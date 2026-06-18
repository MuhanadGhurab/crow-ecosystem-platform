"use server";

import { headers } from "next/headers";
import { isNextRedirectError, redirectToAppPath } from "@/lib/auth/next-redirect";
import { revalidatePath } from "next/cache";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import { issueEmailVerificationCode } from "@/lib/account/email-verification.service";
import {
  C3_GENERIC_REGISTRATION_MESSAGE,
  classifyRegistrationEmail,
  compensateOrphanAuthUser,
  ensurePendingPlatformAccountForRegistration,
  provisionUnconfirmedAuthUser,
} from "@/lib/account/c3-registration-provisioning.service";
import {
  parseMandatoryLegalAcknowledgements,
  resolveMandatoryAcceptancesForLocale,
  validateMandatoryAcknowledgements,
} from "@/lib/account/c3-legal-acknowledgement";
import {
  classifyRegistrationFailure,
  createRegistrationCorrelationId,
  formatSupportReference,
  type C3RegistrationErrorCode,
  userMessageForRegistrationError,
} from "@/lib/account/c3-registration-errors";
import {
  emitC3RegistrationDiagnostic,
  isC3RegistrationDiagnosticsEnabled,
  sanitizeDiagnosticErrorClass,
} from "@/lib/account/c3-registration-diagnostics";
import {
  findPlatformAccountByEmailNormalized,
  findPlatformAccountBySupabaseUserId,
  isBlockedPlatformAccountStatus,
  isPlatformAccountActive,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";
import { getSessionUser, requireActivePlatformAccount } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import {
  getCurrentPublishedMandatoryVersions,
} from "@/lib/legal/legal-document.service";
import {
  hasMandatoryLegalAcceptanceComplete,
  LegalAcceptanceValidationError,
  recordLegalAcceptances,
  recordReacceptanceForVersion,
} from "@/lib/legal/legal-acceptance.service";
import { recordInitialMarketingConsent, setMarketingEmailConsent } from "@/lib/legal/account-consent.service";
import { resolveRegistrationLocale } from "@/lib/legal/registration-locale";
import { summarizeUserAgent } from "@/lib/legal/user-agent-summary";
import { assertC3RegistrationOrigin } from "@/lib/security/c3-registration-origin-guard";
import { checkC3RegistrationRateLimit } from "@/lib/security/c3-registration-rate-limit";
import { getClientIpFromHeaders } from "@/lib/security/client-ip";
import { routes } from "@/lib/routes";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";

export type LegalActionState =
  | {
      error?: string;
      message?: string;
      redirectPath?: string;
      errorCode?: C3RegistrationErrorCode;
      supportRef?: string;
    }
  | undefined;

type RegistrationContext = {
  correlationId: string;
  supportRef: string;
  startedAt: number;
};

function c3DisabledState(ctx: RegistrationContext): LegalActionState {
  return {
    errorCode: "registration_disabled",
    supportRef: ctx.supportRef,
    error: userMessageForRegistrationError("registration_disabled", ctx.supportRef),
  };
}

function buildVerifyEmailRedirect(email: string, next?: string): string {
  const params = new URLSearchParams({ email });
  if (next) params.set("next", next);
  return `${routes.account.verifyEmail}?${params.toString()}`;
}

function validatePasswordPair(password: string, passwordConfirm: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password !== passwordConfirm) return "Passwords do not match.";
  return null;
}

function markStage(
  ctx: RegistrationContext,
  stage: Parameters<typeof emitC3RegistrationDiagnostic>[0]["stage"],
  outcome: "ok" | "failed",
  errorClass?: string
) {
  emitC3RegistrationDiagnostic({
    correlationId: ctx.correlationId,
    supportRef: ctx.supportRef,
    stage,
    outcome,
    durationMs: Date.now() - ctx.startedAt,
    errorClass,
  });
}

async function buildLegalFailureRedirect(
  formData: FormData,
  code: C3RegistrationErrorCode,
  supportRef: string,
  message?: string
): Promise<never> {
  const email = String(formData.get("email") ?? "").trim();
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (next) params.set("next", next);
  params.set("error", code);
  params.set("ref", supportRef);
  if (message) params.set("message", message);
  return await redirectToAppPath(`${routes.account.registerLegal}?${params.toString()}`);
}

