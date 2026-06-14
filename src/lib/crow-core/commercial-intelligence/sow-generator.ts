import type { EnterpriseBlueprintDocument } from "../blueprint";
import {
  SOW_SECTION_KEYS,
  type RoiModel,
  type SowDraft,
  type SowSection,
  type SowSectionKey,
} from "../commercial";
import { SOW_ADVISORY_DISCLAIMER } from "./advisory-labels";

const SOW_SECTION_TITLES: Record<SowSectionKey, string> = {
  title_page: "Title page",
  objective: "Objective",
  scope: "Scope",
  organization_coverage: "Organization coverage",
  departments: "Departments",
  branches: "Branches",
  account_volume: "Account volume",
  capabilities: "Capabilities",
  workflows: "Workflows",
  integrations: "Integrations",
  security_controls: "Security controls",
  sarea_experiences: "SAREA experiences",
  ai_capabilities: "AI capabilities",
  migration_responsibilities: "Migration responsibilities",
  implementation_phases: "Implementation phases",
  deliverables: "Deliverables",
  responsibilities: "Responsibilities",
  exclusions: "Exclusions",
  milestones: "Milestones",
  acceptance_criteria: "Acceptance criteria",
  support: "Support",
  change_control: "Change control",
  pricing_and_payment: "Pricing and payment",
  assumptions_and_dependencies: "Assumptions and dependencies",
};

export type SowGeneratorInput = {
  document: EnterpriseBlueprintDocument;
  roiModel?: RoiModel | null;
  organizationName?: string;
};

function organizationNameFromDocument(document: EnterpriseBlueprintDocument): string {
  const org = document.slices.find((s) => s.type === "organizational");
  if (org && org.type === "organizational") return org.tenantName;
  return "Client organization";
}

