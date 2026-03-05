import { z } from "zod";
import { readJsonFile } from "@/lib/json-store";

const recordingSchema = z.object({
  id: z.string(),
  offeringSlug: z.string(),
  title: z.string(),
  muxPlaybackId: z.string(),
  storageKey: z.string(),
  durationMinutes: z.number().min(1),
  publishedAt: z.string(),
});

const recordingsSchema = z.array(recordingSchema);

export type RecordingAsset = z.infer<typeof recordingSchema>;

export async function getRecordingsForOffering(offeringSlug: string): Promise<RecordingAsset[]> {
  const recordings = await readJsonFile("src/content/recordings.json", recordingsSchema);
  return recordings
    .filter((item) => item.offeringSlug === offeringSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
