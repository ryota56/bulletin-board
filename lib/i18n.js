import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ① 翻訳ファイルを静的インポート
import jaCommon from '../public/locales/ja/common.json';
import enCommon from '../public/locales/en/common.json';

// ② i18next 本体を初期化
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      // ②-1 名前空間を正しく指定
      ns: ['common'],
      defaultNS: 'common',

      // ②-2 翻訳リソースを実体で渡す
      resources: {
        ja: { common: jaCommon },
        en: { common: enCommon },
      },

      // ②-3 言語まわり
      fallbackLng: 'ja',
      // 最初はブラウザ設定を優先。無ければ ja
      lng: typeof window !== 'undefined'
        ? (navigator.language || 'ja').split('-')[0]
        : 'ja',

      interpolation: { escapeValue: false },
    });
}

// ③ React Context で言語切替をアプリに配信
const LangCtx = createContext({
  locale: i18n.language,
  setLocale: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.language);

  // 言語を切り替えたら i18next 側にも反映
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <LangCtx.Provider value={{ locale, setLocale }}>
      {children}
    </LangCtx.Provider>
  );
};

export const useLanguage = () => useContext(LangCtx);
export default i18n;