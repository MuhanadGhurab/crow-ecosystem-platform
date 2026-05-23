import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripeWebhookSecret } from "@/lib/billing/env";
import { getStripeClient } from "@/lib/billing/stripe-client";
import {
  findSubscriptionByStripeId,
  mapStripeSubscriptionStatus,
  recordBillingFromStripeInvoice,
  upsertTenantSubscriptionFromStripe,
} from "@/lib/services/billing-subscription.service";

export const runtime = "nodejs";

function planKeyFromMetadata(meta: Stripe.Metadata | null | undefined): string | null {
  const key = meta?.planKey;
  return typeof key === "string" && key.length > 0 ? key : null;
}

function tenantIdFromMetadata(meta: Stripe.Metadata | null | undefined): string | null {
  const id = meta?.tenantId;
  return typeof id === "string" && id.length > 0 ? id : null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tenantId = tenantIdFromMetadata(session.metadata);
  const planKey = planKeyFromMetadata(session.metadata);
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!tenantId || !planKey || !stripeCustomerId || !stripeSubscriptionId) {
    console.warn("[billing/webhook] checkout.session.completed missing metadata", session.id);
    return;
  }

  const stripe = getStripeClient();
  const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const priceId = sub.items.data[0]?.price?.id ?? null;

  const record = await upsertTenantSubscriptionFromStripe({
    tenantId,
    planKey,
    stripeCustomerId,
    stripeSubscriptionId,
    stripePriceId: priceId,
    status: mapStripeSubscriptionStatus(sub.status),
  });

  const amountPaid = session.amount_total;
  if (amountPaid != null && amountPaid > 0) {
    const periodStart = new Date((sub.current_period_start ?? Date.now() / 1000) * 1000);
    const periodEnd = new Date((sub.current_period_end ?? Date.now() / 1000) * 1000);
    await recordBillingFromStripeInvoice({
      subscriptionId: record.id,
      amountHalala: amountPaid,
      periodStart,
      periodEnd,
      status: "paid",
    });
  }
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const existing = await findSubscriptionByStripeId(sub.id);
  const tenantId =
    tenantIdFromMetadata(sub.metadata) ?? existing?.tenantId ?? null;
  const planKey =
    planKeyFromMetadata(sub.metadata) ?? existing?.plan.key ?? null;
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

  if (!tenantId || !planKey || !stripeCustomerId) {
    console.warn("[billing/webhook] subscription event missing tenant/plan", sub.id);
    return;
  }

  const priceId = sub.items.data[0]?.price?.id ?? null;
  await upsertTenantSubscriptionFromStripe({
    tenantId,
    planKey,
    stripeCustomerId,
    stripeSubscriptionId: sub.id,
    stripePriceId: priceId,
    status: mapStripeSubscriptionStatus(sub.status),
  });
}

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[billing/webhook]", event.type, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