/** Transactional registration: server-admin Auth user + platform account + legal + Crow OTP. */
async function completeRegistrationWithLegalAcceptanceInternal(
  formData: FormData,
  ctx: RegistrationContext
): Promise<LegalActionState> {
  markStage(ctx, "LEGAL_FORM_RECEIVED", "ok");

  if (!isAccountRegistrationEnabled()) {
    markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", "registration_disabled");
    return c3DisabledState(ctx);
  }

  const acks = parseMandatoryLegalAcknowledgements(formData);
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));
  const locale = String(formData.get("locale") ?? (await resolveRegistrationLocale()));

  const mandatoryTypes = (
    await getCurrentPublishedMandatoryVersions({ locale })
  ).map((v) => v.legalDocument.documentType);

  try {
    validateMandatoryAcknowledgements({
      mandatoryTypes,
      termsAccepted: acks.termsAccepted,
      privacyAcknowledged: acks.privacyAcknowledged,
      aupAccepted: acks.aupAccepted,
    });
  } catch (err) {
    markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", sanitizeDiagnosticErrorClass(err));
    const message =
      err instanceof LegalAcceptanceValidationError
        ? err.message
        : "Invalid legal acceptance.";
    return {
      errorCode: "invalid_legal_acceptance",
      supportRef: ctx.supportRef,
      error: userMessageForRegistrationError("invalid_legal_acceptance", ctx.supportRef),
      message,
    };
  }

  markStage(ctx, "LEGAL_INPUT_VALIDATED", "ok");

  void formData.get("scrolledToBottom");

  const h = await headers();
  const rate = checkC3RegistrationRateLimit(getClientIpFromHeaders(h));
  if (!rate.allowed) {
    markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", "rate_limited");
    return {
      errorCode: "rate_limited",
      supportRef: ctx.supportRef,
      error: userMessageForRegistrationError("rate_limited", ctx.supportRef),
    };
  }

  try {
    await assertC3RegistrationOrigin();
  } catch (err) {
    markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", sanitizeDiagnosticErrorClass(err));
    return {
      errorCode: "registration_failed",
      supportRef: ctx.supportRef,
      error: userMessageForRegistrationError("registration_failed", ctx.supportRef),
    };
  }

  const sessionUser = await getSessionUser();
  const formEmail = String(formData.get("email") ?? "").trim();
  const email = sessionUser?.email ?? formEmail;
  if (!email) {
    markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", "missing_email");
    return {
      errorCode: "registration_failed",
      supportRef: ctx.supportRef,
      error: userMessageForRegistrationError("registration_failed", ctx.supportRef),
    };
  }

  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const isOAuthPath = Boolean(sessionUser && !formEmail);

  if (!sessionUser) {
    const passwordError = validatePasswordPair(password, passwordConfirm);
    if (passwordError) {
      markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", "invalid_password");
      return {
        errorCode: "registration_failed",
        supportRef: ctx.supportRef,
        error: passwordError,
      };
    }
  }

  let acceptances: Awaited<ReturnType<typeof resolveMandatoryAcceptancesForLocale>>;
  try {
    acceptances = await resolveMandatoryAcceptancesForLocale(locale);
    markStage(ctx, "LEGAL_DOCUMENTS_RESOLVED", "ok");
  } catch (err) {
    markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", sanitizeDiagnosticErrorClass(err));
    return {
      errorCode: "invalid_legal_acceptance",
      supportRef: ctx.supportRef,
      error: userMessageForRegistrationError("invalid_legal_acceptance", ctx.supportRef),
      message:
        err instanceof LegalAcceptanceValidationError
          ? err.message
          : "Could not validate legal documents.",
    };
  }

  const existingBySession = sessionUser
    ? await findPlatformAccountBySupabaseUserId(sessionUser.id)
    : null;
  if (existingBySession) {
    if (isPlatformAccountActive(existingBySession)) {
      return { redirectPath: routes.account.profile };
    }
    if (isBlockedPlatformAccountStatus(existingBySession.status)) {
      return {
        errorCode: "registration_failed",
        supportRef: ctx.supportRef,
        error: "This account cannot register. Contact support.",
      };
    }
    if (await hasMandatoryLegalAcceptanceComplete(existingBySession.id, locale)) {
      return { redirectPath: buildVerifyEmailRedirect(existingBySession.email, next) };
    }
  }

  const userAgentSummary = summarizeUserAgent(h.get("user-agent"));
  const registrationCorrelationId = ctx.correlationId;

  let supabaseUserId = sessionUser?.id;
  let createdAuthUser = false;
  let account = existingBySession;

  try {
    await assertC2DatabaseEnvironmentSafe();
    markStage(ctx, "APPLICATION_TRANSACTION_STARTED", "ok");

    if (!sessionUser) {
      const policy = await classifyRegistrationEmail(email);
      if (policy.kind === "generic_response") {
        markStage(ctx, "LEGAL_INPUT_REJECTED", "failed", "generic_response");
        return {
          errorCode: "registration_already_pending",
          supportRef: ctx.supportRef,
          message: C3_GENERIC_REGISTRATION_MESSAGE,
        };
      }

      if (policy.kind === "continue_pending") {
        supabaseUserId = policy.supabaseUserId;
        account = await findPlatformAccountBySupabaseUserId(policy.supabaseUserId);
      } else {
        markStage(ctx, "SUPABASE_USER_PROVISION_STARTED", "ok");
        const provisioned = await provisionUnconfirmedAuthUser({ email, password });
        if (!provisioned.ok) {
          markStage(ctx, "SUPABASE_USER_PROVISION_FAILED", "failed", provisioned.reason);
          return {
            errorCode: "registration_already_pending",
            supportRef: ctx.supportRef,
            message: C3_GENERIC_REGISTRATION_MESSAGE,
          };
        }
        supabaseUserId = provisioned.userId;
        createdAuthUser = provisioned.created;
        markStage(ctx, "SUPABASE_USER_PROVISION_COMPLETED", "ok");
      }
    }

    if (!supabaseUserId) {
      markStage(ctx, "APPLICATION_TRANSACTION_FAILED", "failed", "missing_supabase_user");
      return {
        errorCode: "registration_failed",
        supportRef: ctx.supportRef,
        error: userMessageForRegistrationError("registration_failed", ctx.supportRef),
      };
    }

    const existingByEmailBefore = await findPlatformAccountByEmailNormalized(email);

    account =
      account ??
      (await ensurePendingPlatformAccountForRegistration({
        supabaseUserId,
        email,
      }));

    markStage(ctx, "PLATFORM_ACCOUNT_CREATED", "ok");

    await recordLegalAcceptances({
      platformAccountId: account.id,
      locale,
      acceptances,
      registrationCorrelationId,
      userAgentSummary,
    });

    markStage(ctx, "LEGAL_ACCEPTANCE_RECORDED", "ok");

    await recordInitialMarketingConsent({
      platformAccountId: account.id,
      granted: acks.marketingOptIn,
      registrationCorrelationId,
    });

    const hadPlatformAccount =
      Boolean(existingBySession) || Boolean(existingByEmailBefore);
    if (!hadPlatformAccount) {
      await recordPlatformAccountAudit(account.id, "registration_started", {
        source: isOAuthPath ? "oauth" : "email_password",
        registrationCorrelationId,
        supabaseAuthUserProvisioned: !sessionUser,
      });
      await recordPlatformAccountAudit(account.id, "legal_acceptance_recorded", {
        registrationCorrelationId,
        locale,
      });
    }

    const issued = await issueEmailVerificationCode({
      platformAccountId: account.id,
      email: account.email,
    });

    if (!issued.ok) {
      if (issued.reason === "delivery_failed") {
        markStage(ctx, "OTP_DELIVERY_FAILED", "failed", issued.reason);
        return {
          errorCode: "email_delivery_failed",
          supportRef: ctx.supportRef,
          error: userMessageForRegistrationError("email_delivery_failed", ctx.supportRef),
        };
      }
    } else {
      markStage(ctx, "OTP_CHALLENGE_CREATED", "ok");
      markStage(ctx, "OTP_DELIVERY_ACCEPTED", "ok");
    }
  } catch (err) {
    if (isNextRedirectError(err)) throw err;

    if (supabaseUserId && createdAuthUser) {
      await compensateOrphanAuthUser({
        supabaseUserId,
        createdInThisOperation: true,
      });
    }

    markStage(ctx, "APPLICATION_TRANSACTION_FAILED", "failed", sanitizeDiagnosticErrorClass(err));

    const code = classifyRegistrationFailure(
      err instanceof Error ? err.message : "registration_failed"
    );
    return {
      errorCode: code,
      supportRef: ctx.supportRef,
      error: userMessageForRegistrationError(code, ctx.supportRef),
      message:
        err instanceof LegalAcceptanceValidationError
          ? err.message
          : undefined,
    };
  }

  markStage(ctx, "REGISTRATION_REDIRECT_ISSUED", "ok");
  return { redirectPath: buildVerifyEmailRedirect(account!.email, next) };
}

