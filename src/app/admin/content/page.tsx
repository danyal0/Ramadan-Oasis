"use client";

import { useState } from "react";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";

type Notice = { type: "error" | "success"; text: string } | null;

export default function AdminContentPage() {
  const [token, setToken] = useState("");
  const [jsonValue, setJsonValue] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);

  async function loadContent() {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/content", {
        cache: "no-store",
        headers: {
          "x-admin-token": token,
        },
      });
      const data = (await response.json()) as unknown;
      if (!response.ok) {
        setNotice({ type: "error", text: "Could not load content JSON." });
        return;
      }
      setJsonValue(JSON.stringify(data, null, 2));
    } catch {
      setNotice({ type: "error", text: "Network issue while loading content." });
    } finally {
      setLoading(false);
    }
  }

  async function saveContent() {
    setLoading(true);
    setNotice(null);
    try {
      const parsed = JSON.parse(jsonValue) as unknown;
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(parsed),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setNotice({ type: "error", text: body.error ?? "Save failed." });
        return;
      }

      setNotice({ type: "success", text: "Content saved." });
    } catch {
      setNotice({ type: "error", text: "JSON is not valid." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="mx-auto max-w-5xl space-y-5 py-2 text-[var(--ink)]">
          <h1 className="font-serif-display text-4xl">Content Admin</h1>
          <p className="text-[var(--muted)]">
            Lightweight JSON-backed content layer. Edit copy, resources, schedule-related text, and curation pins without touching
            code.
          </p>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Admin edit token"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            />
            <button
              type="button"
              onClick={loadContent}
              disabled={loading}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 hover:text-[var(--accent)] disabled:opacity-70"
            >
              Load
            </button>
            <button
              type="button"
              onClick={saveContent}
              disabled={loading || !jsonValue}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 hover:text-[var(--accent)] disabled:opacity-70"
            >
              Save
            </button>
          </div>

          <textarea
            value={jsonValue}
            onChange={(event) => setJsonValue(event.target.value)}
            className="min-h-[60vh] w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6"
            placeholder="Press Load to fetch current JSON content..."
          />

          {notice ? (
            <p className={notice.type === "error" ? "text-red-700" : "text-[var(--muted)]"}>{notice.text}</p>
          ) : null}
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
