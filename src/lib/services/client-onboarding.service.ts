import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import type { ProposalStatus } from "@prisma/client";
import {
  CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE,
  CLIENT_ONBOARDING_STATUS_LABELS,
  CLIENT_ONBOARDING_TRUST_NOTES,
  type ClientOnboardingDashboardTile,
  type ClientOnboardingStatus,
  type ClientOnboardingTenantRuntimeState,
  type ClientOnboardingTracker,
} from "@/lib/client-portal/client-onboarding-contract";
import {
  buildClientOnboardingTrackerSteps,
  pickCurrentOnboardingStep,
  type ClientOnboardingBuildInput,
} from "@/lib/client-portal/client-onboarding-steps";
import { getMockProposalApprovalOverrides } from "@/lib/mock/blueprint";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_CLIENT_REQUESTS } from "@/lib/mock/portal";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import { routes } from "@/lib/routes";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { buildClientCompanyPageModel, buildClientProfilePageModel } from "@/lib/services/client-profile.service";
import {
  clientCanAccessRequest,
  listClientRequests,
} from "@/lib/services/client-request-link.service";

type RequestRow = Awaited<ReturnType<typeof listClientRequests>>[number];

function proposalSentStatus(status: ProposalStatus | null | undefined): boolean {
  if (!status) return false;
  return status !== "DRAFT";
}

function scopeApprovedStatus(status: ProposalStatus | null | undefined): boolean {
  return status === "CLIENT_APPROVED";
}

function deriveTenantRuntime(
  hasTenant: boolean,
  tenantActive: boolean
): { state: ClientOnboardingTenantRuntimeState; label: string; route: string | null } {
  if (!hasTenant) {
    return {
      state: "not_provisioned",
      label: "Not provisioned — ProCrow controls when a tenant runtime is created.",
      route: null,
    };
  }
  if (tenantActive) {
    return {
      state: "ready",
      label: "Runtime workspace prepared — production launch remains separately gated.",
      route: null,
    };
  }
  return {
    state: "pending",
    label: "Tenant runtime is being prepared — not automatic production launch.",
    route: null,
  };
}

function deriveOverallStatus(
  input: ClientOnboardingBuildInput,
  tenant: ClientOnboardingTenantRuntimeState
): ClientOnboardingStatus {
  if (input.requestStatus === "REJECTED" || input.requestStatus === "CANCELLED") {
    return "paused";
  }

  if (tenant === "ready") return "tenant_ready";
  if (tenant === "pending") return "tenant_pending";

  if (!input.hasBlueprint && !input.hasDiscovery) {
    return input.requestStatus === "PENDING_REVIEW" ? "not_started" : "procrow_review";
  }

  if (input.proposalSent && !input.scopeApproved) {
    return "waiting_for_scope_approval";
  }

  if (input.scopeApproved) {
    if (!input.profileComplete || !input.companyComplete) {
      return "missing_information";
    }
    if (
      input.hasBlueprint &&
      input.blueprintStatus === "APPROVED" &&
      input.requestStatus === "TENANT_PROVISIONING"
    ) {
      return "provisioning_ready";
    }
    if (input.scopeApproved && input.profileComplete && input.companyComplete) {
      return "procrow_review";
    }
    return "scope_approved";
  }

  return "procrow_review";
}

function buildInputFromRequest(
  row: RequestRow,
  profileComplete: boolean,
  companyComplete: boolean,
  mockProposalStatus?: ProposalStatus | null
): ClientOnboardingBuildInput {
  const bp = row.enterpriseBlueprint;
  const proposalStatus =
    mockProposalStatus ?? bp?.proposalStatus ?? null;

  return {
    requestId: row.id,
    requestStatus: row.status as ImplementationRequestStatus,
    hasDiscovery: Boolean(row.discoveryProfile),
    hasBlueprint: Boolean(bp),
    blueprintStatus: bp?.status ?? null,
    proposalStatus,
    proposalSent: proposalSentStatus(proposalStatus) || Boolean(bp?.proposalSentAt),
    scopeApproved: scopeApprovedStatus(proposalStatus),
    profileComplete,
    companyComplete,
    hasTenant: Boolean(bp?.tenant?.id),
    tenantActive: Boolean(bp?.tenant?.isActive),
    blueprintId: bp?.id ?? null,
    proposalId: bp?.id ?? null,
  };
}

