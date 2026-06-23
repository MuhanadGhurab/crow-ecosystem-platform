import type { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../../src/lib/legal/legal-acceptance.service";
import { resolveDesignatedPlatformOwnerByEmail } from "../../src/lib/platform/platform-owner-bootstrap.resolution";
import { procrowOwnerAdminTargetFingerprint } from "../../src/lib/platform/procrow-owner-admin-transfer.constants";
import { findActivePlatformAdminAssignment } from "../../src/lib/platform/procrow-owner-admin-transfer.service";
import {
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveRequestOwnerPlatformAccount,
  RETAINED_REQUESTER_FINGERPRINT,
} from "./ftgp-first-client-resolution";
import { findAuthUsersByNormalizedEmail } from "./platform-owner-bootstrap-deps";
import { resolveProofRequesterPlatformAccount } from "./c3-proof-requester-resolution";
import {
  designationArtifactIntegrity,
  type ProcrowOwnerAdminOperatorConfig,
} from "./procrow-owner-admin-operator";

export type ProcrowOwnerAdminDesignationResult = {
  ok: boolean;
  refusal: string | null;
  targetPlatformAccountId: string | null;
  targetFingerprint: string | null;
  provider: string;
  accountStatus: string | null;
  legalCurrent: boolean;
  emailVerified: boolean;
  googleProviderPresent: boolean;
  currentAdminMatch: boolean;
  candidate07Collision: boolean;
  retainedRequesterCollision: boolean;
  implementerCollision: boolean;
  currentAdminFingerprint: string | null;
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

export async function resolveProcrowOwnerAdminDesignation(
  prisma: PrismaClient,
  operator: ProcrowOwnerAdminOperatorConfig
): Promise<ProcrowOwnerAdminDesignationResult> {
  const designationTimestamp = new Date().toISOString();

  if (!operator.emailNormalized) {
    return {
      ok: false,
      refusal: "missing_designated_email",
      targetPlatformAccountId: null,
      targetFingerprint: null,
      provider: operator.provider,
      accountStatus: null,
      legalCurrent: false,
      emailVerified: false,
      googleProviderPresent: false,
      currentAdminMatch: false,
      candidate07Collision: false,
      retainedRequesterCollision: false,
      implementerCollision: false,
      currentAdminFingerprint: null,
      designationTimestamp,
      integrityHash: designationArtifactIntegrity({ refusal: "missing_designated_email" }),
    };
  }

  if (operator.provider !== "google") {
    return {
      ok: false,
      refusal: "provider_not_google",
      targetPlatformAccountId: null,
      targetFingerprint: null,
      provider: operator.provider,
      accountStatus: null,
      legalCurrent: false,
      emailVerified: false,
      googleProviderPresent: false,
      currentAdminMatch: false,
      candidate07Collision: false,
      retainedRequesterCollision: false,
      implementerCollision: false,
      currentAdminFingerprint: null,
      designationTimestamp,
      integrityHash: designationArtifactIntegrity({ refusal: "provider_not_google" }),
    };
  }

  if (operator.transferAuthorized) {
    return {
      ok: false,
      refusal: "transfer_authorized_during_designation",
      targetPlatformAccountId: null,
      targetFingerprint: null,
      provider: operator.provider,
      accountStatus: null,
      legalCurrent: false,
      emailVerified: false,
      googleProviderPresent: false,
      currentAdminMatch: false,
      candidate07Collision: false,
      retainedRequesterCollision: false,
      implementerCollision: false,
      currentAdminFingerprint: null,
      designationTimestamp,
      integrityHash: designationArtifactIntegrity({
        refusal: "transfer_authorized_during_designation",
      }),
    };
  }

  const resolution = await resolveDesignatedPlatformOwnerByEmail(operator.emailNormalized, {
    findAuthUsersByEmail: findAuthUsersByNormalizedEmail,
    // Transfer designation: an existing sole PLATFORM_ADMIN is expected; do not apply bootstrap single-owner refusal.
    countExistingPlatformOwners: async () => 0,
  });

  if (!resolution.allowed || !resolution.platformAccountId) {
    return {
      ok: false,
      refusal: resolution.refusal ?? "designation_failed",
      targetPlatformAccountId: resolution.platformAccountId,
      targetFingerprint: resolution.platformAccountId
        ? procrowOwnerAdminTargetFingerprint(resolution.platformAccountId)
        : null,
      provider: operator.provider,
      accountStatus: null,
      legalCurrent: resolution.checks.mandatoryLegalComplete,
      emailVerified: resolution.checks.emailVerified,
      googleProviderPresent: false,
      currentAdminMatch: false,
      candidate07Collision: false,
      retainedRequesterCollision: false,
      implementerCollision: false,
      currentAdminFingerprint: null,
      designationTimestamp,
      integrityHash: designationArtifactIntegrity({
        refusal: resolution.refusal,
      }),
    };
  }

  const accountId = resolution.platformAccountId;
  const targetFingerprint = procrowOwnerAdminTargetFingerprint(accountId);
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

  const currentAdmin = await findActivePlatformAdminAssignment();
  const currentAdminFingerprint = currentAdmin?.fingerprint ?? null;
  const currentAdminMatch = currentAdmin?.platformAccountId === accountId;

  const candidate07RequestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  let candidate07Collision = false;
  if (candidate07RequestId) {
    const owner = await resolveRequestOwnerPlatformAccount(prisma, candidate07RequestId);
    if (
      owner &&
      owner.id === accountId &&
      ownerFingerprint(owner.id) === CANDIDATE_07_OWNER_FINGERPRINT
    ) {
      candidate07Collision = true;
    }
  }

  const retained = await resolveProofRequesterPlatformAccount(prisma);
  const retainedRequesterCollision = Boolean(
    retained &&
      retained.id === accountId &&
      ownerFingerprint(retained.id) === RETAINED_REQUESTER_FINGERPRINT
  );

  const implementer = await prisma.platformInternalRoleAssignment.findFirst({
    where: { role: "IMPLEMENTER", status: "ACTIVE" },
    select: { platformAccountId: true },
  });
  const implementerCollision = Boolean(
    implementer && implementer.platformAccountId === accountId
  );

  let refusal: string | null = null;
  if (!googleProviderPresent) refusal = "google_provider_missing";
  else if (!legalCurrent) refusal = "legal_incomplete";
  else if (candidate07Collision) refusal = "candidate_07_collision";
  else if (retainedRequesterCollision) refusal = "retained_requester_collision";
  // IMPLEMENTER on the same account is reported but not blocking: transfer adds PLATFORM_ADMIN only.

  const ok = !refusal && resolution.allowed;

  const payload = {
    targetFingerprint,
    provider: operator.provider,
    accountStatus: account?.status ?? null,
    legalCurrent,
    emailVerified: Boolean(account?.emailVerifiedAt),
    googleProviderPresent,
    currentAdminMatch,
    candidate07Collision,
    retainedRequesterCollision,
    implementerCollision,
    currentAdminFingerprint,
    designationTimestamp,
  };

  return {
    ok,
    refusal,
    targetPlatformAccountId: accountId,
    targetFingerprint,
    provider: operator.provider,
    accountStatus: account?.status ?? null,
    legalCurrent,
    emailVerified: Boolean(account?.emailVerifiedAt),
    googleProviderPresent,
    currentAdminMatch,
    candidate07Collision,
    retainedRequesterCollision,
    implementerCollision,
    currentAdminFingerprint,
    designationTimestamp,
    integrityHash: designationArtifactIntegrity(payload),
  };
}
