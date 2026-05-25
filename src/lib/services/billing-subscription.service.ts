import type Stripe from "stripe";

import { prisma } from "@/lib/db";
import { stripeAmountToSar } from "@/lib/billing/money";
import { normalizePlanKey } from "@/lib/subscription/plan-capabilities";

/** Idempotent TenantSubscription link during provisioning (no Stripe). */
export async function ensureTenantSubscriptionForPlan(input: {
  tenantId: string;
  planKey: string;
  status?: string;
}) {
  const planKey = normalizePlanKey(input.planKey);
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { key: planKey },
  });
  if (!plan) {
    throw new Error(`Unknown subscription plan: ${planKey}`);
  }

  await prisma.tenant.update({
    where: { id: input.tenantId },
    data: { planKey },
  });

  return prisma.tenantSubscription.upsert({
    where: { tenantId: input.tenantId },
    create: {
      tenantId: input.tenantId,
      planId: plan.id,
      status: input.status ?? "active",
    },
    update: {
      planId: plan.id,
      status: input.status ?? "active",
    },
  });
}

export async function upsertTenantSubscriptionFromStripe(input: {
  tenantId: string;
  planKey: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId?: string | null;
  status: string;
}) {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { key: input.planKey },
  });
  if (!plan) {
    throw new Error(`Unknown subscription plan: ${input.planKey}`);
  }

  return prisma.tenantSubscription.upsert({
    where: { tenantId: input.tenantId },
    create: {
      tenantId: input.tenantId,
      planId: plan.id,
      status: input.status,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId ?? null,
    },
    update: {
      planId: plan.id,
      status: input.status,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId ?? null,
    },
  });
}

export async function recordBillingFromStripeInvoice(input: {
  subscriptionId: string;
  amountHalala: number;
  periodStart: Date;
  periodEnd: Date;
  status?: string;
}) {
  const amountSar = stripeAmountToSar(input.amountHalala);
  return prisma.billingRecord.create({
    data: {
      subscriptionId: input.subscriptionId,
      amountSar,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      status: input.status ?? "paid",
    },
  });
}

export function mapStripeSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "canceled":
    case "unpaid":
      return "canceled";
    case "past_due":
      return "past_due";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    case "paused":
      return "paused";
    default:
      return stripeStatus;
  }
}

export async function findSubscriptionByStripeId(stripeSubscriptionId: string) {
  return prisma.tenantSubscription.findFirst({
    where: { stripeSubscriptionId },
    include: { tenant: true, plan: true },
  });
}
