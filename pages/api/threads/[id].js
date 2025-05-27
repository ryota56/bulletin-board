import { supabase } from '../../../lib/supabaseClient.js';
import { translateWithDeepL, getTranslation, saveTranslation, translateText, detectLang, ensureLangCodeFormat } from '../../../lib/translation.js';
import { threadsStore, postsStore, addThread, addPost, debugDataStore, getThreadWithPosts } from '../../../lib/dataStore.js';
import { getCachedTranslation, setCachedTranslation } from '../../../lib/cache.js';

// APIルートハンドラー実行時にデータストアの内容を確認
try {
  debugDataStore();
} catch (error) {
  console.error('データストア初期化エラー:', error);
}

// 翻訳とキャッシュを扱うヘルパー関数
async function translateContent(text, targetLang, sourceLang, contentId, field) {
  if (!text) {
    console.log(`テキストが空のため翻訳スキップ (${field} ${contentId})`);
    return text;
  }

  const normalizedSourceLang = sourceLang ? ensureLangCodeFormat(sourceLang) : null;
  const normalizedTargetLang = ensureLangCodeFormat(targetLang);

  if (normalizedSourceLang && normalizedSourceLang === normalizedTargetLang) {
    // text が文字列であることを確認してから substring を使用
    const logText = typeof text === 'string' ? text.substring(0, 50) : '[non-string_text]';
    console.log(`同じ言語への翻訳をスキップ (${field} ${contentId}): ${normalizedSourceLang} -> ${normalizedTargetLang}. Text: "${logText}..."`);
    return text;
  }

  const cacheKeyContentId = contentId || 'unknown_content_id';
  const cacheKey = `${cacheKeyContentId}_${field}_${normalizedTargetLang}`;

  const cached = getCachedTranslation(cacheKeyContentId, field, normalizedTargetLang);
  if (cached) {
    // cached が文字列であることを確認してから substring を使用
    const logCached = typeof cached === 'string' ? cached.substring(0, 50) : '[non-string_cached_value]';
    console.log(`キャッシュされた翻訳を使用 (${field} ${cacheKeyContentId}, Key: ${cacheKey}): ${normalizedTargetLang} -> "${logCached}..."`);
    return cached;
  }

  const effectiveSourceLang = normalizedSourceLang;

  // text が文字列であることを確認してから substring を使用
  const logTextForRequest = typeof text === 'string' ? text.substring(0, 50) : '[non-string_text]';
  console.log(`DeepL翻訳リクエスト (${field} ${cacheKeyContentId}, Key: ${cacheKey}): "${logTextForRequest}..." (${effectiveSourceLang || 'auto'} → ${normalizedTargetLang})`);
  const translatedText = await translateText(text, normalizedTargetLang, effectiveSourceLang);

  if (translatedText && typeof translatedText === 'string' && translatedText !== text) {
    // translatedText と text が文字列であることを確認してから substring を使用
    const logOriginalText = typeof text === 'string' ? text.substring(0, 50) : '[non-string_original_text]';
    const logTranslated = translatedText.substring(0, 50); // translatedText は文字列であることが確認済み
    console.log(`翻訳成功・キャッシュ保存 (${field} ${cacheKeyContentId}, Key: ${cacheKey}): "${logOriginalText}..." → "${logTranslated}..."`);
    setCachedTranslation(cacheKeyContentId, field, normalizedTargetLang, translatedText);
  } else if (translatedText && typeof translatedText === 'string' && translatedText === text) {
    console.log(`翻訳結果が元テキストと同じ (${field} ${cacheKeyContentId}, Key: ${cacheKey}): ${normalizedTargetLang}. API呼び出しは行われた可能性があります。`);
    setCachedTranslation(cacheKeyContentId, field, normalizedTargetLang, translatedText);
  } else if (!translatedText || typeof translatedText !== 'string') {
    console.error(`翻訳失敗または結果が文字列でない (${field} ${cacheKeyContentId}, Key: ${cacheKey}): Target: ${normalizedTargetLang}, Result:`, translatedText, `. 元のテキストを返します。"`);
    return text;
  } else { // このelseは通常到達しないはずだが、念のため
    console.error(`予期せぬ翻訳結果 (${field} ${cacheKeyContentId}, Key: ${cacheKey}): Target: ${normalizedTargetLang}. 元のテキストを返します。"`);
    return text;
  }
  return translatedText;
}

