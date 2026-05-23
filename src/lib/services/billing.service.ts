import { isStripeConfigured } from "@/lib/billing/env";
import { sarToStripeAmount } from "@/lib/billing/money";

export type SubscriptionCheckoutInput = {
  requestId: string;
  blueprintId?: string;
  monthlySar: number;
  planKey: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
};

export type SubscriptionCheckoutResult =
  | { ok: true; sessionId: string; url: string }
  | { ok: false; reason: "not_configured" | "invalid_amount" | "stripe_error"; message?: string };

/**
 * Creates a Stripe Checkout session for a monthly subscription estimate.
 * Safe default: returns not_configured until STRIPE_* env and `stripe` package are added.
 * See docs/STRIPE_BILLING.md for live implementation steps.
 */
export async function createSubscriptionCheckout(
  input: SubscriptionCheckoutInput
): Promise<SubscriptionCheckoutResult> {
  if (!input.monthlySar || input.monthlySar <= 0) {
    return { ok: false, reason: "invalid_amount", message: "Monthly amount must be positive" };
  }

  if (!isStripeConfigured()) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (see docs/internal/STRIPE_BILLING.md)",
    };
  }

  // Validate amount conversion early (used by live Checkout implementation).
  sarToStripeAmount(input.monthlySar);

  return {
    ok: false,
    reason: "not_configured",
    message:
      "Stripe keys present but live Checkout not wired yet — npm install stripe, then implement session create in billing.service.ts",
  };
}
