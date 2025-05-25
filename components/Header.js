'use client';

import { useTranslation } from 'react-i18next';
import { useLanguage } from '../lib/i18n.js';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const { t, ready } = useTranslation('common');
  const { locale, setLocale } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // クライアントサイドのみでレンダリングされるようにするためのフック
  useEffect(() => {
    setMounted(true);
  }, []);

  // サーバーサイドレンダリング時に使用するフォールバックテキスト
  const fallbackTexts = {
    siteTitle: '5ch掲示板',
    home: 'ホーム',
    newThread: '新規スレッド',
    ja: '日本語',
    en: '英語'
  };

  // クライアントサイドでレンダリングされる前は何も表示しない
  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-base-800 text-white py-5 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight animate-wiggle inline-block">
          {ready ? t('site.title') : fallbackTexts.siteTitle}
        </Link>
        
        <nav className="flex space-x-6 items-center">
          <Link href="/" className="text-base-100 hover:text-accent-300 transition-colors duration-300 font-medium">
            {ready ? t('header.home') : fallbackTexts.home}
          </Link>
          <Link href="/new-thread" className="text-base-100 hover:text-accent-300 transition-colors duration-300 font-medium">
            {ready ? t('header.newThread') : fallbackTexts.newThread}
          </Link>
          
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="bg-base-700 rounded-md px-3 py-1.5 text-sm border-base-600 border focus:ring-2 focus:ring-accent-400 focus:outline-none"
          >
            <option value="ja">{ready ? t('languages.ja') : fallbackTexts.ja}</option>
            <option value="en">{ready ? t('languages.en') : fallbackTexts.en}</option>
          </select>
        </nav>
      </div>
    </header>
  );
} 