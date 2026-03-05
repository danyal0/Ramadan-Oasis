import Link from "next/link";
import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { PhotoSlider } from "@/components/photo-slider";
import { SiteFrame } from "@/components/site-frame";
import { siteConfig } from "@/config/site";
import { getSiteContent } from "@/lib/content";
import { getEligiblePhotos, getPhotoManifest, pickSectionPhoto } from "@/lib/photos";

export default async function HomePage() {
  const content = await getSiteContent();
  const photos = await getPhotoManifest();
  const openingPhoto = pickSectionPhoto(photos, "home-opening");
  const openingSliderPhotos = getEligiblePhotos(photos, "home-opening-slider", {
    targetAspectRatio: 16 / 9,
    subjectPreference: ["nature", "sky", "water", "texture"],
    pinnedSources: content.curation.pinnedBySection["home-opening-slider"] ?? [],
    curationMode: content.curation.enabled,
  });
  const offeringSliderPhotos = getEligiblePhotos(photos, "home-offering-slider", {
    targetAspectRatio: 4 / 3,
    subjectPreference: ["architecture", "nature", "texture"],
    pinnedSources: content.curation.pinnedBySection["home-offering-slider"] ?? [],
    curationMode: content.curation.enabled,
  });

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
            <PhotoSlider
              photos={openingSliderPhotos}
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
              {content.home.orientationPoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
            <p>Supporting:</p>
            <ul className="space-y-2">
              {content.home.supportPoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection id="experienced" label="How This Work Is Experienced" title="Recognition over instruction">
            <ul className="space-y-2">
              {content.home.experiencePoints.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
            <p className="font-medium text-[var(--muted)]">What remains consistent is clarity, restraint, and respect.</p>
          </PageSection>

          <PageSection id="resonates" label="Who This Resonates With" title="A mirror, not a filter">
            <ul className="space-y-2">
              {content.home.audiencePoints.map((point) => (
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
                  {content.home.offeringSummary}
                </p>
                <div className="grid gap-2 text-[var(--muted)]">
                  {content.home.offeringMeta.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
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
              <PhotoSlider
                photos={offeringSliderPhotos}
                alt="Quiet environmental photo accompanying Ramadan Oasis overview"
              />
            </div>
          </section>

          <section className="fade-in rounded-[1.75rem] border border-[var(--border)] bg-[color:var(--surface)]/80 p-7 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Quiet Credibility</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[1.02rem] text-[var(--ink)]/90">
                Instagram <Link href={siteConfig.social.instagram} className="underline decoration-[var(--border)]">@oumnur786</Link>
              </p>
              <p className="text-sm text-[var(--muted)]">{content.home.credibilityLine}</p>
            </div>
          </section>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
