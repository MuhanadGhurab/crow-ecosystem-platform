/**
 * C3.10L — Pre-OAuth Google proof identity inspection (no PII in output).
 */
import { createClient, type User } from "@supabase/supabase-js";
import { PrismaClient, type PlatformAccount } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { opaqueManifestRef } from "./identity-manifest";

export type GoogleProofAccountRetention = "delete_after_proof" | "retain_after_proof";

export type GoogleProofIdentityClassification =
  | "NO_EXISTING_IDENTITY"
  | "CONTROLLED_PENDING_GOOGLE_REQUESTER"
  | "CONTROLLED_ACTIVE_GOOGLE_REQUESTER"
  | "INCOMPLETE_GOOGLE_IDENTITY"
  | "PROVIDER_IDENTITY_COLLISION"
  | "ACTIVE_PRIVILEGED_IDENTITY"
  | "LEGACY_IDENTITY"
  | "OPERATIONAL_OWNERSHIP_BLOCKER"
  | "DUPLICATE_IDENTITY";

export type GoogleProofIdentityResolution = {
  classification: GoogleProofIdentityClassification;
  retentionPolicy: GoogleProofAccountRetention | null;
  accountOpaque: string | null;
  authOpaque: string | null;
  emailOpaque: string | null;
  counts: {
    supabaseAuthUsers: number;
    googleProviderIdentities: number;
    platformAccounts: number;
    legalAcceptances: number;
    profiles: number;
    emailChallenges: number;
    phoneChallenges: number;
    tenantMemberships: number;
    invitations: number;
    clientRequests: number;
    operationalOwnershipRefs: number;
  };
  state: {
    platformAccountStatus: string | null;
    onboardingGeneration: number | null;
    emailVerifiedPlatform: boolean;
    emailConfirmedSupabase: boolean;
    googleProviderLinked: boolean;
    crowRole: string | null;
    linkedAuthToAccount: boolean;
  };
  mayProceed: boolean;
  stopReason: string | null;
};

const PROCEED_CLASSIFICATIONS: GoogleProofIdentityClassification[] = [
  "NO_EXISTING_IDENTITY",
  "CONTROLLED_PENDING_GOOGLE_REQUESTER",
  "INCOMPLETE_GOOGLE_IDENTITY",
];

function parseRetention(): GoogleProofAccountRetention | null {
  const raw = process.env.C3_PROOF_ACCOUNT_RETENTION?.trim();
  if (raw === "delete_after_proof" || raw === "retain_after_proof") return raw;
  return null;
}

export function resolveGoogleProofEmailNormalized(): string | null {
  const email = process.env.C3_GOOGLE_PROOF_EMAIL?.trim();
  if (!email?.includes("@")) return null;
  return normalizeEmail(email);
}

export function requireGoogleProofOperatorEnv(): {
  retention: GoogleProofAccountRetention;
  emailNormalized: string;
} {
  const retention = parseRetention();
  if (!retention) {
    throw new Error(
      "Set C3_PROOF_ACCOUNT_RETENTION=delete_after_proof or retain_after_proof in gitignored operator env"
    );
  }
  const emailNormalized = resolveGoogleProofEmailNormalized();
  if (!emailNormalized) {
    throw new Error("Set C3_GOOGLE_PROOF_EMAIL in gitignored operator env");
  }
  return { retention, emailNormalized };
}

