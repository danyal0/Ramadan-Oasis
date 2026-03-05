import { z } from "zod";
import { env } from "@/lib/env";

export const registrationSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  timezone: z.string().min(2).max(120),
  contributionAmount: z.number().min(0).max(100000).nullable(),
  intention: z.string().max(1200).optional(),
});

export type RegistrationPayload = z.infer<typeof registrationSchema>;

/**
 * Integration seam for production orchestration:
 * - CRM/email list insert
 * - transactional confirmation email
 * - Zoom registration/reminders
 * - Discord invite delivery
 * This keeps UI and validation stable while providers evolve.
 */
export async function processRegistration(payload: RegistrationPayload) {
  const body = {
    source: "ramadan-oasis-landing",
    submittedAt: new Date().toISOString(),
    payload,
  };

  if (env.REGISTRATION_WEBHOOK_URL) {
    await fetch(env.REGISTRATION_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } else {
    // In development we log to aid flow testing until a webhook is wired.
    console.info("Registration received (mock mode):", body);
  }

  return {
    message:
      "You are registered. Check your inbox for confirmation and next steps, including live links and community access details.",
    nextSteps: {
      paymentUrl: env.PAYMENTS_URL ?? null,
      discordInviteUrl: env.DISCORD_INVITE_URL ?? null,
    },
  };
}
