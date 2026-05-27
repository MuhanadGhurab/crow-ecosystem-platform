import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { ProposalStatus } from "@prisma/client";
import type {
  ClientOnboardingStep,
  ClientOnboardingStepStatus,
} from "@/lib/client-portal/client-onboarding-contract";

export type ClientOnboardingBuildInput = {
  requestId: string;
  requestStatus: ImplementationRequestStatus;
  hasDiscovery: boolean;
  hasBlueprint: boolean;
  blueprintStatus: string | null;
  proposalStatus: ProposalStatus | null;
  proposalSent: boolean;
  scopeApproved: boolean;
  profileComplete: boolean;
  companyComplete: boolean;
  hasTenant: boolean;
  tenantActive: boolean;
  blueprintId: string | null;
  proposalId: string | null;
};

type StepDef = {
  key: string;
  label: string;
  owner: ClientOnboardingStep["owner"];
  description: string;
  relatedRoute: string | ((i: ClientOnboardingBuildInput) => string | null);
  /** When true, step is considered complete */
  isComplete: (i: ClientOnboardingBuildInput) => boolean;
  /** When true, step is blocked */
  isBlocked?: (i: ClientOnboardingBuildInput) => boolean;
  blockedReason?: (i: ClientOnboardingBuildInput) => string;
};

const STEP_DEFS: StepDef[] = [
  {
    key: "request_submitted",
    label: "Request submitted",
    owner: "client",
    description: "Your implementation request is on file with ProCrow.",
    relatedRoute: (i) => `/client/requests/${i.requestId}`,
    isComplete: () => true,
  },
  {
    key: "procrow_intake",
    label: "ProCrow review",
    owner: "procrow",
    description: "ProCrow reviews intake, discovery readiness, and pipeline status.",
    relatedRoute: (i) => `/client/requests/${i.requestId}`,
    isComplete: (i) =>
      !["PENDING_REVIEW", "DRAFT"].includes(i.requestStatus) || i.hasDiscovery,
    isBlocked: (i) => i.requestStatus === "REJECTED" || i.requestStatus === "CANCELLED",
    blockedReason: () => "Request is not active — contact ProCrow.",
  },
  {
    key: "discovery_blueprint",
    label: "Discovery & blueprint readiness",
    owner: "procrow",
    description: "Discovery and enterprise blueprint preparation (ProCrow-owned).",
    relatedRoute: (i) =>
      i.blueprintId ? `/client/blueprints/${i.blueprintId}` : `/client/requests/${i.requestId}`,
    isComplete: (i) => i.hasBlueprint,
  },
  {
    key: "proposal_sent",
    label: "Proposal sent",
    owner: "procrow",
    description: "Commercial proposal prepared and shared for your review.",
    relatedRoute: (i) =>
      i.proposalId ? `/client/proposals/${i.proposalId}` : `/client/requests/${i.requestId}`,
    isComplete: (i) => i.proposalSent || Boolean(i.proposalStatus && i.proposalStatus !== "DRAFT"),
  },
  {
    key: "client_scope_approval",
    label: "Client scope approval",
    owner: "client",
    description: "Authenticated approval of commercial scope in the Client Portal (not a legal signature).",
    relatedRoute: (i) =>
      i.proposalId ? `/client/proposals/${i.proposalId}` : `/client/proposals`,
    isComplete: (i) => i.scopeApproved,
    isBlocked: (i) => i.proposalSent && !i.scopeApproved,
    blockedReason: () => "Open your linked proposal and approve scope when eligible.",
  },
  {
    key: "profile_company",
    label: "Profile & company information",
    owner: "client",
    description: "Account profile and company details ProCrow uses for onboarding.",
    relatedRoute: () => "/client/company",
    isComplete: (i) => i.profileComplete && i.companyComplete,
    isBlocked: (i) => !i.profileComplete || !i.companyComplete,
    blockedReason: (i) => {
      const parts: string[] = [];
      if (!i.profileComplete) parts.push("complete your profile");
      if (!i.companyComplete) parts.push("review company details");
      return `Please ${parts.join(" and ")}.`;
    },
  },
  {
    key: "procrow_onboarding_review",
    label: "ProCrow onboarding review",
    owner: "procrow",
    description: "ProCrow validates readiness after scope approval and profile checks.",
    relatedRoute: (i) => `/client/requests/${i.requestId}`,
    isComplete: (i) =>
      i.scopeApproved && i.profileComplete && i.companyComplete && i.hasBlueprint,
    isBlocked: (i) => i.scopeApproved && (!i.profileComplete || !i.companyComplete),
    blockedReason: () => "Waiting on client profile or company information.",
  },
  {
    key: "cybercrow_readiness",
    label: "CyberCrow trust readiness",
    owner: "procrow",
    description: "Security baseline and trust controls (ProCrow / CyberCrow — not auto-certified).",
    relatedRoute: (i) =>
      i.blueprintId ? `/client/blueprints/${i.blueprintId}` : `/client/onboarding`,
    isComplete: (i) =>
      i.scopeApproved && i.hasBlueprint && i.blueprintStatus === "APPROVED",
  },
  {
    key: "sarea_readiness",
    label: "SAREA experience readiness",
    owner: "procrow",
    description: "Experience profiles and navigation readiness (ProCrow-owned).",
    relatedRoute: (i) =>
      i.blueprintId ? `/client/blueprints/${i.blueprintId}` : `/client/onboarding`,
    isComplete: (i) => i.scopeApproved && i.hasBlueprint,
  },
  {
    key: "provisioning_readiness",
    label: "Tenant provisioning readiness",
    owner: "procrow",
    description: "Go/no-go and provisioning checklist before any tenant runtime is created.",
    relatedRoute: () => "/client/onboarding",
    isComplete: (i) =>
      i.scopeApproved &&
      i.hasBlueprint &&
      i.profileComplete &&
      i.companyComplete &&
      (i.hasTenant || i.requestStatus === "TENANT_PROVISIONING"),
  },
  {
    key: "tenant_pending",
    label: "Tenant runtime pending",
    owner: "system",
    description: "Dedicated tenant runtime is being prepared; not production launch.",
    relatedRoute: (i) => (i.hasTenant ? "/client/onboarding" : null),
    isComplete: (i) => i.hasTenant && !i.tenantActive,
    isBlocked: (i) => !i.hasTenant,
    blockedReason: () => "No tenant runtime yet — ProCrow controls provisioning.",
  },
  {
    key: "tenant_ready",
    label: "Tenant runtime ready",
    owner: "tenant_admin",
    description: "Preview/runtime workspace available; production remains separately gated.",
    relatedRoute: () => "/client/onboarding",
    isComplete: (i) => i.hasTenant && i.tenantActive,
    isBlocked: (i) => !i.hasTenant,
    blockedReason: () => "Tenant runtime not provisioned yet.",
  },
];

