import { supabase } from '../../lib/supabaseClient.js';
import { translateWithDeepL, saveTranslation } from '../../lib/translation.js';
import { threadsStore, postsStore, addThread, addPost, debugDataStore } from '../../lib/dataStore.js';

// APIルートハンドラー実行時にデータストアの内容を確認
debugDataStore();

// posts APIからthreads APIにデータを取得するユーティリティ
async function getThreadsData() {
  try {
    // 共有データストアから直接取得
    return { threads: threadsStore };
  } catch (error) {
    console.error('Error accessing threads data:', error);
  }
  
  return { threads: [] };
}

// スレッド情報を取得するユーティリティ
async function getThreadById(threadId) {
  // 共有データストアから直接取得
  const thread = threadsStore.find(t => t.thread_id === threadId);
  if (thread) {
    return { 
      thread,
      posts: postsStore[threadId] || []
    };
  }
  return null;
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { threadId, body, anonymousId, language = 'ja' } = req.body;
        
        if (!threadId || !body) {
          return res.status(400).json({ error: 'Thread ID and body are required' });
        }
        
        // スレッドの存在を確認
        const threadData = await getThreadById(threadId);
        if (!threadData || !threadData.thread) {
          // スレッド一覧からも確認
          const allThreadsData = await getThreadsData();
          const thread = allThreadsData.threads.find(t => t.thread_id === threadId);
          
          if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
          }
          
          // 見つかったスレッドをローカルに追加
          addThread(thread);
        }
        
        // ユーザーID（匿名）
        const userId = anonymousId || `匿名${Math.floor(Math.random() * 1000)}`;
        
        // 新しい投稿を作成
        const postId = `${threadId}_${Date.now()}`;
        const newPost = {
          post_id: postId,
          thread_id: threadId,
          body,
          anonymous_id: userId,
          created_at: new Date().toISOString(),
          language
        };
        
        // 投稿を保存
        addPost(threadId, newPost);
        
        // 英語の翻訳を事前生成
        if (language === 'ja') {
          try {
            const [translatedBody] = await translateWithDeepL({
              text: body,
              targetLang: 'EN'
            });
            
            // 保存済み投稿に翻訳を追加
            const originalPost = postsStore[threadId]?.find(p => p.post_id === postId);
            if (originalPost) {
              originalPost.body_en = translatedBody;
            }
            
            console.log(`新規投稿翻訳: "${body.substring(0, 20)}..." -> "${translatedBody.substring(0, 20)}..."`);
          } catch (error) {
            console.error('Error translating post:', error);
          }
        }
        
        // スレッドの更新日時を更新
        const threadToUpdate = threadsStore.find(t => t.thread_id === threadId);
        if (threadToUpdate) {
          threadToUpdate.updated_at = new Date().toISOString();
        }
        
        return res.status(201).json(newPost);
      } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 