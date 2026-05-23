import { isStripeConfigured, getStripePriceIdForTier } from "@/lib/billing/env";
import { sarToStripeAmount } from "@/lib/billing/money";
import { getStripeClient, isStripePackageInstalled } from "@/lib/billing/stripe-client";
import { prisma } from "@/lib/db";
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions";

export type SubscriptionCheckoutInput = {
  tenantId: string;
  planKey: string;
  monthlySar?: number;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
};

export type SubscriptionCheckoutResult =
  | { ok: true; sessionId: string; url: string }
  | { ok: false; reason: "not_configured" | "invalid_amount" | "stripe_error"; message?: string };

function resolveMonthlySar(planKey: string, monthlySar?: number): number | null {
  if (monthlySar != null && monthlySar > 0) return monthlySar;
  const tier = SUBSCRIPTION_TIERS.find((t) => t.key === planKey);
  return tier?.baseMonthlySar ?? null;
}

/**
 * Creates a Stripe Checkout session for a monthly subscription (tenant-scoped).
 */
export async function createSubscriptionCheckout(
  input: SubscriptionCheckoutInput
): Promise<SubscriptionCheckoutResult> {
  const monthlySar = resolveMonthlySar(input.planKey, input.monthlySar);
  if (!monthlySar || monthlySar <= 0) {
    return { ok: false, reason: "invalid_amount", message: "Monthly amount must be positive" };
  }

  if (!isStripeConfigured() || !isStripePackageInstalled()) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (see docs/internal/STRIPE_BILLING.md)",
    };
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: input.tenantId },
    include: {
      organization: { select: { displayName: true } },
      subscription: true,
    },
  });
  if (!tenant) {
    return { ok: false, reason: "invalid_amount", message: "Tenant not found" };
  }

  const unitAmount = sarToStripeAmount(monthlySar);
  const priceId = getStripePriceIdForTier(input.planKey);

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: input.customerEmail,
      customer: tenant.subscription?.stripeCustomerId ?? undefined,
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "sar",
                unit_amount: unitAmount,
                recurring: { interval: "month" },
                product_data: {
                  name: `${tenant.organization.displayName} — ${input.planKey}`,
                },
              },
              quantity: 1,
            },
          ],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: {
        tenantId: input.tenantId,
        planKey: input.planKey,
        tenantSlug: tenant.slug,
      },
      subscription_data: {
        metadata: {
          tenantId: input.tenantId,
          planKey: input.planKey,
        },
      },
    });

    if (!session.url) {
      return { ok: false, reason: "stripe_error", message: "Checkout session missing URL" };
    }

    return { ok: true, sessionId: session.id, url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    return { ok: false, reason: "stripe_error", message };
  }
}
