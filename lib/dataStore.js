/**
 * サーバーサイドで共有するデータストア
 * Next.jsの開発サーバーでAPIエンドポイント間でデータを共有するために使用
 */

// グローバル変数として保存するためのヘルパー
if (!global.threadsStore) {
  global.threadsStore = [
    {
      thread_id: '1',
      title: 'サンプルスレッド1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: 'ja'
    },
    {
      thread_id: '2',
      title: 'サンプルスレッド2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      language: 'ja'
    },
    {
      thread_id: '3',
      title: 'プログラミングについての議論',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 5400000).toISOString(),
      language: 'ja'
    }
  ];
}

if (!global.postsStore) {
  global.postsStore = {
    '1': [
      {
        post_id: '1_1',
        thread_id: '1',
        body: '最初の投稿です',
        anonymous_id: '匿名123',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        language: 'ja'
      },
      {
        post_id: '1_2',
        thread_id: '1',
        body: '返信です',
        anonymous_id: '匿名456',
        created_at: new Date().toISOString(),
        language: 'ja'
      }
    ],
    '2': [
      {
        post_id: '2_1',
        thread_id: '2',
        body: '別のスレッドの投稿です',
        anonymous_id: '匿名789',
        created_at: new Date(Date.now() - 2400000).toISOString(),
        language: 'ja'
      }
    ],
    '3': [
      {
        post_id: '3_1',
        thread_id: '3',
        body: 'プログラミングについて話しましょう',
        anonymous_id: '匿名101',
        created_at: new Date(Date.now() - 172000000).toISOString(),
        language: 'ja'
      }
    ]
  };
}

// スレッドデータ保存用配列をエクスポート
export const threadsStore = global.threadsStore;

// 投稿データ保存用オブジェクトをエクスポート
export const postsStore = global.postsStore;

// 新しいスレッドを追加するユーティリティ関数
export function addThread(thread) {
  // 既存のスレッドを確認（重複追加防止）
  const existingThread = threadsStore.find(t => t.thread_id === thread.thread_id);
  if (!existingThread) {
    threadsStore.push({...thread}); // オブジェクトをコピーして追加
    console.log(`スレッド追加: ID=${thread.thread_id}, タイトル="${thread.title}"`);
    console.log('現在のスレッド一覧:', threadsStore.map(t => t.thread_id));
  }
}

// 新しい投稿を追加するユーティリティ関数
export function addPost(threadId, post) {
  if (!postsStore[threadId]) {
    postsStore[threadId] = [];
  }
  postsStore[threadId].push({...post}); // オブジェクトをコピーして追加
  console.log(`投稿追加: スレッドID=${threadId}, 投稿ID=${post.post_id}`);
}

// デバッグ用：データストアの内容を表示
export function debugDataStore() {
  console.log('===== データストア内容 =====');
  console.log('スレッド数:', threadsStore.length);
  console.log('スレッドID一覧:', threadsStore.map(t => t.thread_id));
  console.log('投稿数:', Object.keys(postsStore).length);
  console.log('==========================');
} 