import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser, setSessionCookie } from "@/lib/auth";
import { captureException, logEvent } from "@/lib/observability";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const body = loginSchema.parse(json);
    const user = await authenticateUser(body.email, body.password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await setSessionCookie(user);
    logEvent({
      scope: "auth.login",
      message: "User signed in",
      metadata: { email: user.email, role: user.role },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    captureException("auth.login", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
