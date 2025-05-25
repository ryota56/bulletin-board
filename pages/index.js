import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { useLanguage } from '../lib/i18n';
import Link from 'next/link';

export default function Home() {
  const { t, ready } = useTranslation('common');
  const { locale } = useLanguage();
  
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const fetchThreads = async () => {
    setLoading(true);
    try {
      console.log(`Fetching threads with language: ${locale}, page: ${page}`);
      const res = await fetch(`/api/threads?lang=${locale}&page=${page}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log(`Received ${data.threads?.length || 0} threads`);
      
      setThreads(data.threads || []);
      setTotalPages(Math.ceil((data.totalCount || 0) / 20));
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (ready) {
      fetchThreads();
    }
  }, [locale, page, ready]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  if (!ready) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{ready ? t('site.title') : ""}</h1>
        <Link 
          href="/new-thread"
          className="btn btn-primary"
        >
          {ready ? t('header.newThread') : ""}
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg divide-y">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <div key={thread.id || thread.thread_id} className="p-4 hover:bg-gray-50">
                  <Link 
                    href={`/threads/${thread.thread_id}`}
                    className="block"
                  >
                    <h2 className="text-lg font-medium text-gray-900">{thread.title}</h2>
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(thread.updated_at).toLocaleString()}
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                スレッドがありません
              </div>
            )}
          </div>
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    pageNumber === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
} 