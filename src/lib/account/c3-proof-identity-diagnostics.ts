import "server-only";

import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";
import { EMAIL_VERIFICATION_SOURCES } from "@/lib/account/verification-sources";
import { computeC3ProofIdentityFingerprint } from "@/lib/account/c3-proof-identity-fingerprint";
import { getCurrentPublishedMandatoryVersions } from "@/lib/legal/legal-document.service";
import { createHash } from "node:crypto";

export function isC3ProofDiagnosticsEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" &&
    process.env.C3_PROOF_DIAGNOSTICS === "true"
  );
}

export type C3ProofResolutionState =
  | "legacy_auth_only"
  | "pending_legal"
  | "pending_verification"
  | "active"
  | "blocked"
  | "conflict"
  | "unknown";

export type C3ProofIdentitySnapshot = {
  identityFingerprint: string;
  deploymentEnvironment: "preview" | "production" | "development";
  deploymentReference: string | null;
  trustedProvider: "google" | "none" | "other";
  trustedEmailVerified: boolean;
  platformAccountCount: number;
  platformAccountStatus: string | null;
  onboardingGeneration: number | null;
  currentMandatoryLegalAcceptanceCount: number;
  authoritativeCrowRolePresent: boolean;
  tenantMembershipCount: number;
  resolutionState: C3ProofResolutionState;
};

function resolveDeploymentEnvironment(): C3ProofIdentitySnapshot["deploymentEnvironment"] {
  const vercelEnv = process.env.VERCEL_ENV?.trim();
  if (vercelEnv === "preview") return "preview";
  if (vercelEnv === "production") return "production";
  return "development";
}

function resolveSafeDeploymentReference(): string | null {
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID?.trim();
  if (!deploymentId) return null;
  return createHash("sha256")
    .update(`c3-deployment:${deploymentId}`)
    .digest("hex")
    .slice(0, 16);
}

function resolveTrustedProvider(user: User): C3ProofIdentitySnapshot["trustedProvider"] {
  const identities = user.identities ?? [];
  if (identities.some((identity) => identity.provider === "google")) {
    return "google";
  }
  if (identities.length === 0) return "none";
  return "other";
}

async function countCurrentMandatoryLegalAcceptances(
  platformAccountId: string,
  locale: string
): Promise<number> {
  const mandatory = await getCurrentPublishedMandatoryVersions({ locale });
  if (mandatory.length === 0) return 0;

  const accepted = await prisma.accountLegalAcceptance.findMany({
    where: { platformAccountId },
    select: { legalDocumentVersionId: true },
  });
  const acceptedIds = new Set(accepted.map((row) => row.legalDocumentVersionId));
  return mandatory.filter((version) => acceptedIds.has(version.id)).length;
}

function resolveResolutionState(input: {
  platformAccountCount: number;
  status: string | null;
  legalCount: number;
  mandatoryTotal: number;
  trustedEmailVerified: boolean;
}): C3ProofResolutionState {
  if (input.platformAccountCount > 1) return "conflict";
  if (input.platformAccountCount === 0) return "legacy_auth_only";
  if (input.status === "BLOCKED") return "blocked";
  if (
    input.status === "ACTIVE" &&
    input.legalCount >= input.mandatoryTotal &&
    input.mandatoryTotal > 0 &&
    input.trustedEmailVerified
  ) {
    return "active";
  }
  if (input.legalCount < input.mandatoryTotal) return "pending_legal";
  if (
    input.status === "PENDING_EMAIL_VERIFICATION" ||
    input.status === "PENDING_PHONE_VERIFICATION"
  ) {
    return "pending_verification";
  }
  return "unknown";
}

export async function buildC3ProofIdentitySnapshot(
  user: User
): Promise<C3ProofIdentitySnapshot> {
  const locale = process.env.CROW_REGISTRATION_LOCALE?.trim() || "en-US";
  const accounts = await prisma.platformAccount.findMany({
    where: { supabaseUserId: user.id },
    select: {
      status: true,
      onboardingGeneration: true,
      emailVerifiedAt: true,
      emailVerificationSource: true,
      id: true,
    },
  });

  const googleProviders = await prisma.platformProviderIdentity.count({
    where: {
      provider: "google",
      platformAccount: { supabaseUserId: user.id },
    },
  });

  const tenantMembershipCount = await prisma.tenantMembership.count({
    where: { supabaseUserId: user.id },
  });

  const account = accounts.length === 1 ? accounts[0]! : null;
  const mandatory = await getCurrentPublishedMandatoryVersions({ locale });
  const legalCount = account
    ? await countCurrentMandatoryLegalAcceptances(account.id, locale)
    : 0;

  const trustedProvider =
    resolveTrustedProvider(user) === "google" || googleProviders > 0
      ? "google"
      : resolveTrustedProvider(user);

  const trustedEmailVerified = Boolean(
    account?.emailVerifiedAt &&
      account.emailVerificationSource === EMAIL_VERIFICATION_SOURCES.GOOGLE_OAUTH_VERIFIED
  );

  const crowRole =
    typeof user.app_metadata?.crow_role === "string"
      ? user.app_metadata.crow_role.trim()
      : "";

  return {
    identityFingerprint: computeC3ProofIdentityFingerprint(user.id),
    deploymentEnvironment: resolveDeploymentEnvironment(),
    deploymentReference: resolveSafeDeploymentReference(),
    trustedProvider,
    trustedEmailVerified,
    platformAccountCount: accounts.length,
    platformAccountStatus: account?.status ?? null,
    onboardingGeneration: account?.onboardingGeneration ?? null,
    currentMandatoryLegalAcceptanceCount: legalCount,
    authoritativeCrowRolePresent: crowRole.length > 0,
    tenantMembershipCount,
    resolutionState: resolveResolutionState({
      platformAccountCount: accounts.length,
      status: account?.status ?? null,
      legalCount,
      mandatoryTotal: mandatory.length,
      trustedEmailVerified,
    }),
  };
}

export function formatProofAccountStateLabel(
  snapshot: Pick<C3ProofIdentitySnapshot, "resolutionState" | "platformAccountStatus">
): string {
  switch (snapshot.resolutionState) {
    case "active":
      return "Active";
    case "pending_legal":
      return "Pending legal";
    case "pending_verification":
      return "Pending verification";
    case "legacy_auth_only":
      return "Pending legal";
    case "conflict":
      return "Conflict";
    case "blocked":
      return "Blocked";
    default:
      return snapshot.platformAccountStatus ?? "Unknown";
  }
}
