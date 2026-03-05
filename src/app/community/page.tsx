import Link from "next/link";
import { CommunityFeed } from "@/components/community-feed";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { getCurrentUser, hasOfferingAccess } from "@/lib/auth";
import { getCommunityPosts } from "@/lib/community";

const defaultOfferingSlug = "ramadan-oasis";

export default async function CommunityPage() {
  const user = await getCurrentUser();
  const canAccess = user ? user.role === "admin" || (await hasOfferingAccess(user.email, defaultOfferingSlug)) : false;
  const initialPosts = canAccess ? await getCommunityPosts(defaultOfferingSlug) : [];

  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="space-y-6">
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Community & engagement</p>
            <h1 className="font-serif-display text-4xl md:text-6xl">Discussion and reflections</h1>
            <p className="max-w-3xl text-[var(--ink)]/90">
              Authenticated participants can post reflections, respond to prompts, and receive digest reminders through the jobs endpoint.
            </p>
          </section>

          {canAccess ? (
            <CommunityFeed offeringSlug={defaultOfferingSlug} initialPosts={initialPosts} />
          ) : (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[var(--muted)]">
                This feed is restricted to enrolled participants. Sign in first, then request enrollment if needed.
              </p>
              <Link href="/login" className="mt-4 inline-flex text-sm underline decoration-[var(--border)]">
                Go to login
              </Link>
            </section>
          )}
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
