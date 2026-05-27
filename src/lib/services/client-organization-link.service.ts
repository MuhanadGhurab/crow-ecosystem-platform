import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import type {
  ClientOrganizationAccessDecision,
  ClientOrganizationAccessLevel,
  ClientOrganizationLinkSource,
  ClientOrganizationMembership,
  ClientOrganizationSummary,
  ClientOrganizationMembershipStatus,
  ClientOrganizationRole,
} from "@/lib/client-portal/client-organization-contract";
import { prisma } from "@/lib/db";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_DEMO_STRONG_OWNERSHIP_EMAIL } from "@/lib/client-portal/client-approval-contract";
import type { Prisma } from "@prisma/client";

function toMembershipRole(raw: string): ClientOrganizationRole {
  switch (raw) {
    case "owner":
    case "approver":
    case "reviewer":
    case "operations_contact":
    case "billing_contact":
    case "viewer":
      return raw;
    default:
      return "viewer";
  }
}

function toMembershipStatus(raw: string): ClientOrganizationMembershipStatus {
  switch (raw) {
    case "invited":
    case "active":
    case "pending_verification":
    case "suspended":
    case "removed":
      return raw;
    default:
      return "pending_verification";
  }
}

function baseDecision(): ClientOrganizationAccessDecision {
  return {
    organization: null,
    membership: null,
    accessLevel: "none",
    canViewRequests: false,
    canViewProposals: false,
    canViewBlueprints: false,
    canApproveScope: false,
    blockedReason: null,
    linkSource: null,
    requiresProCrowVerification: false,
  };
}

function accessLevelFromRole(role: ClientOrganizationRole | null): ClientOrganizationAccessLevel {
  if (!role) return "none";
  if (role === "owner") return "owner";
  if (role === "approver") return "approver";
  if (role === "reviewer" || role === "operations_contact" || role === "billing_contact") {
    return "reviewer";
  }
  return "viewer";
}

function summarizeOrganization(input: {
  id: string;
  name: string;
  industry: string | null;
  employeeBand: string | null;
  region: string | null;
  requestIds: string[];
  membershipCount: number;
  anyVerified: boolean;
}): ClientOrganizationSummary {
  return {
    organizationId: input.id,
    organizationName: input.name,
    industry: input.industry,
    employeeBand: input.employeeBand,
    region: input.region,
    linkedRequestIds: input.requestIds,
    linkedProposalIds: [],
    linkedBlueprintIds: [],
    tenantId: null,
    membershipCount: input.membershipCount,
    verificationStatus: input.anyVerified ? "procrow_verified" : "unverified",
  };
}

function summarizeMembership(args: {
  user: User;
  email: string | null;
  rawRole: string;
  rawStatus: string;
  linkSource: string;
  verifiedByProcrow: boolean;
  verifiedAt: Date | null;
}): ClientOrganizationMembership {
  const role = toMembershipRole(args.rawRole);
  const status = toMembershipStatus(args.rawStatus);
  const linkSource = (args.linkSource || "invitation") as ClientOrganizationLinkSource;

  const displayName =
    (args.user.user_metadata as { full_name?: string })?.full_name?.trim() ||
    args.user.email ||
    null;

  const isActive = status === "active";
  const isVerified = args.verifiedByProcrow;
  const roleEligible = role === "owner" || role === "approver";

  const canApproveScope = roleEligible && (isActive || isVerified);

  return {
    userId: args.user.id,
    email: args.email,
    displayName,
    role,
    status,
    linkSource,
    canApproveScope,
    canReviewBlueprint: true,
    canTrackOnboarding: true,
    canManageCompanyProfile: role === "owner" || role === "operations_contact",
    verifiedByProCrow: args.verifiedByProcrow,
    verifiedAt: args.verifiedAt ? args.verifiedAt.toISOString() : null,
  };
}

/**
 * Derive a read-only organization access decision for a single implementation request.
 *
 * This does not grant access by itself; existing access checks remain in place.
 * Approval must only be enabled when `canApproveScope === true`.
 */
