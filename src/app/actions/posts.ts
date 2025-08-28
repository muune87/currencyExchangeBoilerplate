'use server';

import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesInsert } from '@/types/supabase';

export async function addPost(title: string, body: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: uerr,
  } = await supabase.auth.getUser();
  if (uerr) throw uerr;
  if (!user) throw new Error('Not authenticated');

  const row: TablesInsert<'posts'> = { user_id: user.id, title, body };

  const { error } = await supabase.from('posts').insert([row]);
  if (error) throw error;
}

/** created_at은 스키마상 string|null 이므로 그대로 반영 */
export async function listPosts(): Promise<
  Array<Pick<Tables<'posts'>, 'id' | 'title' | 'body' | 'created_at'>>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, body, created_at')
    .returns<
      Array<Pick<Tables<'posts'>, 'id' | 'title' | 'body' | 'created_at'>>
    >();

  if (error) throw error;
  return data ?? [];
}
