import type { User } from "@supabase/supabase-js";
import type { PrismaClient, PlatformAccountStatus } from "@prisma/client";

import {
  EMPTY_CLASSIFICATION_COUNTS,
  incrementClassification,
  opaqueManifestRef,
  type IdentityResetClassification,
} from "./identity-manifest";

export type AuthUserAggregate = {
  total: number;
  confirmed: number;
  unconfirmed: number;
  bannedOrDeleted: number;
  providerCounts: Record<string, number>;
  crowRoleCounts: Record<string, number>;
  lastSignInPresent: number;
};

export type MembershipOwnershipRow = {
  membershipRef: string;
  tenantSlug: string;
  membershipRole: string;
  platformAccountRef: string | null;
  platformAccountStatus: PlatformAccountStatus | null;
  onboardingGeneration: number | null;
  canAuthorizeTenantAccess: boolean;
};

export type OwnershipDependencyCounts = {
  blueprintAuthorRefs: number;
  auditActorRefs: number;
  approvalActorRefs: number;
  requestOwnerRefs: number;
  inviteActorRefs: number;
  clientRequestLinkRefs: number;
  erpRequestRefs: number;
  totalDistinctRefs: number;
};

export type IdentityCensusResult = {
  auth: AuthUserAggregate;
  platformAccounts: {
    total: number;
    active: number;
    statusBreakdown: { status: PlatformAccountStatus; count: number }[];
    generationBreakdown: { generation: number; count: number }[];
  };
  profiles: number;
  legalAcceptances: number;
  emailChallenges: number;
  phoneChallenges: number;
  providerIdentities: number;
  tenantMemberships: number;
  tenantInvites: number;
  clientRequestLinks: number;
  membershipOwnership: MembershipOwnershipRow[];
  ownershipDependencies: OwnershipDependencyCounts;
  classificationCounts: Record<IdentityResetClassification, number>;
  unclassifiedAuthUsers: number;
  unclassifiedPlatformAccounts: number;
  plannedDeletionCounts: {
    supabaseAuthUsers: number;
    platformAccounts: number;
    profiles: number;
    providerIdentities: number;
    emailChallenges: number;
    phoneChallenges: number;
    tenantMemberships: number;
    tenantInvites: number;
    clientRequestLinks: number;
    legalAcceptancesArchived: number;
  };
  storageBlockerCount: number;
  manifestSalt: string;
};

const PLATFORM_STAFF_ROLES = new Set([
  "platform_admin",
  "platform_owner",
  "implementer",
  "procrow_operator",
]);

function authProviders(user: User): string[] {
  return user.identities?.map((i) => i.provider) ?? ["email"];
}

function isAuthUserConfirmed(user: User): boolean {
  return Boolean(user.email_confirmed_at || user.phone_confirmed_at);
}

function isAuthUserBannedOrDeleted(user: User): boolean {
  return Boolean(user.banned_until) || Boolean(user.deleted_at);
}

function classifyAuthUser(
  user: User,
  hasPlatformAccount: boolean,
  platformStatus: PlatformAccountStatus | null,
  legalAcceptanceCount: number,
  membershipCount: number,
  ownershipRefCount: number
): IdentityResetClassification {
  const role = String(user.app_metadata?.crow_role ?? "").trim();

  if (PLATFORM_STAFF_ROLES.has(role)) {
    return "SYSTEM_OR_SERVICE_PRINCIPAL";
  }

  if (legalAcceptanceCount > 0 && platformStatus === "ACTIVE") {
    return "ARCHIVE_LEGAL_EVIDENCE_THEN_DELETE";
  }

  if (ownershipRefCount > 0 || membershipCount > 0) {
    return "TRANSFER_OPERATIONAL_OWNERSHIP_THEN_DELETE";
  }

  if (
    hasPlatformAccount &&
    platformStatus &&
    platformStatus !== "ACTIVE" &&
    legalAcceptanceCount === 0 &&
    membershipCount === 0 &&
    ownershipRefCount === 0
  ) {
    return "DISPOSABLE_TEST_IDENTITY";
  }

  if (!hasPlatformAccount && membershipCount === 0 && ownershipRefCount === 0) {
    return "DISPOSABLE_TEST_IDENTITY";
  }

  if (hasPlatformAccount && legalAcceptanceCount > 0) {
    return "ARCHIVE_LEGAL_EVIDENCE_THEN_DELETE";
  }

  return "MANUAL_REVIEW_REQUIRED";
}

