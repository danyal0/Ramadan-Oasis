import { NextResponse } from "next/server";
import { processRegistration, registrationSchema } from "@/lib/registration";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registrationSchema.safeParse({
      ...json,
      contributionAmount:
        typeof json.contributionAmount === "number"
          ? json.contributionAmount
          : json.contributionAmount
            ? Number(json.contributionAmount)
            : null,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please review the form fields and try again." },
        { status: 400 },
      );
    }

    const result = await processRegistration(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Registration API failure:", error);
    return NextResponse.json(
      {
        error:
          "We could not process your registration right now. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