function buildTrackerFromInput(
  row: RequestRow,
  input: ClientOnboardingBuildInput
): ClientOnboardingTracker {
  const tenantMeta = deriveTenantRuntime(input.hasTenant, input.tenantActive);
  const overallStatus = deriveOverallStatus(input, tenantMeta.state);
  const steps = buildClientOnboardingTrackerSteps(input);
  const currentStep = pickCurrentOnboardingStep(steps);

  const missingInformation: string[] = [];
  if (!input.profileComplete) {
    missingInformation.push("Complete your account profile (/client/profile).");
  }
  if (!input.companyComplete) {
    missingInformation.push("Review company details on your linked request (/client/company).");
  }
  if (input.proposalSent && !input.scopeApproved) {
    missingInformation.push("Approve commercial scope on your linked proposal when eligible.");
  }
  if (!input.hasBlueprint) {
    missingInformation.push("Enterprise blueprint is still being prepared by ProCrow.");
  }

  const clientNextActions: string[] = [];
  if (overallStatus === "waiting_for_scope_approval" && input.proposalId) {
    clientNextActions.push(`Review and approve scope on proposal ${input.proposalId}.`);
  }
  if (!input.profileComplete) {
    clientNextActions.push("Complete profile basics at /client/profile.");
  }
  if (!input.companyComplete) {
    clientNextActions.push("Confirm company information at /client/company.");
  }
  if (clientNextActions.length === 0) {
    clientNextActions.push("Monitor onboarding steps — ProCrow will contact you for any gaps.");
    clientNextActions.push("Open /client/onboarding for the full timeline.");
  }

  const procrowNextActions: string[] = [];
  if (input.scopeApproved) {
    procrowNextActions.push("Confirm onboarding checklist and missing client information.");
  } else if (input.proposalSent) {
    procrowNextActions.push("Wait for authenticated client scope approval in the portal.");
  } else {
    procrowNextActions.push("Advance discovery / blueprint and send proposal when ready.");
  }
  if (overallStatus === "provisioning_ready") {
    procrowNextActions.push("Run go/no-go and provision tenant runtime manually (no auto-create).");
  }
  if (tenantMeta.state === "pending") {
    procrowNextActions.push("Complete tenant runtime preparation before client preview.");
  }
  procrowNextActions.push("Production launch remains F23-gated — do not enable billing from approval.");

  const approvedAt =
    (row.enterpriseBlueprint as { clientApprovedAt?: Date | null })?.clientApprovedAt ??
    getMockProposalApprovalOverrides().clientApprovedAt;

  return {
    requestId: row.id,
    referenceCode: row.referenceCode,
    organizationName: row.organizationName,
    overallStatus,
    statusLabel: CLIENT_ONBOARDING_STATUS_LABELS[overallStatus],
    currentStep,
    steps,
    missingInformation,
    procrowNextActions,
    clientNextActions,
    tenantRuntimeState: tenantMeta.state,
    tenantRuntimeLabel: tenantMeta.label,
    tenantRoute: tenantMeta.route,
    approvalSummary: {
      proposalStatus: input.proposalStatus,
      clientApprovedAt: approvedAt ? approvedAt.toISOString() : null,
      scopeApproved: input.scopeApproved,
    },
    trustNotes: [...CLIENT_ONBOARDING_TRUST_NOTES, CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE],
    blueprintId: input.blueprintId,
    proposalId: input.proposalId,
  };
}

async function profileAndCompanyComplete(user: User): Promise<{
  profileComplete: boolean;
  companyComplete: boolean;
}> {
  const [profile, company] = await Promise.all([
    buildClientProfilePageModel(user),
    buildClientCompanyPageModel(user),
  ]);
  const profileComplete = profile.profile.readiness.missingFields.length === 0;
  const companyComplete =
    (company.company?.readiness.missingFields.length ?? 1) === 0 &&
    (company.company?.readiness.companyLinkStatus ?? "not_linked") !== "not_linked";
  return { profileComplete, companyComplete };
}

