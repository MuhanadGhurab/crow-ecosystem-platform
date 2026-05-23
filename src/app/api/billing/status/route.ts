import { NextResponse } from "next/server";

import { isStripeConfigured } from "@/lib/billing/env";

/** M8 — read-only billing config (no secrets). */
export async function GET() {
  const stripe = isStripeConfigured();
  return NextResponse.json({
    ok: true,
    stripeConfigured: stripe,
    subscriptionTiers: stripe
      ? ["startup", "growth", "enterprise"]
      : [],
    message: stripe
      ? "Stripe keys present — checkout can be wired"
      : "Stripe not configured — see docs/internal/STRIPE_BILLING.md",
  });
}
