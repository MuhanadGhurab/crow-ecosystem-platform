import { createHash } from "node:crypto";

import type { User } from "@supabase/supabase-js";

import { normalizeEmail } from "@/lib/account/email-normalize";
import {
  findPlatformAccountById,
  isPlatformAccountActive,
  type PlatformAccountRecord,
} from "@/lib/account/platform-account.service";
import { isPhoneVerificationRequiredForAccount } from "@/lib/account/phone-verification-policy";
import {
  CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION,
  getRequiredOnboardingGeneration,
} from "@/lib/account/onboarding-generation";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";
import { prisma } from "@/lib/db";
import { detectForbiddenPlatformOwnerCredentials as detectForbiddenCredentials } from "@/lib/platform/platform-owner-bootstrap.guards";

export type PlatformOwnerBootstrapRefusal =
  | "execute_disabled"
  | "account_not_found"
  | "account_not_active"
  | "account_blocked"
  | "generation_not_current"
  | "email_not_verified"
  | "phone_not_verified"
  | "legal_incomplete"
  | "existing_platform_owner"
  | "missing_account_reference"
  | "missing_designated_email"
  | "ambiguous_auth_identity"
  | "ambiguous_platform_account"
  | "auth_platform_identity_mismatch"
  | "provider_identity_collision"
  | "tenant_membership_collision"
  | "password_supplied_forbidden"
  | "vercel_runtime_forbidden"
  | "execute_phrase_invalid"
  | "database_fingerprint_mismatch"
  | "plan_digest_missing"
  | "designation_not_confirmed";

export type PlatformOwnerBootstrapChecks = {
  singleAuthIdentity: boolean;
  singlePlatformAccount: boolean;
  authPlatformLinked: boolean;
  active: boolean;
  generationCurrent: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  mandatoryLegalComplete: boolean;
  noProviderCollision: boolean;
  noTenantMembership: boolean;
  singleOwnerPolicy: boolean;
};

export type PlatformOwnerResolutionResult = {
  allowed: boolean;
  dryRun: boolean;
  refusal: PlatformOwnerBootstrapRefusal | null;
  platformAccountId: string | null;
  opaqueRefs: {
    supabaseUser: string | null;
    platformAccount: string | null;
    publicAccountId: string | null;
  };
  mandatoryLegalAcceptanceCount: number;
  checks: PlatformOwnerBootstrapChecks;
  message: string;
};

function opaqueRef(namespace: string, stableId: string): string {
  return createHash("sha256")
    .update(`${namespace}:${stableId}:platform-owner-bootstrap`)
    .digest("hex")
    .slice(0, 16);
}

export function detectForbiddenPlatformOwnerCredentials(): PlatformOwnerBootstrapRefusal | null {
  return detectForbiddenCredentials();
}

function buildChecks(
  partial: Partial<PlatformOwnerBootstrapChecks> = {}
): PlatformOwnerBootstrapChecks {
  return {
    singleAuthIdentity: false,
    singlePlatformAccount: false,
    authPlatformLinked: false,
    active: false,
    generationCurrent: false,
    emailVerified: false,
    phoneVerified: false,
    mandatoryLegalComplete: false,
    noProviderCollision: false,
    noTenantMembership: false,
    singleOwnerPolicy: true,
    ...partial,
  };
}

function accountChecks(account: PlatformAccountRecord | null): Pick<
  PlatformOwnerBootstrapChecks,
  "active" | "generationCurrent" | "emailVerified" | "phoneVerified"
> {
  const requiredGeneration = getRequiredOnboardingGeneration();
  const phonePolicyRequired = account
    ? isPhoneVerificationRequiredForAccount(account)
    : false;
  return {
    active: Boolean(
      account && account.status === "ACTIVE" && isPlatformAccountActive(account)
    ),
    generationCurrent: Boolean(
      account &&
        account.onboardingGeneration >= CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION &&
        account.onboardingGeneration >= requiredGeneration
    ),
    emailVerified: Boolean(account?.emailVerifiedAt),
    phoneVerified: phonePolicyRequired
      ? Boolean(account?.phoneVerifiedAt)
      : true,
  };
}

