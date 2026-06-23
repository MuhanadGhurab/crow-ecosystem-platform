/**
 * C3.10K — Resolve operator-designated proof requester without printing PII.
 */
import { createClient, type User } from "@supabase/supabase-js";
import { PrismaClient, type PlatformAccount } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { opaqueManifestRef } from "./identity-manifest";
import { assessGoogleProviderLinkage } from "./c3-proof-requester-provider-linkage";
import { isPrivilegedMetadataCrowRole, isMetadataNeutralCrowRole } from "../../src/lib/auth/metadata-crow-role";

export type ProofAccountRetention = "delete_after_proof" | "retain_after_proof";

export type ProofRequesterClassification =
  | "CONTROLLED_PENDING_REQUESTER"
  | "CONTROLLED_ACTIVE_REQUESTER"
  | "ACTIVE_GOOGLE_REQUESTER"
  | "ACTIVE_PRIVILEGED_IDENTITY"
  | "PROVIDER_COLLISION"
  | "DUPLICATE_IDENTITY"
  | "LEGACY_IDENTITY"
  | "OPERATIONAL_OWNERSHIP_BLOCKER"
  | "IDENTITY_NOT_FOUND";

export type ProofRequesterRetentionLabel =
  | "CONTROLLED_DISPOSABLE_REQUESTER"
  | "CONTROLLED_RETAINED_REQUESTER";

export type ProofRequesterResolution = {
  classification: ProofRequesterClassification;
  retentionLabel: ProofRequesterRetentionLabel | null;
  retentionPolicy: ProofAccountRetention | null;
  accountOpaque: string | null;
  authOpaque: string | null;
  emailOpaque: string | null;
  counts: {
    supabaseAuthIdentities: number;
    platformAccounts: number;
    legalAcceptances: number;
    profiles: number;
    emailChallenges: number;
    phoneChallenges: number;
    providerIdentities: number;
    tenantMemberships: number;
    implementationRequests: number;
    erpPrimaryContacts: number;
  };
  state: {
    platformAccountStatus: string | null;
    onboardingGeneration: number | null;
    emailVerifiedPlatform: boolean;
    emailConfirmedSupabase: boolean;
    authProvider: string | null;
    crowRole: string | null;
    linkedAuthToAccount: boolean;
  };
  stopReason: string | null;
};

function parseRetention(): ProofAccountRetention | null {
  const raw = process.env.C3_PROOF_ACCOUNT_RETENTION?.trim();
  if (raw === "delete_after_proof" || raw === "retain_after_proof") return raw;
  return null;
}

export function resolveDesignatedProofEmailNormalized(): string | null {
  const preservedId = process.env.C3_PRESERVED_DISPOSABLE_ACCOUNT_ID?.trim();
  if (preservedId) return null;

  const email =
    process.env.C3_SESSION_REQUESTER_FIXTURE_EMAIL?.trim() ||
    process.env.C3_GOOGLE_PROOF_EMAIL?.trim() ||
    process.env.C3_PRESERVED_DISPOSABLE_FIXTURE_EMAIL?.trim();
  if (!email?.includes("@")) return null;
  return normalizeEmail(email);
}

export function requireProofOperatorEnv(): {
  retention: ProofAccountRetention;
  emailNormalized: string | null;
  preservedAccountId: string | null;
} {
  const retention = parseRetention();
  if (!retention) {
    throw new Error(
      "Set C3_PROOF_ACCOUNT_RETENTION=delete_after_proof or retain_after_proof in gitignored operator env"
    );
  }

  const preservedAccountId = process.env.C3_PRESERVED_DISPOSABLE_ACCOUNT_ID?.trim() || null;
  const emailNormalized = resolveDesignatedProofEmailNormalized();

  if (!preservedAccountId && !emailNormalized) {
    throw new Error(
      "Set C3_SESSION_REQUESTER_FIXTURE_EMAIL or C3_PRESERVED_DISPOSABLE_ACCOUNT_ID in gitignored operator env"
    );
  }

  return { retention, emailNormalized, preservedAccountId };
}

function retentionLabelFor(
  retention: ProofAccountRetention,
  classification: ProofRequesterClassification
): ProofRequesterRetentionLabel | null {
  if (
    classification !== "CONTROLLED_PENDING_REQUESTER" &&
    classification !== "CONTROLLED_ACTIVE_REQUESTER" &&
    classification !== "ACTIVE_GOOGLE_REQUESTER"
  ) {
    return null;
  }
  return retention === "delete_after_proof"
    ? "CONTROLLED_DISPOSABLE_REQUESTER"
    : "CONTROLLED_RETAINED_REQUESTER";
}

