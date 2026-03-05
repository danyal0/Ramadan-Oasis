"use client";

import { useState } from "react";

type PaymentIntentButtonProps = {
  offeringSlug: string;
  tierId: string;
  amount: number;
};

export function PaymentIntentButton({ offeringSlug, tierId, amount }: PaymentIntentButtonProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestIntent() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/payments/intents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          offeringSlug,
          email: "participant@example.com",
          amount,
          tierId,
          scholarshipRequested: amount === 0,
          sponsorshipAmount: amount > 0 ? Math.round(amount * 0.2) : 0,
        }),
      });
      if (!response.ok) {
        setMessage("Unable to create payment intent.");
        return;
      }
      const data = (await response.json()) as { providerReference: string };
      setMessage(`Intent created: ${data.providerReference}`);
    } catch {
      setMessage("Unable to create payment intent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={requestIntent}
        disabled={loading}
        className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:text-[var(--accent)] disabled:opacity-70"
      >
        Request intent
      </button>
      {message ? <p className="text-xs text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
