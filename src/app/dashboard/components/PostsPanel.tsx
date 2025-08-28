'use client';
import { useState, useEffect } from 'react';
import { addPost } from '@/app/actions/posts';
import { createClient } from '@/lib/supabase/client';

export default function PostsPanel() {
  const [posts, setPosts] = useState<
    { id: string; title: string; body: string; created_at: string | null }[]
  >([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, body, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error) setPosts(data ?? []);
    }

    fetchPosts(); // 최초 로딩

    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchPosts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await addPost(title, body);
      setTitle('');
      setBody('');
      alert('Posted');
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message ?? 'Error');
      } else {
        alert('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Board</h3>
      <form onSubmit={onSubmit} className="container">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
      <table>
        <tbody>
          {posts.map((p) => {
            const createdAt = p.created_at ? new Date(p.created_at) : null;
            return (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.body}</td>
                <td>{createdAt ? createdAt.toLocaleString() : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
