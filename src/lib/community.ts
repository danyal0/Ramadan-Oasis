import { z } from "zod";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";

const communityPostSchema = z.object({
  id: z.string(),
  offeringSlug: z.string(),
  authorEmail: z.string().email(),
  authorName: z.string(),
  type: z.enum(["discussion", "reflection"]),
  body: z.string().min(2).max(1000),
  createdAt: z.string(),
});

const communityPostsSchema = z.array(communityPostSchema);

export type CommunityPost = z.infer<typeof communityPostSchema>;

export async function getCommunityPosts(offeringSlug: string): Promise<CommunityPost[]> {
  const posts = await readJsonFile("src/content/community-posts.json", communityPostsSchema);
  return posts
    .filter((post) => post.offeringSlug === offeringSlug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addCommunityPost(input: Omit<CommunityPost, "id" | "createdAt">): Promise<CommunityPost> {
  const posts = await readJsonFile("src/content/community-posts.json", communityPostsSchema);
  const next: CommunityPost = {
    ...input,
    id: `post_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [next, ...posts];
  await writeJsonFile("src/content/community-posts.json", communityPostsSchema, updated);
  return next;
}
