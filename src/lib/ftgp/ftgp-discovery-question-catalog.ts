import { FTGP_DISCOVERY_PROVENANCE } from "./ftgp-discovery-provenance.constants";
import {
  FTGP_DISCOVERY_CLIENT_ANSWER_SECTION,
  FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION,
} from "./ftgp-discovery-invariant.constants";

export const FTGP_DISCOVERY_QUESTION_CATALOG_VERSION =
  "ftgp-first-tenant-discovery-v1.0.0" as const;

export type FtgpDiscoveryGroupKey =
  | "01_organization_identity"
  | "02_industry_business_model"
  | "03_branches_locations"
  | "04_departments_reporting"
  | "05_roles_user_populations"
  | "06_operational_workflows"
  | "07_approval_chains"
  | "08_current_systems"
  | "09_external_integrations"
  | "10_security_compliance"
  | "11_data_classification_retention"
  | "12_infrastructure_hosting"
  | "13_reporting_analytics"
  | "14_cem_modules"
  | "15_cybercrow_trust_control"
  | "16_sarea_experience"
  | "17_constraints_risks_budget_timeline";

export type FtgpQuestionActor = "client" | "IMPLEMENTER" | "system";
export type FtgpAnswerDataType = "text" | "enum" | "number" | "list" | "boolean";
export type FtgpSensitiveDataClass =
  | "public"
  | "internal"
  | "confidential"
  | "pii"
  | "none";
export type FtgpVisibility = "client" | "internal" | "system_only";

export type FtgpDiscoveryQuestionDef = {
  questionKey: string;
  sectionKey: string;
  groupKey: FtgpDiscoveryGroupKey;
  questionVersion: string;
  actorType: FtgpQuestionActor;
  answerProvenance:
    | typeof FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED
    | typeof FTGP_DISCOVERY_PROVENANCE.IMPLEMENTER_OBSERVATION
    | typeof FTGP_DISCOVERY_PROVENANCE.SYSTEM_DERIVED
    | typeof FTGP_DISCOVERY_PROVENANCE.SYSTEM_LIFECYCLE_MARKER;
  required: boolean;
  answerDataType: FtgpAnswerDataType;
  validation: string;
  sensitiveDataClass: FtgpSensitiveDataClass;
  clientVisibility: FtgpVisibility;
  internalVisibility: FtgpVisibility;
  evidenceAllowed: boolean;
  blueprintRelevance: "informational";
  completionWeight: number | null;
  label: string;
};

export type FtgpDiscoveryGroupDef = {
  groupKey: FtgpDiscoveryGroupKey;
  ordinal: number;
  title: string;
  requiredForCompletion: boolean;
  facilitatorNotes: string;
  clientFacingPurpose: string;
  evidenceChecklist: string[];
  sensitiveDataWarnings: string[];
  followUpRules: string[];
  saveAsDraftExpectation: string;
  completionRelevance: string;
};

const CLIENT = FTGP_DISCOVERY_CLIENT_ANSWER_SECTION;
const ENTERPRISE_DESIGN = FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION;
const IMPLEMENTER_SECTION = "implementer_discovery" as const;
const V = FTGP_DISCOVERY_QUESTION_CATALOG_VERSION;

function clientQ(
  partial: Omit<
    FtgpDiscoveryQuestionDef,
    "sectionKey" | "actorType" | "answerProvenance" | "questionVersion" | "blueprintRelevance"
  >
): FtgpDiscoveryQuestionDef {
  return {
    ...partial,
    sectionKey: CLIENT,
    actorType: "client",
    answerProvenance: FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED,
    questionVersion: V,
    blueprintRelevance: "informational",
  };
}

function enterpriseDesignQ(
  partial: Omit<
    FtgpDiscoveryQuestionDef,
    "sectionKey" | "actorType" | "answerProvenance" | "questionVersion" | "blueprintRelevance"
  >
): FtgpDiscoveryQuestionDef {
  return {
    ...partial,
    sectionKey: ENTERPRISE_DESIGN,
    actorType: "client",
    answerProvenance: FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED,
    questionVersion: V,
    blueprintRelevance: "informational",
  };
}

