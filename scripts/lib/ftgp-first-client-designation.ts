import type { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../../src/lib/legal/legal-acceptance.service";
import { findActivePlatformAdminAssignment } from "../../src/lib/platform/procrow-owner-admin-transfer.service";
import { resolveDesignatedPlatformOwnerByEmail } from "../../src/lib/platform/platform-owner-bootstrap.resolution";
import { findAuthUsersByNormalizedEmail } from "./platform-owner-bootstrap-deps";
import {
  CANDIDATE_07_FINGERPRINT,
  ownerFingerprint,
  resolveRequestOwnerPlatformAccount,
} from "./ftgp-first-client-resolution";
import {
  designationArtifactIntegrity,
  operatorEmailFingerprint,
  type FtgpFirstClientOperatorConfig,
} from "./ftgp-first-client-operator";

export type FtgpFirstClientDesignationClassification =
  | "READY"
  | "LEGAL_REQUIRED"
  | "NOT_ENROLLED"
  | "BLOCKED";

export type FtgpFirstClientDesignationResult = {
  ok: boolean;
  classification: FtgpFirstClientDesignationClassification;
  refusal: string | null;
  targetPlatformAccountId: string | null;
  targetFingerprint: string | null;
  emailFingerprint: string | null;
  provider: string;
  accountStatus: string | null;
  legalCurrent: boolean;
  emailVerified: boolean;
  googleProviderPresent: boolean;
  procrowAdminCollision: boolean;
  implementerCollision: boolean;
  currentOwnerFingerprint: string | null;
  designationTimestamp: string;
  integrityHash: string;
};

function hasVerifiedGoogleProvider(
  identities: { provider: string; emailVerified: boolean }[]
): boolean {
  return identities.some(
    (i) => i.provider.toLowerCase() === "google" && i.emailVerified
  );
}

export async function resolveFtgpFirstClientDesignation(
  prisma: PrismaClient,
  operator: FtgpFirstClientOperatorConfig
): Promise<FtgpFirstClientDesignationResult> {
  const designationTimestamp = new Date().toISOString();

  if (!operator.emailNormalized) {
    return blockedResult(operator, "missing_designated_email", designationTimestamp);
  }

  if (operator.provider !== "google") {
    return blockedResult(operator, "provider_not_google", designationTimestamp);
  }

  if (operator.requestFingerprint !== CANDIDATE_07_FINGERPRINT) {
    return blockedResult(operator, "request_fingerprint_mismatch", designationTimestamp);
  }

  if (operator.transferAuthorized) {
    return blockedResult(
      operator,
      "transfer_authorized_during_designation",
      designationTimestamp
    );
  }

  const emailFingerprint = operatorEmailFingerprint(operator.emailNormalized);

  const resolution = await resolveDesignatedPlatformOwnerByEmail(operator.emailNormalized, {
    findAuthUsersByEmail: findAuthUsersByNormalizedEmail,
    countExistingPlatformOwners: async () => 0,
  });

  if (!resolution.allowed || !resolution.platformAccountId) {
    const classification: FtgpFirstClientDesignationClassification =
      resolution.refusal === "account_not_found"
        ? "NOT_ENROLLED"
        : resolution.refusal === "legal_incomplete"
          ? "LEGAL_REQUIRED"
          : "BLOCKED";
    return {
      ok: false,
      classification,
      refusal: resolution.refusal ?? "designation_failed",
      targetPlatformAccountId: resolution.platformAccountId,
      targetFingerprint: resolution.platformAccountId
        ? ownerFingerprint(resolution.platformAccountId)
        : null,
      emailFingerprint,
      provider: operator.provider,
      accountStatus: null,
      legalCurrent: resolution.checks.mandatoryLegalComplete,
      emailVerified: resolution.checks.emailVerified,
      googleProviderPresent: false,
      procrowAdminCollision: false,
      implementerCollision: false,
      currentOwnerFingerprint: null,
      designationTimestamp,
      integrityHash: designationArtifactIntegrity({
        refusal: resolution.refusal,
        emailFingerprint,
      }),
    };
  }

  const accountId = resolution.platformAccountId;
  const targetFingerprint = ownerFingerprint(accountId);
  const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";

  const account = await prisma.platformAccount.findUnique({
    where: { id: accountId },
    select: {
      id: true,
      status: true,
      emailVerifiedAt: true,
      providerIdentities: { select: { provider: true, emailVerified: true } },
    },
  });

  const legalCurrent = account
    ? await hasMandatoryLegalAcceptanceComplete(account.id, locale)
    : false;
  const googleProviderPresent = account
    ? hasVerifiedGoogleProvider(account.providerIdentities)
    : false;

  const procrowAdmin = await findActivePlatformAdminAssignment();
  const procrowAdminCollision = Boolean(
    procrowAdmin && procrowAdmin.platformAccountId === accountId
  );

  const implementer = await prisma.platformInternalRoleAssignment.findFirst({
    where: { role: "IMPLEMENTER", status: "ACTIVE" },
    select: { platformAccountId: true },
  });
  const implementerCollision = Boolean(
    implementer && implementer.platformAccountId === accountId
  );

  const internalRoleCount = await prisma.platformInternalRoleAssignment.count({
    where: { platformAccountId: accountId, status: "ACTIVE" },
  });

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  let currentOwnerFingerprint: string | null = null;
  if (requestId) {
    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    currentOwnerFingerprint = owner ? ownerFingerprint(owner.id) : null;
  }

  let refusal: string | null = null;
  let classification: FtgpFirstClientDesignationClassification = "READY";

  if (!googleProviderPresent) {
    refusal = "google_provider_missing";
    classification = "BLOCKED";
  } else if (!legalCurrent) {
    refusal = "legal_incomplete";
    classification = "LEGAL_REQUIRED";
  } else if (procrowAdminCollision) {
    refusal = "procrow_admin_collision";
    classification = "BLOCKED";
  } else if (implementerCollision || internalRoleCount > 0) {
    refusal = "internal_role_collision";
    classification = "BLOCKED";
  } else if (account?.status !== "ACTIVE") {
    refusal = "account_not_active";
    classification = "BLOCKED";
  }

  const ok = classification === "READY" && !refusal;

  const payload = {
    requestFingerprint: operator.requestFingerprint,
    targetFingerprint,
    emailFingerprint,
    provider: operator.provider,
    accountStatus: account?.status ?? null,
    legalCurrent,
    emailVerified: Boolean(account?.emailVerifiedAt),
    googleProviderPresent,
    procrowAdminCollision,
    implementerCollision,
    currentOwnerFingerprint,
    designationTimestamp,
  };

  return {
    ok,
    classification,
    refusal,
    targetPlatformAccountId: accountId,
    targetFingerprint,
    emailFingerprint,
    provider: operator.provider,
    accountStatus: account?.status ?? null,
    legalCurrent,
    emailVerified: Boolean(account?.emailVerifiedAt),
    googleProviderPresent,
    procrowAdminCollision,
    implementerCollision,
    currentOwnerFingerprint,
    designationTimestamp,
    integrityHash: designationArtifactIntegrity(payload),
  };
}

function blockedResult(
  operator: FtgpFirstClientOperatorConfig,
  refusal: string,
  designationTimestamp: string
): FtgpFirstClientDesignationResult {
  return {
    ok: false,
    classification: "BLOCKED",
    refusal,
    targetPlatformAccountId: null,
    targetFingerprint: null,
    emailFingerprint: operator.emailNormalized
      ? operatorEmailFingerprint(operator.emailNormalized)
      : null,
    provider: operator.provider,
    accountStatus: null,
    legalCurrent: false,
    emailVerified: false,
    googleProviderPresent: false,
    procrowAdminCollision: false,
    implementerCollision: false,
    currentOwnerFingerprint: null,
    designationTimestamp,
    integrityHash: designationArtifactIntegrity({ refusal }),
  };
}
