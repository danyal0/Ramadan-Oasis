import { NextResponse } from "next/server";
import { z } from "zod";
import { logEvent } from "@/lib/observability";

const analyticsSchema = z.object({
  event: z.string().min(2),
  page: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const json = (await request.json()) as unknown;
  const payload = analyticsSchema.safeParse(json);
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  logEvent({
    scope: "analytics.track",
    message: payload.data.event,
    metadata: {
      page: payload.data.page,
      ...payload.data.metadata,
    },
  });
  return NextResponse.json({ ok: true }, { status: 200 });
}
