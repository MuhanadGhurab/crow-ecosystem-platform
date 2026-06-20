/** Current required enrollment generation — legacy JWTs / accounts below this are denied. */
export function getRequiredOnboardingGeneration(): number {
  const raw = process.env.CROW_ONBOARDING_GENERATION_REQUIRED?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 2;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
}

export function isOnboardingGenerationCurrent(generation: number): boolean {
  return generation >= getRequiredOnboardingGeneration();
}

/** New registrations always enroll in the current generation. */
export function getCurrentEnrollmentGeneration(): number {
  return getRequiredOnboardingGeneration();
}
