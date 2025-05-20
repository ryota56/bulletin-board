'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// i18n初期化はクライアントサイドでのみ実行
let i18nInitialized = false;

if (typeof window !== 'undefined' && !i18nInitialized) {
  i18nInitialized = true;
  
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: 'ja',
      fallbackLng: 'ja',
      ns: ['common'],
      defaultNS: 'common',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: {
        useSuspense: false
      }
    });
}

// 言語コンテキスト
const LanguageContext = createContext({
  locale: 'ja',
  setLocale: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocaleState] = useState('ja');

  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window !== 'undefined') {
      // ローカルストレージから言語設定を取得
      const savedLocale = localStorage.getItem('site_language');
      if (savedLocale === 'ja' || savedLocale === 'en') {
        setLocaleState(savedLocale);
        i18n.changeLanguage(savedLocale);
      }
    }
  }, []);

  const setLocale = (lang) => {
    if (lang === 'ja' || lang === 'en') {
      setLocaleState(lang);
      i18n.changeLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_language', lang);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 