function implementerQ(
  partial: Omit<
    FtgpDiscoveryQuestionDef,
    "sectionKey" | "actorType" | "answerProvenance" | "questionVersion" | "blueprintRelevance"
  >
): FtgpDiscoveryQuestionDef {
  return {
    ...partial,
    sectionKey: IMPLEMENTER_SECTION,
    actorType: "IMPLEMENTER",
    answerProvenance: FTGP_DISCOVERY_PROVENANCE.IMPLEMENTER_OBSERVATION,
    questionVersion: V,
    blueprintRelevance: "informational",
  };
}

export const FTGP_DISCOVERY_GROUP_DEFINITIONS: readonly FtgpDiscoveryGroupDef[] = [
  {
    groupKey: "01_organization_identity",
    ordinal: 1,
    title: "Organization identity",
    requiredForCompletion: true,
    facilitatorNotes:
      "Confirm legal and operating names; do not capture tax IDs in discovery drafts unless policy allows.",
    clientFacingPurpose: "Establish who the tenant represents on the platform.",
    evidenceChecklist: ["Corporate registration summary (optional)", "Brand name vs legal name"],
    sensitiveDataWarnings: ["Avoid full registration numbers in client drafts"],
    followUpRules: ["If multiple brands, note primary tenant brand only"],
    saveAsDraftExpectation: "Client may save partial identity context before continuing.",
    completionRelevance: "Required for blueprint org shell and tenant naming.",
  },
  {
    groupKey: "02_industry_business_model",
    ordinal: 2,
    title: "Industry and business model",
    requiredForCompletion: true,
    facilitatorNotes: "Map to sector template; system may derive org_intelligence markers separately.",
    clientFacingPurpose: "Select industry template and company stage for advisory recommendations.",
    evidenceChecklist: ["Industry classification", "Revenue model summary"],
    sensitiveDataWarnings: ["No financial statements required at discovery"],
    followUpRules: ["Reconcile with requested modules if mismatch"],
    saveAsDraftExpectation: "Templates save independently.",
    completionRelevance: "Drives sector template and department recommendations.",
  },
  {
    groupKey: "03_branches_locations",
    ordinal: 3,
    title: "Branches and locations",
    requiredForCompletion: true,
    facilitatorNotes: "Capture operating geography; IMPLEMENTER validates branch topology.",
    clientFacingPurpose: "Describe where the organization operates.",
    evidenceChecklist: ["Branch list", "HQ location"],
    sensitiveDataWarnings: ["Street-level addresses are confidential"],
    followUpRules: ["Clarify remote-only vs physical branches"],
    saveAsDraftExpectation: "Client lists may be incomplete until review.",
    completionRelevance: "Informs org structure and locale defaults.",
  },
  {
    groupKey: "04_departments_reporting",
    ordinal: 4,
    title: "Departments and reporting structure",
    requiredForCompletion: true,
    facilitatorNotes: "Use industry template recommendations as starting point.",
    clientFacingPurpose: "Select departments that reflect operating structure.",
    evidenceChecklist: ["Org chart excerpt (optional)"],
    sensitiveDataWarnings: ["Internal reorg plans are internal-only"],
    followUpRules: ["IMPLEMENTER notes reporting lines separately"],
    saveAsDraftExpectation: "Department selections are draftable.",
    completionRelevance: "Required for CEM department seed.",
  },
  {
    groupKey: "05_roles_user_populations",
    ordinal: 5,
    title: "Roles and user populations",
    requiredForCompletion: true,
    facilitatorNotes: "Distinguish role templates from named individuals.",
    clientFacingPurpose: "Select role templates and expected user populations.",
    evidenceChecklist: ["Role catalog alignment"],
    sensitiveDataWarnings: ["No named employee lists in discovery"],
    followUpRules: ["Employee band informs scale assumptions"],
    saveAsDraftExpectation: "Role lists save incrementally.",
    completionRelevance: "Required for RBAC seed and license sizing.",
  },
  {
    groupKey: "06_operational_workflows",
    ordinal: 6,
    title: "Core operational workflows",
    requiredForCompletion: true,
    facilitatorNotes: "Focus on workflows tied to selected CEM modules.",
    clientFacingPurpose: "Select priority workflows for the first tenant path.",
    evidenceChecklist: ["Process outlines"],
    sensitiveDataWarnings: ["Operational secrets stay internal"],
    followUpRules: ["Map workflows to approval chains in group 07"],
    saveAsDraftExpectation: "Workflow picks are advisory drafts.",
    completionRelevance: "Workflow seed for blueprint handoff.",
  },
  {
    groupKey: "07_approval_chains",
    ordinal: 7,
    title: "Approval chains",
    requiredForCompletion: true,
    facilitatorNotes: "IMPLEMENTER-facilitated; client confirms high-level approval model.",
    clientFacingPurpose: "Confirm how decisions escalate in the organization.",
    evidenceChecklist: ["Approval matrix summary"],
    sensitiveDataWarnings: ["Named approvers optional only"],
    followUpRules: ["Cross-check with workflows"],
    saveAsDraftExpectation: "Client confirmation may follow IMPLEMENTER notes.",
    completionRelevance: "Required for workflow approval configuration.",
  },
  {
    groupKey: "08_current_systems",
    ordinal: 8,
    title: "Current applications and systems",
    requiredForCompletion: true,
    facilitatorNotes: "Inventory incumbent systems; no credentials.",
    clientFacingPurpose: "List systems the organization uses today.",
    evidenceChecklist: ["Application inventory"],
    sensitiveDataWarnings: ["No credentials or API keys"],
    followUpRules: ["Link to integration group 09"],
    saveAsDraftExpectation: "Lists may be refined in session.",
    completionRelevance: "Integration and migration planning.",
  },
  {
    groupKey: "09_external_integrations",
    ordinal: 9,
    title: "External integrations",
    requiredForCompletion: true,
    facilitatorNotes: "Distinguish must-have vs nice-to-have integrations.",
    clientFacingPurpose: "Identify external systems that must connect to CEM.",
    evidenceChecklist: ["Integration priorities"],
    sensitiveDataWarnings: ["No integration secrets"],
    followUpRules: ["Validate feasibility with IMPLEMENTER"],
    saveAsDraftExpectation: "Priority list is draftable.",
    completionRelevance: "Blueprint integration scope.",
  },
  {
    groupKey: "10_security_compliance",
    ordinal: 10,
    title: "Security and compliance requirements",
    requiredForCompletion: true,
    facilitatorNotes: "Use security advisory snapshot; client selects posture preference.",
    clientFacingPurpose: "Declare security posture and compliance drivers.",
    evidenceChecklist: ["Compliance frameworks (if any)"],
    sensitiveDataWarnings: ["Audit reports remain out of band"],
    followUpRules: ["Align with CyberCrow group 15"],
    saveAsDraftExpectation: "Security preference saves as draft.",
    completionRelevance: "Security package and control baseline.",
  },
  {
    groupKey: "11_data_classification_retention",
    ordinal: 11,
    title: "Data classification and retention",
    requiredForCompletion: false,
    facilitatorNotes: "IMPLEMENTER captures classification model; client confirms categories.",
    clientFacingPurpose: "Understand data sensitivity and retention expectations.",
    evidenceChecklist: ["Data classification policy summary"],
    sensitiveDataWarnings: ["Classification details may be confidential"],
    followUpRules: ["Feed into retention defaults"],
    saveAsDraftExpectation: "Optional until compliance requires it.",
    completionRelevance: "Optional unless regulated industry mandates.",
  },
  {
    groupKey: "12_infrastructure_hosting",
    ordinal: 12,
    title: "Infrastructure and hosting preferences",
    requiredForCompletion: false,
    facilitatorNotes: "Advisory only for first tenant; platform hosts CEM.",
    clientFacingPurpose: "Note hosting constraints or regional preferences.",
    evidenceChecklist: ["Regional requirements"],
    sensitiveDataWarnings: ["No infrastructure credentials"],
    followUpRules: ["Default to platform-hosted unless exception"],
    saveAsDraftExpectation: "Optional group.",
    completionRelevance: "Informational for provision planning.",
  },
  {
    groupKey: "13_reporting_analytics",
    ordinal: 13,
    title: "Reporting and analytics requirements",
    requiredForCompletion: false,
    facilitatorNotes: "Capture KPI and dashboard expectations.",
    clientFacingPurpose: "Describe reporting needs for go-live.",
    evidenceChecklist: ["Sample dashboard requirements"],
    sensitiveDataWarnings: ["Business metrics may be confidential"],
    followUpRules: ["Map to CEM modules"],
    saveAsDraftExpectation: "Optional refinement after modules selected.",
    completionRelevance: "Blueprint analytics seed (optional).",
  },
  {
    groupKey: "14_cem_modules",
    ordinal: 14,
    title: "CEM module requirements",
    requiredForCompletion: true,
    facilitatorNotes: "Must align with request module keys.",
    clientFacingPurpose: "Select CEM modules for first operating model.",
    evidenceChecklist: ["Module checklist vs request"],
    sensitiveDataWarnings: ["None"],
    followUpRules: ["Reconcile with workflows"],
    saveAsDraftExpectation: "Module picks are draftable.",
    completionRelevance: "Required — at least one module.",
  },
  {
    groupKey: "15_cybercrow_trust_control",
    ordinal: 15,
    title: "CyberCrow trust and control requirements",
    requiredForCompletion: true,
    facilitatorNotes: "Tied to requested security packages on implementation request.",
    clientFacingPurpose: "Confirm trust and control expectations for CyberCrow layer.",
    evidenceChecklist: ["Security package alignment"],
    sensitiveDataWarnings: ["Threat models stay internal"],
    followUpRules: ["Link to group 10"],
    saveAsDraftExpectation: "Preference draft only.",
    completionRelevance: "CyberCrow baseline at provision.",
  },
  {
    groupKey: "16_sarea_experience",
    ordinal: 16,
    title: "SAREA experience requirements",
    requiredForCompletion: true,
    facilitatorNotes: "Client selects SAREA preference; mapping is advisory.",
    clientFacingPurpose: "Configure SAREA experience expectations.",
    evidenceChecklist: ["SAREA preference selection"],
    sensitiveDataWarnings: ["None"],
    followUpRules: ["Validate against module set"],
    saveAsDraftExpectation: "SAREA preference saves as draft.",
    completionRelevance: "SAREA mapping at blueprint.",
  },
  {
    groupKey: "17_constraints_risks_budget_timeline",
    ordinal: 17,
    title: "Constraints, risks, budget, and timeline",
    requiredForCompletion: true,
    facilitatorNotes:
      "Distinct from company size — captures go-live target, risks, budget guardrails, and free-form constraints.",
    clientFacingPurpose: "Share timeline, scale assumptions, and constraints for planning.",
    evidenceChecklist: ["Go-live target", "Risk register summary", "Budget guardrails"],
    sensitiveDataWarnings: ["Budget figures are confidential"],
    followUpRules: ["IMPLEMENTER validates feasibility"],
    saveAsDraftExpectation: "Notes and timeline fields are draftable.",
    completionRelevance: "Required for proposal timing and scope guardrails.",
  },
] as const;