export async function buildClientOnboardingTracker(
  user: User,
  requestId: string
): Promise<ClientOnboardingTracker | null> {
  const email = user.email ?? "";
  const canAccess = await clientCanAccessRequest(user.id, email, requestId);
  if (!canAccess) return null;

  const { profileComplete, companyComplete } = await profileAndCompanyComplete(user);

  if (isUseMockData() && requestId.startsWith("mock-req-")) {
    const mockRow = MOCK_PIPELINE_REQUESTS.find((m) => m.id === requestId);
    const clientRow = MOCK_CLIENT_REQUESTS.find((m) => m.id === requestId);
    if (!mockRow && !clientRow) return null;

    const overrides = getMockProposalApprovalOverrides();
    const input: ClientOnboardingBuildInput = {
      requestId,
      requestStatus: (mockRow?.status ?? clientRow?.status ?? "PENDING_REVIEW") as ImplementationRequestStatus,
      hasDiscovery: mockRow?.discoveryAvailable ?? false,
      hasBlueprint: Boolean(mockRow?.blueprintId),
      blueprintStatus: mockRow?.blueprintId ? "APPROVED" : null,
      proposalStatus: overrides.proposalStatus ?? mockRow?.proposalStatus ?? null,
      proposalSent: proposalSentStatus(overrides.proposalStatus ?? mockRow?.proposalStatus),
      scopeApproved: overrides.proposalStatus === "CLIENT_APPROVED",
      profileComplete,
      companyComplete,
      hasTenant: Boolean(mockRow?.tenantSlug),
      tenantActive: Boolean(mockRow?.tenantSlug),
      blueprintId: mockRow?.blueprintId ?? null,
      proposalId: mockRow?.blueprintId ?? null,
    };

    const syntheticRow = {
      id: requestId,
      referenceCode: mockRow?.referenceCode ?? clientRow?.referenceCode ?? requestId,
      organizationName: mockRow?.organizationName ?? clientRow?.organizationName ?? "Organization",
      status: input.requestStatus,
      enterpriseBlueprint: {
        id: mockRow?.blueprintId ?? null,
        proposalStatus: input.proposalStatus,
        clientApprovedAt: overrides.clientApprovedAt ?? null,
      },
    } as unknown as RequestRow;

    return buildTrackerFromInput(syntheticRow, input);
  }

  const rows = await listClientRequests(user.id, email);
  const row = rows.find((r) => r.id === requestId);
  if (!row) return null;

  const input = buildInputFromRequest(row, profileComplete, companyComplete);
  return buildTrackerFromInput(row, input);
}

export async function buildClientOnboardingOverview(user: User): Promise<{
  trackers: ClientOnboardingTracker[];
  primary: ClientOnboardingTracker | null;
}> {
  const email = user.email ?? "";
  const { profileComplete, companyComplete } = await profileAndCompanyComplete(user);
  const rows = await listClientRequests(user.id, email);

  if (rows.length === 0 && isUseMockData()) {
    const trackers: ClientOnboardingTracker[] = [];
    for (const mockId of MOCK_CLIENT_REQUESTS.map((r) => r.id)) {
      const t = await buildClientOnboardingTracker(user, mockId);
      if (t) trackers.push(t);
    }
    return { trackers, primary: trackers[0] ?? null };
  }

  const trackers = rows.map((row) => {
    const mockOverride = isUseMockData()
      ? getMockProposalApprovalOverrides().proposalStatus
      : undefined;
    const input = buildInputFromRequest(row, profileComplete, companyComplete, mockOverride);
    return buildTrackerFromInput(row, input);
  });

  return { trackers, primary: trackers[0] ?? null };
}

