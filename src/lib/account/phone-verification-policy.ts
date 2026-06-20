/**
 * C3.10B — canonical server-side phone verification policy.
 * Never expose via NEXT_PUBLIC_*; consume only through this module.
 */

import type { PlatformAccount } from "@prisma/client";

import { CROW_PHONE_ONBOARDING_GENERATION } from "@/lib/account/onboarding-generation";

const TRUTHY = new Set(["true", "1", "yes", "on"]);

/**
 * When false (default), phone/SMS verification is deferred and must not block onboarding.
 * When true, phone verification applies to generation-3+ enrollments only.
 */
export function isPhoneVerificationRequired(): boolean {
  const raw = process.env.CROW_PHONE_VERIFICATION_REQUIRED?.trim().toLowerCase();
  if (!raw) {
    return false;
  }
  return TRUTHY.has(raw);
}

/** Per-account phone requirement — policy flag AND enrollment generation ≥ 3. */
export function isPhoneVerificationRequiredForAccount(
  account: Pick<PlatformAccount, "onboardingGeneration">
): boolean {
  if (!isPhoneVerificationRequired()) {
    return false;
  }
  return account.onboardingGeneration >= CROW_PHONE_ONBOARDING_GENERATION;
}
