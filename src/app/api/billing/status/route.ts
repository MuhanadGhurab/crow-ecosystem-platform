import { NextResponse } from "next/server";

import { isStripeConfigured } from "@/lib/billing/env";
import { isStripePackageInstalled } from "@/lib/billing/stripe-client";

/** M8 — read-only billing config (no secrets). */
export async function GET() {
  const stripe = isStripeConfigured();
  const packageInstalled = isStripePackageInstalled();
  const checkoutReady = stripe && packageInstalled;

  return NextResponse.json({
    ok: true,
    stripeConfigured: stripe,
    stripePackageInstalled: packageInstalled,
    checkoutReady,
    subscriptionTiers: checkoutReady ? ["startup", "growth", "enterprise"] : [],
    message: checkoutReady
      ? "Stripe checkout ready — POST /api/billing/checkout"
      : stripe
        ? "Stripe keys present — ensure stripe package is installed"
        : "Stripe not configured — see docs/internal/STRIPE_BILLING.md",
  });
}
