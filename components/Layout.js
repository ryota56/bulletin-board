'use client';

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

// HeaderコンポーネントをSSRなしでインポート
const Header = dynamic(() => import('./Header'), { ssr: false });

export default function Layout({ children, title }) {
  const { t, ready } = useTranslation('common');
  const [mounted, setMounted] = useState(false);
  
  // クライアントサイドでのみ実行されるuseEffect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // サーバー側レンダリング用のフォールバックタイトル
  const defaultTitle = title || '5ch掲示板';
  const pageTitle = mounted && ready ? 
    (title ? `${title} | ${t('site.title')}` : t('site.title')) : 
    defaultTitle;

  // 初期レンダリング時は空のdivを返す（ハイドレーション問題を防ぐため）
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={ready ? t('site.description') : '匿名で自由に投稿できる掲示板です'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>© {new Date().getFullYear()} 5ch Board</p>
        </footer>
      </div>
    </>
  );
} 