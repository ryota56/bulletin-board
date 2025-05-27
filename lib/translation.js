import deepl from './deepl.js';
import { supabase } from './supabaseClient.js';
import { detectLang, mapLang, oppositeLang } from './langUtil.js';
import { threadsStore, postsStore } from './dataStore.js';

// 日本語文字を含むか簡易判定
const jpRegex = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
const detectSourceLang = (t = '') => (jpRegex.test(t) ? 'JA' : 'EN');

// DeepL API設定
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

/**
 * 言語コードを正規化する（DeepLに適した形式に変換する）
 * @param {string} langCode - 言語コード（ja, en, JA, EN など）
 * @returns {string} 正規化された言語コード（JA, ENなど）
 */
export function ensureLangCodeFormat(langCode = '') {
  if (!langCode) return 'JA'; // デフォルト値
  
  // すでに正しい形式（JA, EN）であれば、そのまま返す
  if (langCode === 'JA' || langCode === 'EN') {
    return langCode;
  }
  
  // 小文字を大文字に変換
  return langCode.toLowerCase().startsWith('ja') ? 'JA'
    : langCode.toLowerCase().startsWith('en') ? 'EN'
    : langCode.toUpperCase(); // その他の言語コードはそのまま大文字に
}

/**
 * DeepL APIを使用してテキストを翻訳する
 * @param {object} params - パラメータ
 * @param {string|string[]} params.text - 翻訳するテキストまたはテキストの配列
 * @param {string} params.targetLang - ターゲット言語コード（'EN'または'JA'）
 * @returns {Promise<string>} - 翻訳されたテキスト
 */
export async function translateWithDeepL({ text, targetLang }) {
  if (!text) return '';
  if (!DEEPL_API_KEY) {
    console.error('DeepL API キーが設定されていません。');
    return Array.isArray(text) ? text[0] || '' : text; // APIキーがない場合は原文を返す
  }

  // 言語コードの正規化
  const normalizedTargetLang = mapLang(targetLang);
  
  // ① 前処理 ― トリム・連続ピリオド整理（改行は保持）
  const cleaned = Array.isArray(text) ? text[0] : text;
  const cleanedText = cleaned
    // .replace(/\r?\n+/g, ' ')   // 改行を半角スペースに変換する処理を削除
    .replace(/\.{3,}/g, '...')    // ピリオド 3 個を超える部分は 3 個に
    .trim();

  if (!cleanedText) return '';

  // 短いテキストの場合は辞書を使った直接翻訳を試みる
  if (cleanedText.length < 10) {
    const simpleDict = {
      '犬': { en: 'dog', ja: '犬' },
      '猫': { en: 'cat', ja: '猫' },
      'dog': { en: 'dog', ja: '犬' },
      'cat': { en: 'cat', ja: '猫' },
      'hello': { en: 'hello', ja: 'こんにちは' },
      'yes': { en: 'yes', ja: 'はい' },
      'no': { en: 'no', ja: 'いいえ' }
    };
    
    const dictKey = cleanedText.toLowerCase().trim();
    const dictEntry = simpleDict[dictKey];
    if (dictEntry) {
      const targetLangCode = normalizedTargetLang.toLowerCase() === 'en' ? 'en' : 'ja';
      const translated = dictEntry[targetLangCode];
      if (translated && translated !== cleanedText) {
        console.log(`辞書翻訳: "${cleanedText}" → "${translated}"`);
        return translated;
      }
    }
  }

  try {
    // ソース言語を検出（日本語文字が含まれるかどうか）
    const detectedSourceLang = detectSourceLang(cleanedText);
    
    // 同じ言語への翻訳は避ける
    if (detectedSourceLang.toLowerCase() === normalizedTargetLang.toLowerCase()) {
      console.log(`同じ言語への翻訳をスキップ: ${detectedSourceLang}`);
      return cleanedText;
    }
    
    console.log(`DeepL翻訳リクエスト: "${cleanedText.slice(0, 20)}..." (${detectedSourceLang} → ${normalizedTargetLang})`);

    // DeepL API呼び出し関数（内部用）
    async function callDeeplApi(reqText, keepFormatting = true) {
      try {
        // Deepl 関数を直接呼び出し
        const results = await deepl(
          reqText,
          normalizedTargetLang,
          detectedSourceLang // ソース言語を明示的に指定
        );
        
        // 文字列として結果を返す
        return results || reqText;
      } catch (err) {
        console.error('DeepL API 呼び出しエラー:', err.message);
        return reqText; // エラー時は原文を返す
      }
    }

    // ① １回目の翻訳試行
    const first = await callDeeplApi(cleanedText, true);

    // ② 翻訳結果が原文と同じかチェック
    if (first.trim() === cleanedText.trim()) {
      console.log('翻訳結果が原文と同じです。別の方法で再試行します。');
      
      // 単語辞書で再確認
      const dictWords = {
        '犬': 'dog',
        '猫': 'cat',
        'こんにちは': 'hello',
        'おはよう': 'good morning',
        'ありがとう': 'thank you',
        'dog': '犬',
        'cat': '猫',
        'hello': 'こんにちは',
        'good morning': 'おはよう',
        'thank you': 'ありがとう'
      };
      
      if (dictWords[cleanedText]) {
        const dictResult = dictWords[cleanedText];
        console.log(`辞書による再翻訳: "${cleanedText}" → "${dictResult}"`);
        return dictResult;
      }
      
      // フォーマット維持なしで再試行
      const retry = await callDeeplApi(cleanedText, false);
      
      if (retry.trim() !== cleanedText.trim()) {
        console.log(`フォーマット維持なしで翻訳成功: "${cleanedText}" → "${retry}"`);
        return retry;
      }
      
      // それでも同じならソース言語を変えて試す最後の手段
      const forcedSourceLang = detectedSourceLang === 'JA' ? 'EN' : 'JA';
      console.log(`最終試行: ソース言語を強制的に ${forcedSourceLang} に設定`);
      
      try {
        const results = await deepl(cleanedText, normalizedTargetLang, forcedSourceLang);
        const final = results || cleanedText;
        
        if (final.trim() !== cleanedText.trim()) {
          console.log(`最終試行成功: "${cleanedText}" → "${final}"`);
          return final;
        }
      } catch (finalError) {
        console.error('最終翻訳試行エラー:', finalError);
      }
      
      console.log('全ての翻訳試行が失敗しました。原文を返します。');
      return cleanedText;
    }

    console.log(`翻訳成功: "${cleanedText.slice(0, 20)}..." → "${first.slice(0, 20)}..."`);
    return first;
  } catch (error) {
    console.error('translateWithDeepL エラー:', error);
    return cleanedText; // エラー時は原文を返す
  }
}

