/** Stripe keys — optional until Phase 8.4 live billing. */

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );
}

export function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return key;
}

export function getStripeWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || undefined;
}

export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!key) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  }
  return key;
}

/** Optional mapping from subscription tier key to Stripe Price id. */
export function getStripePriceIdForTier(tierKey: string): string | undefined {
  const map: Record<string, string | undefined> = {
    startup: process.env.STRIPE_PRICE_STARTUP?.trim(),
    growth: process.env.STRIPE_PRICE_GROWTH?.trim(),
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE?.trim(),
  };
  return map[tierKey];
}
