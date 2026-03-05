import { NextResponse } from "next/server";
import { createMockPaymentIntent, parsePaymentIntentInput } from "@/lib/payments";
import { captureException } from "@/lib/observability";

export async function POST(request: Request) {
  try {
    const body = parsePaymentIntentInput((await request.json()) as unknown);
    const intent = await createMockPaymentIntent(body);
    return NextResponse.json(intent, { status: 200 });
  } catch (error) {
    captureException("payments.intents.post", error);
    return NextResponse.json({ error: "Unable to create payment intent." }, { status: 400 });
  }
}