export async function buildClientOnboardingDashboardTile(
  user: User
): Promise<ClientOnboardingDashboardTile | null> {
  const { primary } = await buildClientOnboardingOverview(user);
  if (!primary) {
    return {
      overallStatus: "not_started",
      statusLabel: CLIENT_ONBOARDING_STATUS_LABELS.not_started,
      currentStepLabel: "Link a request to start onboarding",
      clientNextAction: "Submit a request or sign in with your primary contact email.",
      organizationName: null,
      tenantRuntimeLabel: deriveTenantRuntime(false, false).label,
      link: routes.client.onboarding,
    };
  }

  return {
    overallStatus: primary.overallStatus,
    statusLabel: primary.statusLabel,
    currentStepLabel: primary.currentStep?.label ?? primary.statusLabel,
    clientNextAction: primary.clientNextActions[0] ?? "View onboarding tracker.",
    organizationName: primary.organizationName,
    tenantRuntimeLabel: primary.tenantRuntimeLabel,
    link: routes.client.onboarding,
  };
}

/** ProCrow/admin: derived tracker without client access gate */
export async function buildClientOnboardingTrackerForAdmin(
  requestId: string
): Promise<ClientOnboardingTracker | null> {
  if (isUseMockData()) {
    const mockRow = MOCK_PIPELINE_REQUESTS.find((m) => m.id === requestId);
    if (!mockRow) return null;
    const overrides = getMockProposalApprovalOverrides();
    const input: ClientOnboardingBuildInput = {
      requestId,
      requestStatus: mockRow.status,
      hasDiscovery: mockRow.discoveryAvailable,
      hasBlueprint: Boolean(mockRow.blueprintId),
      blueprintStatus: mockRow.blueprintId ? "APPROVED" : null,
      proposalStatus: overrides.proposalStatus ?? mockRow.proposalStatus ?? null,
      proposalSent: proposalSentStatus(overrides.proposalStatus ?? mockRow.proposalStatus),
      scopeApproved: overrides.proposalStatus === "CLIENT_APPROVED",
      profileComplete: true,
      companyComplete: true,
      hasTenant: Boolean(mockRow.tenantSlug),
      tenantActive: Boolean(mockRow.tenantSlug),
      blueprintId: mockRow.blueprintId,
      proposalId: mockRow.blueprintId,
    };
    const syntheticRow = {
      id: requestId,
      referenceCode: mockRow.referenceCode,
      organizationName: mockRow.organizationName,
      status: mockRow.status,
      enterpriseBlueprint: {
        id: mockRow.blueprintId,
        proposalStatus: input.proposalStatus,
        clientApprovedAt: overrides.clientApprovedAt ?? null,
      },
    } as unknown as RequestRow;
    return buildTrackerFromInput(syntheticRow, input);
  }

  const { prisma } = await import("@/lib/db");
  const row = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      discoveryProfile: true,
      enterpriseBlueprint: {
        include: { tenant: { select: { id: true, slug: true, isActive: true } } },
      },
    },
  });
  if (!row) return null;

  const bp = row.enterpriseBlueprint;
  const proposalStatus = bp?.proposalStatus ?? null;
  const input: ClientOnboardingBuildInput = {
    requestId: row.id,
    requestStatus: row.status as ImplementationRequestStatus,
    hasDiscovery: Boolean(row.discoveryProfile),
    hasBlueprint: Boolean(bp),
    blueprintStatus: bp?.status ?? null,
    proposalStatus,
    proposalSent: proposalSentStatus(proposalStatus) || Boolean(bp?.proposalSentAt),
    scopeApproved: scopeApprovedStatus(proposalStatus),
    profileComplete: true,
    companyComplete: true,
    hasTenant: Boolean(bp?.tenant?.id),
    tenantActive: Boolean(bp?.tenant?.isActive),
    blueprintId: bp?.id ?? null,
    proposalId: bp?.id ?? null,
  };

  const adminRow = {
    id: row.id,
    referenceCode: row.referenceCode,
    organizationName: row.organizationName,
    status: row.status,
    enterpriseBlueprint: bp,
  } as unknown as RequestRow;

  return buildTrackerFromInput(adminRow, input);
}
