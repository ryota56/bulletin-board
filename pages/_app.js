'use client';

import { LanguageProvider } from '../lib/i18n';
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// NoSSRコンポーネント - SSRでレンダリングしないコンポーネントをラップ
const NoSSR = ({ children }) => {
  return <>{children}</>;
};

// LanguageProviderを動的インポートでSSRから除外
const ClientLanguageProvider = dynamic(
  () => Promise.resolve(LanguageProvider),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 注：コンポーネント自体は常にレンダリングします
  return mounted ? (
    <ClientLanguageProvider>
      <Component {...pageProps} />
    </ClientLanguageProvider>
  ) : (
    <NoSSR>
      <Component {...pageProps} />
    </NoSSR>
  );
}

export default MyApp; 