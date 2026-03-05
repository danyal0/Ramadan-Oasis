import { readdir } from "node:fs/promises";
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const PHOTOS_DIR = path.join(PUBLIC_DIR, "photos");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const FACE_LIKELY_KEYWORDS = ["face", "portrait", "selfie", "person", "human"];

export type PhotoAsset = {
  src: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
  faceLikely: boolean;
};

async function listFilesRecursively(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listFilesRecursively(fullPath);
      }
      return fullPath;
    }),
  );
  return files.flat();
}

function inferOrientation(width: number, height: number): PhotoAsset["orientation"] {
  if (width > height) return "landscape";
  if (height > width) return "portrait";
  return "square";
}

function looksLikeFaceFilename(filePath: string) {
  const normalized = filePath.toLowerCase();
  return FACE_LIKELY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function createSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededRandom(seed: number) {
  let value = seed || 1;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

export async function getPhotoManifest(): Promise<PhotoAsset[]> {
  try {
    const allFiles = await listFilesRecursively(PHOTOS_DIR);
    const imageFiles = allFiles.filter((filePath) =>
      SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
    );

    const photoDetails = await Promise.all(
      imageFiles.map(async (filePath) => {
        const details = await imageSizeFromFile(filePath);
        const width = details.width ?? 0;
        const height = details.height ?? 0;
        if (!width || !height) return null;

        const src = `/${path.relative(PUBLIC_DIR, filePath).replaceAll("\\", "/")}`;
        return {
          src,
          width,
          height,
          orientation: inferOrientation(width, height),
          faceLikely: looksLikeFaceFilename(filePath),
        } satisfies PhotoAsset;
      }),
    );

    return photoDetails.filter(Boolean) as PhotoAsset[];
  } catch {
    return [];
  }
}

function scorePhoto(photo: PhotoAsset) {
  let score = 0;
  if (photo.orientation === "landscape") score += 4;
  if (photo.orientation === "square") score += 1;
  if (photo.orientation === "portrait") score -= 2;
  if (photo.faceLikely) score -= 2;
  return score;
}

export function pickSectionPhoto(photos: PhotoAsset[], sectionKey: string): PhotoAsset | null {
  if (!photos.length) return null;
  const dateSeed = new Date().toISOString().slice(0, 10);
  const random = seededRandom(createSeed(`${sectionKey}-${dateSeed}`));

  const weighted = photos
    .map((photo) => ({
      photo,
      score: scorePhoto(photo) + random(),
    }))
    .sort((a, b) => b.score - a.score);

  return weighted[0]?.photo ?? null;
}
