import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { env } from "@/lib/env";
import { readJsonFile } from "@/lib/json-store";

const sessionCookieName = "oumnur_session";

const appUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  role: z.enum(["admin", "participant"]),
});

const enrollmentSchema = z.object({
  email: z.string().email(),
  offeringSlug: z.string(),
  role: z.enum(["participant", "facilitator"]),
});

const sessionSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "participant"]),
  issuedAt: z.number(),
});

export type SessionUser = z.infer<typeof sessionSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;

function encode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function decode(input: string) {
  return Buffer.from(input, "base64url").toString("utf-8");
}

function sign(payload: string) {
  return createHmac("sha256", env.AUTH_SECRET).update(payload).digest("base64url");
}

function serializeSession(user: Omit<SessionUser, "issuedAt">) {
  const session = JSON.stringify({
    ...user,
    issuedAt: Date.now(),
  });
  const encodedSession = encode(session);
  const signature = sign(encodedSession);
  return `${encodedSession}.${signature}`;
}

export function createSessionCookieValue(user: Omit<SessionUser, "issuedAt">) {
  return serializeSession(user);
}

function parseSessionToken(raw: string): SessionUser | null {
  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expected = sign(encoded);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  try {
    const decoded = decode(encoded);
    return sessionSchema.parse(JSON.parse(decoded) as unknown);
  } catch {
    return null;
  }
}

function getAppUsers() {
  return appUserSchema.array().parse([
    {
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      name: "Admin User",
      role: "admin",
    },
    {
      email: env.PARTICIPANT_EMAIL,
      password: env.PARTICIPANT_PASSWORD,
      name: "Participant User",
      role: "participant",
    },
  ]);
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getAppUsers().find((item) => item.email.toLowerCase() === normalizedEmail);
  if (!user || user.password !== password) {
    return null;
  }
  return {
    email: user.email,
    name: user.name,
    role: user.role,
  } as const;
}

export async function setSessionCookie(user: Omit<SessionUser, "issuedAt">) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, serializeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName)?.value;
  if (!raw) {
    return null;
  }
  return parseSessionToken(raw);
}

export function getUserFromRequest(request: Request): SessionUser | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }
  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${sessionCookieName}=`));
  if (!cookie) {
    return null;
  }
  const raw = cookie.slice(sessionCookieName.length + 1);
  return parseSessionToken(raw);
}

export async function getEnrollmentsByEmail(email: string): Promise<Enrollment[]> {
  const enrollments = await readJsonFile("src/content/enrollments.json", enrollmentSchema.array());
  return enrollments.filter((item) => item.email.toLowerCase() === email.toLowerCase());
}

export async function hasOfferingAccess(email: string, offeringSlug: string): Promise<boolean> {
  const enrollments = await getEnrollmentsByEmail(email);
  return enrollments.some((enrollment) => enrollment.offeringSlug === offeringSlug);
}
