/** Current required enrollment generation — legacy JWTs / accounts below this are denied. */
export function getRequiredOnboardingGeneration(): number {
  const raw = process.env.CROW_ONBOARDING_GENERATION_REQUIRED?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 2;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
}

export function isOnboardingGenerationCurrent(generation: number): boolean {
  return generation >= getRequiredOnboardingGeneration();
}

/** Dual-channel enrollment generation for newly created accounts (independent of temporary gate). */
export const CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION = 2;

/** New registrations always enroll in dual-channel generation (default 2), not the temporary required gate. */
export function getCurrentEnrollmentGeneration(): number {
  const raw = process.env.CROW_NEW_ACCOUNT_ENROLLMENT_GENERATION?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION;
}