export async function getClientOrganizationAccessDecisionForRequest(
  user: User,
  requestId: string,
): Promise<ClientOrganizationAccessDecision> {
  const decision = baseDecision();

  const auth = getCrowAuth(user);
  const staffPreview = isPlatformStaff(auth.role);

  if (staffPreview) {
    return {
      ...decision,
      canViewRequests: true,
      canViewProposals: true,
      canViewBlueprints: true,
      blockedReason: "platform_staff_preview",
      linkSource: "manual_admin_link",
    };
  }

  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      submittedByUserId: true,
      organizationName: true,
      industry: true,
      employeeBand: true,
      countryCode: true,
    },
  });

  if (!request) {
    return {
      ...decision,
      blockedReason: "request_not_found",
    };
  }

  const mockDemoStrong =
    isUseMockData() &&
    requestId === "mock-req-003" &&
    (user.email ?? "").trim().toLowerCase() === MOCK_DEMO_STRONG_OWNERSHIP_EMAIL.toLowerCase();

  const strongSubmitter = request.submittedByUserId === user.id || mockDemoStrong;

  // Strong submitter can approve even before organization linkage exists.
  // In non-mock mode, `mockDemoStrong` is false, so this is truly user-backed.
  if (strongSubmitter) {
    const summary: ClientOrganizationSummary = {
      organizationId: `request-${request.id}`,
      organizationName: request.organizationName ?? "Unlinked organization",
      industry: request.industry,
      employeeBand: request.employeeBand,
      region: request.countryCode ?? null,
      linkedRequestIds: [request.id],
      linkedProposalIds: [],
      linkedBlueprintIds: [],
      tenantId: null,
      membershipCount: 0,
      verificationStatus: "unverified",
    };

    return {
      organization: summary,
      membership: null,
      accessLevel: "approver",
      canViewRequests: true,
      canViewProposals: true,
      canViewBlueprints: true,
      canApproveScope: true,
      blockedReason: null,
      linkSource: mockDemoStrong ? null : "submitted_by_user",
      requiresProCrowVerification: false,
    };
  }

  // Look for an explicit organization link and membership.
  // Migration-created tables may not exist yet in local environments,
  // so we fail closed (deny approval) on query errors.
  type LinkPayload = Prisma.ClientOrganizationRequestLinkGetPayload<{
    include: {
      organization: {
        include: {
          members: true;
          requestLinks: { select: { requestId: true } };
        };
      };
    };
  }>;

  let link: LinkPayload | null = null;
  try {
    link = await prisma.clientOrganizationRequestLink.findUnique({
      where: { requestId },
      include: {
        organization: {
          include: {
            members: true,
            requestLinks: {
              select: { requestId: true },
            },
          },
        },
      },
    });
  } catch {
    return {
      ...decision,
      blockedReason: "no_organization_link",
      linkSource: null,
    };
  }

  const organization = link?.organization;

  if (organization) {
    const member = organization.members.find((m) => m.supabaseUserId === user.id) ?? null;

    const summary: ClientOrganizationSummary = summarizeOrganization({
      id: organization.id,
      name: organization.name,
      industry: organization.industry,
      employeeBand: organization.employeeBand,
      region: organization.region,
      requestIds: organization.requestLinks.map((r) => r.requestId),
      membershipCount: organization.members.length,
      anyVerified: organization.members.some((m) => m.verifiedByProcrow),
    });

    let membership: ClientOrganizationMembership | null = null;
    let accessLevel: ClientOrganizationAccessLevel = "none";
    let canApproveScope = false;
    let requiresProCrowVerification = false;
    let blockedReason: string | null = null;
    let linkSource: ClientOrganizationLinkSource | null = null;

    if (member) {
      membership = summarizeMembership({
        user,
        email: member.email,
        rawRole: member.role,
        rawStatus: member.status,
        linkSource: member.linkSource,
        verifiedByProcrow: member.verifiedByProcrow,
        verifiedAt: member.verifiedAt,
      });

      accessLevel = accessLevelFromRole(membership.role);
      canApproveScope = membership.canApproveScope;
      linkSource = membership.linkSource;

      if (!membership.canApproveScope) {
        requiresProCrowVerification = true;
        blockedReason = "membership_not_verified";
      }
    } else {
      // Organization is linked but this user has no membership yet.
      accessLevel = "none";
      requiresProCrowVerification = true;
      blockedReason = "membership_required";
      linkSource = "contact_email_match";
    }

    return {
      organization: summary,
      membership,
      accessLevel,
      canViewRequests: true,
      canViewProposals: true,
      canViewBlueprints: true,
      canApproveScope,
      blockedReason,
      linkSource,
      requiresProCrowVerification,
    };
  }

  return {
    ...decision,
    blockedReason: "no_organization_link",
  };
}

