"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  issueEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/lib/account/email-verification.service";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { updatePlatformAccountProfile } from "@/lib/account/platform-account-profile.service";
import { runDeferredClientOnboarding } from "@/lib/account/c3-auth-orchestration";
import { requireAuth } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import { refreshSessionUser } from "@/lib/auth/refresh-session-user";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export type AccountActionState = { error?: string; message?: string } | undefined;

function c3DisabledState(): AccountActionState {
  return { error: "Account registration is not enabled." };
}

export async function verifyEmailCode(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
  }

  const code = String(formData.get("code") ?? "").trim();
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));

  if (!/^\d{6}$/.test(code)) {
    return { error: "Enter the 6-digit code from your email." };
  }

  const user = await requireAuth(routes.account.verifyEmail);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { error: "No platform account found. Sign up again or contact support." };
  }

  if (isPlatformAccountActive(account)) {
    redirect(await resolveC3PostAuthLanding(user, next));
  }

  const result = await verifyEmailVerificationCode({
    platformAccountId: account.id,
    email: account.email,
    code,
  });

  if (!result.ok) {
    switch (result.reason) {
      case "invalid":
        return { error: "Invalid code. Check your email and try again." };
      case "expired":
        return { error: "This code has expired. Request a new one." };
      case "max_attempts":
        return { error: "Too many attempts. Request a new code." };
      case "no_challenge":
        return { error: "No active verification code. Request a new one." };
      case "blocked":
        return { error: "This account cannot be verified. Contact support." };
      case "legal_incomplete":
        redirect(routes.account.registerLegal);
      default:
        return { error: "Verification failed. Try again." };
    }
  }

  const supabase = await createClient();
  await runDeferredClientOnboarding(user);
  const refreshed = (await refreshSessionUser(supabase)) ?? user;
  redirect(await resolveC3PostAuthLanding(refreshed, next));
}

export async function resendVerificationCode(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
  }

  const user = await requireAuth(routes.account.verifyEmail);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { error: "No platform account found." };
  }

  if (isPlatformAccountActive(account)) {
    return { message: "Your email is already verified." };
  }

  const issued = await issueEmailVerificationCode({
    platformAccountId: account.id,
    email: account.email,
  });

  if (!issued.ok) {
    if (issued.reason === "cooldown") {
      return { error: "Please wait before requesting another code." };
    }
    if (issued.reason === "delivery_failed") {
      return {
        error:
          "We could not deliver a verification code right now. Try again in a few minutes or contact support.",
      };
    }
    return { error: "Could not send a new code. Try again shortly." };
  }

  return { message: "A new verification code was sent to your email." };
}

export async function updateAccountProfile(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
  }

  const user = await requireAuth(routes.account.profile);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account || !isPlatformAccountActive(account)) {
    redirect(routes.account.verifyEmail);
  }

  try {
    await updatePlatformAccountProfile(account.id, {
      displayName: String(formData.get("displayName") ?? ""),
      handle: String(formData.get("handle") ?? ""),
      jobTitle: String(formData.get("jobTitle") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      preferredLanguage: String(formData.get("preferredLanguage") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      isPrivate: formData.get("isPrivate") === "on",
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not save profile.",
    };
  }

  revalidatePath(routes.account.profile);
  return { message: "Profile saved." };
}
