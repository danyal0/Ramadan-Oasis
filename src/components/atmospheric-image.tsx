import Image from "next/image";
import type { PhotoAsset } from "@/lib/photos";

type AtmosphericImageProps = {
  photo: PhotoAsset | null;
  alt: string;
  priority?: boolean;
};

export function AtmosphericImage({ photo, alt, priority }: AtmosphericImageProps) {
  if (!photo) {
    return (
      <div
        aria-hidden="true"
        className="h-48 w-full rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--bg-end),var(--surface))] md:h-64"
      />
    );
  }

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-[1.75rem] border border-[var(--border)] md:h-72">
      <Image
        src={photo.src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover opacity-80"
        sizes="(max-width: 768px) 100vw, 900px"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgba(20,20,20,0.14)_100%)]" />
    </div>
  );
}