export async function listAllAuthUsers(
  fetchPage: (page: number) => Promise<User[]>
): Promise<User[]> {
  const users: User[] = [];
  for (let page = 1; page <= 50; page += 1) {
    const batch = await fetchPage(page);
    if (batch.length === 0) break;
    users.push(...batch);
    if (batch.length < 200) break;
  }
  return users;
}

export async function runIdentityCensus(
  prisma: PrismaClient,
  options: {
    authUsers: User[];
    manifestSalt: string;
    storageBlockerCount?: number;
  }
): Promise<IdentityCensusResult> {
  const { authUsers, manifestSalt } = options;
  const classificationCounts = { ...EMPTY_CLASSIFICATION_COUNTS };

  const providerCounts: Record<string, number> = {};
  const crowRoleCounts: Record<string, number> = {};
  let confirmed = 0;
  let unconfirmed = 0;
  let bannedOrDeleted = 0;
  let lastSignInPresent = 0;

  for (const user of authUsers) {
    if (isAuthUserConfirmed(user)) confirmed += 1;
    else unconfirmed += 1;
    if (isAuthUserBannedOrDeleted(user)) bannedOrDeleted += 1;
    if (user.last_sign_in_at) lastSignInPresent += 1;
    for (const p of authProviders(user)) {
      providerCounts[p] = (providerCounts[p] ?? 0) + 1;
    }
    const role = String(user.app_metadata?.crow_role ?? "(none)");
    crowRoleCounts[role] = (crowRoleCounts[role] ?? 0) + 1;
  }

  const [
    platformAccountTotal,
    profiles,
    legalAcceptances,
    emailChallenges,
    phoneChallenges,
    providerIdentities,
    tenantMemberships,
    tenantInvites,
    clientRequestLinks,
    statusBreakdown,
    generationBreakdown,
    platformAccounts,
    memberships,
    blueprintAuthors,
    auditActors,
    approvalActors,
    requestOwners,
    inviteActors,
    clientLinks,
    erpRequests,
  ] = await Promise.all([
    prisma.platformAccount.count(),
    prisma.platformAccountProfile.count(),
    prisma.accountLegalAcceptance.count(),
    prisma.emailVerificationChallenge.count(),
    prisma.phoneVerificationChallenge.count(),
    prisma.platformProviderIdentity.count(),
    prisma.tenantMembership.count(),
    prisma.tenantMembershipInvite.count(),
    prisma.clientOrganizationRequestLink.count(),
    prisma.platformAccount.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.platformAccount.groupBy({
      by: ["onboardingGeneration"],
      _count: { _all: true },
    }),
    prisma.platformAccount.findMany({
      select: {
        id: true,
        supabaseUserId: true,
        status: true,
        onboardingGeneration: true,
        _count: { select: { legalAcceptances: true } },
      },
    }),
    prisma.tenantMembership.findMany({
      include: { tenant: { select: { slug: true } } },
    }),
    prisma.enterpriseBlueprintVersion.count({ where: { authorUserId: { not: null } } }),
    prisma.blueprintTraceEvent.count({ where: { actorId: { not: null } } }),
    prisma.blueprintApproval.count(),
    prisma.clientOrganizationMember.count(),
    prisma.tenantMembershipInvite.count(),
    prisma.clientOrganizationRequestLink.count(),
    prisma.implementationRequest.count({ where: { submittedByUserId: { not: null } } }),
  ]);

  const activeCount =
    statusBreakdown.find((r) => r.status === "ACTIVE")?._count._all ?? 0;

  const platformByAuth = new Map(
    platformAccounts.map((a) => [a.supabaseUserId, a] as const)
  );

  const membershipCountByAuth = new Map<string, number>();
  for (const m of memberships) {
    membershipCountByAuth.set(
      m.supabaseUserId,
      (membershipCountByAuth.get(m.supabaseUserId) ?? 0) + 1
    );
  }

  const membershipOwnership: MembershipOwnershipRow[] = memberships.map((m) => {
    const pa = platformByAuth.get(m.supabaseUserId);
    const canAuthorize =
      Boolean(pa) && pa!.status === "ACTIVE" && pa!.onboardingGeneration >= 1;
    return {
      membershipRef: opaqueManifestRef("membership", m.id, manifestSalt),
      tenantSlug: m.tenant.slug,
      membershipRole: m.role,
      platformAccountRef: pa
        ? opaqueManifestRef("platform_account", pa.id, manifestSalt)
        : null,
      platformAccountStatus: pa?.status ?? null,
      onboardingGeneration: pa?.onboardingGeneration ?? null,
      canAuthorizeTenantAccess: canAuthorize,
    };
  });

  let unclassifiedAuthUsers = 0;
  for (const user of authUsers) {
    const pa = platformByAuth.get(user.id);
    const legalCount = pa?._count.legalAcceptances ?? 0;
    const memCount = membershipCountByAuth.get(user.id) ?? 0;
    const ownershipRefs = memCount > 0 ? 1 : 0;
    const category = classifyAuthUser(
      user,
      Boolean(pa),
      pa?.status ?? null,
      legalCount,
      memCount,
      ownershipRefs
    );
    incrementClassification(classificationCounts, category);
    if (category === "MANUAL_REVIEW_REQUIRED") unclassifiedAuthUsers += 1;
  }

  let unclassifiedPlatformAccounts = 0;
  for (const pa of platformAccounts) {
    if (!authUsers.some((u) => u.id === pa.supabaseUserId)) {
      incrementClassification(classificationCounts, "MANUAL_REVIEW_REQUIRED");
      unclassifiedPlatformAccounts += 1;
    }
  }

  const ownershipDependencies: OwnershipDependencyCounts = {
    blueprintAuthorRefs: blueprintAuthors,
    auditActorRefs: auditActors,
    approvalActorRefs: approvalActors,
    requestOwnerRefs: requestOwners,
    inviteActorRefs: inviteActors,
    clientRequestLinkRefs: clientLinks,
    erpRequestRefs: erpRequests,
    totalDistinctRefs:
      blueprintAuthors +
      auditActors +
      approvalActors +
      requestOwners +
      inviteActors +
      clientLinks,
  };

  const plannedDeletionCounts = {
    supabaseAuthUsers: authUsers.length,
    platformAccounts: platformAccountTotal,
    profiles,
    providerIdentities,
    emailChallenges,
    phoneChallenges,
    tenantMemberships,
    tenantInvites,
    clientRequestLinks,
    legalAcceptancesArchived: legalAcceptances,
  };

  return {
    auth: {
      total: authUsers.length,
      confirmed,
      unconfirmed,
      bannedOrDeleted,
      providerCounts,
      crowRoleCounts,
      lastSignInPresent,
    },
    platformAccounts: {
      total: platformAccountTotal,
      active: activeCount,
      statusBreakdown: statusBreakdown.map((r) => ({
        status: r.status,
        count: r._count._all,
      })),
      generationBreakdown: generationBreakdown.map((r) => ({
        generation: r.onboardingGeneration,
        count: r._count._all,
      })),
    },
    profiles,
    legalAcceptances,
    emailChallenges,
    phoneChallenges,
    providerIdentities,
    tenantMemberships,
    tenantInvites,
    clientRequestLinks,
    membershipOwnership,
    ownershipDependencies,
    classificationCounts,
    unclassifiedAuthUsers,
    unclassifiedPlatformAccounts,
    plannedDeletionCounts,
    storageBlockerCount: options.storageBlockerCount ?? 0,
    manifestSalt,
  };
}