async function countAuthUsersByEmail(
  admin: ReturnType<typeof createClient>,
  emailNormalized: string
): Promise<User[]> {
  const matches: User[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;
    for (const user of data.users) {
      if (user.email && normalizeEmail(user.email) === emailNormalized) {
        matches.push(user);
      }
    }
    if (data.users.length < 200) break;
  }
  return matches;
}

export async function resolveProofRequester(
  prisma: PrismaClient
): Promise<ProofRequesterResolution> {
  const { retention, emailNormalized, preservedAccountId } = requireProofOperatorEnv();
  const platformAdminNorm = process.env.PLATFORM_ADMIN_EMAIL?.trim()
    ? normalizeEmail(process.env.PLATFORM_ADMIN_EMAIL.trim())
    : null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase admin credentials required");
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let account: PlatformAccount | null = null;
  let authUsers: User[] = [];

  if (preservedAccountId) {
    account = await prisma.platformAccount.findUnique({ where: { id: preservedAccountId } });
    if (account) {
      const { data } = await admin.auth.admin.getUserById(account.supabaseUserId);
      if (data.user) authUsers = [data.user];
    }
  } else if (emailNormalized) {
    authUsers = await countAuthUsersByEmail(admin, emailNormalized);
    const accounts = await prisma.platformAccount.findMany({
      where: { emailNormalized },
    });
    if (accounts.length === 1) account = accounts[0]!;
    else if (accounts.length > 1) account = null;
  }

  const emailForOpaque = emailNormalized ?? account?.emailNormalized ?? "";
  const emailOpaque = emailForOpaque
    ? opaqueManifestRef("proof-email", emailForOpaque)
    : null;

  const baseCounts = {
    supabaseAuthIdentities: authUsers.length,
    platformAccounts: preservedAccountId
      ? account
        ? 1
        : 0
      : emailNormalized
        ? await prisma.platformAccount.count({ where: { emailNormalized } })
        : 0,
    legalAcceptances: 0,
    profiles: 0,
    emailChallenges: 0,
    phoneChallenges: 0,
    providerIdentities: 0,
    tenantMemberships: 0,
    implementationRequests: 0,
    erpPrimaryContacts: 0,
  };

  const emptyState = {
    platformAccountStatus: account?.status ?? null,
    onboardingGeneration: account?.onboardingGeneration ?? null,
    emailVerifiedPlatform: Boolean(account?.emailVerifiedAt),
    emailConfirmedSupabase: false,
    authProvider: null as string | null,
    crowRole: null as string | null,
    linkedAuthToAccount: false,
  };

  if (!account && authUsers.length === 0) {
    return {
      classification: "IDENTITY_NOT_FOUND",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque: null,
      authOpaque: null,
      emailOpaque,
      counts: baseCounts,
      state: emptyState,
      stopReason: "No matching PlatformAccount or Supabase Auth user",
    };
  }

  if (baseCounts.platformAccounts > 1 || authUsers.length > 1) {
    return {
      classification: "DUPLICATE_IDENTITY",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque: account ? opaqueManifestRef("platform-account", account.id) : null,
      authOpaque: authUsers[0]
        ? opaqueManifestRef("supabase-auth", authUsers[0].id)
        : null,
      emailOpaque,
      counts: baseCounts,
      state: emptyState,
      stopReason: "Multiple Auth or PlatformAccount rows for designation",
    };
  }

  if (!account) {
    return {
      classification: "IDENTITY_NOT_FOUND",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque: null,
      authOpaque: authUsers[0]
        ? opaqueManifestRef("supabase-auth", authUsers[0].id)
        : null,
      emailOpaque,
      counts: { ...baseCounts, supabaseAuthIdentities: authUsers.length, platformAccounts: 0 },
      state: emptyState,
      stopReason: "Supabase Auth exists without PlatformAccount — do not create duplicate",
    };
  }

  const authUser = authUsers[0] ?? (await admin.auth.admin.getUserById(account.supabaseUserId)).data.user;
  if (!authUser) {
    return {
      classification: "IDENTITY_NOT_FOUND",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque: opaqueManifestRef("platform-account", account.id),
      authOpaque: null,
      emailOpaque,
      counts: baseCounts,
      state: emptyState,
      stopReason: "PlatformAccount without Supabase Auth identity",
    };
  }

  const linked = authUser.id === account.supabaseUserId;
  const legalAcceptances = await prisma.accountLegalAcceptance.count({
    where: { platformAccountId: account.id },
  });
  const profiles = await prisma.platformAccountProfile.count({
    where: { platformAccountId: account.id },
  });
  const emailChallenges = await prisma.emailVerificationChallenge.count({
    where: { platformAccountId: account.id },
  });
  const phoneChallenges = await prisma.phoneVerificationChallenge.count({
    where: { platformAccountId: account.id },
  });
  const ownedProviderRows = await prisma.platformProviderIdentity.findMany({
    where: { platformAccountId: account.id },
    select: {
      platformAccountId: true,
      provider: true,
      providerUserId: true,
      emailNormalized: true,
    },
  });
  const providerIdentities = ownedProviderRows.length;
  const ownedGoogleProviderUserIds = ownedProviderRows
    .filter((row) => row.provider === "google")
    .map((row) => row.providerUserId);
  const tenantMemberships = await prisma.tenantMembership.count({
    where: { supabaseUserId: account.supabaseUserId },
  });
  const implementationRequests = await prisma.implementationRequest.count({
    where: { submittedByUserId: account.supabaseUserId },
  });
  const erpPrimaryContacts = await prisma.requestContact.count({
    where: {
      isPrimary: true,
      email: { equals: account.emailNormalized, mode: "insensitive" },
    },
  });

  const counts = {
    ...baseCounts,
    supabaseAuthIdentities: 1,
    platformAccounts: 1,
    legalAcceptances,
    profiles,
    emailChallenges,
    phoneChallenges,
    providerIdentities,
    tenantMemberships,
    implementationRequests,
    erpPrimaryContacts,
  };

  const crowRole =
    typeof authUser.app_metadata?.crow_role === "string"
      ? authUser.app_metadata.crow_role
      : null;
  const authProvider =
    authUser.app_metadata?.provider ??
    (authUser.identities?.[0]?.provider ?? "email");

  const state = {
    platformAccountStatus: account.status,
    onboardingGeneration: account.onboardingGeneration,
    emailVerifiedPlatform: Boolean(account.emailVerifiedAt),
    emailConfirmedSupabase: Boolean(authUser.email_confirmed_at),
    authProvider: typeof authProvider === "string" ? authProvider : "email",
    crowRole,
    linkedAuthToAccount: linked,
  };

  const accountOpaque = opaqueManifestRef("platform-account", account.id);
  const authOpaque = opaqueManifestRef("supabase-auth", authUser.id);

  if (platformAdminNorm && account.emailNormalized === platformAdminNorm) {
    return {
      classification: "OPERATIONAL_OWNERSHIP_BLOCKER",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque,
      authOpaque,
      emailOpaque,
      counts,
      state,
      stopReason: "Designated identity matches PLATFORM_ADMIN_EMAIL",
    };
  }

  if (account.onboardingGeneration < 2) {
    return {
      classification: "LEGACY_IDENTITY",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque,
      authOpaque,
      emailOpaque,
      counts,
      state,
      stopReason: "Legacy onboarding generation",
    };
  }

  const foreignGoogleRowForEmail = Boolean(
    await prisma.platformProviderIdentity.findFirst({
      where: {
        provider: "google",
        platformAccountId: { not: account.id },
        emailNormalized: account.emailNormalized,
      },
      select: { id: true },
    })
  );

  const foreignGoogleRowsForOwnedProviderUserIds =
    ownedGoogleProviderUserIds.length > 0
      ? await prisma.platformProviderIdentity.findMany({
          where: {
            provider: "google",
            providerUserId: { in: ownedGoogleProviderUserIds },
            platformAccountId: { not: account.id },
          },
          select: {
            platformAccountId: true,
            provider: true,
            providerUserId: true,
            emailNormalized: true,
          },
        })
      : [];

  const providerLinkage = assessGoogleProviderLinkage({
    accountId: account.id,
    emailNormalized: account.emailNormalized,
    ownedProviderRows,
    foreignGoogleRowForEmail,
    foreignGoogleRowsForOwnedProviderUserIds,
    authIdentities: authUser.identities,
    ownedGoogleProviderUserIds,
  });

  if (!providerLinkage.ok) {
    return {
      classification: "PROVIDER_COLLISION",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque,
      authOpaque,
      emailOpaque,
      counts,
      state,
      stopReason: providerLinkage.detail,
    };
  }

  if (isPrivilegedMetadataCrowRole(crowRole)) {
    return {
      classification: "ACTIVE_PRIVILEGED_IDENTITY",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque,
      authOpaque,
      emailOpaque,
      counts,
      state,
      stopReason: `Privileged crow_role=${crowRole ?? "unknown"}`,
    };
  }

  if (tenantMemberships > 0 || implementationRequests > 0 || erpPrimaryContacts > 0) {
    return {
      classification: "OPERATIONAL_OWNERSHIP_BLOCKER",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque,
      authOpaque,
      emailOpaque,
      counts,
      state,
      stopReason: "Tenant, ERP, or client-request ownership present",
    };
  }

  const isPendingOrdinary =
    account.status === "PENDING_EMAIL_VERIFICATION" &&
    account.onboardingGeneration === 2 &&
    legalAcceptances === 3 &&
    !account.emailVerifiedAt &&
    phoneChallenges === 0 &&
    isMetadataNeutralCrowRole(crowRole);

  const isActiveOrdinary =
    account.status === "ACTIVE" &&
    account.onboardingGeneration === 2 &&
    legalAcceptances === 3 &&
    Boolean(account.emailVerifiedAt) &&
    phoneChallenges === 0 &&
    isMetadataNeutralCrowRole(crowRole);

  let classification: ProofRequesterClassification;
  if (isPendingOrdinary) classification = "CONTROLLED_PENDING_REQUESTER";
  else if (isActiveOrdinary && providerLinkage.googleLinked) {
    classification = "ACTIVE_GOOGLE_REQUESTER";
  } else if (isActiveOrdinary) classification = "CONTROLLED_ACTIVE_REQUESTER";
  else {
    return {
      classification: "ACTIVE_PRIVILEGED_IDENTITY",
      retentionLabel: null,
      retentionPolicy: retention,
      accountOpaque,
      authOpaque,
      emailOpaque,
      counts,
      state,
      stopReason: "Account state does not match ordinary pending/active requester profile",
    };
  }

  return {
    classification,
    retentionLabel: retentionLabelFor(retention, classification),
    retentionPolicy: retention,
    accountOpaque,
    authOpaque,
    emailOpaque,
    counts,
    state,
    stopReason: null,
  };
}