export default async function handler(req, res) {
  const { id } = req.query;
  const uiLangParam = req.query.lang || 'ja'; // フロントエンドから渡される言語パラメータ
  const uiLang = ensureLangCodeFormat(uiLangParam); // DeepLが期待する形式 (JA, ENなど) に正規化

  if (req.method === 'GET') {
    try {
      console.log(`API HANDLER: Looking for thread with ID: ${id}, Requested UI language: ${uiLang} (param: ${uiLangParam})`);
      let threadData = await getThreadWithPosts(id);

      if (!threadData) {
        console.log(`API HANDLER: Thread not found for ID: ${id}`);
        return res.status(404).json({ error: 'Thread not found' });
      }

      // スレッド自体の元の言語。なければ'ja'をフォールバックとするか、エラーとするかは仕様次第。
      // ここでは'ja'をフォールバックとします。
      const threadOriginalLangStored = threadData.lang || 'ja';
      const threadOriginalLang = ensureLangCodeFormat(threadOriginalLangStored);
      console.log(`API HANDLER: Thread ${id} original language: ${threadOriginalLang} (stored as ${threadOriginalLangStored})`);

      // スレッドタイトルの翻訳
      if (threadData.thread.title) {
        console.log(`API HANDLER: Processing title for thread ${id}. Original: "${threadData.thread.title.substring(0,50)}...", Original lang: ${threadOriginalLang}, Target UI lang: ${uiLang}`);
        threadData.thread.title = await translateContent(threadData.thread.title, uiLang, threadOriginalLang, `thread_${id}`, 'title');
      } else {
        console.log(`API HANDLER: Thread ${id} has no title to translate.`);
      }

      // スレッド説明文の翻訳
      if (threadData.thread.description) {
        console.log(`API HANDLER: Processing description for thread ${id}. Original: "${threadData.thread.description.substring(0,50)}...", Original lang: ${threadOriginalLang}, Target UI lang: ${uiLang}`);
        const translatedDescription = await translateContent(threadData.thread.description, uiLang, threadOriginalLang, `thread_${id}`, 'description');
        threadData.thread[`description_${uiLangParam.toLowerCase()}`] = translatedDescription;
      } else {
        console.log(`API HANDLER: Thread ${id} has no description to translate.`);
      }

      // 各投稿の本文を翻訳
      if (threadData.posts && threadData.posts.length > 0) {
        console.log(`API HANDLER: Processing ${threadData.posts.length} posts for thread ${id}.`);
        threadData.posts = await Promise.all(
          threadData.posts.map(async (post) => {
            if (!post || !post.id) {
                console.warn(`API HANDLER: Invalid post object found in thread ${id}, skipping.`, post);
                return post; // or filter it out earlier
            }
            if (!post.body) {
              console.log(`API HANDLER: Post ${post.id} has no body to translate.`);
              return post; // 本文がなければ翻訳不要
            }

            // 各投稿の元の言語 (post.original_lang がDBに保存されていることを期待)
            let postOriginalLangStored = post.original_lang;
            let postOriginalLang = null;

            if (postOriginalLangStored) {
              postOriginalLang = ensureLangCodeFormat(postOriginalLangStored);
              console.log(`API HANDLER: Post ${post.id} original language from DB: ${postOriginalLang} (stored as ${postOriginalLangStored}) for body: "${post.body.substring(0,20)}..."`);
            } else {
              // original_lang がない場合、本文から言語を検出
              console.log(`API HANDLER: Post ${post.id} original_lang not found in DB. Detecting from body: "${post.body.substring(0,20)}..."`);
              try {
                const detected = await detectLang(post.body); // detectLangはDeepL形式の言語コードを返すと期待
                if (detected) {
                    postOriginalLang = ensureLangCodeFormat(detected);
                    console.log(`API HANDLER: Post ${post.id} language detected as: ${postOriginalLang}`);
                    // ここで検出した言語をDBの post.original_lang に保存する更新処理を入れても良い (オプション)
                    // await savePostOriginalLang(post.id, postOriginalLang);
                } else {
                    // 検出失敗時はスレッドの言語にフォールバック
                    postOriginalLang = threadOriginalLang;
                    console.log(`API HANDLER: Post ${post.id} language detection failed, falling back to thread lang: ${postOriginalLang}`);
                }
              } catch (e) {
                console.error(`API HANDLER: Error detecting language for post ${post.id}, falling back to thread lang ${threadOriginalLang}. Error:`, e);
                postOriginalLang = threadOriginalLang;
              }
            }

            const translatedBody = await translateContent(post.body, uiLang, postOriginalLang, post.id, 'body');
            return { ...post, body: translatedBody, original_lang: postOriginalLang, translated_to: uiLang };
          })
        );
      } else {
        console.log(`API HANDLER: Thread ${id} has no posts to translate.`);
      }
      console.log(`API HANDLER: Returning thread ${id} with ${threadData.posts ? threadData.posts.length : 0} posts, processed for UI language ${uiLang}.`);
      return res.status(200).json(threadData);

    } catch (error) {
      console.error(`API HANDLER: Error fetching or processing thread ${id} (UI lang: ${uiLang}). Error:`, error);
      // エラーオブジェクト全体やスタックトレースをログに出力するとデバッグに役立つ
      console.error("Error details:", error.message, error.stack);
      return res.status(500).json({ error: 'Failed to fetch or process thread data', details: error.message });
    }
  } else {
    console.log(`API HANDLER: Method ${req.method} not allowed for /api/threads/[id]`);
    res.setHeader('Allow', ['GET']); // このエンドポイントがGETのみを想定する場合
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 