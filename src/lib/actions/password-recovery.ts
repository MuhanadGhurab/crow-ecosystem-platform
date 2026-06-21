"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createPasswordRecoverySupportRef,
  logPasswordRecoveryOutcome,
  recordPasswordRecoveryAuditIfKnown,
  sendPasswordChangedNotification,
} from "@/lib/account/password-recovery.service";
import {
  PASSWORD_RECOVERY_GENERIC_MESSAGE,
  PASSWORD_RECOVERY_THROTTLED_MESSAGE,
} from "@/lib/auth/password-recovery-messages";
import {
  clearPasswordRecoveryCookieOptions,
  PASSWORD_RECOVERY_COOKIE,
  passwordRecoveryCookieOptions,
} from "@/lib/auth/password-recovery-session";
import { validateNewPassword } from "@/lib/auth/password-validation";
import {
  buildPasswordRecoveryCallbackUrl,
  resolveTrustedAppOriginFromHeaders,
} from "@/lib/auth/trusted-app-origin";
import { checkPasswordRecoveryRateLimit } from "@/lib/security/password-recovery-rate-limit";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { routes } from "@/lib/routes";

export type PasswordRecoveryFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | undefined;

function clientIpFromHeaders(headersList: Headers): string | null {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headersList.get("x-real-ip")?.trim() ?? null;
}

export async function requestPasswordResetAction(
  _prev: PasswordRecoveryFormState,
  formData: FormData
): Promise<PasswordRecoveryFormState> {
  const supportRef = createPasswordRecoverySupportRef();

  if (!isSupabaseAuthConfigured()) {
    logPasswordRecoveryOutcome("misconfigured", supportRef);
    return {
      status: "success",
      message: PASSWORD_RECOVERY_GENERIC_MESSAGE,
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email || !email.includes("@")) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    };
  }

  const headersList = await headers();
  const rate = checkPasswordRecoveryRateLimit(
    clientIpFromHeaders(headersList),
    email
  );
  if (!rate.allowed) {
    logPasswordRecoveryOutcome("throttled", supportRef);
    return {
      status: "error",
      message: PASSWORD_RECOVERY_THROTTLED_MESSAGE,
    };
  }

  const origin = resolveTrustedAppOriginFromHeaders(headersList);
  const redirectTo = buildPasswordRecoveryCallbackUrl(origin);

  const supabase = await createClient();
  try {
    await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    logPasswordRecoveryOutcome("accepted", supportRef);
    await recordPasswordRecoveryAuditIfKnown(email, "password_recovery_requested", {
      ref: supportRef,
    });
  } catch {
    logPasswordRecoveryOutcome("provider_error", supportRef);
    /* enumeration-safe: same outward response */
  }

  return {
    status: "success",
    message: PASSWORD_RECOVERY_GENERIC_MESSAGE,
  };
}

export async function submitPasswordResetAction(
  _prev: PasswordRecoveryFormState,
  formData: FormData
): Promise<PasswordRecoveryFormState> {
  const supportRef = createPasswordRecoverySupportRef();

  if (!isSupabaseAuthConfigured()) {
    return {
      status: "error",
      message: "Password reset is not available. Contact support.",
    };
  }

  const cookieStore = await cookies();
  const recoveryFlag = cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value;
  if (recoveryFlag !== "1") {
    return {
      status: "error",
      message: "This reset link is invalid or has expired. Request a new reset link.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("passwordConfirm") ?? "");
  const validation = validateNewPassword(password, confirmPassword);
  if (!validation.ok) {
    return { status: "error", message: validation.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      status: "error",
      message: "This reset link is invalid or has expired. Request a new reset link.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    await recordPasswordRecoveryAuditIfKnown(user.email, "password_recovery_failed", {
      ref: supportRef,
      reason: "update_rejected",
    });
    return {
      status: "error",
      message: "Could not update your password. Request a new reset link and try again.",
    };
  }

  await recordPasswordRecoveryAuditIfKnown(user.email, "password_recovery_succeeded", {
    ref: supportRef,
  });

  const notification = await sendPasswordChangedNotification(user.email, supportRef);
  if (!notification.sent) {
    await recordPasswordRecoveryAuditIfKnown(user.email, "password_recovery_failed", {
      ref: supportRef,
      reason: "notification_failed",
    });
  }

  await supabase.auth.signOut();

  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const secure = proto === "https";
  cookieStore.set(clearPasswordRecoveryCookieOptions(secure));

  redirect(`${routes.auth.login}?password-reset=1`);
}
