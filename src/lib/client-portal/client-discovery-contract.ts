/**
 * L4 — Client-led discovery data contract (no schema migration).
 * Persists via DiscoveryAnswer section `client_discovery` + existing request/discovery tables.
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export const CLIENT_DISCOVERY_SECTION = "client_discovery" as const;

export type ClientDiscoveryStageTemplate = "startup" | "growth" | "enterprise";

export type ClientDiscoveryIndustryTemplate = ModeledSectorKey | "general";

export type ClientDiscoveryStep =
  | "company_size"
  | "industry_template"
  | "company_stage"
  | "departments"
  | "roles"
  | "modules"
  | "workflows"
  | "security"
  | "sarea"
  | "review_submit";

export type ClientDiscoveryStatus =
  | "not_started"
  | "in_progress"
  | "submitted_for_procrow_review"
  | "procrow_reviewing"
  | "accepted_into_blueprint"
  | "changes_requested";

export type ClientDiscoveryRecommendation = {
  departments: string[];
  roles: string[];
  modules: string[];
  workflows: string[];
  security: string[];
  sarea: string[];
  advisoryNote: string;
};

export type ClientDiscoveryDraft = {
  requestId: string;
  status: ClientDiscoveryStatus;
  industryTemplate: ClientDiscoveryIndustryTemplate | null;
  companyStageTemplate: ClientDiscoveryStageTemplate | null;
  employeeBand: string | null;
  expectedUsers: string | null;
  selectedDepartments: string[];
  selectedRoles: string[];
  selectedModules: string[];
  selectedWorkflows: string[];
  securityPreference: string | null;
  sareaPreference: string | null;
  notes: string | null;
  submittedAt: string | null;
  updatedAt: string | null;
};

export type ClientDiscoveryFieldRegistryEntry = {
  key: string;
  label: string;
  discoveryStep: ClientDiscoveryStep;
  editableByClient: boolean;
  actionHref?: (requestId: string) => string;
  blockedReason?: string;
  procrowOwner?: boolean;
};

export function clientDiscoveryStepHref(
  requestId: string,
  step: ClientDiscoveryStep
): string {
  return `/client/requests/${requestId}/discovery?step=${step}`;
}

export const CLIENT_DISCOVERY_FIELD_REGISTRY: readonly ClientDiscoveryFieldRegistryEntry[] =
  [
    {
      key: "employeeBand",
      label: "Employee band",
      discoveryStep: "company_size",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "company_size"),
    },
    {
      key: "industryTemplate",
      label: "Industry template",
      discoveryStep: "industry_template",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "industry_template"),
    },
    {
      key: "companyStageTemplate",
      label: "Company stage",
      discoveryStep: "company_stage",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "company_stage"),
    },
    {
      key: "selectedModules",
      label: "Modules",
      discoveryStep: "modules",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "modules"),
    },
    {
      key: "selectedDepartments",
      label: "Departments",
      discoveryStep: "departments",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "departments"),
    },
    {
      key: "selectedRoles",
      label: "Roles",
      discoveryStep: "roles",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "roles"),
    },
    {
      key: "selectedWorkflows",
      label: "Workflows",
      discoveryStep: "workflows",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "workflows"),
    },
    {
      key: "securityPreference",
      label: "Security posture",
      discoveryStep: "security",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "security"),
    },
    {
      key: "sareaPreference",
      label: "SAREA experience",
      discoveryStep: "sarea",
      editableByClient: true,
      actionHref: (id) => clientDiscoveryStepHref(id, "sarea"),
    },
    {
      key: "blueprintApproval",
      label: "Final blueprint approval",
      discoveryStep: "review_submit",
      editableByClient: false,
      procrowOwner: true,
      blockedReason: "ProCrow reviews discovery and publishes the official blueprint and proposal.",
    },
    {
      key: "finalPricing",
      label: "Final pricing",
      discoveryStep: "review_submit",
      editableByClient: false,
      procrowOwner: true,
      blockedReason:
        "Pricing estimates may change with modules, employee band, and security layer. Final proposal pricing is issued after ProCrow review.",
    },
    {
      key: "tenantRuntime",
      label: "Tenant runtime",
      discoveryStep: "review_submit",
      editableByClient: false,
      procrowOwner: true,
      blockedReason:
        "Tenant runtime preparation is owned by ProCrow after scope approval and go/no-go readiness.",
    },
  ] as const;

export function assertClientDiscoveryFieldRegistry(): void {
  for (const field of CLIENT_DISCOVERY_FIELD_REGISTRY) {
    if (field.editableByClient) {
      if (!field.actionHref) {
        throw new Error(`Editable discovery field ${field.key} must define actionHref`);
      }
      continue;
    }
    if (!field.blockedReason?.trim()) {
      throw new Error(
        `Discovery field "${field.label}" must define blockedReason when not client-editable`
      );
    }
  }
}

export type ClientDiscoveryPageModel = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  canEdit: boolean;
  editBlockedReason: string | null;
  draft: ClientDiscoveryDraft;
  recommendations: ClientDiscoveryRecommendation | null;
  missingSteps: ClientDiscoveryStep[];
  nextStep: ClientDiscoveryStep | null;
  pricingHonestyCopy: string;
};

export const CLIENT_DISCOVERY_PRICING_HONESTY_COPY =
  "Module selection, employee band, company stage, security layer, SAREA preferences, and workflow depth influence estimated pricing. This discovery is advisory — ProCrow issues the official proposal after review. Setup/onboarding fees apply after scope approval; subscription billing starts when tenant runtime is ready. No live checkout in the Client Portal.";

export const CLIENT_DISCOVERY_SUBMIT_DISCLAIMER =
  "Submitting discovery sends your selections to ProCrow for review. This is not final blueprint approval, final pricing, or tenant activation.";

export function discoveryStatusLabel(status: ClientDiscoveryStatus): string {
  switch (status) {
    case "not_started":
      return "Not started";
    case "in_progress":
      return "In progress";
    case "submitted_for_procrow_review":
      return "Submitted for ProCrow review";
    case "procrow_reviewing":
      return "ProCrow reviewing";
    case "accepted_into_blueprint":
      return "Accepted into blueprint";
    case "changes_requested":
      return "Changes requested";
    default:
      return status;
  }
}
