import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { env } from "@/lib/env";

const contentSchema = z.object({
  home: z.object({
    orientationPoints: z.array(z.string()),
    supportPoints: z.array(z.string()),
    experiencePoints: z.array(z.string()),
    audiencePoints: z.array(z.string()),
    offeringSummary: z.string(),
    offeringMeta: z.array(z.string()),
    credibilityLine: z.string(),
  }),
  ramadanOasis: z.object({
    invocation: z.string(),
    whoItsFor: z.array(z.string()),
    experiences: z.array(z.string()),
    outcomes: z.array(z.string()),
  }),
  resources: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        href: z.string(),
      }),
    ),
  }),
  curation: z.object({
    enabled: z.boolean(),
    pinnedBySection: z.record(z.string(), z.array(z.string())),
  }),
});

export type SiteContent = z.infer<typeof contentSchema>;

const contentFilePath = path.join(process.cwd(), "src/content/site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  if (env.CONTENT_CMS_URL) {
    const response = await fetch(env.CONTENT_CMS_URL, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Unable to fetch CMS content source.");
    }
    const remoteContent = (await response.json()) as unknown;
    return contentSchema.parse(remoteContent);
  }

  const raw = await readFile(contentFilePath, "utf-8");
  return contentSchema.parse(JSON.parse(raw) as unknown);
}

export async function updateSiteContent(nextContent: unknown) {
  const parsed = contentSchema.parse(nextContent);
  await writeFile(contentFilePath, JSON.stringify(parsed, null, 2), "utf-8");
  return parsed;
}
