/**
 * C3.10B — canonical server-side phone verification policy.
 * Never expose via NEXT_PUBLIC_*; consume only through this module.
 *
 * CROW.REQUEST.2 — client-process progression requires verified phone (constitution),
 * independently of the deferred global enrollment flag below.
 */

import type { PlatformAccount } from "@prisma/client";

import { CROW_PHONE_ONBOARDING_GENERATION } from "@/lib/account/onboarding-generation";

const TRUTHY = new Set(["true", "1", "yes", "on"]);
const FALSY = new Set(["false", "0", "no", "off"]);

/**
 * When false (default), phone/SMS verification is deferred for **account activation**
 * and must not block email-only onboarding enrollment.
 * When true, phone verification applies to generation-3+ enrollments only.
 *
 * Client-process routes (`/client/*`, request submit) use
 * {@link isClientProcessPhoneVerificationRequired} instead.
 */
export function isPhoneVerificationRequired(): boolean {
  const raw = process.env.CROW_PHONE_VERIFICATION_REQUIRED?.trim().toLowerCase();
  if (!raw) {
    return false;
  }
  return TRUTHY.has(raw);
}

/** Per-account phone requirement for enrollment/activation — policy flag AND generation ≥ 3. */
export function isPhoneVerificationRequiredForAccount(
  account: Pick<PlatformAccount, "onboardingGeneration">
): boolean {
  if (!isPhoneVerificationRequired()) {
    return false;
  }
  return account.onboardingGeneration >= CROW_PHONE_ONBOARDING_GENERATION;
}

/**
 * CROW.REQUEST.2 — constitution alignment for client-process progression.
 * Default **true**: email + phone required before `/client/*` and request submit.
 * Does not fake OTP — callers must redirect to real phone verification when missing.
 * Override with `CROW_CLIENT_PROCESS_PHONE_REQUIRED=false` only for explicit local/test waivers.
 */
export function isClientProcessPhoneVerificationRequired(): boolean {
  const raw = process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED?.trim().toLowerCase();
  if (!raw) {
    return true;
  }
  if (FALSY.has(raw)) {
    return false;
  }
  return TRUTHY.has(raw);
}

/**
 * True when phone OTP capture/verify UI and services may run.
 * Enrollment policy OR client-process constitution gate.
 */
export function isPhoneVerificationFlowEnabled(): boolean {
  return isPhoneVerificationRequired() || isClientProcessPhoneVerificationRequired();
}

/** True when client-process requires phone and this account has no verified phone. */
export function accountMissingClientProcessPhone(
  account: Pick<PlatformAccount, "phoneVerifiedAt"> | null | undefined
): boolean {
  if (!isClientProcessPhoneVerificationRequired()) {
    return false;
  }
  return !account?.phoneVerifiedAt;
}
