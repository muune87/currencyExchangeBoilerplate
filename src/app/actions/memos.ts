'use server';

import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesInsert } from '@/types/supabase';

export async function addMemo(body: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: uerr,
  } = await supabase.auth.getUser();
  if (uerr) throw uerr;
  if (!user) throw new Error('Not authenticated');

  const row: TablesInsert<'memos'> = { user_id: user.id, body };

  const { error } = await supabase.from('memos').insert([row]);
  if (error) throw error;
}

export async function listMemos(): Promise<
  Array<Pick<Tables<'memos'>, 'id' | 'body' | 'created_at'>>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('memos')
    .select('id, body, created_at')
    .returns<Array<Pick<Tables<'memos'>, 'id' | 'body' | 'created_at'>>>();

  if (error) throw error;
  return data ?? [];
}
