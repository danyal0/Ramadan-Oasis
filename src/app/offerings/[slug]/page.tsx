import { notFound } from "next/navigation";
import { OfferingTemplate } from "@/components/offering-template";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { getCurrentUser, hasOfferingAccess } from "@/lib/auth";
import { getOfferingBySlug, getOfferings } from "@/lib/offerings";

export async function generateStaticParams() {
  const offerings = await getOfferings();
  return offerings.map((offering) => ({ slug: offering.slug }));
}

type OfferingRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function OfferingBySlugPage({ params }: OfferingRouteProps) {
  const { slug } = await params;
  const offering = await getOfferingBySlug(slug);
  if (!offering) {
    notFound();
  }

  const user = await getCurrentUser();
  const hasAccess = user ? user.role === "admin" || (await hasOfferingAccess(user.email, offering.slug)) : false;
  if (offering.visibility === "private" && !hasAccess) {
    return (
      <PaletteProvider>
        <SiteFrame>
          <main className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Private offering</p>
            <h1 className="font-serif-display text-4xl md:text-5xl">{offering.title}</h1>
            <p className="max-w-2xl text-[var(--muted)]">
              This offering is private. Sign in with an enrolled account to unlock detailed curriculum, recordings, and community access.
            </p>
          </main>
        </SiteFrame>
      </PaletteProvider>
    );
  }

  return (
    <PaletteProvider>
      <SiteFrame>
        <main>
          <OfferingTemplate offering={offering} hasAccess={hasAccess} />
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
