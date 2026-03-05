import Link from "next/link";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { getRecentTransactions } from "@/lib/payments";

export default async function AdminOperationsPage() {
  const transactions = await getRecentTransactions(10);

  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="space-y-6">
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Operational maturity</p>
            <h1 className="font-serif-display text-4xl md:text-6xl">Admin operations</h1>
            <p className="max-w-3xl text-[var(--ink)]/90">
              Lightweight observability and payment auditing view. Run digest scheduling from the API and review recent transaction logs.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif-display text-2xl">Background jobs</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Trigger <code>POST /api/jobs/digest</code> from a scheduler (Trigger.dev/Inngest/cron) for reminders and digest notifications.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-serif-display text-2xl">Recent transactions</h2>
            <div className="mt-4 space-y-3">
              {transactions.length === 0 ? <p className="text-sm text-[var(--muted)]">No transactions logged yet.</p> : null}
              {transactions.map((txn) => (
                <article key={txn.id} className="rounded-xl border border-[var(--border)] p-3 text-sm">
                  <p>
                    {txn.email} - {txn.offeringSlug} - ${txn.amount}
                  </p>
                  <p className="text-[var(--muted)]">
                    {txn.status} - scholarship: {txn.scholarshipRequested ? "yes" : "no"} - sponsor: ${txn.sponsorshipAmount}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <Link href="/admin/content" className="inline-flex text-sm underline decoration-[var(--border)]">
            Open content admin
          </Link>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
