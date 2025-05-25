import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase =
  url && key
    ? createClient(url, key)        // 本番・Preview では実接続
    : {                             // ローカル開発ではモック
        from: () => ({
          select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
          upsert: () => ({
            select: () => ({ single: async () => ({ data: null, error: null }) }),
          }),
          insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        }),
        channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }) }),
      }; 