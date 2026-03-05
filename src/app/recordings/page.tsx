import Link from "next/link";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { getCurrentUser, hasOfferingAccess } from "@/lib/auth";
import { getRecordingsForOffering } from "@/lib/recordings";

const defaultOfferingSlug = "ramadan-oasis";

export default async function RecordingsPage() {
  const user = await getCurrentUser();
  const canAccess = user ? user.role === "admin" || (await hasOfferingAccess(user.email, defaultOfferingSlug)) : false;
  const recordings = canAccess ? await getRecordingsForOffering(defaultOfferingSlug) : [];

  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="space-y-6">
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Media library</p>
            <h1 className="font-serif-display text-4xl md:text-6xl">Gated recordings</h1>
            <p className="max-w-3xl text-[var(--ink)]/90">
              Recording metadata is tracked with object storage keys and Mux playback ids, and access is enforced by enrollment checks.
            </p>
          </section>

          {!canAccess ? (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[var(--muted)]">You need an enrolled account to view recordings.</p>
              <Link href="/login" className="mt-3 inline-flex text-sm underline decoration-[var(--border)]">
                Sign in
              </Link>
            </section>
          ) : (
            <section className="grid gap-4">
              {recordings.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h2 className="font-serif-display text-3xl">{item.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.durationMinutes} min - published {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="mt-3 text-sm text-[var(--muted)]">Storage key: {item.storageKey}</p>
                  <Link
                    href={`https://stream.mux.com/${item.muxPlaybackId}.m3u8`}
                    target="_blank"
                    className="mt-4 inline-flex text-sm underline decoration-[var(--border)]"
                  >
                    Open stream URL
                  </Link>
                </article>
              ))}
            </section>
          )}
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
