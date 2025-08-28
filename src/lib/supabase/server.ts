import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n: string) => cookieStore.get(n)?.value,
        set: (n, v, o: CookieOptions) => {
          try {
            cookieStore.set({ name: n, value: v, ...o });
          } catch {}
        },
        remove: (n, o: CookieOptions) => {
          try {
            cookieStore.set({ name: n, value: '', ...o });
          } catch {}
        },
      },
    },
  ) as unknown as SupabaseClient<Database>;
}
