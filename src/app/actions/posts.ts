'use server';
import { createClient } from '@/lib/supabase/server';
import type { TablesInsert } from '@/types/supabase';

export async function addPost(title: string, body: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: uerr,
  } = await supabase.auth.getUser();
  if (uerr) throw uerr;
  if (!user) throw new Error('Not authenticated');

  // user_email 추가
  const row: TablesInsert<'posts'> = {
    user_id: user.id,
    title,
    body,
    user_email: user.email,
  };

  const { error } = await supabase.from('posts').insert([row]);
  if (error) throw error;
}

/** created_at은 스키마상 string|null 이므로 그대로 반영 */
export async function listPosts(): Promise<
  Array<{
    id: string;
    title: string;
    body: string;
    created_at: string | null;
    user_id: string;
    user_email?: string | null;
  }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, body, created_at, user_id, user_email')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data ?? [];
}
