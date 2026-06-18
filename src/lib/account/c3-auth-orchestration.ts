import type { User } from "@supabase/supabase-js";

import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";

import {

  findPlatformAccountBySupabaseUserId,

  isBlockedPlatformAccountStatus,

  isPendingEmailVerification,

  isPlatformAccountActive,

} from "@/lib/account/platform-account.service";

import { linkRequestsForUser } from "@/lib/services/client-request-link.service";

import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";

import { getPendingReacceptanceForAccount } from "@/lib/legal/legal-acceptance.service";

import { resolveRegistrationLocale } from "@/lib/legal/registration-locale";

import { routes } from "@/lib/routes";



export type C3RegistrationSource = "email_password" | "oauth";



function verifyEmailPath(next?: string): string {

  if (!next) return routes.account.verifyEmail;

  return `${routes.account.verifyEmail}?next=${encodeURIComponent(next)}`;

}



function registerLegalPath(next?: string): string {

  if (!next) return routes.account.registerLegal;

  return `${routes.account.registerLegal}?next=${encodeURIComponent(next)}`;

}



function accountLegalReacceptPath(): string {

  return `${routes.account.legal}?reaccept=1`;

}



/** Deferred onboarding — only after email verification / ACTIVE status. */

/** Link prior intake requests by email only — never auto-assign client role on activation. */
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

 * When C3 is enabled, gate auth completion on platform account + legal evidence state.

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

    return { action: "redirect", path: registerLegalPath(next) };

  }



  if (isBlockedPlatformAccountStatus(account.status)) {

    return {

      action: "error",

      message: "This account is not permitted to sign in.",

    };

  }



  const locale = await resolveRegistrationLocale();



  if (isPendingEmailVerification(account)) {

    const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id, locale);

    if (!legalComplete) {

      return { action: "redirect", path: registerLegalPath(next) };

    }

    return { action: "redirect", path: verifyEmailPath(next) };

  }



  if (isPlatformAccountActive(account)) {

    const pendingReaccept = await getPendingReacceptanceForAccount(account.id, locale);

    if (pendingReaccept.length > 0) {

      return { action: "redirect", path: accountLegalReacceptPath() };

    }

    await runDeferredClientOnboarding(user);

  }



  return { action: "continue" };

}



export function isC3AuthEnabled(): boolean {

  return isAccountRegistrationEnabled();

}

