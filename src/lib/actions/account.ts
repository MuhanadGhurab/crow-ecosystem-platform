"use server";

import { redirectToAppPath } from "@/lib/auth/next-redirect";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  issueEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/lib/account/email-verification.service";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import { isPhoneVerificationRequiredForAccount } from "@/lib/account/phone-verification-policy";
import {
  findPlatformAccountByEmailNormalized,
  findPlatformAccountById,
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { updatePlatformAccountProfile } from "@/lib/account/platform-account-profile.service";
import { isPhoneVerificationRequired } from "@/lib/account/phone-verification-policy";
import { requireActivePlatformAccount, requireAuth } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { checkC3VerificationRateLimit } from "@/lib/security/c3-registration-rate-limit";
import { getClientIpFromHeaders } from "@/lib/security/client-ip";
import { routes } from "@/lib/routes";

export type AccountActionState =
  | { error?: string; message?: string; redirectPath?: string }
  | undefined;

/** Blocks new self-service registration flows only — not existing account profile access. */
function registrationDisabledState(): AccountActionState {
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
    return registrationDisabledState();
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
    return { redirectPath: loginAfterVerificationPath(account.email, next) };
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
        return { redirectPath: routes.onboarding.legal };
      case "confirm_failed":
        return {
          error:
            "Verification succeeded but activation could not finish. Try again or contact support.",
        };
      default:
        return { error: "Verification failed. Try again." };
    }
  }

  if (result.ok) {
    if (result.activated) {
      return { redirectPath: loginAfterVerificationPath(account.email, next) };
    }
    const refreshed = await findPlatformAccountById(account.id);
    if (
      refreshed &&
      isPhoneVerificationRequiredForAccount(refreshed) &&
      !isPlatformAccountActive(refreshed)
    ) {
      const phoneParams = new URLSearchParams();
      if (next) phoneParams.set("next", next);
      const qs = phoneParams.toString();
      return {
        redirectPath: qs
          ? `${routes.onboarding.verifyPhone}?${qs}`
          : routes.onboarding.verifyPhone,
        message: "Email verified. Add your phone number to finish onboarding.",
      };
    }
    return { redirectPath: loginAfterVerificationPath(account.email, next) };
  }

  return { error: "Verification failed. Try again." };
}

export async function submitVerifyEmailFormAction(formData: FormData): Promise<void> {
  const path = await resolveVerifyEmailSubmissionUrl(formData);
  await redirectToAppPath(path);
}

export async function resolveVerifyEmailSubmissionUrl(formData: FormData): Promise<string> {
  const result = await verifyEmailCode(undefined, formData);
  if (result?.redirectPath) {
    return result.redirectPath;
  }

  const email = String(formData.get("email") ?? "").trim();
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (next) params.set("next", next);
  if (result?.error) params.set("error", result.error);
  if (result?.message) params.set("message", result.message);

  const qs = params.toString();
  return qs ? `${routes.onboarding.verifyEmail}?${qs}` : routes.onboarding.verifyEmail;
}

export async function resendVerificationCode(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return registrationDisabledState();
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
  const user = await requireActivePlatformAccount(routes.account.profile);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account || !isPlatformAccountActive(account)) {
    return { error: "Your account is not active yet." };
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

export async function submitPhoneCaptureAction(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return registrationDisabledState();
  }

  if (!isPhoneVerificationRequired()) {
    return { error: "Phone verification is not required for your account." };
  }

  const user = await requireAuth(routes.onboarding.verifyPhone);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { error: "Complete legal review first." };
  }

  const countryCode = String(formData.get("countryCode") ?? "").trim();
  const nationalNumber = String(formData.get("phone") ?? "").trim();
  const confirmed = formData.get("confirmPhone") === "on";

  const { normalizePhoneToE164 } = await import("@/lib/account/phone-normalize");
  const normalized = normalizePhoneToE164({ countryCode, nationalNumber });
  if (!normalized.ok) {
    return { error: "Enter a valid phone number for the selected country." };
  }

  if (!confirmed) {
    return {
      error: "Confirm the masked number before requesting a verification code.",
      message: `We will send a code to ${normalized.masked}.`,
    };
  }

  const { issuePhoneVerificationCode } = await import(
    "@/lib/account/phone-verification.service"
  );
  const issued = await issuePhoneVerificationCode({
    platformAccountId: account.id,
    phoneNormalized: normalized.e164,
    phoneMasked: normalized.masked,
  });

  if (!issued.ok) {
    if (issued.reason === "duplicate") {
      return { error: "This phone number cannot be used. Try another or contact support." };
    }
    if (issued.reason === "cooldown") {
      return { error: "Please wait before requesting another code." };
    }
    return { error: "Could not send verification code. Try again shortly." };
  }

  return {
    message: `Verification code sent to ${issued.maskedPhone}.`,
    redirectPath: routes.onboarding.verifyPhone,
  };
}

export async function submitPhoneOtpAction(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  if (!isAccountRegistrationEnabled()) {
    return registrationDisabledState();
  }

  if (!isPhoneVerificationRequired()) {
    return { error: "Phone verification is not required for your account." };
  }

  const user = await requireAuth(routes.onboarding.verifyPhone);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account?.phoneNormalized) {
    return { error: "Add your phone number first." };
  }

  const code = String(formData.get("code") ?? "").trim();
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));

  if (!/^\d{6}$/.test(code)) {
    return { error: "Enter the 6-digit code from your SMS." };
  }

  const { verifyPhoneVerificationCode } = await import(
    "@/lib/account/phone-verification.service"
  );
  const result = await verifyPhoneVerificationCode({
    platformAccountId: account.id,
    phoneNormalized: account.phoneNormalized,
    code,
  });

  if (!result.ok) {
    switch (result.reason) {
      case "invalid":
        return { error: "Invalid code. Try again." };
      case "expired":
        return { error: "Code expired. Request a new one." };
      case "max_attempts":
        return { error: "Too many attempts. Request a new code." };
      default:
        return { error: "Verification failed. Try again." };
    }
  }

  if (result.activated) {
    const params = new URLSearchParams({ verified: "1" });
    if (next) params.set("next", next);
    return { redirectPath: `${routes.auth.login}?${params.toString()}` };
  }

  return { message: "Phone verified." };
}
