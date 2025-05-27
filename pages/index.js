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
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif text-base-800 tracking-tight">{ready ? t('site.title') : ""}</h1>
        <Link 
          href="/new-thread"
          className="btn btn-primary animate-float"
        >
          {ready ? t('header.newThread') : ""}
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>
      ) : (
        <>
          <div className="card divide-y divide-base-200 animate-fade-in-up">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <div key={thread.id || thread.thread_id} className="p-6 hover:bg-base-50 transition-colors duration-200">
                  <Link 
                    href={`/threads/${thread.thread_id}`}
                    className="block"
                  >
                    <h2 className="text-xl font-medium font-serif text-base-800">{thread.title}</h2>
                    {thread.description && (
                      <p className="mt-1 text-sm text-base-600">
                        {((thread[`description_${locale}`] || thread.description).length > 50)
                          ? `${(thread[`description_${locale}`] || thread.description).substring(0, 50)}...` 
                          : (thread[`description_${locale}`] || thread.description)
                        }
                      </p>
                    )}
                    <div className="mt-2 text-sm text-base-500">
                      {new Date(thread.updated_at).toLocaleString()}
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-base-500">
                スレッドがありません
              </div>
            )}
          </div>
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    pageNumber === page
                      ? 'bg-accent-500 text-white shadow-md'
                      : 'bg-base-200 text-base-700 hover:bg-base-300 hover:shadow-sm'
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