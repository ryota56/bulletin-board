// ── 言語ユーティリティ ────────────────────────────────
const jaChar = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
export const detectLang = (t = '') => (jaChar.test(t) ? 'JA' : 'EN');
export const oppositeLang = (l) => (l === 'JA' ? 'EN' : 'JA');
export const mapLang = (l = '') =>
  l.toLowerCase().startsWith('en') ? 'EN'
  : l.toLowerCase().startsWith('ja') ? 'JA'
  : l.toUpperCase();

export const manualDict = {
  '犬': 'dog',  '猫': 'cat',
  'dog': '犬',  'cat': '猫',
};

export const dictionaryLookup = (text, target) => {
  const hit = manualDict[text.trim()];
  if (!hit) return null;
  return target === 'EN' ? hit : Object.keys(manualDict)
    .find(k => manualDict[k] === text.trim()) || null;
}; 