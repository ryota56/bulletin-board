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
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={ready ? t('header.newThread') : ""}>
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <h1 className="text-3xl font-bold font-serif text-base-800 tracking-tight mb-8">{t('header.newThread')}</h1>
        
        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-base-700 text-sm font-medium mb-2" htmlFor="title">
                {t('newThread.title')}
              </label>
              <input
                id="title"
                type="text"
                className="input w-full text-base-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('newThread.enterTitle')}
                required
                maxLength={100}
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-base-700 text-sm font-medium mb-2" htmlFor="body">
                {t('newThread.content')}
              </label>
              <textarea
                id="body"
                className="input w-full text-base-700"
                rows={10}
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
                className="btn btn-secondary"
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`btn ${
                  submitting
                    ? 'bg-base-400 text-white cursor-not-allowed'
                    : 'btn-primary animate-float'
                }`}
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