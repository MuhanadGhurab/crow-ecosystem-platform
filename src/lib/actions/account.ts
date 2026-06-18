"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  issueEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/lib/account/email-verification.service";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountByEmailNormalized,
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { updatePlatformAccountProfile } from "@/lib/account/platform-account-profile.service";
import { requireAuth } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { checkC3VerificationRateLimit } from "@/lib/security/c3-registration-rate-limit";
import { getClientIpFromHeaders } from "@/lib/security/client-ip";
import { routes } from "@/lib/routes";

export type AccountActionState = { error?: string; message?: string } | undefined;

function c3DisabledState(): AccountActionState {
  return { error: "Account registration is not enabled." };
}

function loginAfterVerificationPath(email: string, next?: string): string {
  const params = new URLSearchParams({ verified: "1", email });
  if (next) params.set("next", next);
  return `${routes.auth.login}?${params.toString()}`;
}

async function resolvePendingAccount(email: string) {
  const normalized = email.trim();
  if (!normalized) return null;
  return findPlatformAccountByEmailNormalized(normalized);
}

export async function verifyEmailCode(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
  }

  const h = await headers();
  const rate = checkC3VerificationRateLimit(getClientIpFromHeaders(h));
  if (!rate.allowed) {
    return { error: "Too many attempts. Try again later." };
  }

  const code = String(formData.get("code") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));

  if (!email) {
    return { error: "Email is required." };
  }

  if (!/^\d{6}$/.test(code)) {
    return { error: "Enter the 6-digit code from your email." };
  }

  const account = await resolvePendingAccount(email);
  if (!account) {
    return { error: "No pending registration found for this email." };
  }

  if (isPlatformAccountActive(account)) {
    redirect(loginAfterVerificationPath(account.email, next));
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
      case "confirm_failed":
        return {
          error:
            "Verification succeeded but activation could not finish. Try again or contact support.",
        };
      default:
        return { error: "Verification failed. Try again." };
    }
  }

  redirect(loginAfterVerificationPath(account.email, next));
}

export async function resendVerificationCode(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
  }

  const h = await headers();
  const rate = checkC3VerificationRateLimit(getClientIpFromHeaders(h));
  if (!rate.allowed) {
    return { error: "Too many attempts. Try again later." };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Email is required." };
  }

  const account = await resolvePendingAccount(email);
  if (!account) {
    return { error: "No pending registration found for this email." };
  }

  if (isPlatformAccountActive(account)) {
    return { message: "Your email is already verified. You can sign in." };
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