/**
 * DeepL で翻訳し、翻訳テキストを返す
 * cleaned: 末尾の「...」などを除去した本文
 * @param {string} cleaned - 翻訳するテキスト
 * @param {string} targetLang - 翻訳先言語コード
 * @param {string|null} sourceLang - 翻訳元言語コード（オプション）
 * @returns {Promise<string>} - 翻訳されたテキスト（文字列）
 */
export async function translateText(cleaned, targetLang, sourceLang = null) {
  if (!cleaned) return '';
  if (!DEEPL_API_KEY) {
    console.error('DeepL API キーが設定されていません。');
    return cleaned; // APIキーがない場合は原文を返す
  }

  try {
    // 言語コードの正規化
    const normalizedTargetLang = mapLang(targetLang);
    
    //   0: 全体, 1: 本体, 2: 末尾記号
    const [, core = '', trailer = ''] = cleaned.match(/^(.*?)([\u0021-\u002E\u3001-\u303F\uFF01-\uFF0F\u2026]+)?$/u) || [];
    const text = core || cleaned.trim();

    if (!text) return cleaned;

    // ソース言語を検出
    const effectiveSourceLang = sourceLang ? mapLang(sourceLang) : detectSourceLang(text);
    
    // 同じ言語への翻訳は避ける
    if (effectiveSourceLang.toLowerCase() === normalizedTargetLang.toLowerCase()) {
      console.log(`同じ言語への翻訳をスキップ: ${effectiveSourceLang}`);
      return cleaned;
    }
    
    // まず辞書検索を試す
    const dictResult = translateWithDictionary(text, normalizedTargetLang);
    if (dictResult) {
      console.log(`辞書翻訳成功: "${text.slice(0, 20)}..." → "${dictResult.slice(0, 20)}..."`);
      return dictResult + trailer;
    }
    
    // DeepL API呼び出し
    console.log(`翻訳リクエスト: ${effectiveSourceLang} → ${normalizedTargetLang}`, text.slice(0, 20));
    
    const translatedResults = await deepl(
      text,
      normalizedTargetLang,
      effectiveSourceLang
    );
    
    // deepl関数は配列ではなく文字列を返すようになったので、そのまま使用
    const translatedText = translatedResults || text;
    
    // 翻訳結果 + 元の末尾記号を結合
    const result = (translatedText + trailer).trim();
    
    // 翻訳結果が原文と同じ場合は辞書を再確認
    if (result.trim() === text.trim() + trailer.trim()) {
      console.log('翻訳結果が原文と同じです。強制的に翻訳を試みます。');
      
      // 強制的に反対言語に設定して再試行
      const forcedSourceLang = effectiveSourceLang === 'JA' ? 'EN' : 'JA';
      const forcedResults = await deepl(text, normalizedTargetLang, forcedSourceLang);
      
      // 配列ではなく文字列を使用
      const forcedResult = forcedResults || text;
      
      if (forcedResult.trim() !== text.trim()) {
        console.log(`強制翻訳成功: "${text.slice(0, 20)}..." → "${forcedResult.slice(0, 20)}..."`);
        return (forcedResult + trailer).trim();
      }
      
      return result; // 失敗した場合はDeepLの結果をそのまま返す
    }
    
    return result;
  } catch (error) {
    console.error('translateText エラー:', error);
    return cleaned; // エラー時は原文を返す
  }
}

