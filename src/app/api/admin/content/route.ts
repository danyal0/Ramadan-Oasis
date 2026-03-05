import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/content";
import { env } from "@/lib/env";

function isAuthorized(request: Request) {
  const token = request.headers.get("x-admin-token");
  return Boolean(env.ADMIN_EDIT_TOKEN && token === env.ADMIN_EDIT_TOKEN);
}

export async function GET(request: Request) {
  if (!env.ADMIN_EDIT_TOKEN) {
    return NextResponse.json({ error: "ADMIN_EDIT_TOKEN is not configured." }, { status: 500 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Admin content GET failed:", error);
    return NextResponse.json({ error: "Unable to load content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!env.ADMIN_EDIT_TOKEN) {
    return NextResponse.json({ error: "ADMIN_EDIT_TOKEN is not configured." }, { status: 500 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as unknown;
    const updated = await updateSiteContent(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin content PUT failed:", error);
    return NextResponse.json({ error: "Unable to save content." }, { status: 400 });
  }
}
