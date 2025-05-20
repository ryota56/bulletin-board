import { supabase } from '../../../lib/supabaseClient.js';
import { translateWithDeepL, getTranslation, saveTranslation } from '../../../lib/translation.js';
import { threadsStore, postsStore, addThread, addPost, debugDataStore } from '../../../lib/dataStore.js';

// APIルートハンドラー実行時にデータストアの内容を確認
debugDataStore();

export default async function handler(req, res) {
  const { method, query } = req;
  const lang = query.lang || 'ja';
  const page = parseInt(query.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  switch (method) {
    case 'GET':
      try {
        // 保存されているスレッドを取得
        let threads = [...threadsStore];
        
        // スレッドを更新日時でソート
        threads.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        // ページング
        const startIndex = offset;
        const endIndex = Math.min(offset + limit, threads.length);
        const paginatedThreads = threads.slice(startIndex, endIndex);
        
        // 言語変換（英語の場合）
        if (lang === 'en') {
          const translatedThreads = await Promise.all(
            paginatedThreads.map(async (thread) => {
              // 常に新しい翻訳を取得する
              try {
                const [translatedTitle] = await translateWithDeepL({
                  text: thread.title,
                  targetLang: 'EN'
                });
                
                // 次回使用するためにスレッドに保存
                const originalThread = threadsStore.find(t => t.thread_id === thread.thread_id);
                if (originalThread) {
                  originalThread.title_en = translatedTitle;
                }
                
                console.log(`スレッド一覧翻訳: "${thread.title}" -> "${translatedTitle}"`);
                
                return {
                  ...thread,
                  title: translatedTitle
                };
              } catch (error) {
                console.error('Error translating thread title:', error);
                // エラー時は既存の翻訳を使用
                if (thread.title_en) {
                  return { ...thread, title: thread.title_en };
                }
                return thread;
              }
            })
          );
          
          return res.status(200).json({
            threads: translatedThreads,
            totalCount: threads.length
          });
        }
        
        return res.status(200).json({
          threads: paginatedThreads,
          totalCount: threads.length
        });

      } catch (error) {
        console.error('Error fetching threads:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
      
    case 'POST':
      try {
        const { title, body, language = 'ja' } = req.body;
        
        if (!title || !body) {
          return res.status(400).json({ error: 'Title and body are required' });
        }
        
        // 匿名ID生成
        const anonymousId = `匿名${Math.floor(Math.random() * 1000)}`;
        
        // 新しいスレッドID
        const thread_id = Date.now().toString();
        
        // 新しいスレッドを作成
        const newThread = {
          thread_id,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          language
        };
        
        // 最初の投稿を作成
        const newPost = {
          post_id: `${thread_id}_1`,
          thread_id,
          body,
          anonymous_id: anonymousId,
          created_at: new Date().toISOString(),
          language
        };
        
        // スレッドと投稿を保存
        addThread(newThread);
        addPost(thread_id, newPost);
        
        // スレッドが正しく保存されたか確認
        const savedThread = threadsStore.find(t => t.thread_id === thread_id);
        if (!savedThread) {
          console.error('スレッドの保存に失敗しました。手動で追加します。');
          threadsStore.push({...newThread});
          console.log('手動追加後のスレッド一覧:', threadsStore.map(t => t.thread_id));
        }
        
        console.log(`新規スレッド作成: ID=${thread_id}, タイトル="${title}"`);
        console.log('現在のスレッド一覧:', threadsStore.map(t => t.thread_id));
        
        // 英語の場合はタイトルを翻訳
        if (language === 'ja') {
          try {
            const [translatedTitle] = await translateWithDeepL({
              text: title,
              targetLang: 'EN'
            });
            
            // 保存済みスレッドに翻訳を追加
            const threadToUpdate = threadsStore.find(t => t.thread_id === thread_id);
            if (threadToUpdate) {
              threadToUpdate.title_en = translatedTitle;
            }
            
            const [translatedBody] = await translateWithDeepL({
              text: body,
              targetLang: 'EN'
            });
            
            // 保存済み投稿に翻訳を追加
            const postToUpdate = postsStore[thread_id]?.find(p => p.post_id === newPost.post_id);
            if (postToUpdate) {
              postToUpdate.body_en = translatedBody;
            }
          } catch (error) {
            console.error('Error translating new thread title:', error);
          }
        }
        
        return res.status(201).json({
          thread: newThread,
          post: newPost,
          anonymousId
        });
        
      } catch (error) {
        console.error('Error creating thread:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 