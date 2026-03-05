"use client";

import { FormEvent, useState } from "react";

type CommunityPost = {
  id: string;
  authorName: string;
  type: "discussion" | "reflection";
  body: string;
  createdAt: string;
};

type CommunityFeedProps = {
  offeringSlug: string;
  initialPosts: CommunityPost[];
};

export function CommunityFeed({ offeringSlug, initialPosts }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);
    const response = await fetch(`/api/community/posts?offeringSlug=${offeringSlug}`, { cache: "no-store" });
    const data = (await response.json()) as { posts?: CommunityPost[]; error?: string };
    if (!response.ok || !data.posts) {
      setNotice(data.error ?? "Unable to load community posts.");
      setLoading(false);
      return;
    }
    setPosts(data.posts);
    setNotice("");
    setLoading(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        offeringSlug,
        body,
        type: "reflection",
      }),
    });
    if (!response.ok) {
      setNotice("Could not publish reflection.");
      return;
    }
    setBody("");
    await loadPosts();
  }

  return (
    <section className="space-y-4">
      <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="grid gap-2">
          <span className="text-sm text-[var(--muted)]">Share reflection</span>
          <textarea
            className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write a short reflection from your practice this week."
            required
          />
        </label>
        <button
          type="submit"
          className="mt-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm hover:text-[var(--accent)]"
        >
          Publish
        </button>
      </form>

      {notice ? <p className="text-sm text-red-700">{notice}</p> : null}
      {loading ? <p className="text-sm text-[var(--muted)]">Loading community feed...</p> : null}
      <div className="space-y-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              {post.type} - {post.authorName}
            </p>
            <p className="mt-2 leading-relaxed">{post.body}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{new Date(post.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