function sectionBody(
  key: SowSectionKey,
  document: EnterpriseBlueprintDocument,
  roiModel: RoiModel | null | undefined,
  organizationName: string
): { body: string; warning?: string } {
  const org = document.slices.find((s) => s.type === "organizational");
  const ops = document.slices.find((s) => s.type === "operational");
  const sec = document.slices.find((s) => s.type === "security_trust");
  const exp = document.slices.find((s) => s.type === "experience");
  const integ = document.slices.find((s) => s.type === "integration");
  const comm = document.slices.find((s) => s.type === "commercial");

  switch (key) {
    case "title_page":
      return {
        body: `Statement of Work — ${organizationName} · Blueprint v${document.ref.version}`,
      };
    case "objective":
      return {
        body: document.assumptions[0] ?? "Implement Crow enterprise operating fabric per approved blueprint.",
      };
    case "scope":
      return {
        body: `In scope: ${document.acceptanceCriteria.join("; ")}. Exclusions: ${document.exclusions.join("; ")}.`,
      };
    case "organization_coverage":
      return org && org.type === "organizational"
        ? { body: `Tenant: ${org.tenantName}. Departments: ${org.departments.map((d) => d.label).join(", ")}.` }
        : { body: "", warning: "Organizational slice missing — section left blank." };
    case "departments":
      return org && org.type === "organizational"
        ? { body: org.departments.map((d) => d.label).join(", ") }
        : { body: "", warning: "Department list unavailable." };
    case "branches":
      return org && org.type === "organizational"
        ? { body: org.branches.map((b) => b.label).join(", ") }
        : { body: "", warning: "Branch coverage not documented." };
    case "account_volume":
      return org && org.type === "organizational" && org.accountPopulationEstimate
        ? { body: `Estimated accounts/users: ${org.accountPopulationEstimate}` }
        : { body: "", warning: "Account volume estimate missing." };
    case "capabilities":
      return comm && comm.type === "commercial"
        ? { body: `Modules: ${comm.modules.join(", ")}. Package: ${comm.recommendedPackage}.` }
        : { body: "", warning: "Commercial capabilities slice missing." };
    case "workflows":
      return ops && ops.type === "operational"
        ? { body: ops.processes.map((p) => p.label).join("; ") }
        : { body: "", warning: "Operational workflows not available." };
    case "integrations":
      return integ && integ.type === "integration"
        ? { body: `IdP: ${integ.identityProviders.join(", ")}. External: ${integ.externalApis.join(", ")}.` }
        : { body: "", warning: "Integration slice missing." };
    case "security_controls":
      return sec && sec.type === "security_trust"
        ? { body: `Auth: ${sec.authenticationMethods.join(", ")}. Model: ${sec.authorizationModel}.` }
        : { body: "", warning: "Security & trust slice missing." };
    case "sarea_experiences":
      return exp && exp.type === "experience"
        ? { body: `Personas: ${exp.personas.map((p) => p.label).join(", ")}.` }
        : { body: "", warning: "Experience/SAREA slice missing." };
    case "ai_capabilities":
      return comm && comm.type === "commercial" && comm.aiCapabilities.length > 0
        ? { body: comm.aiCapabilities.join(", ") }
        : { body: "", warning: "AI capabilities not specified in blueprint." };
    case "migration_responsibilities":
      return { body: "Client provides master data; ProCrow configures blueprint and tenant runtime." };
    case "implementation_phases":
      return comm && comm.type === "commercial"
        ? { body: `Timeline: ${comm.timelineWeeks} weeks. Effort: ${comm.implementationEffortDays} days.` }
        : { body: "", warning: "Implementation timeline not in commercial slice." };
    case "deliverables":
      return { body: document.acceptanceCriteria.join("\n") };
    case "responsibilities":
      return {
        body: "ProCrow: configuration, advisory, training. Client: approvals, data, UAT sign-off.",
      };
    case "exclusions":
      return { body: document.exclusions.join("\n") };
    case "milestones":
      return {
        body: "Discovery complete → Blueprint approved → Configuration proposed → Go-live readiness.",
      };
    case "acceptance_criteria":
      return { body: document.acceptanceCriteria.join("\n") };
    case "support":
      return comm && comm.type === "commercial"
        ? { body: `Support tier: ${comm.supportTier}.` }
        : { body: "", warning: "Support tier not specified." };
    case "change_control":
      return {
        body: "Material changes require traceable approval per Crow Core constitution.",
      };
    case "pricing_and_payment":
      return roiModel?.subscriptionAnnualEstimate
        ? {
            body: `Indicative annual subscription: SAR ${roiModel.subscriptionAnnualEstimate}. Implementation: SAR ${roiModel.implementationCostEstimate ?? "TBD"}.`,
          }
        : { body: "", warning: "ROI/commercial model missing — pricing section incomplete." };
    case "assumptions_and_dependencies":
      return {
        body: document.assumptions.join("\n"),
      };
    default: {
      const _exhaustive: never = key;
      return { body: String(_exhaustive) };
    }
  }
}

export type SowGeneratorResult = {
  draft: SowDraft;
  warnings: string[];
};

export function generateSowDraft(input: SowGeneratorInput): SowGeneratorResult {
  const organizationName =
    input.organizationName ?? organizationNameFromDocument(input.document);

  const warnings: string[] = [];
  const sections: SowSection[] = [];

  for (const key of SOW_SECTION_KEYS) {
    const title = SOW_SECTION_TITLES[key];
    const { body, warning } = sectionBody(
      key as SowSectionKey,
      input.document,
      input.roiModel,
      organizationName
    );
    if (warning) warnings.push(`${key}: ${warning}`);
    sections.push({
      key: key as SowSectionKey,
      title,
      body: body || "[Pending discovery / blueprint data]",
    });
  }

  const draft: SowDraft = {
    blueprintVersion: input.document.ref.version,
    title: `SOW — ${organizationName}`,
    sections,
    generatedAtIso: new Date().toISOString(),
    approvalStatus: "draft",
    advisoryDisclaimer: SOW_ADVISORY_DISCLAIMER,
  };

  return { draft, warnings };
}
