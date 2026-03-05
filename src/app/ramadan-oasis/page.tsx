import { PageSection } from "@/components/page-section";
import { PaletteProvider } from "@/components/palette-provider";
import { PhotoSlider } from "@/components/photo-slider";
import { RegistrationForm } from "@/components/registration-form";
import { SiteFrame } from "@/components/site-frame";
import { programOutline, ramadanSchedule } from "@/config/site";
import { getEligiblePhotos, getPhotoManifest, pickSectionPhoto } from "@/lib/photos";

const whoItsFor = [
  "Those seeking a spiritually reverent space without pressure or performance.",
  "People longing for Qur'an-centered companionship rooted in mercy.",
  "Participants moving through personal transition, grief, complexity, or reorientation.",
];

const experiences = [
  "Live circles that allow listening, reflection, and integrative dialogue.",
  "Nervous-system aware pacing that supports safety before transformation.",
  "Practices for coherence between inner life, relationships, and daily action.",
];

const outcomes = [
  "A steadier relationship with sacred text and inner perception.",
  "Greater language for what is subtle, tender, and difficult to name.",
  "A felt sense of belonging, responsibility, and spiritual integration.",
];

export default async function RamadanOasisPage() {
  const photos = await getPhotoManifest();
  const heroPhoto = pickSectionPhoto(photos, "ramadan-hero");
  const heroSliderPhotos = getEligiblePhotos(photos, "ramadan-hero-slider", {
    targetAspectRatio: 16 / 9,
    subjectPreference: ["sky", "nature", "water", "texture"],
  });
  const bodySliderPhotos = getEligiblePhotos(photos, "ramadan-body-slider", {
    targetAspectRatio: 4 / 3,
    subjectPreference: ["architecture", "texture", "nature"],
  });

  return (
    <PaletteProvider imageSrc={heroPhoto?.src}>
      <SiteFrame>
        <main className="space-y-14 md:space-y-18">
          <section className="fade-in space-y-6 md:space-y-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Ramadan Oasis</p>
            <h1 className="font-serif-display text-4xl leading-[1.15] md:text-6xl">A journey page for spiritual travelers</h1>
            <p className="max-w-4xl text-[1.08rem] leading-[1.9] text-[var(--ink)]/90 md:text-[1.15rem]">
              In the name of the One who is infinitely Merciful, may this space be a refuge for hearts seeking sincerity,
              coherence, and quiet return.
            </p>
            <PhotoSlider photos={heroSliderPhotos} alt="Quiet environmental image for Ramadan Oasis opening" priority />
          </section>

          <PageSection label="Who This Is For" title="A gentle container for sincere seekers">
            <ul className="space-y-2">
              {whoItsFor.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection label="What You'll Experience" title="Mercy-first companionship and clear inner orientation">
            <ul className="space-y-2">
              {experiences.map((item) => (
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
              {outcomes.map((item) => (
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
