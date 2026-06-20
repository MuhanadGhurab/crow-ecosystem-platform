import type { User } from "@supabase/supabase-js";

import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  activatePlatformAccountIfReady,
  findPlatformAccountBySupabaseUserId,
  isBlockedPlatformAccountStatus,
  isPendingEmailVerification,
  isPendingPhoneVerification,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { isOnboardingGenerationCurrent } from "@/lib/account/onboarding-generation";
import { isPhoneVerificationRequiredForAccount } from "@/lib/account/phone-verification-policy";
import { linkRequestsForUser } from "@/lib/services/client-request-link.service";
import {
  getPendingReacceptanceForAccount,
  hasMandatoryLegalAcceptanceComplete,
} from "@/lib/legal/legal-acceptance.service";
import { resolveRegistrationLocale } from "@/lib/legal/registration-locale";
import { routes } from "@/lib/routes";

export type C3RegistrationSource = "email_password" | "oauth";

function withNext(base: string, next?: string): string {
  if (!next) return base;
  return `${base}?next=${encodeURIComponent(next)}`;
}

/** Deferred onboarding — only after full activation. */
export async function runDeferredClientOnboarding(user: User): Promise<void> {
  try {
    await linkRequestsForUser(user, { grantClientRole: false });
  } catch {
    /* DB optional */
  }
}

export type C3GateResult =
  | { action: "continue" }
  | { action: "redirect"; path: string }
  | { action: "error"; message: string };

/**
 * When C3 is enabled, gate auth completion on platform account + legal + dual verification.
 */
export async function gateAuthSessionForC3(
  user: User,
  next?: string
): Promise<C3GateResult> {
  if (!isAccountRegistrationEnabled()) {
    return { action: "continue" };
  }

  if (!user.email) {
    return { action: "error", message: "Account email is required." };
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { action: "redirect", path: withNext(routes.onboarding.legal, next) };
  }

  if (isBlockedPlatformAccountStatus(account.status)) {
    return {
      action: "error",
      message: "This account is not permitted to sign in.",
    };
  }

  if (
    account.status === "ACTIVE" &&
    !isOnboardingGenerationCurrent(account.onboardingGeneration)
  ) {
    return {
      action: "error",
      message: "This account must complete the current onboarding process.",
    };
  }

  const locale = await resolveRegistrationLocale();
  const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id, locale);

  if (!legalComplete) {
    return { action: "redirect", path: withNext(routes.onboarding.legal, next) };
  }

  if (isPendingEmailVerification(account) || !account.emailVerifiedAt) {
    return { action: "redirect", path: withNext(routes.onboarding.verifyEmail, next) };
  }

  let currentAccount = account;
  if (
    !isPhoneVerificationRequiredForAccount(currentAccount) &&
    !isPlatformAccountActive(currentAccount)
  ) {
    await activatePlatformAccountIfReady(currentAccount.id);
    currentAccount =
      (await findPlatformAccountBySupabaseUserId(user.id)) ?? currentAccount;
  }

  if (
    isPhoneVerificationRequiredForAccount(currentAccount) &&
    isPendingPhoneVerification(currentAccount)
  ) {
    return { action: "redirect", path: withNext(routes.onboarding.verifyPhone, next) };
  }

  if (isPlatformAccountActive(currentAccount)) {
    const pendingReaccept = await getPendingReacceptanceForAccount(currentAccount.id, locale);
    if (pendingReaccept.length > 0) {
      return { action: "redirect", path: `${routes.account.legal}?reaccept=1` };
    }
    await runDeferredClientOnboarding(user);
  }

  return { action: "continue" };
}

export function isC3AuthEnabled(): boolean {
  return isAccountRegistrationEnabled();
}

/** Paths incomplete onboarding users may access (session required). */
export function isC3OnboardingPath(pathname: string): boolean {
  return (
    pathname === routes.onboarding.legal ||
    pathname.startsWith(`${routes.onboarding.legal}/`) ||
    pathname === routes.onboarding.verifyEmail ||
    pathname === routes.onboarding.verifyPhone ||
    pathname === routes.account.registerLegal ||
    pathname === routes.account.verifyEmail
  );
}
