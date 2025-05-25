// 翻訳キャッシュを管理するシンプルなユーティリティ
// メモリ内キャッシュとしてシンプルに実装。必要に応じてRedisやSupabaseなどに置き換え可能

// メモリ内キャッシュオブジェクト（サーバーリスタートでリセットされる）
if (!global.translationCache) {
  global.translationCache = {};
}

const cache = global.translationCache;

/**
 * キャッシュキーを生成
 * @param {string} sourceId - 翻訳元コンテンツのID
 * @param {string} field - 翻訳するフィールド名（title, bodyなど）
 * @param {string} targetLang - 翻訳先言語
 * @returns {string} キャッシュキー
 */
const generateCacheKey = (sourceId, field, targetLang) => {
  return `${sourceId}_${field}_${targetLang}`;
};

/**
 * 翻訳をキャッシュから取得
 * @param {string} sourceId - 翻訳元コンテンツのID
 * @param {string} field - 翻訳するフィールド名（title, bodyなど）
 * @param {string} targetLang - 翻訳先言語
 * @returns {string|null} キャッシュされた翻訳テキスト、なければnull
 */
export function getCachedTranslation(sourceId, field, targetLang) {
  const key = generateCacheKey(sourceId, field, targetLang);
  const cached = cache[key];
  
  if (cached) {
    // キャッシュヒット数を記録（オプション）
    cache[`${key}_hits`] = (cache[`${key}_hits`] || 0) + 1;
  }
  
  return cached || null;
}

/**
 * 翻訳をキャッシュに保存
 * @param {string} sourceId - 翻訳元コンテンツのID
 * @param {string} field - 翻訳するフィールド名（title, bodyなど）
 * @param {string} targetLang - 翻訳先言語
 * @param {string} text - 翻訳テキスト
 */
export function setCachedTranslation(sourceId, field, targetLang, text) {
  if (!text) return;
  
  const key = generateCacheKey(sourceId, field, targetLang);
  cache[key] = text;
  // 最終更新時間を記録（オプション）
  cache[`${key}_updated`] = Date.now();
}

/**
 * キャッシュ内のすべての翻訳を取得（デバッグ用）
 */
export function getAllCachedTranslations() {
  return { ...cache };
}

/**
 * 特定の条件に一致するキャッシュエントリをすべて削除
 * @param {object} filters - フィルター条件
 * @param {string} [filters.sourceId] - 特定のソースIDに関連するキャッシュのみ削除
 * @param {string} [filters.field] - 特定のフィールドに関連するキャッシュのみ削除
 * @param {string} [filters.targetLang] - 特定の言語に関連するキャッシュのみ削除
 */
export function clearCachedTranslations(filters = {}) {
  const { sourceId, field, targetLang } = filters;
  
  Object.keys(cache).forEach(key => {
    // メタデータキー（_hitsや_updatedで終わるもの）はスキップ
    if (key.endsWith('_hits') || key.endsWith('_updated')) return;
    
    const [keySourceId, keyField, keyLang] = key.split('_');
    
    // フィルター条件に基づいてキャッシュエントリを削除
    if (
      (sourceId && keySourceId !== sourceId) ||
      (field && keyField !== field) ||
      (targetLang && keyLang !== targetLang)
    ) {
      return; // フィルター条件に一致しない場合はスキップ
    }
    
    // フィルター条件に一致する場合、キャッシュエントリとそのメタデータを削除
    delete cache[key];
    delete cache[`${key}_hits`];
    delete cache[`${key}_updated`];
  });
} 