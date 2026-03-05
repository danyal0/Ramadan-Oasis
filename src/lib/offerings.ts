import { z } from "zod";
import { env } from "@/lib/env";
import { readJsonFile } from "@/lib/json-store";

const contributionTierSchema = z.object({
  id: z.string(),
  label: z.string(),
  amount: z.number().min(0),
  description: z.string(),
});

const offeringSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  visibility: z.enum(["public", "private"]),
  contributionModel: z.enum(["pay-what-you-can", "tiered"]),
  contributionTiers: z.array(contributionTierSchema),
  communityEnabled: z.boolean(),
  recordingsEnabled: z.boolean(),
});

const offeringsSchema = z.array(offeringSchema);

export type Offering = z.infer<typeof offeringSchema>;
export type ContributionTier = z.infer<typeof contributionTierSchema>;

export async function getOfferings(): Promise<Offering[]> {
  if (env.OFFERINGS_CMS_URL) {
    const response = await fetch(env.OFFERINGS_CMS_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to fetch offerings from CMS.");
    }
    const body = (await response.json()) as unknown;
    return offeringsSchema.parse(body);
  }

  return readJsonFile("src/content/offerings.json", offeringsSchema);
}

export async function getOfferingBySlug(slug: string): Promise<Offering | null> {
  const offerings = await getOfferings();
  return offerings.find((offering) => offering.slug === slug) ?? null;
}
