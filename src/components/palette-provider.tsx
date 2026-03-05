"use client";

import { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";
import { createAccessiblePalette, getFallbackPalette, type RGB } from "@/lib/palette";

type PaletteProviderProps = {
  imageSrc?: string | null;
  children: ReactNode;
};

async function sampleImageColors(imageSrc: string): Promise<{ primary: RGB; secondary: RGB } | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(image.width / 16));
      canvas.height = Math.max(1, Math.floor(image.height / 16));
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let count = 0;
      const buckets: RGB[] = [];

      for (let i = 0; i < data.length; i += 16) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        sr += r;
        sg += g;
        sb += b;
        count += 1;
        if (count % 22 === 0) buckets.push({ r, g, b });
      }

      if (!count) {
        resolve(null);
        return;
      }

      const primary = { r: sr / count, g: sg / count, b: sb / count };
      const secondary = buckets[Math.floor(buckets.length / 2)] ?? primary;
      resolve({ primary, secondary });
    };

    image.onerror = () => resolve(null);
  });
}

export function PaletteProvider({ imageSrc, children }: PaletteProviderProps) {
  const [styleVars, setStyleVars] = useState<CSSProperties>(() => {
    const fallback = getFallbackPalette();
    return {
      ["--bg-start" as string]: fallback.bgStart,
      ["--bg-end" as string]: fallback.bgEnd,
      ["--surface" as string]: fallback.surface,
      ["--border" as string]: fallback.border,
      ["--ink" as string]: fallback.ink,
      ["--muted" as string]: fallback.muted,
      ["--accent" as string]: fallback.accent,
      ["--glow" as string]: fallback.glow,
      ["--accent-soft" as string]: fallback.accentSoft,
    };
  });

  useEffect(() => {
    if (!imageSrc) return;
    let mounted = true;
    void sampleImageColors(imageSrc).then((sample) => {
      if (!sample || !mounted) return;
      const palette = createAccessiblePalette(sample.primary, sample.secondary);
      setStyleVars({
        ["--bg-start" as string]: palette.bgStart,
        ["--bg-end" as string]: palette.bgEnd,
        ["--surface" as string]: palette.surface,
        ["--border" as string]: palette.border,
        ["--ink" as string]: palette.ink,
        ["--muted" as string]: palette.muted,
        ["--accent" as string]: palette.accent,
        ["--glow" as string]: palette.glow,
        ["--accent-soft" as string]: palette.accentSoft,
      });
    });
    return () => {
      mounted = false;
    };
  }, [imageSrc]);

  const className = useMemo(
    () =>
      "min-h-screen bg-[radial-gradient(1000px_420px_at_18%_-12%,var(--glow),transparent_62%),radial-gradient(780px_300px_at_82%_0%,color-mix(in_oklch,var(--accent-soft)_38%,transparent),transparent_74%),linear-gradient(180deg,var(--bg-start),var(--bg-end))] text-[var(--ink)] transition-colors duration-[1600ms]",
    [],
  );

  return (
    <div style={styleVars} className={className}>
      {children}
    </div>
  );
}
