import { supabase } from '../../../lib/supabaseClient.js';
import { translateWithDeepL, getTranslation, saveTranslation, translateText } from '../../../lib/translation.js';
import { threadsStore, postsStore, addThread, addPost, debugDataStore } from '../../../lib/dataStore.js';
import { detectLang, oppositeLang, dictionaryLookup } from '../../../lib/langUtil.js';

// APIルートハンドラー実行時にデータストアの内容を確認
try {
  debugDataStore();
} catch (error) {
  console.error('データストア初期化エラー:', error);
}

export default async function handler(req, res) {
  const { method, query } = req;
  const lang = query.lang || 'ja';
  const page = parseInt(query.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  switch (method) {
    case 'GET':
      try {
        console.log(`スレッド一覧取得リクエスト: lang=${lang}, page=${page}`);
        
        // 保存されているスレッドを取得
        let threads = [];
        try {
          threads = [...threadsStore];
          console.log(`スレッド一覧取得: ${threads.length}件`);
        } catch (error) {
          console.error('スレッド一覧取得エラー:', error);
          threads = [];
        }
        
        if (threads.length === 0) {
          console.log('スレッドが存在しません。空の配列を返します。');
          return res.status(200).json({
            threads: [],
            totalCount: 0
          });
        }
        
        // スレッドを更新日時でソート
        try {
          threads.sort((a, b) => {
            try {
              return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
            } catch (error) {
              console.error('スレッドソートエラー:', error);
              return 0;
            }
          });
        } catch (error) {
          console.error('スレッド全体ソートエラー:', error);
        }
        
        // ページング
        const startIndex = offset;
        const endIndex = Math.min(offset + limit, threads.length);
        const paginatedThreads = threads.slice(startIndex, endIndex);
        
        if (paginatedThreads.length === 0) {
          console.log('ページングされたスレッドが0件です。空の配列を返します。');
          return res.status(200).json({
            threads: [],
            totalCount: threads.length
          });
        }
        
        console.log(`ページング後のスレッド: ${paginatedThreads.length}件`);
        
        // 言語変換（UI言語と元言語が異なる場合）
        const translatedThreads = [];
        for (const thread of paginatedThreads) {
          try {
            // スレッドの言語チェック（nullやundefinedを考慮）
            const threadLang = thread.language || 'ja';
            
            // 既存の翻訳キャッシュをチェック
            const cacheKey = lang === 'en' ? 'title_en' : 'title_ja';
            if (thread[cacheKey] && lang !== threadLang) {
              console.log(`キャッシュされた翻訳を使用: ${thread.thread_id}`);
              translatedThreads.push({
                ...thread,
                title: thread[cacheKey]
              });
              continue;
            }
            
            // UI 言語と元スレッド言語が異なる場合のみ翻訳
            if (lang !== threadLang) {
              const targetLang = lang === 'en' ? 'EN' : 'JA';
              
              try {
                // 翻訳前にthread.titleが存在するか確認
                if (!thread.title) {
                  console.error(`スレッドタイトルが存在しません: ID=${thread.thread_id}`);
                  translatedThreads.push(thread);
                  continue;
                }
                
                // 翻訳実行
                console.log(`スレッドタイトルを翻訳: "${thread.title.slice(0, 20)}..." (${threadLang} → ${targetLang})`);
                const translatedTitle = await translateWithDeepL({
                  text: thread.title,
                  targetLang
                });
                
                // 翻訳結果の検証
                if (!translatedTitle) {
                  console.error(`翻訳結果が空: ID=${thread.thread_id}`);
                  translatedThreads.push(thread);
                  continue;
                }
                
                // 次回使用するためにスレッドに保存
                try {
                  const originalThread = threadsStore.find(t => t.thread_id === thread.thread_id);
                  if (originalThread) {
                    originalThread[cacheKey] = translatedTitle;
                  }
                } catch (cacheError) {
                  console.error('翻訳キャッシュ保存エラー:', cacheError);
                }
                
                // language が未設定ならここで補完
                if (!thread.language) {
                  thread.language = targetLang.toLowerCase() === 'en' ? 'ja' : 'en';
                }
                
                console.log(`スレッド一覧翻訳成功: "${thread.title.slice(0, 20)}..." -> "${translatedTitle.slice(0, 20)}..."`);
                
                translatedThreads.push({
                  ...thread,
                  title: translatedTitle
                });
              } catch (translationError) {
                console.error('スレッドタイトル翻訳エラー:', translationError, { threadId: thread.thread_id });
                
                // エラー時は既存の翻訳またはオリジナルを使用
                if (thread[cacheKey]) {
                  console.log(`翻訳エラー時にキャッシュを使用: ${thread.thread_id}`);
                  translatedThreads.push({ 
                    ...thread, 
                    title: thread[cacheKey] 
                  });
                } else {
                  console.log(`翻訳エラー時にオリジナルを使用: ${thread.thread_id}`);
                  translatedThreads.push(thread);
                }
              }
            } else {
              // 言語が同じ場合は翻訳不要
              translatedThreads.push(thread);
            }
          } catch (threadError) {
            console.error('スレッド処理エラー:', threadError, { threadId: thread?.thread_id });
            // エラーが発生しても処理を続行
            translatedThreads.push(thread);
          }
        }
        
        // 最終チェック - 返すスレッドがあるかどうか
        if (translatedThreads.length > 0) {
          console.log(`スレッド一覧API成功: ${translatedThreads.length}件返却`);
          return res.status(200).json({
            threads: translatedThreads,
            totalCount: threads.length
          });
        }
        
        // フォールバック：翻訳なしのスレッドを返す
        console.log('翻訳処理に問題が発生したため、オリジナルのスレッドを返します。');
        return res.status(200).json({
          threads: paginatedThreads,
          totalCount: threads.length
        });

      } catch (error) {
        console.error('スレッド一覧取得処理エラー:', error);
        // エラー詳細を返す
        return res.status(500).json({ 
          error: 'Internal Server Error', 
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
      break;
      
    case 'POST':
      try {
        const { title, body, lang = 'ja' } = req.body;
        
        if (!title || !body) {
          return res.status(400).json({ error: 'Title and body are required' });
        }
        
        // 匿名ID生成
        const anonymousId = `匿名${Math.floor(Math.random() * 1000)}`;
        
        // 新しいスレッドID
        const thread_id = Date.now().toString();
        
        let detected = lang;
        try {
          // DeepL に一度投げて元言語を判定
          const deeplRes = await translateWithDeepL({ text: title, targetLang: 'JA' }); // targetLang は何でも良い
          const detectedRaw = deeplRes?.detected_source_language;   // undefined 可
          // DeepL が検出言語を返さないときは簡易判定（日本語文字が含まれるか）
          const fallback = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(title) ? 'ja' : 'en';
          detected = (detectedRaw || fallback).toLowerCase();
        } catch (langDetectError) {
          console.error('言語検出エラー:', langDetectError);
          // エラー時はフォールバック
          detected = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(title) ? 'ja' : 'en';
        }
        
        // 新しいスレッドを作成
        const newThread = {
          thread_id,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          language: detected
        };
        
        // 最初の投稿を作成
        const newPost = {
          post_id: `${thread_id}_1`,
          thread_id,
          body,
          anonymous_id: anonymousId,
          created_at: new Date().toISOString(),
          language: detected
        };
        
        try {
          // スレッドと投稿を保存
          addThread(newThread);
          addPost(thread_id, newPost);
          
          // スレッドが正しく保存されたか確認
          const savedThread = threadsStore.find(t => t.thread_id === thread_id);
          if (!savedThread) {
            console.error('スレッドの保存に失敗しました。手動で追加します。');
            threadsStore.push({
              ...newThread,
              id: thread_id,
              title,
              language: detected,
              createdAt: new Date().toISOString(),
              posts: []
            });
            console.log('手動追加後のスレッド一覧:', threadsStore.map(t => t.thread_id));
          }
        } catch (saveError) {
          console.error('スレッド保存エラー:', saveError);
        }
        
        console.log(`新規スレッド作成: ID=${thread_id}, タイトル="${title}"`);
        
        try {
          /* ---------- ★追加：タイトルを翻訳してキャッシュ ---------- */
          const srcLang      = detectLang(title);
          const targetLang   = oppositeLang(srcLang);
          const translated = dictionaryLookup(title, targetLang) || 
                             await translateText(title, targetLang);

          await saveTranslation({ 
            sourceId: thread_id, 
            field: 'title',
            lang: targetLang.toLowerCase(), 
            text: translated 
          });
          /* --------------------------------------------------------- */
        } catch (translateError) {
          console.error('タイトル翻訳保存エラー:', translateError);
          // 翻訳エラーはスレッド作成の失敗とはみなさない
        }
        
        return res.status(201).json({
          thread: newThread,
          post: newPost,
          anonymousId
        });
        
      } catch (error) {
        console.error('スレッド作成エラー:', error);
        return res.status(500).json({ 
          error: 'Internal Server Error', 
          message: error.message
        });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}