import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  PROCROW_COUNTERPARTS,
  type ClientPortalAuthState,
  type ClientPortalBlueprintSummary,
  type ClientPortalCompanyProfile,
  type ClientPortalDashboardSnapshot,
  type ClientPortalProposalSummary,
  type ClientPortalRequestSummary,
  type ClientPortalSecurityNote,
} from "@/lib/client-portal/client-portal-contract";
import { buildOnboardingStepsForRequest } from "@/lib/client-portal/onboarding-steps";
import { moduleLabel, planLabel } from "@/lib/catalog-labels";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_CLIENT_REQUESTS } from "@/lib/mock/portal";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { listClientRequests } from "@/lib/services/client-request-link.service";

function nextActionForRequest(
  status: ImplementationRequestStatus,
  proposalStatus: string | null
): string {
  if (status === "PENDING_REVIEW") {
    return "ProCrow is reviewing your request. We will contact you when discovery begins.";
  }
  if (status === "UNDER_DISCOVERY") {
    return "Complete discovery with your ProCrow team when invited.";
  }
  if (status === "BLUEPRINT_BUILD") {
    return "Blueprint is in progress. Review scope in Blueprints when available.";
  }
  if (proposalStatus === "SENT") {
    return "Review your commercial proposal in the Client Portal (sign-in required for approval).";
  }
  if (status === "TENANT_PROVISIONING" || status === "SECURITY_INIT" || status === "SAREA_INIT") {
    return "ProCrow is preparing your environment. Track onboarding steps here.";
  }
  if (status === "GO_LIVE" || status === "APPROVED") {
    return "Coordinate go-live with your ProCrow contact.";
  }
  if (status === "REJECTED" || status === "CANCELLED") {
    return "This request is closed. Contact ProCrow if you need a new submission.";
  }
  return "Check back for updates from ProCrow.";
}

function companyProfileFromRequest(row: {
  id: string;
  organizationName: string;
  industry: string | null;
  employeeBand: string | null;
  countryCode: string;
  contacts: { fullName: string; email: string; isPrimary: boolean }[];
}): ClientPortalCompanyProfile {
  const primary = row.contacts.find((c) => c.isPrimary) ?? row.contacts[0];
  const missing: string[] = [];
  if (!row.industry) missing.push("industry");
  if (!row.employeeBand) missing.push("employee band");
  if (!primary?.fullName) missing.push("primary contact name");
  if (!primary?.email) missing.push("primary contact email");

  const total = 4;
  const profileCompleteness = Math.round(((total - missing.length) / total) * 100);

  return {
    id: row.id,
    companyName: row.organizationName,
    industry: row.industry,
    employeeBand: row.employeeBand,
    region: row.countryCode || null,
    primaryContactName: primary?.fullName ?? null,
    primaryContactEmail: primary?.email ?? null,
    profileCompleteness,
    missingFields: missing,
  };
}

function mapRequestSummary(row: {
  id: string;
  referenceCode: string;
  organizationName: string;
  industry: string | null;
  status: ImplementationRequestStatus;
  createdAt: Date | string;
  enterpriseBlueprint?: {
    id: string;
    status: string;
    proposalStatus: string;
  } | null;
}): ClientPortalRequestSummary {
  const proposalStatus = row.enterpriseBlueprint?.proposalStatus ?? null;
  return {
    requestId: row.id,
    referenceCode: row.referenceCode,
    organizationName: row.organizationName,
    industry: row.industry,
    status: row.status,
    submittedAt:
      typeof row.createdAt === "string" ? row.createdAt : row.createdAt.toISOString(),
    proposalStatus: proposalStatus as ClientPortalRequestSummary["proposalStatus"],
    blueprintStatus: (row.enterpriseBlueprint?.status ??
      null) as ClientPortalRequestSummary["blueprintStatus"],
    nextAction: nextActionForRequest(row.status, proposalStatus),
  };
}

function mapProposalSummary(
  blueprintId: string,
  requestId: string,
  orgName: string,
  status: string,
  sentAt: Date | null
): ClientPortalProposalSummary {
  return {
    proposalId: blueprintId,
    requestId,
    status: status as ClientPortalProposalSummary["status"],
    title: `Commercial proposal — ${orgName}`,
    sentAt: sentAt?.toISOString() ?? null,
    expiresAt: null,
    canView: true,
    canApprove: false,
    approvalBlockedReason: CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  };
}

function mapBlueprintSummary(row: {
  id: string;
  requestId: string;
  status: string;
  requestedModules: { moduleKey: string }[];
  requestedPlans: { planKey: string }[];
}): ClientPortalBlueprintSummary {
  const modules = row.requestedModules.map((m) => moduleLabel(m.moduleKey));
  const plan = row.requestedPlans[0]?.planKey;
  const bpStatus = row.status as ClientPortalBlueprintSummary["status"];
  const readinessLabels: Record<string, string> = {
    DRAFT: "Draft",
    IN_REVIEW: "In review",
    APPROVED: "Approved",
    ARCHIVED: "Archived",
  };
  return {
    blueprintId: row.id,
    requestId: row.requestId,
    status: bpStatus,
    operatingModel: plan ? `${planLabel(plan)} operating model` : "Enterprise operating model",
    modules,
    readinessLabel: readinessLabels[row.status] ?? row.status,
    reviewNotes: null,
  };
}

const BASE_SECURITY_NOTES: ClientPortalSecurityNote[] = [
  {
    id: "token-not-auth",
    message:
      "Email proposal links help you find your proposal. They do not grant approval rights without Client Portal sign-in.",
  },
  {
    id: "approval-future",
    message: CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  },
  {
    id: "procrow-owner",
    message: "ProCrow manages internal review, blueprint readiness, and provisioning gates.",
  },
];

