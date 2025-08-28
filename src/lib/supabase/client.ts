'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Supabase 클라이언트 생성 함수
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
