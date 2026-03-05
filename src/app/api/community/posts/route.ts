import { NextResponse } from "next/server";
import { z } from "zod";
import { addCommunityPost, getCommunityPosts } from "@/lib/community";
import { getUserFromRequest, hasOfferingAccess } from "@/lib/auth";
import { captureException } from "@/lib/observability";

const createPostSchema = z.object({
  offeringSlug: z.string(),
  body: z.string().min(2).max(1000),
  type: z.enum(["discussion", "reflection"]).default("reflection"),
});

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const offeringSlug = searchParams.get("offeringSlug") ?? "ramadan-oasis";
    const canAccess = user.role === "admin" || (await hasOfferingAccess(user.email, offeringSlug));
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const posts = await getCommunityPosts(offeringSlug);
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    captureException("community.posts.get", error);
    return NextResponse.json({ error: "Unable to load posts." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const json = (await request.json()) as unknown;
    const body = createPostSchema.parse(json);
    const canAccess = user.role === "admin" || (await hasOfferingAccess(user.email, body.offeringSlug));
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const post = await addCommunityPost({
      offeringSlug: body.offeringSlug,
      authorEmail: user.email,
      authorName: user.name,
      type: body.type,
      body: body.body,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    captureException("community.posts.post", error);
    return NextResponse.json({ error: "Unable to publish post." }, { status: 400 });
  }
}
