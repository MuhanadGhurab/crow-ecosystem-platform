/** Generation 1 — legacy identities before authorized fresh reset. */
export const CROW_LEGACY_ONBOARDING_GENERATION = 1;

/** Generation 2 — mandatory legal acceptance + verified email (current enrollment). */
export const CROW_EMAIL_ONLY_ONBOARDING_GENERATION = 2;

/** Generation 3 (future) — generation 2 + verified phone when phone policy is enabled. */
export const CROW_PHONE_ONBOARDING_GENERATION = 3;

/** Current required enrollment generation — legacy JWTs / accounts below this are denied. */
export function getRequiredOnboardingGeneration(): number {
  const raw = process.env.CROW_ONBOARDING_GENERATION_REQUIRED?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : CROW_EMAIL_ONLY_ONBOARDING_GENERATION;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : CROW_EMAIL_ONLY_ONBOARDING_GENERATION;
}

export function isOnboardingGenerationCurrent(generation: number): boolean {
  return generation >= getRequiredOnboardingGeneration();
}

/** New account enrollment generation (legal + email; phone deferred until generation 3). */
export const CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION = CROW_EMAIL_ONLY_ONBOARDING_GENERATION;

/** New registrations always enroll in dual-channel generation (default 2), not the temporary required gate. */
export function getCurrentEnrollmentGeneration(): number {
  const raw = process.env.CROW_NEW_ACCOUNT_ENROLLMENT_GENERATION?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION;
}
