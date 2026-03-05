import Link from "next/link";
import { PaymentIntentButton } from "@/components/payment-intent-button";
import { Offering } from "@/lib/offerings";

type OfferingTemplateProps = {
  offering: Offering;
  hasAccess: boolean;
};

export function OfferingTemplate({ offering, hasAccess }: OfferingTemplateProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Offering</p>
        <h1 className="font-serif-display text-4xl md:text-5xl">{offering.title}</h1>
        <p className="text-[var(--muted)]">{offering.tagline}</p>
        <p className="max-w-4xl leading-relaxed">{offering.description}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {offering.contributionTiers.map((tier) => (
          <article key={tier.id} className="rounded-2xl border border-[var(--border)] p-4">
            <h2 className="font-serif-display text-2xl">{tier.label}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {tier.amount === 0 ? "Scholarship / Sponsored" : `$${tier.amount}`}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{tier.description}</p>
            <PaymentIntentButton offeringSlug={offering.slug} tierId={tier.id} amount={tier.amount} />
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full border border-[var(--border)] px-3 py-1">{offering.contributionModel}</span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1">
          Community {offering.communityEnabled ? "enabled" : "disabled"}
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1">
          Recordings {offering.recordingsEnabled ? "enabled" : "disabled"}
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--border)] p-4 text-sm">
        {hasAccess ? (
          <p>
            You are enrolled. Visit the <Link href="/community">community feed</Link> and <Link href="/recordings">recordings</Link>.
          </p>
        ) : (
          <p>
            Enrollment required for protected areas. Sign in and request enrollment from your facilitator for private offering access.
          </p>
        )}
      </div>
    </section>
  );
}
