import Link from "next/link";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { getOfferings } from "@/lib/offerings";

export default async function OfferingsPage() {
  const offerings = await getOfferings();
  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="space-y-8">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Offerings</p>
            <h1 className="font-serif-display text-4xl md:text-6xl">Multi-offering architecture</h1>
            <p className="max-w-3xl text-[var(--ink)]/90">
              Offerings are now rendered from a data layer and each entry has its own route under <code>/offerings/[slug]</code>.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {offerings.map((offering) => (
              <article key={offering.slug} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">{offering.visibility} offering</p>
                <h2 className="mt-2 font-serif-display text-3xl">{offering.title}</h2>
                <p className="mt-2 text-[var(--muted)]">{offering.tagline}</p>
                <p className="mt-3">{offering.description}</p>
                <Link href={`/offerings/${offering.slug}`} className="mt-5 inline-flex text-sm underline decoration-[var(--border)]">
                  Open offering
                </Link>
              </article>
            ))}
          </section>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
