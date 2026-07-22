import type { ErrorCategory } from "@ghuravia/contracts/schemas";
import type { ExplainableLockCode } from "@ghuravia/contracts/schemas";
import { ar } from "./ar";
import { en } from "./en";
import {
  MESSAGE_KEYS,
  type Locale,
  type MessageCatalog,
  type MessageKey,
} from "./messages";

const catalogs: Record<Locale, MessageCatalog> = { ar, en };

export function assertCatalogParity(): void {
  for (const key of MESSAGE_KEYS) {
    if (!ar[key] || !en[key]) {
      throw new Error(`Missing localization key: ${key}`);
    }
  }
  const arKeys = Object.keys(ar).sort().join(",");
  const enKeys = Object.keys(en).sort().join(",");
  if (arKeys !== enKeys) {
    throw new Error("Arabic and English localization key sets differ");
  }
}

export function t(locale: Locale, key: MessageKey): string {
  const value = catalogs[locale][key];
  if (!value) {
    throw new Error(`Missing message key ${key} for locale ${locale}`);
  }
  return value;
}

export function errorMessage(
  locale: Locale,
  category: ErrorCategory | string,
): string {
  switch (category) {
    case "VALIDATION_ERROR":
      return t(locale, "errValidation");
    case "UNAUTHORIZED":
      return t(locale, "errUnauthorized");
    case "FORBIDDEN":
      return t(locale, "errForbidden");
    case "NOT_FOUND":
      return t(locale, "errNotFound");
    case "CONFLICT":
      return t(locale, "errConflict");
    case "IDEMPOTENCY_CONFLICT":
      return t(locale, "errIdempotencyConflict");
    case "INVALID_TRANSITION":
      return t(locale, "errInvalidTransition");
    case "CHALLENGE_EXPIRED":
      return t(locale, "errChallengeExpired");
    case "ACTIVATION_LOCKED":
      return t(locale, "errActivationLocked");
    case "PROVIDER_UNAVAILABLE":
      return t(locale, "errProviderUnavailable");
    case "LOCAL_RUNTIME_ONLY":
      return t(locale, "errLocalRuntime");
    case "INTERNAL_ERROR":
    default:
      return t(locale, "errInternal");
  }
}

export function lockCopy(
  locale: Locale,
  code: ExplainableLockCode,
): { title: string; body: string } {
  switch (code) {
    case "EMAIL_NOT_VERIFIED":
      return {
        title: t(locale, "lockEmailTitle"),
        body: t(locale, "lockEmailBody"),
      };
    case "TERMS_NOT_ACCEPTED":
      return {
        title: t(locale, "lockTermsTitle"),
        body: t(locale, "lockTermsBody"),
      };
    case "ACCOUNT_RISK_NOT_ACCEPTED":
      return {
        title: t(locale, "lockRiskTitle"),
        body: t(locale, "lockRiskBody"),
      };
    case "RECOVERY_REQUIRED":
      return {
        title: t(locale, "lockRecoveryTitle"),
        body: t(locale, "lockRecoveryBody"),
      };
    case "RISK_REVIEW_REQUIRED":
      return {
        title: t(locale, "lockReviewTitle"),
        body: t(locale, "lockReviewBody"),
      };
    case "ACCOUNT_SUSPENDED":
      return {
        title: t(locale, "lockSuspendedTitle"),
        body: t(locale, "lockSuspendedBody"),
      };
    case "ACCOUNT_CLOSED":
      return {
        title: t(locale, "lockClosedTitle"),
        body: t(locale, "lockClosedBody"),
      };
    default: {
      const _exhaustive: never = code;
      return _exhaustive;
    }
  }
}

export { type Locale, type MessageKey };
