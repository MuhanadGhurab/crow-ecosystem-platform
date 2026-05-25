/**
 * Stripe alignment view — read-only billing posture (no enforcement).
 */

import { prisma } from "@/lib/db";
import { isStripeConfigured } from "@/lib/billing/env";
import { getStripeClient, isStripePackageInstalled } from "@/lib/billing/stripe-client";
import {
  normalizePlanKey,
  PLAN_DISPLAY_NAMES,
} from "@/lib/subscription/plan-capabilities";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

export type BillingMode = "internal" | "stripe_ready" | "stripe_active";

export const BILLING_MODE_LABELS: Record<BillingMode, string> = {
  internal: "Internal",
  stripe_ready: "Stripe-ready",
  stripe_active: "Stripe active",
};

export type TenantBillingAlignment = {
  tenantId: string;
  billingMode: BillingMode;
  billingModeLabel: string;
  stripeConfigured: boolean;
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  subscriptionStatus: string | null;
  hasTenantSubscription: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean | null;
  startedAt: Date | null;
  endsAt: Date | null;
  checkedAt: Date;
  advisoryMessage: string | null;
};

export function resolveBillingMode(input: {
  stripeConfigured: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}): BillingMode {
  if (!input.stripeConfigured) return "internal";
  if (input.stripeSubscriptionId) return "stripe_active";
  if (input.stripeCustomerId) return "stripe_ready";
  return "stripe_ready";
}

async function fetchStripeSubscriptionPeriod(input: {
  stripeSubscriptionId: string;
}): Promise<{
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean | null;
} | null> {
  if (!isStripeConfigured() || !isStripePackageInstalled()) return null;
  try {
    const stripe = getStripeClient();
    const sub = await stripe.subscriptions.retrieve(input.stripeSubscriptionId);
    return {
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    };
  } catch {
    return null;
  }
}

export async function getTenantBillingAlignment(
  tenantId: string
): Promise<TenantBillingAlignment | null> {
  const stripeConfigured = isStripeConfigured();
  const checkedAt = new Date();

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      planKey: true,
      subscription: {
        include: {
          plan: { select: { key: true } },
          billingRecords: {
            orderBy: { periodEnd: "desc" },
            take: 1,
            select: { periodStart: true, periodEnd: true },
          },
        },
      },
    },
  });

  if (!tenant) return null;

  const sub = tenant.subscription;
  const planKey = normalizePlanKey(sub?.plan.key ?? tenant.planKey);
  const billingMode = resolveBillingMode({
    stripeConfigured,
    stripeCustomerId: sub?.stripeCustomerId,
    stripeSubscriptionId: sub?.stripeSubscriptionId,
  });

  let currentPeriodStart = sub?.startedAt ?? null;
  let currentPeriodEnd = sub?.endsAt ?? null;
  let cancelAtPeriodEnd: boolean | null = null;

  const latestBilling = sub?.billingRecords[0];
  if (latestBilling) {
    currentPeriodStart = latestBilling.periodStart;
    currentPeriodEnd = latestBilling.periodEnd;
  }

  if (sub?.stripeSubscriptionId && billingMode === "stripe_active") {
    const stripePeriod = await fetchStripeSubscriptionPeriod({
      stripeSubscriptionId: sub.stripeSubscriptionId,
    });
    if (stripePeriod) {
      currentPeriodStart = stripePeriod.currentPeriodStart ?? currentPeriodStart;
      currentPeriodEnd = stripePeriod.currentPeriodEnd ?? currentPeriodEnd;
      cancelAtPeriodEnd = stripePeriod.cancelAtPeriodEnd;
    }
  }

  let advisoryMessage: string | null = null;
  if (!stripeConfigured) {
    advisoryMessage =
      "Stripe is not configured. Subscription is managed internally.";
  } else if (billingMode === "stripe_ready") {
    advisoryMessage =
      "Stripe keys are configured — subscription is provisioned locally until checkout completes.";
  }

  return {
    tenantId,
    billingMode,
    billingModeLabel: BILLING_MODE_LABELS[billingMode],
    stripeConfigured,
    planKey,
    planDisplayName: PLAN_DISPLAY_NAMES[planKey],
    subscriptionStatus: sub?.status ?? null,
    hasTenantSubscription: Boolean(sub),
    stripeCustomerId: sub?.stripeCustomerId ?? null,
    stripeSubscriptionId: sub?.stripeSubscriptionId ?? null,
    stripePriceId: sub?.stripePriceId ?? null,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    startedAt: sub?.startedAt ?? null,
    endsAt: sub?.endsAt ?? null,
    checkedAt,
    advisoryMessage,
  };
}
