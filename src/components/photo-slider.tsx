"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PhotoAsset } from "@/lib/photos";

type PhotoSliderProps = {
  photos: PhotoAsset[];
  alt: string;
  priority?: boolean;
  className?: string;
  intervalMs?: number;
};

const TRANSITIONS = ["dissolve", "veil", "drift"] as const;
type TransitionName = (typeof TRANSITIONS)[number];

function pickRandomTransition(previous: TransitionName): TransitionName {
  const candidates = TRANSITIONS.filter((name) => name !== previous);
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] ?? previous;
}

export function PhotoSlider({
  photos,
  alt,
  priority,
  className,
  intervalMs = 5200,
}: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transition, setTransition] = useState<TransitionName>("dissolve");

  const stepTo = useCallback(
    (step: 1 | -1) => {
      if (photos.length <= 1) return;
      setCurrentIndex((prev) => {
        setPrevIndex(prev);
        setDirection(step);
        setTransition((current) => pickRandomTransition(current));
        const next = (prev + step + photos.length) % photos.length;
        return next;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    if (photos.length <= 1) return;

    const timer = setInterval(() => {
      stepTo(1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [photos.length, intervalMs, stepTo]);

  const currentPhoto = photos[currentIndex] ?? null;
  const previousPhoto = prevIndex !== null ? photos[prevIndex] : null;

  const animation = useMemo(() => {
    if (transition === "veil") {
      return {
        incoming: "animate-[sliderVeilIn_1300ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]",
        outgoing: "animate-[sliderVeilOut_1100ms_ease_forwards]",
      };
    }

    if (transition === "drift") {
      return direction === 1
        ? {
            incoming: "animate-[sliderDriftInNext_1200ms_ease_forwards]",
            outgoing: "animate-[sliderDriftOutNext_1000ms_ease_forwards]",
          }
        : {
            incoming: "animate-[sliderDriftInPrev_1200ms_ease_forwards]",
            outgoing: "animate-[sliderDriftOutPrev_1000ms_ease_forwards]",
          };
    }

    return {
      incoming: "animate-[sliderFadeIn_1300ms_ease_forwards]",
      outgoing: "animate-[sliderFadeOut_1300ms_ease_forwards]",
    };
  }, [transition, direction]);

  const containerClass = useMemo(
    () =>
      `relative h-56 w-full overflow-hidden rounded-[1.75rem] border border-[var(--border)] md:h-72 ${className ?? ""}`,
    [className],
  );

  if (!currentPhoto) {
    return (
      <div
        aria-hidden="true"
        className="h-56 w-full rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--bg-end),var(--surface))] md:h-72"
      />
    );
  }

  return (
    <div className={containerClass}>
      {previousPhoto ? (
        <div key={`prev-${previousPhoto.src}`} className={`absolute inset-0 ${animation.outgoing}`}>
          <Image src={previousPhoto.src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 900px" />
        </div>
      ) : null}

      <div key={`current-${currentPhoto.src}`} className={`absolute inset-0 ${animation.incoming}`}>
        <Image
          src={currentPhoto.src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(18,18,18,0.18)_100%)]" />
      {photos.length > 1 ? (
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepTo(-1)}
            aria-label="Previous photo"
            className="rounded-full border border-white/35 bg-black/25 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-black/35"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => stepTo(1)}
            aria-label="Next photo"
            className="rounded-full border border-white/35 bg-black/25 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-black/35"
          >
            Next
          </button>
        </div>
      ) : null}
      <div className="absolute bottom-3 right-3 rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm">
        {currentIndex + 1}/{photos.length}
      </div>
    </div>
  );
}