function isBlockedStatus(status: PlatformAccountRecord["status"]): boolean {
  return status === "SUSPENDED" || status === "LOCKED" || status === "DEACTIVATED";
}

export async function resolveDesignatedPlatformOwnerByEmail(
  designatedEmail: string,
  deps: {
    findAuthUsersByEmail: (normalizedEmail: string) => Promise<User[]>;
    countExistingPlatformOwners: () => Promise<number>;
    locale?: string;
  }
): Promise<PlatformOwnerResolutionResult> {
  const forbidden = detectForbiddenPlatformOwnerCredentials();
  if (forbidden) {
    return {
      allowed: false,
      dryRun: true,
      refusal: forbidden,
      platformAccountId: null,
      opaqueRefs: { supabaseUser: null, platformAccount: null, publicAccountId: null },
      mandatoryLegalAcceptanceCount: 0,
      checks: buildChecks(),
      message: "Passwords must never be supplied to platform-owner bootstrap tooling.",
    };
  }

  const normalized = normalizeEmail(designatedEmail);
  if (!normalized || !normalized.includes("@")) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "missing_designated_email",
      platformAccountId: null,
      opaqueRefs: { supabaseUser: null, platformAccount: null, publicAccountId: null },
      mandatoryLegalAcceptanceCount: 0,
      checks: buildChecks(),
      message: "A valid designated email must be supplied via operator environment.",
    };
  }

  const authMatches = await deps.findAuthUsersByEmail(normalized);
  const platformMatches = await prisma.platformAccount.findMany({
    where: { emailNormalized: normalized },
  });

  const checks = buildChecks({
    singleAuthIdentity: authMatches.length === 1,
    singlePlatformAccount: platformMatches.length === 1,
  });

  if (authMatches.length === 0 && platformMatches.length === 0) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "account_not_found",
      platformAccountId: null,
      opaqueRefs: { supabaseUser: null, platformAccount: null, publicAccountId: null },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: "No Supabase Auth user or PlatformAccount matches the designated email.",
    };
  }

  if (authMatches.length !== 1) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "ambiguous_auth_identity",
      platformAccountId: null,
      opaqueRefs: { supabaseUser: null, platformAccount: null, publicAccountId: null },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: `Expected exactly one Supabase Auth identity (found ${authMatches.length}).`,
    };
  }

  if (platformMatches.length !== 1) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "ambiguous_platform_account",
      platformAccountId: null,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authMatches[0]!.id),
        platformAccount: null,
        publicAccountId: null,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: `Expected exactly one PlatformAccount (found ${platformMatches.length}).`,
    };
  }

  const authUser = authMatches[0]!;
  const account = platformMatches[0]!;
  checks.authPlatformLinked = account.supabaseUserId === authUser.id;

  if (!checks.authPlatformLinked) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "auth_platform_identity_mismatch",
      platformAccountId: null,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: "Supabase Auth identity and PlatformAccount are not linked.",
    };
  }

  Object.assign(checks, accountChecks(account));

  if (isBlockedStatus(account.status)) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "account_blocked",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: "Platform account is blocked (suspended, locked, or deactivated).",
    };
  }

  if (account.status !== "ACTIVE") {
    return {
      allowed: false,
      dryRun: true,
      refusal: "account_not_active",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: "Platform account must be ACTIVE before platform-owner bootstrap.",
    };
  }

  if (!checks.generationCurrent) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "generation_not_current",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: "Onboarding generation must satisfy the current required generation (generation 2).",
    };
  }

  if (!checks.emailVerified) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "email_not_verified",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message: "Email verification evidence is required.",
    };
  }

  if (!checks.phoneVerified) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "phone_not_verified",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: 0,
      checks,
      message:
        "Phone verification evidence is required when CROW_PHONE_VERIFICATION_REQUIRED is enabled for generation-3 enrollments.",
    };
  }

  const locale = deps.locale ?? "en-US";
  const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id, locale);
  checks.mandatoryLegalComplete = legalComplete;

  const acceptanceCount = await prisma.accountLegalAcceptance.count({
    where: { platformAccountId: account.id },
  });

  if (!legalComplete) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "legal_incomplete",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: acceptanceCount,
      checks,
      message: "All mandatory legal acceptances (Terms, Privacy Notice, AUP) must be complete.",
    };
  }

  const providerIdentities = await prisma.platformProviderIdentity.findMany({
    where: { platformAccountId: account.id },
  });
  const providerKeys = new Set(
    providerIdentities.map((p) => `${p.provider}:${p.providerUserId}`)
  );
  checks.noProviderCollision = providerKeys.size === providerIdentities.length;

  const duplicateProvider = await prisma.platformProviderIdentity.findFirst({
    where: {
      emailNormalized: normalized,
      NOT: { platformAccountId: account.id },
    },
  });
  if (duplicateProvider) checks.noProviderCollision = false;

  if (!checks.noProviderCollision) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "provider_identity_collision",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: acceptanceCount,
      checks,
      message: "Unresolved provider identity collision detected.",
    };
  }

  const tenantMembershipCount = await prisma.tenantMembership.count({
    where: { supabaseUserId: authUser.id },
  });
  checks.noTenantMembership = tenantMembershipCount === 0;

  if (!checks.noTenantMembership) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "tenant_membership_collision",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: acceptanceCount,
      checks,
      message:
        "Tenant membership must not exist on the designated Platform Owner account before bootstrap.",
    };
  }

  const crowRole = String(authUser.app_metadata?.crow_role ?? "");
  if (crowRole === "platform_admin") {
    checks.singleOwnerPolicy = false;
  }

  const existingOwners = await deps.countExistingPlatformOwners();
  if (existingOwners > 0 || crowRole === "platform_admin") {
    return {
      allowed: false,
      dryRun: true,
      refusal: "existing_platform_owner",
      platformAccountId: account.id,
      opaqueRefs: {
        supabaseUser: opaqueRef("auth", authUser.id),
        platformAccount: opaqueRef("platform_account", account.id),
        publicAccountId: account.publicAccountId,
      },
      mandatoryLegalAcceptanceCount: acceptanceCount,
      checks: { ...checks, singleOwnerPolicy: false },
      message: "Conflicting platform owner authority already exists.",
    };
  }

  return {
    allowed: true,
    dryRun: true,
    refusal: null,
    platformAccountId: account.id,
    opaqueRefs: {
      supabaseUser: opaqueRef("auth", authUser.id),
      platformAccount: opaqueRef("platform_account", account.id),
      publicAccountId: account.publicAccountId,
    },
    mandatoryLegalAcceptanceCount: acceptanceCount,
    checks,
    message:
      "Designated account resolved to internal PlatformAccount ID — dry-run plan OK (execute separately gated).",
  };
}

export async function planPlatformOwnerBootstrapByAccountId(
  platformAccountId: string,
  deps: {
    findAuthUsersByEmail: (normalizedEmail: string) => Promise<User[]>;
    countExistingPlatformOwners: () => Promise<number>;
    locale?: string;
  }
): Promise<PlatformOwnerResolutionResult> {
  const account = await findPlatformAccountById(platformAccountId);
  if (!account) {
    return {
      allowed: false,
      dryRun: true,
      refusal: "account_not_found",
      platformAccountId: null,
      opaqueRefs: { supabaseUser: null, platformAccount: null, publicAccountId: null },
      mandatoryLegalAcceptanceCount: 0,
      checks: buildChecks(),
      message: "Platform account not found.",
    };
  }
  return resolveDesignatedPlatformOwnerByEmail(account.emailNormalized, deps);
}

export function resolutionManifestDigest(result: PlatformOwnerResolutionResult): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        allowed: result.allowed,
        platformAccountId: result.platformAccountId,
        refusal: result.refusal,
        checks: result.checks,
      })
    )
    .digest("hex");
}
