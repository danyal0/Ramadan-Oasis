import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { PhotoSlider } from "@/components/photo-slider";
import { RegistrationForm } from "@/components/registration-form";
import { SiteFrame } from "@/components/site-frame";
import { programOutline, ramadanSchedule } from "@/config/site";
import { getSiteContent } from "@/lib/content";
import { getEligiblePhotos, getPhotoManifest, pickSectionPhoto } from "@/lib/photos";

export default async function RamadanOasisPage() {
  const content = await getSiteContent();
  const photos = await getPhotoManifest();
  const heroPhoto = pickSectionPhoto(photos, "ramadan-hero");
  const heroSliderPhotos = getEligiblePhotos(photos, "ramadan-hero-slider", {
    targetAspectRatio: 16 / 9,
    subjectPreference: ["sky", "nature", "water", "texture"],
    pinnedSources: content.curation.pinnedBySection["ramadan-hero-slider"] ?? [],
    curationMode: content.curation.enabled,
  });
  const bodySliderPhotos = getEligiblePhotos(photos, "ramadan-body-slider", {
    targetAspectRatio: 4 / 3,
    subjectPreference: ["architecture", "texture", "nature"],
    pinnedSources: content.curation.pinnedBySection["ramadan-body-slider"] ?? [],
    curationMode: content.curation.enabled,
  });

  return (
    <PaletteProvider imageSrc={heroPhoto?.src}>
      <SiteFrame>
        <main className="space-y-14 md:space-y-18">
          <section className="fade-in space-y-6 md:space-y-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Ramadan Oasis</p>
            <h1 className="font-serif-display text-4xl leading-[1.15] md:text-6xl">A journey page for spiritual travelers</h1>
            <p className="max-w-4xl text-[1.08rem] leading-[1.9] text-[var(--ink)]/90 md:text-[1.15rem]">
              {content.ramadanOasis.invocation}
            </p>
            <PhotoSlider photos={heroSliderPhotos} alt="Quiet environmental image for Ramadan Oasis opening" priority />
          </section>

          <PageSection label="Who This Is For" title="A gentle container for sincere seekers">
            <ul className="space-y-2">
              {content.ramadanOasis.whoItsFor.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection label="What You'll Experience" title="Mercy-first companionship and clear inner orientation">
            <ul className="space-y-2">
              {content.ramadanOasis.experiences.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </PageSection>

          <section className="fade-in grid gap-6 md:grid-cols-[1.15fr_1fr]">
            <PageSection id="outline" label="Session Structure" title="Nine sessions across three arcs">
              <p>Dates: Feb 18 – March 20</p>
              <p>Schedule: Wednesdays & Saturdays</p>
              <div className="grid gap-3">
                {programOutline.map((item) => (
                  <article key={item.theme} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {item.phase} — {item.theme}
                    </p>
                    <p className="mt-2 text-[var(--ink)]/90">{item.focus}</p>
                  </article>
                ))}
              </div>
            </PageSection>
            <PhotoSlider photos={bodySliderPhotos} alt="Environmental texture beside session structure" />
          </section>

          <PageSection label="Session Map" title="Wednesdays and Saturdays">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-sm text-[var(--muted)]">
                    <th className="px-3 py-2">Session</th>
                    <th className="px-3 py-2">Arc</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Format</th>
                  </tr>
                </thead>
                <tbody>
                  {ramadanSchedule.map((session) => (
                    <tr key={session.title + session.date}>
                      <td className="rounded-l-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
                        {session.title}
                      </td>
                      <td className="border-y border-[var(--border)] bg-[var(--surface)] px-3 py-3">{session.arc}</td>
                      <td className="border-y border-[var(--border)] bg-[var(--surface)] px-3 py-3">{session.date}</td>
                      <td className="rounded-r-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
                        {session.format}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageSection>

          <PageSection label="What Participants Leave With" title="Safety, coherence, and lived integration">
            <ul className="space-y-2">
              {content.ramadanOasis.outcomes.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection id="registration" label="Registration" title="Join the container">
            <RegistrationForm />
          </PageSection>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
