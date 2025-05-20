import { supabase } from './supabaseClient.js';
import axios from 'axios';

// DeepL API設定
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'your-api-key'; // 環境変数から取得

/**
 * DeepL APIを使用してテキストを翻訳する
 * @param {object} params - パラメータ
 * @param {string|string[]} params.text - 翻訳するテキストまたはテキストの配列
 * @param {string} params.targetLang - ターゲット言語コード（'EN'または'JA'）
 * @returns {Promise<string[]>} - 翻訳されたテキストの配列
 */
export async function translateWithDeepL({ text, targetLang }) {
  try {
    // 言語コードをDeepL形式に変換
    const formattedLang = targetLang.toUpperCase();
    
    // テキストを配列に確実に変換
    const textArray = Array.isArray(text) ? text : [text];
    
    // 空のテキストはスキップ
    const filteredTextArray = textArray.filter(t => t && t.trim() !== '');
    if (filteredTextArray.length === 0) {
      return Array.isArray(text) ? [] : [''];
    }
    
    console.log(`翻訳APIリクエスト: targetLang=${formattedLang}, テキスト数=${filteredTextArray.length}`);
    
    // DeepL APIリクエスト
    const response = await axios.post(
      DEEPL_API_URL,
      {
        text: filteredTextArray,
        target_lang: formattedLang,
        source_lang: formattedLang === 'EN' ? 'JA' : 'EN',
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // レスポンスから翻訳テキストを取り出す
    const translations = response.data.translations.map(t => t.text);
    
    // デバッグ出力
    console.log(`翻訳結果: ${translations.length}件の翻訳が完了`);
    
    // 配列またはシングルの値を返す
    return Array.isArray(text) ? translations : [translations[0] || ''];
    
  } catch (error) {
    console.error('DeepL API翻訳エラー:', error.response?.data || error.message);
    
    // エラー時はフォールバック：元のテキストをそのまま返す
    return Array.isArray(text) ? text : [text];
  }
}

/**
 * 翻訳をデータベースに保存する
 * @param {string} sourceId - ソースID
 * @param {'thread'|'post'} sourceType - ソースタイプ
 * @param {string} language - 言語コード
 * @param {string} translatedContent - 翻訳されたコンテンツ
 * @returns {Promise} - 保存結果
 */
export async function saveTranslation(sourceId, sourceType, language, translatedContent) {
  try {
    // Supabaseに翻訳を保存
    const { data, error } = await supabase
      .from('translations')
      .upsert({
        source_id: sourceId,
        source_type: sourceType,
        language,
        translated_content: translatedContent,
        created_at: new Date().toISOString()
      });
      
    if (error) throw error;
    
    console.log(`翻訳を保存: ${sourceType} ${sourceId} to ${language}`);
    return { data, error: null };
    
  } catch (error) {
    console.error('翻訳保存エラー:', error);
    return { data: null, error };
  }
}

/**
 * 翻訳をデータベースから取得する
 * @param {string} sourceId - ソースID
 * @param {'thread'|'post'} sourceType - ソースタイプ
 * @param {string} language - 言語コード
 * @returns {Promise<string|null>} - 保存された翻訳データ
 */
export async function getTranslation(sourceId, sourceType, language) {
  try {
    // Supabaseから翻訳を取得
    const { data, error } = await supabase
      .from('translations')
      .select('translated_content')
      .eq('source_id', sourceId)
      .eq('source_type', sourceType)
      .eq('language', language)
      .single();
      
    if (error) throw error;
    
    console.log(`翻訳を取得: ${sourceType} ${sourceId} from ${language}`);
    return data?.translated_content || null;
    
  } catch (error) {
    console.error('翻訳取得エラー:', error);
    return null;
  }
} 