export const FTGP_DISCOVERY_QUESTION_CATALOG: readonly FtgpDiscoveryQuestionDef[] = [
  clientQ({
    questionKey: "organizationDisplayName",
    groupKey: "01_organization_identity",
    label: "Organization display name",
    required: true,
    answerDataType: "text",
    validation: "non_empty_trimmed,max_200",
    sensitiveDataClass: "public",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "legalEntityType",
    groupKey: "01_organization_identity",
    label: "Legal entity type",
    required: false,
    answerDataType: "enum",
    validation: "enum:corporation,llc,partnership,nonprofit,government,other",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "industryTemplate",
    groupKey: "02_industry_business_model",
    label: "Industry template",
    required: true,
    answerDataType: "enum",
    validation: "sector_catalog_key",
    sensitiveDataClass: "public",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 2,
  }),
  clientQ({
    questionKey: "companyStageTemplate",
    groupKey: "02_industry_business_model",
    label: "Company stage",
    required: true,
    answerDataType: "enum",
    validation: "enum:startup,growth,enterprise",
    sensitiveDataClass: "public",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "branchLocations",
    groupKey: "03_branches_locations",
    label: "Branch and location list",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list,max_50_items",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: 1,
  }),
  implementerQ({
    questionKey: "branchTopologyNotes",
    groupKey: "03_branches_locations",
    label: "Branch topology notes",
    required: false,
    answerDataType: "text",
    validation: "max_2000",
    sensitiveDataClass: "internal",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "selectedDepartments",
    groupKey: "04_departments_reporting",
    label: "Selected departments",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 2,
  }),
  implementerQ({
    questionKey: "reportingStructureNotes",
    groupKey: "04_departments_reporting",
    label: "Reporting structure notes",
    required: false,
    answerDataType: "text",
    validation: "max_2000",
    sensitiveDataClass: "internal",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "employeeBand",
    groupKey: "05_roles_user_populations",
    label: "Employee band",
    required: true,
    answerDataType: "enum",
    validation: "employee_band_catalog",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "selectedRoles",
    groupKey: "05_roles_user_populations",
    label: "Selected roles",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 2,
  }),
  clientQ({
    questionKey: "expectedUsers",
    groupKey: "05_roles_user_populations",
    label: "Expected platform users",
    required: false,
    answerDataType: "number",
    validation: "positive_integer",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "selectedWorkflows",
    groupKey: "06_operational_workflows",
    label: "Selected workflows",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 2,
  }),
  clientQ({
    questionKey: "approvalModelSummary",
    groupKey: "07_approval_chains",
    label: "Approval model summary",
    required: true,
    answerDataType: "text",
    validation: "non_empty_trimmed,max_1000",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: 1,
  }),
  implementerQ({
    questionKey: "approvalChainNotes",
    groupKey: "07_approval_chains",
    label: "Approval chain facilitator notes",
    required: false,
    answerDataType: "text",
    validation: "max_2000",
    sensitiveDataClass: "internal",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "currentSystemsInventory",
    groupKey: "08_current_systems",
    label: "Current systems inventory",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list,max_100_items",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "integrationPriorities",
    groupKey: "09_external_integrations",
    label: "Integration priorities",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: 1,
  }),
  implementerQ({
    questionKey: "integrationFeasibilityNotes",
    groupKey: "09_external_integrations",
    label: "Integration feasibility notes",
    required: false,
    answerDataType: "text",
    validation: "max_2000",
    sensitiveDataClass: "internal",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "securityPreference",
    groupKey: "10_security_compliance",
    label: "Security posture preference",
    required: true,
    answerDataType: "enum",
    validation: "security_preference_catalog",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 2,
  }),
  clientQ({
    questionKey: "complianceDrivers",
    groupKey: "10_security_compliance",
    label: "Compliance drivers",
    required: false,
    answerDataType: "list",
    validation: "max_20_items",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  implementerQ({
    questionKey: "dataClassificationModel",
    groupKey: "11_data_classification_retention",
    label: "Data classification model",
    required: false,
    answerDataType: "text",
    validation: "max_2000",
    sensitiveDataClass: "confidential",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "retentionExpectations",
    groupKey: "11_data_classification_retention",
    label: "Retention expectations",
    required: false,
    answerDataType: "text",
    validation: "max_1000",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "hostingConstraints",
    groupKey: "12_infrastructure_hosting",
    label: "Hosting constraints",
    required: false,
    answerDataType: "text",
    validation: "max_1000",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "reportingRequirements",
    groupKey: "13_reporting_analytics",
    label: "Reporting requirements",
    required: false,
    answerDataType: "list",
    validation: "max_30_items",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  clientQ({
    questionKey: "selectedModules",
    groupKey: "14_cem_modules",
    label: "Selected CEM modules",
    required: true,
    answerDataType: "list",
    validation: "non_empty_list,module_catalog_keys",
    sensitiveDataClass: "public",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 3,
  }),
  clientQ({
    questionKey: "cybercrowTrustExpectations",
    groupKey: "15_cybercrow_trust_control",
    label: "CyberCrow trust expectations",
    required: true,
    answerDataType: "text",
    validation: "non_empty_trimmed,max_1000",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "sareaPreference",
    groupKey: "16_sarea_experience",
    label: "SAREA experience preference",
    required: true,
    answerDataType: "enum",
    validation: "sarea_preference_catalog",
    sensitiveDataClass: "public",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "goLiveTarget",
    groupKey: "17_constraints_risks_budget_timeline",
    label: "Target go-live window",
    required: true,
    answerDataType: "text",
    validation: "non_empty_trimmed,max_200",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "constraintsAndRisks",
    groupKey: "17_constraints_risks_budget_timeline",
    label: "Constraints and risks",
    required: true,
    answerDataType: "text",
    validation: "non_empty_trimmed,max_2000",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: 1,
  }),
  clientQ({
    questionKey: "notes",
    groupKey: "17_constraints_risks_budget_timeline",
    label: "Additional discovery notes",
    required: false,
    answerDataType: "text",
    validation: "max_4000",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  implementerQ({
    questionKey: "budgetGuardrailsNotes",
    groupKey: "17_constraints_risks_budget_timeline",
    label: "Budget guardrails (internal)",
    required: false,
    answerDataType: "text",
    validation: "max_1000",
    sensitiveDataClass: "confidential",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: true,
    completionWeight: null,
  }),
  enterpriseDesignQ({
    questionKey: "v1.draft_snapshot",
    groupKey: "02_industry_business_model",
    label: "Client enterprise design draft snapshot",
    required: false,
    answerDataType: "text",
    validation: "json_snapshot",
    sensitiveDataClass: "confidential",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: null,
  }),
  enterpriseDesignQ({
    questionKey: "v1.design_status",
    groupKey: "02_industry_business_model",
    label: "Client enterprise design status",
    required: false,
    answerDataType: "enum",
    validation: "design_status_enum",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: null,
  }),
  enterpriseDesignQ({
    questionKey: "v1.submitted_at",
    groupKey: "02_industry_business_model",
    label: "Client enterprise design submitted at",
    required: false,
    answerDataType: "text",
    validation: "iso_timestamp_optional",
    sensitiveDataClass: "internal",
    clientVisibility: "client",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: null,
  }),
  enterpriseDesignQ({
    questionKey: "v1.snapshot_hash",
    groupKey: "02_industry_business_model",
    label: "Client enterprise design snapshot hash",
    required: false,
    answerDataType: "text",
    validation: "hash_16",
    sensitiveDataClass: "none",
    clientVisibility: "internal",
    internalVisibility: "internal",
    evidenceAllowed: false,
    completionWeight: null,
  }),
] as const;

export function findCatalogQuestion(
  sectionKey: string,
  questionKey: string
): FtgpDiscoveryQuestionDef | undefined {
  return FTGP_DISCOVERY_QUESTION_CATALOG.find(
    (q) => q.sectionKey === sectionKey && q.questionKey === questionKey
  );
}

export function assertCatalogQuestionVersion(
  sectionKey: string,
  questionKey: string,
  questionVersion: string
): boolean {
  const q = findCatalogQuestion(sectionKey, questionKey);
  return Boolean(q && q.questionVersion === questionVersion);
}

export function catalogQuestionCounts(): {
  requiredGroupCount: number;
  optionalGroupCount: number;
  requiredQuestionCount: number;
  optionalQuestionCount: number;
} {
  const requiredGroups = FTGP_DISCOVERY_GROUP_DEFINITIONS.filter((g) => g.requiredForCompletion);
  const optionalGroups = FTGP_DISCOVERY_GROUP_DEFINITIONS.filter((g) => !g.requiredForCompletion);
  const requiredQuestions = FTGP_DISCOVERY_QUESTION_CATALOG.filter((q) => q.required);
  const optionalQuestions = FTGP_DISCOVERY_QUESTION_CATALOG.filter((q) => !q.required);
  return {
    requiredGroupCount: requiredGroups.length,
    optionalGroupCount: optionalGroups.length,
    requiredQuestionCount: requiredQuestions.length,
    optionalQuestionCount: optionalQuestions.length,
  };
}

export function requiredClientQuestionsForCompletion(): readonly FtgpDiscoveryQuestionDef[] {
  return FTGP_DISCOVERY_QUESTION_CATALOG.filter(
    (q) =>
      q.required &&
      q.answerProvenance === FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED
  );
}

export function assertStableQuestionKeys(): void {
  const keys = new Set<string>();
  for (const q of FTGP_DISCOVERY_QUESTION_CATALOG) {
    const composite = `${q.sectionKey}::${q.questionKey}`;
    if (keys.has(composite)) {
      throw new Error(`Duplicate question key: ${composite}`);
    }
    keys.add(composite);
  }
}

assertStableQuestionKeys();
