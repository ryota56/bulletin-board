import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/i18n';
import { supabase } from '../../lib/supabaseClient';

export default function ThreadDetail() {
  const { t, ready } = useTranslation('common');
  const { locale } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [anonymousId, setAnonymousId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const fetchThread = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      console.log(`Fetching thread with ID: ${id}, language: ${locale}`);
      
      // 最大3回リトライする
      let attempts = 0;
      const maxAttempts = 3;
      let threadData = null;
      
      while (attempts < maxAttempts && !threadData) {
        attempts++;
        
        try {
          const res = await fetch(`/api/threads/${id}?lang=${locale}`);
          
          if (res.ok) {
            threadData = await res.json();
            console.log('Thread data received:', threadData);
            break;
          } else {
            // 404エラーの場合は少し待ってリトライ
            if (res.status === 404) {
              console.log(`Attempt ${attempts}/${maxAttempts}: Thread not found, retrying in 500ms...`);
              await new Promise(resolve => setTimeout(resolve, 500));
            } else {
              console.error(`Failed to fetch thread. Status: ${res.status}`);
              const errorData = await res.json();
              console.error('Error details:', errorData);
              throw new Error(`Error: ${res.status}`);
            }
          }
        } catch (retryError) {
          if (attempts >= maxAttempts) {
            throw retryError;
          }
          console.error(`Retry attempt ${attempts} failed:`, retryError);
        }
      }
      
      if (threadData) {
        setThread(threadData.thread);
        setPosts(threadData.posts || []);
        
        // ローカルストレージから匿名IDを取得するか新規生成
        if (typeof window !== 'undefined') {
          const storedId = localStorage.getItem(`anonymousId_${id}`);
          if (storedId) {
            setAnonymousId(storedId);
          } else {
            const newId = `匿名${Math.floor(Math.random() * 1000)}`;
            setAnonymousId(newId);
            localStorage.setItem(`anonymousId_${id}`, newId);
          }
        }
      } else {
        throw new Error('Failed to fetch thread after multiple attempts');
      }
    } catch (error) {
      console.error('Error fetching thread:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // リアルタイムサブスクリプション設定
  useEffect(() => {
    if (!id || !ready) return;
    
    fetchThread();
    
    // Supabaseのリアルタイム更新をサブスクライブ（実際のプロジェクトで使用）
    /* 
    const subscription = supabase
      .channel(`posts_${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'Posts',
        filter: `thread_id=eq.${id}`
      }, () => {
        // 投稿時、即時表示するために呼び出す
        fetchThread();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
    */
  }, [id, locale, ready]);
  
  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyBody.trim() || !thread) return;
    
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/posts?lang=${locale}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: thread.thread_id,
          body: replyBody,
          anonymousId,
          uiLang: locale, // 現在のUI言語を送信
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      // 投稿レスポンスを取得
      const postData = await res.json();
      console.log('Post response:', postData);
      
      // 投稿成功
      setReplyBody('');
      
      // 翻訳結果がある場合は即座に表示に反映
      if (postData.translated) {
        // 既存の投稿一覧に新しい投稿を追加（翻訳済み）
        const newPost = {
          ...postData,
          body: postData.translated.body // 翻訳されたテキストを表示
        };
        
        setPosts(prevPosts => [...prevPosts, newPost]);
      } else {
        // 翻訳結果がない場合は原文のまま表示
        setPosts(prevPosts => [...prevPosts, postData]);
      }
      
      // スクロールを最下部に移動
      window.scrollTo(0, document.body.scrollHeight);
    } catch (error) {
      console.error('Error posting reply:', error);
      alert(ready ? t('thread.postFailure') : '投稿に失敗しました');
      // エラー発生時はスレッドを再取得
      fetchThread();
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
  
  if (loading && !thread) {
    return (
      <Layout>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>
      </Layout>
    );
  }
  
  // 開発モードでのデバッグ表示
  if (process.env.NODE_ENV === 'development' && !thread && !loading) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-accent-600">{t('thread.notFound')}</h1>
          <div className="mt-6 p-5 bg-base-100 rounded-lg shadow-md text-left overflow-auto max-w-2xl mx-auto">
            <h2 className="font-bold font-serif">デバッグ情報:</h2>
            <p>スレッドID: {id}</p>
            <p>言語: {locale}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 btn btn-primary"
            >
              {t('thread.returnHome')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!thread && !loading) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-accent-600">{t('thread.notFound')}</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-6 btn btn-primary"
          >
            {t('thread.returnHome')}
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={thread?.title}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-base-800 tracking-tight">{thread?.title}</h1>
        <div className="text-sm text-base-500 mt-2">
          {t('thread.created')}: {thread && new Date(thread.created_at).toLocaleString()}
        </div>
      </div>
      
      <div className="card mb-8 divide-y divide-base-200 animate-fade-in-up">
        {posts.map((post, index) => (
          <div 
            key={post.id || post.post_id}
            className="p-6"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="flex justify-between mb-3">
              <span className="font-medium text-base-700">{post.anonymous_id}</span>
              <span className="text-sm text-base-500">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
            <div className="whitespace-pre-wrap text-base-700">{post.body}</div>
          </div>
        ))}
      </div>
      
      <div className="card p-6">
        <h2 className="text-xl font-medium font-serif mb-5 text-base-800">{t('thread.reply')}</h2>
        <form onSubmit={handleReply}>
          <div className="mb-5">
            <label className="block text-base-700 text-sm font-medium mb-2">
              {t('thread.posterId')}: <span className="font-serif">{anonymousId}</span>
            </label>
            <textarea
              className="input w-full px-4 py-3 text-base-700"
              rows={5}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={t('thread.enterContent')}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`btn ${
              submitting
                ? 'bg-base-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {submitting ? t('thread.posting') : t('buttons.submit')}
          </button>
        </form>
      </div>
    </Layout>
  );
} 