import { supabase } from '../../../lib/supabaseClient.js';
import { translateWithDeepL, getTranslation, saveTranslation } from '../../../lib/translation.js';
import { threadsStore, postsStore, addThread, addPost, debugDataStore } from '../../../lib/dataStore.js';

// APIルートハンドラー実行時にデータストアの内容を確認
debugDataStore();

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  const lang = query.lang || 'ja';
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid thread ID' });
  }

  // デバッグ: 現在のスレッド一覧をログ出力
  console.log(`Looking for thread with ID: ${id}`);
  console.log(`Current threads in store:`, threadsStore.map(t => t.thread_id));

  switch (method) {
    case 'GET':
      try {
        // スレッドをメモリから取得
        const thread = threadsStore.find(t => t.thread_id === id);
        
        if (!thread) {
          console.log(`Thread ID ${id} not found in threadsStore`);
          
          // スレッドが見つからない場合は404を返す
          return res.status(404).json({ 
            error: 'Thread not found',
            availableThreads: threadsStore.map(t => ({ id: t.thread_id, title: t.title }))
          });
        }
        
        // 投稿をメモリから取得
        const posts = postsStore[id] || [];
        console.log(`Found posts for thread ${id}:`, posts.length);
        
        // 英語翻訳が必要かどうか
        if (lang === 'en') {
          // スレッドタイトルの翻訳 - 常に新しい翻訳を取得
          let threadWithTranslation = { ...thread };
          
          try {
            const [translatedTitle] = await translateWithDeepL({
              text: thread.title,
              targetLang: 'EN'
            });
            
            // オリジナルのスレッドの翻訳を更新
            const originalThread = threadsStore.find(t => t.thread_id === id);
            if (originalThread) {
              originalThread.title_en = translatedTitle;
            }
            
            threadWithTranslation.title = translatedTitle;
            console.log(`スレッドタイトル翻訳: "${thread.title}" -> "${translatedTitle}"`);
          } catch (error) {
            console.error('Error translating thread title:', error);
            // エラー時は既存の翻訳を使用
            if (thread.title_en) {
              threadWithTranslation.title = thread.title_en;
            }
          }
          
          // 投稿の翻訳 - 常に新しい翻訳を取得
          const postsWithTranslation = await Promise.all(
            posts.map(async (post) => {
              try {
                const [translatedBody] = await translateWithDeepL({
                  text: post.body,
                  targetLang: 'EN'
                });
                
                // オリジナルの投稿の翻訳を更新
                const originalPost = postsStore[id]?.find(p => p.post_id === post.post_id);
                if (originalPost) {
                  originalPost.body_en = translatedBody;
                }
                
                console.log(`投稿翻訳: "${post.body.substring(0, 20)}..." -> "${translatedBody.substring(0, 20)}..."`);
                return { ...post, body: translatedBody };
              } catch (error) {
                console.error('Error translating post body:', error);
                // エラー時は既存の翻訳を使用
                if (post.body_en) {
                  return { ...post, body: post.body_en };
                }
                return post;
              }
            })
          );
          
          return res.status(200).json({
            thread: threadWithTranslation,
            posts: postsWithTranslation
          });
        }
        
        return res.status(200).json({
          thread,
          posts
        });
        
      } catch (error) {
        console.error('Error fetching thread:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 