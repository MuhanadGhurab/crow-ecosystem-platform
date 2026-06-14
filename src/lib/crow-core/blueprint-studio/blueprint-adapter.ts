import type { ApprovalStatus } from "../common";
import type {
  BlueprintSlice,
  BlueprintVersionRef,
  EnterpriseBlueprintDocument,
} from "../blueprint";
import type { EnterpriseBlueprintDetail } from "@/lib/services/blueprint.service";
import { mapToBlueprintLifecycleState } from "./blueprint-lifecycle";

function mapBlueprintStatus(status: string): ApprovalStatus {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "IN_REVIEW":
      return "pending_review";
    case "ARCHIVED":
      return "superseded";
    default:
      return "draft";
  }
}

function buildOrganizationalSlice(detail: EnterpriseBlueprintDetail): BlueprintSlice {
  const req = detail.request;
  const answers = req.discoveryProfile?.answers ?? [];
  const operatingModel = answers.find(
    (a) => a.sectionKey === "organization" && a.questionKey === "operatingModel"
  );

  return {
    type: "organizational",
    tenantName: req.organizationName,
    branches: [{ key: "hq", label: req.countryCode ?? "SA" }],
    departments: [
      { key: "operations", label: "Operations" },
      { key: "procurement", label: "Procurement" },
      { key: "finance", label: "Finance" },
      { key: "it", label: "IT" },
      { key: "warehouse", label: "Warehouse" },
    ],
    teams: [],
    roles: [
      { key: "requester", label: "Requester" },
      { key: "approver", label: "Approver" },
      { key: "warehouse_clerk", label: "Warehouse Clerk" },
    ],
    positions: [],
    accountPopulationEstimate: parseEmployeeBand(req.employeeBand),
  };
}

function parseEmployeeBand(band: string | null | undefined): number | null {
  if (!band) return null;
  const match = band.match(/(\d+)/);
  return match ? Number.parseInt(match[1]!, 10) : null;
}

function buildOperationalSlice(detail: EnterpriseBlueprintDetail): BlueprintSlice {
  return {
    type: "operational",
    processes: [
      {
        key: "equipment_request",
        label: "Equipment request",
        departmentKey: "operations",
      },
      {
        key: "procurement_approval",
        label: "Procurement approval",
        departmentKey: "procurement",
      },
      {
        key: "supplier_risk",
        label: "CyberCrow supplier risk",
        departmentKey: "finance",
      },
      {
        key: "warehouse_receiving",
        label: "Warehouse receiving",
        departmentKey: "warehouse",
      },
      {
        key: "it_asset_assignment",
        label: "IT asset assignment",
        departmentKey: "it",
      },
    ],
    workflowStages: [
      "request",
      "procurement",
      "finance_approval",
      "supplier_risk",
      "receiving",
      "asset_assignment",
    ],
    handoffs: [
      { from: "request", to: "procurement", trigger: "request_submitted" },
      { from: "procurement", to: "finance_approval", trigger: "quote_selected" },
      { from: "finance_approval", to: "supplier_risk", trigger: "budget_approved" },
      { from: "supplier_risk", to: "receiving", trigger: "risk_cleared" },
      { from: "receiving", to: "asset_assignment", trigger: "goods_received" },
    ],
    approvalPoints: ["finance_approval", "supplier_risk"],
    slas: [{ key: "procurement_cycle", targetHours: 72 }],
    kpis: ["request_cycle_time", "approval_sla", "receiving_accuracy"],
    evidenceRequirements: ["purchase_order", "delivery_note", "asset_tag"],
  };
}

function buildSecuritySlice(detail: EnterpriseBlueprintDetail): BlueprintSlice {
  const idpAnswer = detail.request.discoveryProfile?.answers?.find(
    (a) => a.sectionKey === "identity"
  );
  const idp =
    typeof idpAnswer?.valueJson === "string"
      ? idpAnswer.valueJson
      : "enterprise_sso";

  return {
    type: "security_trust",
    identityAssurance: ["verified_corporate_identity"],
    authenticationMethods: [idp, "mfa"],
    authorizationModel: "role_based_least_privilege",
    leastPrivilegeNotes: "Department-scoped roles with separation of duties on finance approvals.",
    separationOfDutiesRules: ["requester_cannot_approve_own_request"],
    sessionTrustRequirements: ["device_compliance_optional"],
    privacyControls: ["audit_logging", "data_minimization"],
    evidenceRetentionPolicy: "7_years_financial_records",
  };
}

