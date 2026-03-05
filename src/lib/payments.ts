import { randomUUID } from "node:crypto";
import { z } from "zod";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";

const paymentIntentInputSchema = z.object({
  offeringSlug: z.string(),
  email: z.string().email(),
  amount: z.number().min(0),
  tierId: z.string(),
  scholarshipRequested: z.boolean().default(false),
  sponsorshipAmount: z.number().min(0).default(0),
});

const transactionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  offeringSlug: z.string(),
  email: z.string().email(),
  amount: z.number(),
  tierId: z.string(),
  scholarshipRequested: z.boolean(),
  sponsorshipAmount: z.number(),
  status: z.enum(["created", "captured"]),
  providerReference: z.string(),
});

const transactionsSchema = z.array(transactionSchema);

export type PaymentIntentInput = z.infer<typeof paymentIntentInputSchema>;
export type TransactionLog = z.infer<typeof transactionSchema>;

export function parsePaymentIntentInput(input: unknown): PaymentIntentInput {
  return paymentIntentInputSchema.parse(input);
}

export async function createMockPaymentIntent(input: PaymentIntentInput) {
  const transactions = await readJsonFile("src/content/transactions.json", transactionsSchema);
  const providerReference = `pi_${randomUUID().replaceAll("-", "").slice(0, 18)}`;

  const next: TransactionLog = {
    id: `txn_${randomUUID()}`,
    createdAt: new Date().toISOString(),
    offeringSlug: input.offeringSlug,
    email: input.email,
    amount: input.amount,
    tierId: input.tierId,
    scholarshipRequested: input.scholarshipRequested,
    sponsorshipAmount: input.sponsorshipAmount,
    status: "created",
    providerReference,
  };

  await writeJsonFile("src/content/transactions.json", transactionsSchema, [next, ...transactions]);

  return {
    provider: "mock-stripe-adapter",
    providerReference,
    clientSecret: `mock_secret_${providerReference}`,
  };
}

export async function getRecentTransactions(limit = 20) {
  const transactions = await readJsonFile("src/content/transactions.json", transactionsSchema);
  return transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