/** Plain form action — server redirect; progressive enhancement safe. */
export async function submitRegistrationLegalFormAction(formData: FormData): Promise<void> {
  const correlationId = createRegistrationCorrelationId();
  const supportRef = formatSupportReference(correlationId);
  const ctx: RegistrationContext = {
    correlationId,
    supportRef,
    startedAt: Date.now(),
  };

  let result: LegalActionState;
  try {
    result = await completeRegistrationWithLegalAcceptanceInternal(formData, ctx);
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    const code = classifyRegistrationFailure(
      err instanceof Error ? err.message : "registration_failed"
    );
    await buildLegalFailureRedirect(
      formData,
      code,
      supportRef,
      userMessageForRegistrationError(code, supportRef)
    );
  }

  if (result?.redirectPath) {
    await redirectToAppPath(result.redirectPath);
  }

  const email = String(formData.get("email") ?? "").trim();
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (next) params.set("next", next);

  const code =
    result?.errorCode ??
    (result?.message ? "registration_already_pending" : "registration_failed");
  params.set("error", code);
  params.set("ref", result?.supportRef ?? supportRef);

  const displayMessage =
    result?.error ??
    (result?.message
      ? userMessageForRegistrationError("registration_already_pending", result.supportRef ?? supportRef)
      : userMessageForRegistrationError("registration_failed", result?.supportRef ?? supportRef));

  params.set("message", displayMessage);
  markStage(ctx, "REGISTRATION_REDIRECT_FAILED", "failed", code);
  await redirectToAppPath(`${routes.account.registerLegal}?${params.toString()}`);
}