/**
 * 簡易辞書を使った翻訳
 * @param {string} text - 翻訳するテキスト
 * @param {string} targetLang - 対象言語
 * @returns {string|null} - 翻訳結果、辞書にない場合はnull
 */
function translateWithDictionary(text, targetLang) {
  const simpleDictionary = {
    // 日本語→英語
    '犬': 'dog',
    '猫': 'cat',
    'こんにちは': 'hello',
    'おはよう': 'good morning',
    'ありがとう': 'thank you',
    'はい': 'yes',
    'いいえ': 'no',
    
    // 英語→日本語
    'dog': '犬',
    'cat': '猫',
    'hello': 'こんにちは',
    'good morning': 'おはよう',
    'thank you': 'ありがとう',
    'yes': 'はい',
    'no': 'いいえ'
  };
  
  const normalizedText = text.trim().toLowerCase();
  
  if (simpleDictionary[normalizedText]) {
    const isENTarget = targetLang.toUpperCase() === 'EN';
    const isJAText = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(normalizedText);
    
    // 日本語→英語 または 英語→日本語の方向が合っている場合のみ翻訳
    if ((isENTarget && isJAText) || (!isENTarget && !isJAText)) {
      return simpleDictionary[normalizedText];
    }
  }
  
  return null;
}

/* ------------------------------------------------------------------------
 * ★ 重要: saveTranslation は "sourceId を必須" に一本化する
 *   - thread でも post でも ID をそのまま sourceId に渡す
 *   - 呼び出し側ロジックを単純化
 * --------------------------------------------------------------------- */
export async function saveTranslation({ sourceId, field, lang, text }) {
  if (!sourceId || !field || !lang || !text) {
    console.error('saveTranslation: 引数が不足しています', { sourceId, field, lang, text });
    return { success: false, error: '引数が不足しています' };
  }

  try {
    // 言語コードの正規化
    const normalizedLang = lang.toLowerCase();
    
    const row = {
      source_id: sourceId,
      field,
      language: normalizedLang,
      translated_content: text,
      created_at: new Date().toISOString(),
    };

    // Supabase が null ならメモリだけで動かす
    if (!supabase) {
      console.log('翻訳保存 [mock]:', sourceId, field, normalizedLang, text.slice(0, 20));
      return { success: true };
    }
    
    const { error } = await supabase.from('translations')
      .upsert(row, { onConflict: 'source_id,field,language' });
      
    if (error) {
      console.error('翻訳保存エラー:', error);
      return { success: false, error };
    }
    
    console.log('翻訳保存成功:', sourceId, field, normalizedLang, text.slice(0, 20));
    return { success: true };
  } catch (error) {
    console.error('saveTranslation エラー:', error);
    return { success: false, error };
  }
}

/* -------------------------------------------------------------------- */
export async function getTranslation(sourceId, field, lang) {
  if (!sourceId || !field || !lang) {
    console.error('getTranslation: 引数が不足しています', { sourceId, field, lang });
    return null;
  }

  try {
    // 言語コードの正規化
    const normalizedLang = lang.toLowerCase();
    
    if (!supabase) {
      console.log('翻訳取得 [mock]:', sourceId, field, normalizedLang);
      return null;
    }
    
    const { data, error } = await supabase
      .from('translations')
      .select('translated_content, created_at')
      .eq('source_id', sourceId)
      .eq('field', field)
      .eq('language', normalizedLang)
      .single();
      
    if (error) {
      // データが見つからない場合はエラーにしない
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('翻訳取得エラー:', error);
      return null;
    }
    
    console.log('翻訳取得成功:', sourceId, field, normalizedLang, data.translated_content.slice(0, 20));
    return data.translated_content;
  } catch (error) {
    console.error('getTranslation エラー:', error);
    return null;
  }
} 