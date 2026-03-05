import { PaletteProvider } from "@/components/palette-provider";
import { SiteFrame } from "@/components/site-frame";

type FuturePageProps = {
  title: string;
  description: string;
};

export function FuturePage({ title, description }: FuturePageProps) {
  return (
    <PaletteProvider>
      <SiteFrame>
        <main className="space-y-6 pt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">In Preparation</p>
          <h1 className="font-serif-display text-4xl md:text-6xl">{title}</h1>
          <p className="max-w-3xl text-[1.06rem] text-[var(--ink)]/90">{description}</p>
        </main>
      </SiteFrame>
    </PaletteProvider>
  );
}