/** @deprecated use submitRegistrationLegalFormAction — kept for tests referencing export name */
export async function completeRegistrationWithLegalAcceptance(
  _prev: LegalActionState,
  formData: FormData
): Promise<LegalActionState> {
  const correlationId = createRegistrationCorrelationId();
  const supportRef = formatSupportReference(correlationId);
  return completeRegistrationWithLegalAcceptanceInternal(formData, {
    correlationId,
    supportRef,
    startedAt: Date.now(),
  });
}

export async function updateMarketingConsent(
  _prev: LegalActionState,
  formData: FormData
): Promise<LegalActionState> {
  if (!isAccountRegistrationEnabled()) {
    const ref = formatSupportReference(createRegistrationCorrelationId());
    return {
      errorCode: "registration_disabled",
      supportRef: ref,
      error: userMessageForRegistrationError("registration_disabled", ref),
    };
  }

  const granted = formData.get("granted") === "true";
  const user = await requireActivePlatformAccount();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { error: "No platform account found." };
  }

  await setMarketingEmailConsent({
    platformAccountId: account.id,
    granted,
    source: "account_settings",
  });

  revalidatePath(routes.account.legal);
  return { message: granted ? "Marketing emails enabled." : "Marketing emails disabled." };
}

export async function recordReacceptance(
  _prev: LegalActionState,
  formData: FormData
): Promise<LegalActionState> {
  if (!isAccountRegistrationEnabled()) {
    const ref = formatSupportReference(createRegistrationCorrelationId());
    return {
      errorCode: "registration_disabled",
      supportRef: ref,
      error: userMessageForRegistrationError("registration_disabled", ref),
    };
  }

  const versionId = String(formData.get("versionId") ?? "");
  if (!versionId) {
    return { error: "Missing document version." };
  }

  const user = await requireActivePlatformAccount();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return { error: "No platform account found." };
  }
  const locale = await resolveRegistrationLocale();
  const h = await headers();
  const userAgentSummary = summarizeUserAgent(h.get("user-agent"));

  try {
    await recordReacceptanceForVersion({
      platformAccountId: account.id,
      versionId,
      locale,
      userAgentSummary,
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not record acceptance.",
    };
  }

  revalidatePath(routes.account.legal);
  return { message: "Acceptance recorded." };
}

/** Server helper for legal registration page — current mandatory docs. */
export async function loadMandatoryLegalDocumentsForRegistration(locale?: string) {
  const resolvedLocale = locale ?? (await resolveRegistrationLocale());
  const versions = await getCurrentPublishedMandatoryVersions({ locale: resolvedLocale });
  return versions.map((v) => ({
    id: v.id,
    documentType: v.legalDocument.documentType,
    title: v.title,
    versionNumber: v.versionNumber,
    locale: v.locale,
    effectiveAt: v.effectiveAt,
    publishedAt: v.publishedAt,
    contentBody: v.contentBody,
    contentHash: hashLegalDocumentContent(v.contentBody),
    mandatoryClassification: v.mandatoryClassification,
  }));
}

export { isC3RegistrationDiagnosticsEnabled };