async function listAuthUsersByEmail(
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

function hasGoogleIdentity(user: User): boolean {
  return user.identities?.some((identity) => identity.provider === "google") ?? false;
}

export async function resolveGoogleProofIdentity(
  prisma: PrismaClient
): Promise<GoogleProofIdentityResolution> {
  const { retention, emailNormalized } = requireGoogleProofOperatorEnv();
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

  const authUsers = await listAuthUsersByEmail(admin, emailNormalized);
  const accounts = await prisma.platformAccount.findMany({
    where: { emailNormalized },
  });

  const emailOpaque = opaqueManifestRef("google-proof-email", emailNormalized);

  const baseResolution = (
    classification: GoogleProofIdentityClassification,
    partial: Partial<GoogleProofIdentityResolution> = {}
  ): GoogleProofIdentityResolution => ({
    classification,
    retentionPolicy: retention,
    accountOpaque: null,
    authOpaque: null,
    emailOpaque,
    counts: {
      supabaseAuthUsers: authUsers.length,
      googleProviderIdentities: 0,
      platformAccounts: accounts.length,
      legalAcceptances: 0,
      profiles: 0,
      emailChallenges: 0,
      phoneChallenges: 0,
      tenantMemberships: 0,
      invitations: 0,
      clientRequests: 0,
      operationalOwnershipRefs: 0,
    },
    state: {
      platformAccountStatus: null,
      onboardingGeneration: null,
      emailVerifiedPlatform: false,
      emailConfirmedSupabase: false,
      googleProviderLinked: false,
      crowRole: null,
      linkedAuthToAccount: false,
    },
    mayProceed: PROCEED_CLASSIFICATIONS.includes(classification),
    stopReason: null,
    ...partial,
  });

  if (emailNormalized === platformAdminNorm) {
    return baseResolution("OPERATIONAL_OWNERSHIP_BLOCKER", {
      stopReason: "Designated email matches PLATFORM_ADMIN_EMAIL",
    });
  }

  if (authUsers.length > 1 || accounts.length > 1) {
    return baseResolution("DUPLICATE_IDENTITY", {
      stopReason: "Multiple Auth users or PlatformAccounts for email",
    });
  }

  if (authUsers.length === 0 && accounts.length === 0) {
    return baseResolution("NO_EXISTING_IDENTITY");
  }

  const account: PlatformAccount | null = accounts[0] ?? null;
  const authUser: User | null =
    authUsers[0] ??
    (account
      ? (await admin.auth.admin.getUserById(account.supabaseUserId)).data.user
      : null);

  if (!authUser && account) {
    return baseResolution("INCOMPLETE_GOOGLE_IDENTITY", {
      accountOpaque: opaqueManifestRef("platform-account", account.id),
      stopReason: "PlatformAccount without Supabase Auth user",
    });
  }

  if (authUser && !account) {
    return baseResolution("INCOMPLETE_GOOGLE_IDENTITY", {
      authOpaque: opaqueManifestRef("supabase-auth", authUser.id),
      stopReason: "Supabase Auth without PlatformAccount — reconcile on OAuth callback",
    });
  }

  if (!authUser || !account) {
    return baseResolution("DUPLICATE_IDENTITY", {
      stopReason: "Unexpected identity resolution state",
    });
  }

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
  const googleProviderIdentities = await prisma.platformProviderIdentity.count({
    where: { platformAccountId: account.id, provider: "google" },
  });
  const tenantMemberships = await prisma.tenantMembership.count({
    where: { supabaseUserId: account.supabaseUserId },
  });
  const invitations = await prisma.tenantMembershipInvite.count({
    where: { email: { equals: account.email, mode: "insensitive" } },
  });
  const clientRequests = await prisma.implementationRequest.count({
    where: { submittedByUserId: account.supabaseUserId },
  });
  const erpPrimaryContacts = await prisma.requestContact.count({
    where: {
      isPrimary: true,
      email: { equals: account.emailNormalized, mode: "insensitive" },
    },
  });
  const operationalOwnershipRefs = erpPrimaryContacts + clientRequests;

  const crowRole =
    typeof authUser.app_metadata?.crow_role === "string"
      ? authUser.app_metadata.crow_role
      : null;

  const providerCollision = await prisma.platformProviderIdentity.findFirst({
    where: {
      provider: "google",
      platformAccountId: { not: account.id },
      emailNormalized,
    },
  });

  const counts = {
    supabaseAuthUsers: 1,
    googleProviderIdentities,
    platformAccounts: 1,
    legalAcceptances,
    profiles,
    emailChallenges,
    phoneChallenges,
    tenantMemberships,
    invitations,
    clientRequests,
    operationalOwnershipRefs,
  };

  const state = {
    platformAccountStatus: account.status,
    onboardingGeneration: account.onboardingGeneration,
    emailVerifiedPlatform: Boolean(account.emailVerifiedAt),
    emailConfirmedSupabase: Boolean(authUser.email_confirmed_at),
    googleProviderLinked: hasGoogleIdentity(authUser) || googleProviderIdentities > 0,
    crowRole,
    linkedAuthToAccount: authUser.id === account.supabaseUserId,
  };

  const accountOpaque = opaqueManifestRef("platform-account", account.id);
  const authOpaque = opaqueManifestRef("supabase-auth", authUser.id);

  if (providerCollision) {
    return baseResolution("PROVIDER_IDENTITY_COLLISION", {
      accountOpaque,
      authOpaque,
      counts,
      state,
      stopReason: "Google provider identity linked to another platform account",
    });
  }

  if (account.onboardingGeneration < 2) {
    return baseResolution("LEGACY_IDENTITY", {
      accountOpaque,
      authOpaque,
      counts,
      state,
      stopReason: "Legacy onboarding generation",
    });
  }

  if (
    crowRole === "client" ||
    crowRole === "admin" ||
    crowRole === "platform_admin"
  ) {
    return baseResolution("ACTIVE_PRIVILEGED_IDENTITY", {
      accountOpaque,
      authOpaque,
      counts,
      state,
      stopReason: `Privileged crow_role=${crowRole}`,
    });
  }

  if (tenantMemberships > 0 || operationalOwnershipRefs > 0) {
    return baseResolution("OPERATIONAL_OWNERSHIP_BLOCKER", {
      accountOpaque,
      authOpaque,
      counts,
      state,
      stopReason: "Tenant membership or operational ownership present",
    });
  }

  const isActiveOrdinary =
    account.status === "ACTIVE" &&
    account.onboardingGeneration === 2 &&
    legalAcceptances === 3 &&
    Boolean(account.emailVerifiedAt) &&
    state.googleProviderLinked;

  if (isActiveOrdinary) {
    return baseResolution("CONTROLLED_ACTIVE_GOOGLE_REQUESTER", {
      accountOpaque,
      authOpaque,
      counts,
      state,
      stopReason: "Already ACTIVE — use for re-login session proof only",
    });
  }

  const isPendingOrdinary =
    account.status === "PENDING_EMAIL_VERIFICATION" &&
    account.onboardingGeneration === 2 &&
    legalAcceptances === 3 &&
    !crowRole;

  if (isPendingOrdinary) {
    return baseResolution("CONTROLLED_PENDING_GOOGLE_REQUESTER", {
      accountOpaque,
      authOpaque,
      counts,
      state,
    });
  }

  const incomplete =
    legalAcceptances < 3 ||
    account.status === "PENDING_EMAIL_VERIFICATION" ||
    account.status === "PENDING_PHONE_VERIFICATION" ||
    !state.linkedAuthToAccount ||
    !state.googleProviderLinked;

  if (incomplete) {
    return baseResolution("INCOMPLETE_GOOGLE_IDENTITY", {
      accountOpaque,
      authOpaque,
      counts,
      state,
    });
  }

  return baseResolution("ACTIVE_PRIVILEGED_IDENTITY", {
    accountOpaque,
    authOpaque,
    counts,
    state,
    stopReason: "Account state does not match controlled Google requester profile",
  });
}

export function printGoogleProofResolution(resolution: GoogleProofIdentityResolution): void {
  console.log("\n=== C3.10L Google proof identity resolution ===\n");
  console.log(`  retentionPolicy: ${resolution.retentionPolicy ?? "unset"}`);
  console.log(`  classification: ${resolution.classification}`);
  console.log(`  mayProceed: ${resolution.mayProceed}`);
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
