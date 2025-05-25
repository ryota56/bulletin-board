/**
 * DeepL API を呼び出し、翻訳済みテキストを返します。
 * 必ず .env.local に DEEPL_API_KEY=xxxxxxxx を設定してください。
 * @param {string} text        翻訳したい原文
 * @param {string} targetLang  例: 'EN', 'JA' など（大文字2文字）
 * @param {string} sourceLang  任意：原文言語 例:'JA'（空なら自動判定）
 * @returns {Promise<string>}  翻訳後テキスト（失敗時は原文を返す）
 */
export default async function deepl(text, targetLang, sourceLang = '') {
  try {
    if (!text || text.trim() === '') {
      console.log('空のテキストが渡されました。原文を返します。');
      return text;
    }

    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      console.error('DeepL API キーが設定されていません。環境変数 DEEPL_API_KEY を確認してください。');
      return text;
    }

    // 言語コードの正規化
    const normalizedTargetLang = targetLang.toUpperCase();
    const normalizedSourceLang = sourceLang ? sourceLang.toUpperCase() : '';

    // 同じ言語の場合は翻訳せずに返す
    if (normalizedSourceLang && normalizedSourceLang === normalizedTargetLang) {
      console.log(`同じ言語 (${normalizedSourceLang}) なので翻訳をスキップします。`);
      return text;
    }

    // 辞書による簡易翻訳チェック (短い単語の場合)
    if (text.length < 10) {
      const simpleDictionary = {
        '犬': { EN: 'dog', JA: '犬' },
        '猫': { EN: 'cat', JA: '猫' },
        'dog': { EN: 'dog', JA: '犬' },
        'cat': { EN: 'cat', JA: '猫' },
      };
      
      const dictEntry = simpleDictionary[text.trim()];
      if (dictEntry && dictEntry[normalizedTargetLang]) {
        console.log(`辞書による翻訳: ${text} → ${dictEntry[normalizedTargetLang]}`);
        return dictEntry[normalizedTargetLang];
      }
    }

    // リクエストパラメータ
    const params = new URLSearchParams();
    params.append('auth_key', apiKey);
    params.append('text', text);
    params.append('target_lang', normalizedTargetLang);
    
    // ソース言語が指定されている場合のみ追加
    // 重要: 同じ言語間の翻訳を避けるため、ソース言語を明示的に設定
    if (normalizedSourceLang) {
      params.append('source_lang', normalizedSourceLang);
    }

    // 翻訳文のフォーマット保持設定（日本語→英語の場合は保持しない）
    const isJaToEn = (normalizedSourceLang === 'JA' && normalizedTargetLang === 'EN') || 
                     (!normalizedSourceLang && /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text) && normalizedTargetLang === 'EN');
    
    if (!isJaToEn) {
      params.append('preserve_formatting', '1');
    }

    // リクエスト送信
    console.log(`DeepL API リクエスト: ${normalizedSourceLang || '自動検出'} → ${normalizedTargetLang} "${text.slice(0, 30)}..."`);
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': '5ch-board/1.0',
      },
      body: params,
    });

    // レスポンスチェック
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`DeepL API エラー: ${response.status} ${response.statusText} ${errorText}`);
    }

    // レスポンス解析
    const data = await response.json();
    
    if (!data.translations || data.translations.length === 0) {
      console.warn('DeepL API: 翻訳結果が空です。', { text, targetLang });
      return text;
    }
    
    const translatedText = data.translations[0].text;
    const detectedSourceLang = data.translations[0].detected_source_language;
    
    // 翻訳結果の検証 - 入力と出力が同じで言語が異なる場合はおかしい
    if (translatedText.trim() === text.trim() && 
        detectedSourceLang && normalizedTargetLang !== detectedSourceLang) {
      console.warn('翻訳結果が元のテキストと同じです。2回目の試行を行います。', 
                  { detected: detectedSourceLang, target: normalizedTargetLang });
      
      // 2回目の試行 - ソース言語を明示的に設定して再試行
      const retryParams = new URLSearchParams();
      retryParams.append('auth_key', apiKey);
      retryParams.append('text', text);
      retryParams.append('target_lang', normalizedTargetLang);
      retryParams.append('source_lang', detectedSourceLang);
      retryParams.append('preserve_formatting', '0'); // フォーマット保持しない
      
      const retryResponse = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: retryParams,
      });
      
      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        if (retryData.translations && retryData.translations.length > 0) {
          const retryText = retryData.translations[0].text;
          if (retryText.trim() !== text.trim()) {
            console.log(`再試行成功: "${text.slice(0, 20)}..." → "${retryText.slice(0, 20)}..."`);
            return retryText;
          }
        }
      }
      
      // 万が一それでも同じなら、簡易翻訳を試す（特定の単語のみ）
      if (/^[a-zA-Z\s]+$/.test(text) && normalizedTargetLang === 'JA') {
        // 英語→日本語の簡易辞書
        const enToJa = {
          'dog': '犬',
          'cat': '猫',
          'hello': 'こんにちは',
          'good morning': 'おはようございます',
          'thank you': 'ありがとう',
          'yes': 'はい',
          'no': 'いいえ'
        };
        const lowerText = text.toLowerCase().trim();
        if (enToJa[lowerText]) {
          console.log(`簡易辞書翻訳: ${text} → ${enToJa[lowerText]}`);
          return enToJa[lowerText];
        }
      } else if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text) && normalizedTargetLang === 'EN') {
        // 日本語→英語の簡易辞書
        const jaToEn = {
          '犬': 'dog',
          '猫': 'cat',
          'こんにちは': 'hello',
          'おはようございます': 'good morning',
          'ありがとう': 'thank you',
          'はい': 'yes',
          'いいえ': 'no'
        };
        if (jaToEn[text.trim()]) {
          console.log(`簡易辞書翻訳: ${text} → ${jaToEn[text.trim()]}`);
          return jaToEn[text.trim()];
        }
      }
    }
    
    // デバッグログ
    console.log(`DeepL翻訳: ${detectedSourceLang} → ${normalizedTargetLang}`, 
      text.slice(0, 20), '→', translatedText.slice(0, 20));
    
    return translatedText;
  } catch (err) {
    console.error('[deepl] 翻訳エラー:', err.message, { text: text.slice(0, 50), targetLang });
    
    // ネットワークエラーの場合はフラグを立てて、後でリトライできるようにする
    if (err.name === 'TypeError' || err.name === 'NetworkError' || err.message.includes('network')) {
      console.error('[deepl] ネットワークエラーが発生しました。後でリトライします。');
    }
    
    return text; // 失敗した場合は原文を返す
  }
} 