// モックのSupabaseクライアント
// 実際の環境では@supabase/supabase-jsのcreateClientを使用します

// モックのsupabaseオブジェクト
export const supabase = {
  // データ取得用のモックメソッド
  from: (table) => ({
    select: (columns) => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Not implemented in mock' } }),
        order: () => Promise.resolve({ data: [], error: null, count: 0 }),
      }),
      order: () => ({
        range: () => Promise.resolve({ data: [], error: null, count: 0 }),
      }),
    }),
    insert: (data) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Not implemented in mock' } })
      })
    }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  }),
  
  // リアルタイム機能のモック
  channel: (name) => ({
    on: () => ({
      subscribe: () => ({
        unsubscribe: () => {}
      })
    })
  })
}; 