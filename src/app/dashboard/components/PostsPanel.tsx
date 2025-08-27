"use client";
import { useState, FormEvent } from "react";
import { addPost } from "@/app/actions/posts";


export default function PostsPanel({
                                       posts,
                                   }: { posts: { id: string; title: string; body: string; created_at: string | null }[] }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);


    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await addPost(title, body);
            setTitle("");
            setBody("");
            alert("Posted");
        } catch (e: any) {
            alert(e.message ?? "Error");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="card">
            <h3>Board</h3>
            <form onSubmit={onSubmit} className="container">
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
                <button className="btn" type="submit" disabled={loading}>{loading ? "Posting..." : "Post"}</button>
            </form>
            <table>
                <tbody>
                {posts.map((p) => {
                    const createdAt = p.created_at ? new Date(p.created_at) : null;
                    return (
                        <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{p.body}</td>
                            <td>{createdAt ? createdAt.toLocaleString() : "-"}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}