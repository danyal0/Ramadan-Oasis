import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_BASE_URL: z.string().url().optional(),
  REGISTRATION_WEBHOOK_URL: z.string().url().optional(),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_PROVIDER: z.enum(["mock", "resend"]).default("mock"),
  DISCORD_INVITE_URL: z.string().url().optional(),
  ZOOM_EVENT_ID: z.string().optional(),
  PAYMENTS_URL: z.string().url().optional(),
  CONTENT_CMS_URL: z.string().url().optional(),
  ADMIN_EDIT_TOKEN: z.string().default("qwerty"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_BASE_URL: process.env.APP_BASE_URL,
  REGISTRATION_WEBHOOK_URL: process.env.REGISTRATION_WEBHOOK_URL,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  DISCORD_INVITE_URL: process.env.DISCORD_INVITE_URL,
  ZOOM_EVENT_ID: process.env.ZOOM_EVENT_ID,
  PAYMENTS_URL: process.env.PAYMENTS_URL,
  CONTENT_CMS_URL: process.env.CONTENT_CMS_URL,
  ADMIN_EDIT_TOKEN: process.env.ADMIN_EDIT_TOKEN,
});
