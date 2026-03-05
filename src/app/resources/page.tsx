import Link from "next/link";
import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { getSiteContent } from "@/lib/content";

export default async function ResourcesPage() {
  const content = await getSiteContent();
  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="space-y-8">
          <PageSection label="Resources" title={content.resources.title}>
            <p>{content.resources.description}</p>
            <div className="grid gap-4 md:grid-cols-3">
              {content.resources.items.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="font-serif-display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-[var(--muted)]">{item.description}</p>
                  <Link href={item.href} className="mt-4 inline-flex text-sm underline decoration-[var(--border)]">
                    Explore
                  </Link>
                </article>
              ))}
            </div>
          </PageSection>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
