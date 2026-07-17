import {
  isPasswordRecoveryNextPath,
  PASSWORD_RECOVERY_NEXT_PATH,
} from "./password-recovery-session";
import { validateNewPassword, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "./password-validation";
import { buildPasswordRecoveryCallbackUrl } from "./trusted-app-origin";
import {
  checkPasswordRecoveryRateLimit,
  emailDigestForRateLimit,
  resetPasswordRecoveryRateLimitForTests,
} from "@/lib/security/password-recovery-rate-limit";
import { PASSWORD_RECOVERY_GENERIC_MESSAGE } from "./password-recovery-messages";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

assert(isPasswordRecoveryNextPath(PASSWORD_RECOVERY_NEXT_PATH), "recovery next allowed");
assert(!isPasswordRecoveryNextPath("/account"), "account next rejected");
assert(!isPasswordRecoveryNextPath("https://evil.example"), "external next rejected");

assert(!validateNewPassword("", "").ok, "empty passwords rejected");
assert(!validateNewPassword("short", "short").ok, "weak password rejected");
assert(
  !validateNewPassword("a".repeat(PASSWORD_MIN_LENGTH), "b".repeat(PASSWORD_MIN_LENGTH)).ok,
  "mismatch rejected"
);
assert(
  !validateNewPassword("a".repeat(PASSWORD_MAX_LENGTH + 1), "a".repeat(PASSWORD_MAX_LENGTH + 1))
    .ok,
  "long password rejected"
);
const okPass = "x".repeat(PASSWORD_MIN_LENGTH);
assert(validateNewPassword(okPass, okPass).ok, "valid password accepted");

resetPasswordRecoveryRateLimitForTests();
const email = "user+tag@example.com";
assert(
  emailDigestForRateLimit(email) === emailDigestForRateLimit(email.toUpperCase()),
  "email digest normalized"
);
assert(checkPasswordRecoveryRateLimit("1.2.3.4", email).allowed, "first request allowed");
assert(!checkPasswordRecoveryRateLimit("1.2.3.4", email).allowed, "cooldown enforced");

const callbackUrl = buildPasswordRecoveryCallbackUrl("https://app.example.com");
assert(
  callbackUrl === "https://app.example.com/auth/callback?next=%2Freset-password",
  "callback url shape"
);
assert(!callbackUrl.includes("=") || !/password=[^&]/i.test(callbackUrl), "no password query param");

assert(/eligible account/i.test(PASSWORD_RECOVERY_GENERIC_MESSAGE), "generic message");
assert(!/not found|invalid|unknown/i.test(PASSWORD_RECOVERY_GENERIC_MESSAGE), "no enumeration");

console.log("password-recovery.test.ts: all assertions passed");
