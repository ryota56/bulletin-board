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
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          {ready ? t('site.title') : fallbackTexts.siteTitle}
        </Link>
        
        <nav className="flex space-x-4 items-center">
          <Link href="/" className="hover:text-gray-300">
            {ready ? t('header.home') : fallbackTexts.home}
          </Link>
          <Link href="/new-thread" className="hover:text-gray-300">
            {ready ? t('header.newThread') : fallbackTexts.newThread}
          </Link>
          
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="bg-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value="ja">{ready ? t('languages.ja') : fallbackTexts.ja}</option>
            <option value="en">{ready ? t('languages.en') : fallbackTexts.en}</option>
          </select>
        </nav>
      </div>
    </header>
  );
} 