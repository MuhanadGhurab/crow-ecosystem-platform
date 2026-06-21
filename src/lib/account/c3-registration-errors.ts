import { createHash, randomUUID } from "crypto";

/** Safe, non-enumerating registration failure codes for URL + UI. */
export type C3RegistrationErrorCode =
  | "invalid_legal_acceptance"
  | "registration_temporarily_unavailable"
  | "email_delivery_failed"
  | "registration_already_pending"
  | "registration_disabled"
  | "rate_limited"
  | "registration_failed";

export function createRegistrationCorrelationId(): string {
  return randomUUID();
}

/** Opaque support reference — no account, email, or tenant identifiers. */
export function formatSupportReference(correlationId: string): string {
  const hex = createHash("sha256").update(correlationId).digest("hex").slice(0, 6).toUpperCase();
  return `CRW-${hex}`;
}

export function userMessageForRegistrationError(
  code: C3RegistrationErrorCode,
  supportRef?: string
): string {
  const base = (() => {
    switch (code) {
      case "invalid_legal_acceptance":
        return "Please review and accept all required legal agreements before continuing.";
      case "email_delivery_failed":
        return "We could not deliver a verification code right now. Try again in a few minutes.";
      case "registration_already_pending":
        return "If this email is eligible for registration, check your inbox for the next step. If you already have an account, sign in.";
      case "registration_disabled":
        return "Account registration is not available right now.";
      case "rate_limited":
        return "Too many registration attempts. Try again later.";
      case "registration_temporarily_unavailable":
      case "registration_failed":
      default:
        return "We couldn't complete account creation. Please try again.";
    }
  })();

  if (!supportRef) return base;
  return `${base}\n\nSupport reference: ${supportRef}`;
}

export function classifyRegistrationFailure(
  reason: string
): C3RegistrationErrorCode {
  if (reason.includes("Terms of Service") || reason.includes("Privacy Notice")) {
    return "invalid_legal_acceptance";
  }
  if (reason.includes("Acceptable Use Policy")) {
    return "invalid_legal_acceptance";
  }
  if (reason.includes("legal document") || reason.includes("Legal document")) {
    return "invalid_legal_acceptance";
  }
  if (reason.includes("deliver a verification")) {
    return "email_delivery_failed";
  }
  if (reason.includes("Too many registration")) {
    return "rate_limited";
  }
  if (reason.includes("not enabled")) {
    return "registration_disabled";
  }
  return "registration_failed";
}
