import type { User } from "@supabase/supabase-js";

import { isC3PlatformAccountGateEnabled, isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  activatePlatformAccountIfReady,
  findPlatformAccountBySupabaseUserId,
  isBlockedPlatformAccountStatus,
  isPendingEmailVerification,
  isPendingPhoneVerification,
  isPlatformAccountActive,
  reconcileLegacyOnboardingGeneration,
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
  if (!isC3PlatformAccountGateEnabled()) {
    return { action: "continue" };
  }

  if (!user.email) {
    return { action: "error", message: "Account email is required." };
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { action: "redirect", path: withNext(routes.account.registerLegal, next) };
  }

  if (isBlockedPlatformAccountStatus(account.status)) {
    return {
      action: "error",
      message: "This account is not permitted to sign in.",
    };
  }

  const locale = await resolveRegistrationLocale();
  const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id, locale);

  if (
    account.status === "ACTIVE" &&
    !isOnboardingGenerationCurrent(account.onboardingGeneration)
  ) {
    if (!legalComplete) {
      return { action: "redirect", path: withNext(routes.account.registerLegal, next) };
    }
    await reconcileLegacyOnboardingGeneration(account.id);
  }

  let currentAccount =
    (await findPlatformAccountBySupabaseUserId(user.id)) ?? account;

  if (!legalComplete) {
    return { action: "redirect", path: withNext(routes.account.registerLegal, next) };
  }

  if (isPendingEmailVerification(currentAccount) || !currentAccount.emailVerifiedAt) {
    return { action: "redirect", path: withNext(routes.onboarding.verifyEmail, next) };
  }

  let workingAccount = currentAccount;
  if (
    !isPhoneVerificationRequiredForAccount(workingAccount) &&
    !isPlatformAccountActive(workingAccount)
  ) {
    await activatePlatformAccountIfReady(workingAccount.id);
    workingAccount =
      (await findPlatformAccountBySupabaseUserId(user.id)) ?? workingAccount;
  }

  if (
    isPhoneVerificationRequiredForAccount(workingAccount) &&
    isPendingPhoneVerification(workingAccount)
  ) {
    return { action: "redirect", path: withNext(routes.onboarding.verifyPhone, next) };
  }

  if (isPlatformAccountActive(workingAccount)) {
    const pendingReaccept = await getPendingReacceptanceForAccount(workingAccount.id, locale);
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
