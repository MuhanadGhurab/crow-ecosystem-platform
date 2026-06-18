"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { LegalDocumentType } from "@prisma/client";
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
  findPlatformAccountByEmailNormalized,
  findPlatformAccountBySupabaseUserId,
  isBlockedPlatformAccountStatus,
  isPlatformAccountActive,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";
import { getSessionUser, requireActivePlatformAccount, requireAuth } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import {
  getCurrentPublishedMandatoryVersions,
  getPublishedVersionById,
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
  | { error?: string; message?: string }
  | undefined;

function c3DisabledState(): LegalActionState {
  return { error: "Account registration is not enabled." };
}

function isNextRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
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

async function buildAcceptancesFromForm(
  formData: FormData,
  locale: string
): Promise<{ documentType: LegalDocumentType; versionId: string; contentHash: string }[]> {
  const mandatoryRaw = formData.get("mandatoryVersions");
  if (typeof mandatoryRaw !== "string") {
    throw new LegalAcceptanceValidationError("Missing legal document versions.");
  }

  let entries: { documentType: LegalDocumentType; versionId: string }[];
  try {
    entries = JSON.parse(mandatoryRaw) as { documentType: LegalDocumentType; versionId: string }[];
  } catch {
    throw new LegalAcceptanceValidationError("Invalid legal document payload.");
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new LegalAcceptanceValidationError("Missing legal document versions.");
  }

  const built: { documentType: LegalDocumentType; versionId: string; contentHash: string }[] =
    [];
  for (const entry of entries) {
    const version = await getPublishedVersionById(entry.versionId);
    if (!version || version.legalDocument.documentType !== entry.documentType) {
      throw new LegalAcceptanceValidationError("Invalid legal document version.");
    }
    if (version.locale !== locale) {
      throw new LegalAcceptanceValidationError("Legal document locale mismatch.");
    }
    built.push({
      documentType: entry.documentType,
      versionId: entry.versionId,
      contentHash: hashLegalDocumentContent(version.contentBody),
    });
  }
  return built;
}

/** Transactional registration: server-admin Auth user + platform account + legal + Crow OTP. */
export async function completeRegistrationWithLegalAcceptance(
  _prev: LegalActionState,
  formData: FormData
): Promise<LegalActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
  }

  const termsAccepted = formData.get("termsAccepted") === "on";
  const privacyAcknowledged = formData.get("privacyAcknowledged") === "on";
  const aupAccepted = formData.get("aupAccepted") === "on";
  const marketingOptIn = formData.get("marketingOptIn") === "on";
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));

  const locale = String(formData.get("locale") ?? (await resolveRegistrationLocale()));
  const mandatoryTypes = (
    await getCurrentPublishedMandatoryVersions({ locale })
  ).map((v) => v.legalDocument.documentType);

  if (mandatoryTypes.includes("TERMS_OF_SERVICE") && !termsAccepted) {
    return { error: "You must accept the Terms of Service." };
  }
  if (mandatoryTypes.includes("PRIVACY_NOTICE") && !privacyAcknowledged) {
    return { error: "You must acknowledge the Privacy Notice." };
  }
  if (mandatoryTypes.includes("ACCEPTABLE_USE_POLICY") && !aupAccepted) {
    return { error: "You must accept the Acceptable Use Policy." };
  }

  void formData.get("scrolledToBottom");

  const h = await headers();
  const rate = checkC3RegistrationRateLimit(getClientIpFromHeaders(h));
  if (!rate.allowed) {
    return { error: "Too many registration attempts. Try again later." };
  }

  try {
    await assertC3RegistrationOrigin();
  } catch {
    return { error: "Registration could not be completed." };
  }

  const sessionUser = await getSessionUser();
  const formEmail = String(formData.get("email") ?? "").trim();
  const email = sessionUser?.email ?? formEmail;
  if (!email) {
    return { error: "Account email is required." };
  }

  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const isOAuthPath = Boolean(sessionUser && !formEmail);

  if (!sessionUser) {
    const passwordError = validatePasswordPair(password, passwordConfirm);
    if (passwordError) return { error: passwordError };
  }

  let acceptances: { documentType: LegalDocumentType; versionId: string; contentHash: string }[];
  try {
    acceptances = await buildAcceptancesFromForm(formData, locale);
  } catch (err) {
    return {
      error:
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
      redirect(routes.account.profile);
    }
    if (isBlockedPlatformAccountStatus(existingBySession.status)) {
      return { error: "This account cannot register. Contact support." };
    }
    if (await hasMandatoryLegalAcceptanceComplete(existingBySession.id, locale)) {
      redirect(buildVerifyEmailRedirect(existingBySession.email, next));
    }
  }

  const userAgentSummary = summarizeUserAgent(h.get("user-agent"));
  const registrationCorrelationId = randomUUID();

  let supabaseUserId = sessionUser?.id;
  let createdAuthUser = false;
  let account = existingBySession;

  try {
    await assertC2DatabaseEnvironmentSafe();

    if (!sessionUser) {
      const policy = await classifyRegistrationEmail(email);
      if (policy.kind === "generic_response") {
        return { message: C3_GENERIC_REGISTRATION_MESSAGE };
      }

      if (policy.kind === "continue_pending") {
        supabaseUserId = policy.supabaseUserId;
        account = await findPlatformAccountBySupabaseUserId(policy.supabaseUserId);
      } else {
        const provisioned = await provisionUnconfirmedAuthUser({ email, password });
        if (!provisioned.ok) {
          return { message: C3_GENERIC_REGISTRATION_MESSAGE };
        }
        supabaseUserId = provisioned.userId;
        createdAuthUser = provisioned.created;
      }
    }

    if (!supabaseUserId) {
      return { error: "Registration could not be completed." };
    }

    const existingByEmailBefore = await findPlatformAccountByEmailNormalized(email);

    account =
      account ??
      (await ensurePendingPlatformAccountForRegistration({
        supabaseUserId,
        email,
      }));

    await recordLegalAcceptances({
      platformAccountId: account.id,
      locale,
      acceptances,
      registrationCorrelationId,
      userAgentSummary,
    });

    await recordInitialMarketingConsent({
      platformAccountId: account.id,
      granted: marketingOptIn,
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

    if (!issued.ok && issued.reason === "delivery_failed") {
      return {
        error:
          "We could not deliver a verification code right now. Try again in a few minutes or contact support.",
      };
    }
  } catch (err) {
    if (isNextRedirectError(err)) throw err;

    if (supabaseUserId && createdAuthUser) {
      await compensateOrphanAuthUser({
        supabaseUserId,
        createdInThisOperation: true,
      });
    }

    return {
      error:
        err instanceof LegalAcceptanceValidationError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Registration could not be completed.",
    };
  }

  redirect(buildVerifyEmailRedirect(account!.email, next));
}

export async function updateMarketingConsent(
  _prev: LegalActionState,
  formData: FormData
): Promise<LegalActionState> {
  if (!isAccountRegistrationEnabled()) {
    return c3DisabledState();
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
    return c3DisabledState();
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
