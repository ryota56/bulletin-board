import { supabase } from '../../lib/supabaseClient.js';
import { translateWithDeepL, saveTranslation, translateText } from '../../lib/translation.js';
import { threadsStore, postsStore, addThread, addPost, debugDataStore } from '../../lib/dataStore.js';
import { detectLang, oppositeLang, dictionaryLookup } from '../../lib/langUtil.js';

// UI 言語コード (ja/en) → DeepL 用2桁 (JA/EN)
const mapLang = (l = '') =>
  l.toLowerCase().startsWith('en') ? 'EN'
  : l.toLowerCase().startsWith('ja') ? 'JA'
  : l.toUpperCase();

// APIルートハンドラー実行時にデータストアの内容を確認
try {
  debugDataStore();
} catch (error) {
  console.error('データストア初期化エラー:', error);
}

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
        const { threadId, body, anonymousId } = req.body;
        const uiLang = (req.query.lang || req.body.uiLang || 'ja').toLowerCase();  // UI が渡す言語
        
        console.log(`投稿リクエスト: threadId=${threadId}, uiLang=${uiLang}, body長さ=${body?.length}`);
        
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
        
        // 投稿の言語を検出
        let detected = '';
        try {
          // DeepL に一度投げて元言語を判定
          const deeplRes = await translateWithDeepL({ text: body, targetLang: 'JA' });
          const detectedRaw = deeplRes?.detected_source_language;
          const fallback = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(body) ? 'ja' : 'en';
          detected = (detectedRaw || fallback).toLowerCase();
          console.log(`投稿言語検出: ${detected}`);
        } catch (error) {
          console.error('言語検出エラー:', error);
          // エラー時はテキストの簡易検出を行う
          detected = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(body) ? 'ja' : 'en';
        }
        
        // 1) 原文はそのまま保存
        const postId = `${threadId}_${Date.now()}`;
        const newPost = {
          post_id: postId,
          thread_id: threadId,
          body: body,
          anonymous_id: userId,
          created_at: new Date().toISOString(),
          language: detected
        };
        
        // 投稿を保存
        addPost(threadId, newPost);
        
        // 2) UI 言語向けに翻訳してキャッシュ
        const srcLang = detected.toUpperCase() === 'JA' ? 'JA' : 'EN';
        const translationNeeded = uiLang !== detected;
        
        let translatedText = body;
        let translationLang = detected;
        
        if (translationNeeded) {
          // 翻訳が必要な場合は翻訳を実行
          const targetLang = uiLang === 'en' ? 'EN' : 'JA';
          translationLang = uiLang;
          
          console.log(`投稿翻訳実行: ${srcLang} → ${targetLang}`);
          try {
            // まず辞書で検索
            const dict = dictionaryLookup(body, targetLang);
            if (dict) {
              translatedText = dict;
              console.log(`辞書翻訳成功: "${body}" → "${translatedText}"`);
            } else {
              // DeepL翻訳実行
              translatedText = await translateText(body, targetLang);
              console.log(`API翻訳成功: "${body.slice(0, 20)}..." → "${translatedText.slice(0, 20)}..."`);
            }
            
            // 翻訳をキャッシュに保存
            await saveTranslation({
              sourceId: postId,
              field: 'body',
              lang: uiLang,
              text: translatedText
            });
            
            // メモリキャッシュも更新
            const postInStore = postsStore[threadId]?.find(p => p.post_id === postId);
            if (postInStore) {
              postInStore[`body_${uiLang}`] = translatedText;
            }
          } catch (error) {
            console.error('翻訳エラー:', error);
            // 翻訳エラー時は原文を使用
            translatedText = body;
          }
        } else {
          console.log('翻訳スキップ: UIと投稿が同じ言語');
        }
        
        // 3) 反対言語の翻訳も常に生成してキャッシュする
        try {
          const oppositeUiLang = uiLang === 'en' ? 'ja' : 'en';
          const oppositeTargetLang = oppositeUiLang === 'en' ? 'EN' : 'JA';
          
          // 投稿言語と反対言語が異なる場合のみ翻訳
          if (detected !== oppositeUiLang) {
            console.log(`反対言語翻訳: ${srcLang} → ${oppositeTargetLang}`);
            
            // 辞書検索
            const dict = dictionaryLookup(body, oppositeTargetLang);
            if (dict) {
              console.log(`反対言語辞書翻訳: "${body}" → "${dict}"`);
              
              await saveTranslation({
                sourceId: postId,
                field: 'body',
                lang: oppositeUiLang,
                text: dict
              });
              
              // メモリキャッシュも更新
              const postInStore = postsStore[threadId]?.find(p => p.post_id === postId);
              if (postInStore) {
                postInStore[`body_${oppositeUiLang}`] = dict;
              }
            } else {
              // DeepL翻訳
              const oppositeTranslated = await translateText(body, oppositeTargetLang);
              
              await saveTranslation({
                sourceId: postId,
                field: 'body',
                lang: oppositeUiLang,
                text: oppositeTranslated
              });
              
              // メモリキャッシュも更新
              const postInStore = postsStore[threadId]?.find(p => p.post_id === postId);
              if (postInStore) {
                postInStore[`body_${oppositeUiLang}`] = oppositeTranslated;
              }
            }
          }
        } catch (error) {
          console.error('反対言語翻訳エラー:', error);
          // エラーは無視して続行
        }
        
        // スレッドの更新日時を更新
        const threadToUpdate = threadsStore.find(t => t.thread_id === threadId);
        if (threadToUpdate) {
          threadToUpdate.updated_at = new Date().toISOString();
        }
        
        // 3) レスポンスに翻訳結果も含める
        const response = {
          ...newPost,
          translated: translationNeeded ? {
            body: translatedText,
            language: translationLang
          } : null
        };
        
        console.log(`投稿成功: ID=${postId}`);
        return res.status(201).json(response);
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