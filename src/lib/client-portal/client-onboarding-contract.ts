/**
 * I7 — Client onboarding tracker contract (derived readiness; advisory only).
 */

export type ClientOnboardingStatus =
  | "not_started"
  | "waiting_for_scope_approval"
  | "scope_approved"
  | "procrow_review"
  | "missing_information"
  | "provisioning_ready"
  | "tenant_pending"
  | "tenant_ready"
  | "paused";

export type ClientOnboardingStepStatus =
  | "complete"
  | "current"
  | "pending"
  | "blocked"
  | "skipped";

export type ClientOnboardingStepOwner =
  | "client"
  | "procrow"
  | "system"
  | "tenant_admin";

export type ClientOnboardingStep = {
  key: string;
  label: string;
  status: ClientOnboardingStepStatus;
  owner: ClientOnboardingStepOwner;
  description: string;
  relatedRoute: string | null;
  blockedReason?: string;
  evidenceNote?: string;
};

export type ClientOnboardingApprovalSummary = {
  proposalStatus: string | null;
  clientApprovedAt: string | null;
  scopeApproved: boolean;
};

export type ClientOnboardingTenantRuntimeState =
  | "not_applicable"
  | "not_provisioned"
  | "pending"
  | "ready";

export type ClientOnboardingTracker = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  overallStatus: ClientOnboardingStatus;
  statusLabel: string;
  currentStep: ClientOnboardingStep | null;
  steps: ClientOnboardingStep[];
  missingInformation: string[];
  procrowNextActions: string[];
  clientNextActions: string[];
  tenantRuntimeState: ClientOnboardingTenantRuntimeState;
  tenantRuntimeLabel: string;
  tenantRoute: string | null;
  approvalSummary: ClientOnboardingApprovalSummary;
  trustNotes: string[];
  blueprintId: string | null;
  proposalId: string | null;
};

export type ClientOnboardingDashboardTile = {
  overallStatus: ClientOnboardingStatus;
  statusLabel: string;
  currentStepLabel: string;
  clientNextAction: string;
  organizationName: string | null;
  tenantRuntimeLabel: string;
  link: string;
};

export const CLIENT_ONBOARDING_STATUS_LABELS: Record<ClientOnboardingStatus, string> = {
  not_started: "Not started",
  waiting_for_scope_approval: "Awaiting your scope approval",
  scope_approved: "Scope approved — ProCrow review",
  procrow_review: "ProCrow onboarding review",
  missing_information: "Information needed",
  provisioning_ready: "Ready for provisioning review",
  tenant_pending: "Tenant runtime preparing",
  tenant_ready: "Tenant runtime available",
  paused: "Paused",
};

export const CLIENT_ONBOARDING_TRUST_NOTES = [
  "Scope approval does not activate production or billing.",
  "Tenant runtime provisioning remains ProCrow-controlled — nothing is created automatically from this tracker.",
  "CyberCrow trust and SAREA experience readiness are reviewed before runtime go-live.",
  "Production launch stays operator-gated (F23); onboarding is operational readiness only.",
  "This tracker is advisory: it reflects linked request, proposal, and blueprint data.",
] as const;

export const CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE =
  "Production launch and live payments remain disabled until ProCrow completes go/no-go and billing activation.";
