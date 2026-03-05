import Link from "next/link";
import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";

export default function LoginPage() {
  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="mx-auto max-w-3xl">
          <PageSection label="Secure Access" title="Member Login">
            <p>Access your participant dashboard, recordings, and resources.</p>
            <form className="grid gap-4 pt-3" action="#" method="post">
              <label className="grid gap-2">
                <span className="text-sm text-[var(--muted)]">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none"
                  placeholder="you@example.com"
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
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-2.5 text-sm transition hover:text-[var(--accent)]"
              >
                Sign in
              </button>
            </form>
            <p className="text-sm text-[var(--muted)]">
              Need help with access? <Link href="mailto:support@oumnur.com">support@oumnur.com</Link>
            </p>
          </PageSection>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
