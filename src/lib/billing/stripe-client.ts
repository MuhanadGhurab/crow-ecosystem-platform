import Stripe from "stripe";

import { getStripeSecretKey } from "@/lib/billing/env";

let stripeSingleton: Stripe | null = null;

/** Lazy Stripe SDK singleton — only call when keys are configured. */
export function getStripeClient(): Stripe {
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(getStripeSecretKey());
  }
  return stripeSingleton;
}

/** Whether the `stripe` npm package is installed (always true after M8). */
export function isStripePackageInstalled(): boolean {
  try {
    require.resolve("stripe");
    return true;
  } catch {
    return false;
  }
}
