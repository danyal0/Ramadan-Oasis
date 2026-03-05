import Link from "next/link";
import { AtmosphericImage } from "@/components/atmospheric-image";
import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";
import { siteConfig } from "@/config/site";
import { getPhotoManifest, pickSectionPhoto } from "@/lib/photos";

const orientationPoints = [
  "Making invisible dynamics visible",
  "Restoring conditions for conscious action",
];

const supportPoints = [
  "alignment without coercion",
  "engagement without manipulation",
  "certainty without rigidity",
];

const experiencePoints = [
  "Reflection",
  "Language that restores orientation",
  "Contemplative inquiry",
  "Practices and exercises",
];

const audiencePoints = [
  "Thoughtful leaders",
  "Spiritual seekers without dogma",
  "People navigating complexity",
  "Those seeking lived alignment",
];

export default async function HomePage() {
  const photos = await getPhotoManifest();
  const openingPhoto = pickSectionPhoto(photos, "home-opening");
  const offeringPhoto = pickSectionPhoto(photos, "home-offering");

  return (
    <PaletteProvider imageSrc={openingPhoto?.src}>
      <SiteFrame>
        <main className="space-y-14 md:space-y-20">
          <section className="fade-in space-y-7 pt-4 md:pt-8">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">{siteConfig.tagline}</p>
            <h1 className="font-serif-display text-5xl leading-[1.12] md:text-7xl">{siteConfig.name}</h1>
            <p className="max-w-3xl text-lg text-[var(--muted)] md:text-xl">{siteConfig.role}</p>
            <p className="max-w-4xl font-serif-display text-2xl leading-[1.4] text-[var(--ink)]/90 md:text-3xl">
              {siteConfig.homeStatement}
            </p>
            <AtmosphericImage
              photo={openingPhoto}
              alt="Atmospheric visual texture supporting opening presence"
              priority
            />
          </section>

          <PageSection id="offer" label="What I Offer" title="Interpretation in service of clarity and agency">
            <p>
              I offer precise interpretation of human, relational, and inner dynamics so what is subtle, unspoken, or
              difficult to name becomes visible, intelligible, and actionable.
            </p>
            <p>My work is grounded in perception, discernment, and respect for human dignity.</p>
            <p>
              I do not persuade, direct, or manage. I illuminate patterns so individuals and leaders can choose their
              own way forward clearly, responsibly, and with confidence.
            </p>
          </PageSection>

          <PageSection id="orientation" label="My Orientation" title="A philosophical and practical anchor">
            <ul className="space-y-2">
              {orientationPoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
            <p>Supporting:</p>
            <ul className="space-y-2">
              {supportPoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection id="experienced" label="How This Work Is Experienced" title="Recognition over instruction">
            <ul className="space-y-2">
              {experiencePoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
            <p className="font-medium text-[var(--muted)]">What remains consistent is clarity, restraint, and respect.</p>
          </PageSection>

          <PageSection id="resonates" label="Who This Resonates With" title="A mirror, not a filter">
            <ul className="space-y-2">
              {audiencePoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </PageSection>

          <section
            id="ramadan-oasis"
            className="fade-in rounded-[1.75rem] border border-[var(--border)] bg-[color:var(--surface)]/85 p-7 md:p-10"
          >
            <div className="grid items-start gap-8 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Current Offering — Ramadan Oasis</p>
                <h2 className="font-serif-display text-3xl leading-[1.2] md:text-5xl">Mercy-first Quranic companionship</h2>
                <p className="text-[1.04rem] leading-[1.9] text-[var(--ink)]/92">
                  A sacred energetic container that is Qur&apos;an-centered, mercy-first, and nervous-system aware.
                  Designed for safety, coherence, presence, and integration.
                </p>
                <div className="grid gap-2 text-[var(--muted)]">
                  <p>Feb 18 – March 20</p>
                  <p>Wednesdays & Saturdays</p>
                  <p>9 sessions</p>
                  <p>Three arcs: Mercy, Forgiveness, Safety</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/ramadan-oasis#registration"
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm transition hover:text-[var(--accent)]"
                  >
                    Registration
                  </Link>
                  <Link
                    href="/ramadan-oasis#outline"
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm transition hover:text-[var(--accent)]"
                  >
                    Program outline
                  </Link>
                </div>
              </div>
              <AtmosphericImage photo={offeringPhoto} alt="Quiet environmental photo accompanying Ramadan Oasis overview" />
            </div>
          </section>

          <section className="fade-in rounded-[1.75rem] border border-[var(--border)] bg-[color:var(--surface)]/80 p-7 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Quiet Credibility</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[1.02rem] text-[var(--ink)]/90">
                Instagram <Link href={siteConfig.social.instagram} className="underline decoration-[var(--border)]">@oumnur786</Link>
              </p>
              <p className="text-sm text-[var(--muted)]">14.8k views in the last 30 days, with 221% growth</p>
            </div>
          </section>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
