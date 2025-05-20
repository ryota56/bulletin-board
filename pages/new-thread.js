import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout.js';

export default function NewThread() {
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) return;
    
    setSubmitting(true);
    
    try {
      console.log('Creating new thread:', { title, body });
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          language: 'ja', // 日本語固定（拡張可能）
        }),
      });
      
      if (!res.ok) {
        console.error(`Failed to create thread. Status: ${res.status}`);
        throw new Error(`Error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Thread created successfully:', data);
      
      // スレッドIDを確認用に出力
      console.log('Created thread ID:', data.thread.thread_id);
      
      // 匿名IDを保存
      if (typeof window !== 'undefined' && data.anonymousId && data.thread) {
        localStorage.setItem(`anonymousId_${data.thread.thread_id}`, data.anonymousId);
      }
      
      // サーバー側にデータが反映されるのを少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 作成したスレッドに遷移
      router.push(`/threads/${data.thread.thread_id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('スレッド作成に失敗しました。再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!ready) {
    return (
      <Layout>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={ready ? t('header.newThread') : ""}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('header.newThread')}</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                {t('newThread.title')}
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('newThread.enterTitle')}
                required
                maxLength={100}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
                {t('newThread.content')}
              </label>
              <textarea
                id="body"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t('newThread.enterContent')}
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`${
                  submitting
                    ? 'bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-700'
                } text-white font-bold py-2 px-4 rounded`}
              >
                {submitting ? t('newThread.creating') : t('buttons.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 