/** Resolve the operator-designated retained requester PlatformAccount (read-only). */
export async function resolveProofRequesterPlatformAccount(
  prisma: PrismaClient
): Promise<Pick<PlatformAccount, "id" | "supabaseUserId" | "status"> | null> {
  const { preservedAccountId, emailNormalized } = requireProofOperatorEnv();
  if (preservedAccountId) {
    return prisma.platformAccount.findUnique({
      where: { id: preservedAccountId },
      select: { id: true, supabaseUserId: true, status: true },
    });
  }
  if (emailNormalized) {
    const accounts = await prisma.platformAccount.findMany({
      where: { emailNormalized },
      select: { id: true, supabaseUserId: true, status: true },
    });
    return accounts.length === 1 ? accounts[0]! : null;
  }
  return null;
}

export function printProofResolution(resolution: ProofRequesterResolution): void {
  console.log("\n=== C3.10K proof requester resolution ===\n");
  console.log(`  retentionPolicy: ${resolution.retentionPolicy ?? "unset"}`);
  console.log(`  classification: ${resolution.classification}`);
  if (resolution.retentionLabel) {
    console.log(`  retentionLabel: ${resolution.retentionLabel}`);
  }
  if (resolution.accountOpaque) console.log(`  accountOpaque: ${resolution.accountOpaque}`);
  if (resolution.authOpaque) console.log(`  authOpaque: ${resolution.authOpaque}`);
  if (resolution.emailOpaque) console.log(`  emailOpaque: ${resolution.emailOpaque}`);
  console.log("  counts:", JSON.stringify(resolution.counts));
  console.log("  state:", JSON.stringify(resolution.state));
  if (resolution.stopReason) {
    console.log(`  stopReason: ${resolution.stopReason}`);
  }
  console.log("");
}
