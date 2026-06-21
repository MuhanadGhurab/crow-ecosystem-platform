import { isGoogleSsoEnabled } from "@/lib/auth/google-sso";

/** C3 — public email/password registration feature gate. */
export function isAccountRegistrationEnabled(): boolean {
  return process.env.ACCOUNT_REGISTRATION_ENABLED === "true";
}

/**
 * C3 platform-account session gate — registration and/or Google OAuth onboarding.
 * Password sign-in still uses {@link isAccountRegistrationEnabled} only.
 */
export function isC3PlatformAccountGateEnabled(): boolean {
  return isAccountRegistrationEnabled() || isGoogleSsoEnabled();
}

/** OAuth users may complete legal/verify gates when Google SSO is enabled. */
export function isC3GoogleOnboardingSurfaceEnabled(): boolean {
  return isGoogleSsoEnabled();
}
