'use client';
import { useEffect, useState } from 'react';
import { addPost, listPosts } from '@/app/actions/posts';
import { createClient } from '@/lib/supabase/client';

type Post = {
  id: string;
  title: string;
  body: string;
  created_at: string | null;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

export default function PostsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts_with_author')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      const postsData = (data ?? []) as Post[];

      if (!error) {
        setPosts(postsData);
      }
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
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Created At</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => {
            const createdAt = p.created_at ? new Date(p.created_at) : null;
            return (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.body}</td>
                <td>{createdAt ? createdAt.toLocaleString() : '-'}</td>
                <td>
                  {p.full_name ?? p.email ?? '익명'}
                  {p.avatar_url && (
                    <img
                      src={p.avatar_url}
                      alt="avatar"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        marginLeft: 4,
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