export function resolveClientPortalAuthState(user: User | null): ClientPortalAuthState {
  if (!user) return "unauthenticated";
  const { role } = getCrowAuth(user);
  if (isPlatformStaff(role)) return "platform_staff";
  return "authenticated_unlinked";
}

export async function buildClientPortalDashboardSnapshot(
  user: User
): Promise<ClientPortalDashboardSnapshot> {
  const { role } = getCrowAuth(user);
  const authState: ClientPortalAuthState = isPlatformStaff(role)
    ? "platform_staff"
    : "authenticated_unlinked";

  const account = {
    userId: user.id,
    email: user.email ?? null,
    displayName: user.user_metadata?.full_name as string | undefined ?? user.email ?? null,
    role: isPlatformStaff(role) ? null : ("request_submitter" as const),
    accessLevel: isPlatformStaff(role) ? ("viewer" as const) : ("viewer" as const),
  };

  let requests: ClientPortalRequestSummary[] = [];
  let proposals: ClientPortalProposalSummary[] = [];
  let blueprints: ClientPortalBlueprintSummary[] = [];
  let companyProfile: ClientPortalCompanyProfile | null = null;
  let linkedAuth: ClientPortalAuthState = authState;

  if (isUseMockData()) {
    requests = MOCK_CLIENT_REQUESTS.map((r) => {
      const pipeline = MOCK_PIPELINE_REQUESTS.find((p) => p.id === r.id);
      return mapRequestSummary({
        id: r.id,
        referenceCode: r.referenceCode,
        organizationName: r.organizationName,
        industry:
          pipeline && "industry" in pipeline
            ? String((pipeline as { industry: string }).industry)
            : null,
        status: r.status,
        createdAt: r.updatedAt,
        enterpriseBlueprint: pipeline?.blueprintId
          ? {
              id: pipeline.blueprintId,
              status: "IN_REVIEW",
              proposalStatus: r.proposalToken ? "SENT" : "DRAFT",
            }
          : null,
      });
    });
    if (requests[0]) {
      companyProfile = {
        id: requests[0].requestId,
        companyName: requests[0].organizationName,
        industry: requests[0].industry,
        employeeBand:
          MOCK_PIPELINE_REQUESTS[0] && "employeeBand" in MOCK_PIPELINE_REQUESTS[0]
            ? String((MOCK_PIPELINE_REQUESTS[0] as { employeeBand: string }).employeeBand)
            : null,
        region: "SA",
        primaryContactName: "Demo sponsor",
        primaryContactEmail: user.email ?? "client.demo@alnoor.test",
        profileCompleteness: 100,
        missingFields: [],
      };
    }
    linkedAuth = "authenticated_linked";
  } else if (user.email) {
    try {
      const rows = await listClientRequests(user.id, user.email);
      if (rows.length > 0) {
        linkedAuth = isPlatformStaff(role) ? "platform_staff" : "authenticated_linked";
        requests = rows.map((r) =>
          mapRequestSummary({
            id: r.id,
            referenceCode: r.referenceCode,
            organizationName: r.organizationName,
            industry: r.industry,
            status: r.status as ImplementationRequestStatus,
            createdAt: r.createdAt,
            enterpriseBlueprint: r.enterpriseBlueprint
              ? {
                  id: r.enterpriseBlueprint.id,
                  status: "IN_REVIEW",
                  proposalStatus: r.enterpriseBlueprint.proposalStatus,
                }
              : null,
          })
        );
        companyProfile = companyProfileFromRequest(rows[0]);

        for (const r of rows) {
          const bp = r.enterpriseBlueprint;
          if (!bp) continue;
          blueprints.push(
            mapBlueprintSummary({
              id: bp.id,
              requestId: r.id,
              status: bp.status,
              requestedModules: r.requestedModules,
              requestedPlans: r.requestedPlans,
            })
          );
          if (bp.proposalStatus !== "DRAFT") {
            proposals.push(
              mapProposalSummary(
                bp.id,
                r.id,
                r.organizationName,
                bp.proposalStatus,
                bp.proposalSentAt
              )
            );
          }
        }
      }
    } catch {
      /* DB unavailable — stay unlinked with empty data */
    }
  }

  const primaryRequest = requests[0];
  const onboardingSteps = primaryRequest
    ? buildOnboardingStepsForRequest(primaryRequest.requestId, primaryRequest.status)
    : [];

  const nextActions: string[] = [];
  if (linkedAuth === "authenticated_unlinked" || linkedAuth === "platform_staff") {
    nextActions.push(
      "No requests are linked to this account yet. Use the same email as your request contact, or submit a new request."
    );
  } else if (primaryRequest) {
    nextActions.push(primaryRequest.nextAction);
  } else {
    nextActions.push("Submit an implementation request to get started.");
  }

  if (linkedAuth === "platform_staff") {
    nextActions.unshift(
      "Staff preview — client data shown only when requests match your signed-in email or demo mock."
    );
  }

  return {
    authState: linkedAuth,
    account,
    companyProfile,
    requests,
    proposals,
    blueprints,
    onboardingSteps,
    securityNotes: BASE_SECURITY_NOTES,
    procrowCounterparts: PROCROW_COUNTERPARTS,
    nextActions,
  };
}

export function unauthenticatedClientPortalSnapshot(): ClientPortalDashboardSnapshot {
  return {
    authState: "unauthenticated",
    account: null,
    companyProfile: null,
    requests: [],
    proposals: [],
    blueprints: [],
    onboardingSteps: [],
    securityNotes: BASE_SECURITY_NOTES,
    procrowCounterparts: PROCROW_COUNTERPARTS,
    nextActions: ["Sign in to view requests and proposals linked to your organization."],
  };
}