function buildExperienceSlice(detail: EnterpriseBlueprintDetail): BlueprintSlice {
  const reqs = detail.request.discoveryProfile?.experienceRequirements ?? [];
  return {
    type: "experience",
    personas: reqs.map((r) => ({
      key: r.personaKey,
      label: r.personaKey,
      density: "standard",
    })),
    navigationKeys: ["dashboard", "requests", "approvals", "warehouse"],
    accessibilityRequirements: ["wcag_aa_target"],
    languages: ["ar", "en"],
    sareaRules: ["role_density_by_persona", "executive_summary_mode"],
  };
}

function buildIntegrationSlice(detail: EnterpriseBlueprintDetail): BlueprintSlice {
  const idpAnswer = detail.request.discoveryProfile?.answers?.find(
    (a) => a.sectionKey === "identity"
  );
  const idp =
    typeof idpAnswer?.valueJson === "string" ? idpAnswer.valueJson : "entra_id";

  return {
    type: "integration",
    identityProviders: [idp],
    financeSystems: ["erp_finance"],
    hrSystems: ["hr_core"],
    externalApis: ["cybercrow_supplier_risk"],
    governmentServices: [],
    integrationOwners: [{ key: "it", ownerRole: "it_admin" }],
  };
}

function buildCommercialSlice(detail: EnterpriseBlueprintDetail): BlueprintSlice {
  const plan = detail.request.requestedPlans[0]?.planKey ?? "professional";
  const modules = detail.modules.filter((m) => m.enabled).map((m) => m.moduleKey);
  const aiAnswer = detail.request.discoveryProfile?.answers?.find(
    (a) => a.sectionKey === "experience" && a.questionKey === "aiExtras"
  );
  const aiCapabilities = Array.isArray(aiAnswer?.valueJson)
    ? (aiAnswer.valueJson as string[])
    : [];

  return {
    type: "commercial",
    recommendedPackage: plan,
    accountVolume: parseEmployeeBand(detail.request.employeeBand),
    modules,
    aiCapabilities,
    implementationEffortDays: 90,
    timelineWeeks: 16,
    supportTier: "enterprise",
  };
}

export function adaptEnterpriseBlueprintDetail(
  detail: EnterpriseBlueprintDetail
): EnterpriseBlueprintDocument {
  const lifecycle = mapToBlueprintLifecycleState({
    requestStatus: detail.request.status,
    blueprintStatus: detail.status,
    proposalStatus: detail.proposalStatus,
    clientApprovedAt: detail.clientApprovedAt,
    approvedAt: detail.approvedAt,
  });

  const ref: BlueprintVersionRef = {
    blueprintId: detail.id,
    version: String(detail.version),
    tenantId: detail.tenant?.id ?? "unknown",
    status: mapBlueprintStatus(detail.status),
    basedOnDiscoveryRequestId: detail.requestId,
    createdAtIso: detail.createdAt.toISOString(),
    approvedAtIso: detail.approvedAt?.toISOString() ?? null,
  };

  const assumptions = [
    `Lifecycle view: ${lifecycle}`,
    detail.request.discoveryProfile?.summary
      ? `Discovery summary: ${detail.request.discoveryProfile.summary}`
      : "Discovery summary pending",
  ];

  const acceptanceCriteria = [
    "End-to-end equipment request workflow operational",
    "Finance and supplier risk gates enforced",
    "Warehouse receiving linked to asset assignment",
  ];

  return {
    ref,
    slices: [
      buildOrganizationalSlice(detail),
      buildOperationalSlice(detail),
      buildSecuritySlice(detail),
      buildExperienceSlice(detail),
      buildIntegrationSlice(detail),
      buildCommercialSlice(detail),
    ],
    assumptions,
    exclusions: ["Custom ERP rewrite", "On-prem legacy fax integrations"],
    acceptanceCriteria,
  };
}
