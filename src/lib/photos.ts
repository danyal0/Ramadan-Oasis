import { readdir } from "node:fs/promises";
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const PHOTOS_DIR = path.join(PUBLIC_DIR, "photos");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const FACE_LIKELY_KEYWORDS = ["face", "portrait", "selfie", "person", "human"];
const SUBJECT_HINTS = {
  nature: ["nature", "tree", "forest", "leaf", "green", "garden", "field", "mountain", "flower"],
  water: ["water", "ocean", "sea", "river", "lake", "wave"],
  sky: ["sky", "cloud", "sunset", "sunrise", "dawn", "dusk"],
  architecture: ["building", "window", "door", "arch", "stone", "mosque", "city", "street"],
  texture: ["sand", "desert", "wall", "light", "shadow", "pattern", "abstract"],
} as const;
type SubjectTag = keyof typeof SUBJECT_HINTS;

export type PhotoAsset = {
  src: string;
  fileName: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "landscape" | "portrait" | "square";
  faceLikely: boolean;
  subjectTags: SubjectTag[];
  objectPosition: string;
};

type EligibleOptions = {
  targetAspectRatio?: number;
  subjectPreference?: SubjectTag[];
  pinnedSources?: string[];
  curationMode?: boolean;
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

function inferSubjectTags(fileName: string): SubjectTag[] {
  const normalized = fileName.toLowerCase();
  return (Object.keys(SUBJECT_HINTS) as SubjectTag[]).filter((subject) =>
    SUBJECT_HINTS[subject].some((keyword) => normalized.includes(keyword)),
  );
}

function inferObjectPosition(subjectTags: SubjectTag[], faceLikely: boolean) {
  if (faceLikely) return "50% 28%";
  if (subjectTags.includes("sky")) return "50% 30%";
  if (subjectTags.includes("water")) return "50% 60%";
  if (subjectTags.includes("texture")) return "50% 58%";
  return "50% 50%";
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
        const fileName = path.basename(filePath).toLowerCase();
        const subjectTags = inferSubjectTags(fileName);
        const faceLikely = looksLikeFaceFilename(filePath);
        return {
          src,
          fileName,
          width,
          height,
          aspectRatio: width / height,
          orientation: inferOrientation(width, height),
          faceLikely,
          subjectTags,
          objectPosition: inferObjectPosition(subjectTags, faceLikely),
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

export function getEligiblePhotos(
  photos: PhotoAsset[],
  key: string,
  options: EligibleOptions = {},
): PhotoAsset[] {
  if (!photos.length) return [];

  const random = seededRandom(createSeed(key));
  const targetAspectRatio = options.targetAspectRatio ?? 16 / 9;
  const subjectPreference = options.subjectPreference ?? [];
  const pinnedSources = options.pinnedSources ?? [];
  const curationMode = options.curationMode ?? false;

  const pinned = pinnedSources
    .map((src) => photos.find((photo) => photo.src === src))
    .filter(Boolean) as PhotoAsset[];
  const pinnedSet = new Set(pinned.map((photo) => photo.src));
  const pool = photos.filter((photo) => !pinnedSet.has(photo.src));

  const ranked = pool
    .map((photo) => ({
      photo,
      score:
        scorePhoto(photo) +
        (2 - Math.min(Math.abs(photo.aspectRatio - targetAspectRatio), 2)) +
        (subjectPreference.some((subject) => photo.subjectTags.includes(subject)) ? 1.5 : 0) +
        random(),
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.photo);

  if (curationMode && pinned.length) {
    return [...pinned, ...ranked];
  }

  return ranked;
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
