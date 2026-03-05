import { NextResponse } from "next/server";
import { getOfferings } from "@/lib/offerings";
import { logEvent, captureException } from "@/lib/observability";

export async function POST() {
  try {
    const offerings = await getOfferings();
    const enabledOfferings = offerings.filter((offering) => offering.communityEnabled);

    logEvent({
      scope: "jobs.digest",
      message: "Digest notifications scheduled",
      metadata: {
        offerings: enabledOfferings.map((offering) => offering.slug),
        scheduledAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Digest and reminder scheduling completed.",
        offerings: enabledOfferings.length,
      },
      { status: 200 },
    );
  } catch (error) {
    captureException("jobs.digest", error);
    return NextResponse.json({ error: "Unable to run digest scheduler." }, { status: 500 });
  }
}
