"use client";

import { FormEvent, useState } from "react";

type FormState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

const initialState: FormState = {
  loading: false,
  error: null,
  success: null,
};

export function RegistrationForm() {
  const [formState, setFormState] = useState<FormState>(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormState({ loading: true, error: null, success: null });
    const form = new FormData(event.currentTarget);

    const payload = {
      fullName: String(form.get("fullName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      timezone: String(form.get("timezone") ?? "").trim(),
      contributionAmount: form.get("contributionAmount")
        ? Number(form.get("contributionAmount"))
        : null,
      intention: String(form.get("intention") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setFormState({
          loading: false,
          error: data.error ?? "Registration was not successful. Please try again.",
          success: null,
        });
        return;
      }

      event.currentTarget.reset();
      setFormState({
        loading: false,
        error: null,
        success:
          data.message ??
          "You are registered. Check your inbox for confirmation and next steps.",
      });
    } catch {
      setFormState({
        loading: false,
        error: "A network error occurred. Please try again in a moment.",
        success: null,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2">
        <span className="text-sm text-[var(--muted)]">Full name</span>
        <input
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--border)]"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Your full name"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-[var(--muted)]">Email</span>
        <input
          type="email"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--border)]"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-[var(--muted)]">Timezone</span>
        <input
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--border)]"
          name="timezone"
          required
          placeholder="e.g. America/Toronto"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-[var(--muted)]">Contribution (pay what you can)</span>
        <input
          type="number"
          min="0"
          step="1"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--border)]"
          name="contributionAmount"
          placeholder="Optional amount"
        />
      </label>

      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm text-[var(--muted)]">What are you hoping to receive from this journey? (optional)</span>
        <textarea
          className="min-h-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--border)]"
          name="intention"
          maxLength={1200}
          placeholder="Share a short intention..."
        />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={formState.loading}
          className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-medium text-[var(--ink)] transition hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {formState.loading ? "Submitting..." : "Register / Join the Oasis"}
        </button>
      </div>

      {formState.error ? <p className="md:col-span-2 text-sm text-red-800">{formState.error}</p> : null}
      {formState.success ? <p className="md:col-span-2 text-sm text-[var(--muted)]">{formState.success}</p> : null}
    </form>
  );
}