function routeFor(def: StepDef, input: ClientOnboardingBuildInput): string | null {
  const r = def.relatedRoute;
  return typeof r === "function" ? r(input) : r;
}

function resolveStepStatuses(input: ClientOnboardingBuildInput): ClientOnboardingStep[] {
  const steps: ClientOnboardingStep[] = [];
  let foundCurrent = false;

  for (const def of STEP_DEFS) {
    const complete = def.isComplete(input);
    const blocked = def.isBlocked?.(input) ?? false;
    let status: ClientOnboardingStepStatus;

    if (complete) {
      status = "complete";
    } else if (blocked) {
      status = "blocked";
    } else if (!foundCurrent) {
      status = "current";
      foundCurrent = true;
    } else {
      status = "pending";
    }

    if (input.requestStatus === "REJECTED" || input.requestStatus === "CANCELLED") {
      if (!complete) status = status === "current" ? "blocked" : status;
    }

    steps.push({
      key: def.key,
      label: def.label,
      owner: def.owner,
      description: def.description,
      relatedRoute: routeFor(def, input),
      status,
      blockedReason: blocked ? def.blockedReason?.(input) : undefined,
      evidenceNote: complete ? "Recorded from linked portal data." : undefined,
    });
  }

  return steps;
}

export function buildClientOnboardingTrackerSteps(
  input: ClientOnboardingBuildInput
): ClientOnboardingStep[] {
  return resolveStepStatuses(input);
}

export function pickCurrentOnboardingStep(
  steps: ClientOnboardingStep[]
): ClientOnboardingStep | null {
  return steps.find((s) => s.status === "current" || s.status === "blocked") ?? steps[0] ?? null;
}
