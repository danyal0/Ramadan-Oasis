"use client";

import { FormEvent, useState } from "react";

type AuthState = {
  kind: "idle" | "success" | "error";
  message: string;
};

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState<AuthState>({
    kind: "idle",
    message: "Use seeded accounts from `.env.local` to test role-based access.",
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setAuthState({ kind: "idle", message: "Signing in..." });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setAuthState({ kind: "error", message: "Sign in failed. Check credentials and try again." });
        return;
      }

      setAuthState({ kind: "success", message: "Signed in. Protected pages now use your enrollment permissions." });
    } catch {
      setAuthState({ kind: "error", message: "Network error while signing in." });
    } finally {
      setLoading(false);
    }
  }

  async function onSignOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthState({ kind: "success", message: "Signed out." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-4 pt-3" onSubmit={onSubmit}>
        <label className="grid gap-2">
          <span className="text-sm text-[var(--muted)]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-[var(--muted)]">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-2.5 text-sm transition hover:text-[var(--accent)] disabled:opacity-70"
          >
            Sign in
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onSignOut}
            className="mt-2 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-2.5 text-sm transition hover:text-[var(--accent)] disabled:opacity-70"
          >
            Sign out
          </button>
        </div>
      </form>

      <p className={authState.kind === "error" ? "text-sm text-red-700" : "text-sm text-[var(--muted)]"}>{authState.message}</p>
    </div>
  );
}
