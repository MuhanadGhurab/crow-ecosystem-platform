/** Organizational Intelligence — advisory sector models (templates recommend, blueprint decides). */

export type OrgIntelligenceStatus = "RECOMMENDED" | "CUSTOMIZED" | "ACCEPTED";

export type SectorTemplateKey =
  | "logistics"
  | "construction"
  | "aviation"
  | "healthcare"
  | "retail";

export type OrgDepartmentRecommendation = {
  key: string;
  name: string;
  description?: string;
  recommendedPriority?: number;
  recommendedHeadcount?: { min: number; max: number };
};

export type OrgPositionRecommendation = {
  key: string;
  title: string;
  departmentKey: string;
  level: string;
  description?: string;
  responsibilities: string[];
  recommendedCountMin?: number;
  recommendedCountMax?: number;
  sareaPersonaKey?: string;
  cybercrowSensitive?: boolean;
  riskSensitive?: boolean;
};

export type OrgWorkflowRecommendation = {
  key: string;
  name: string;
  description?: string;
  departmentScope?: string;
  complexityLevel?: "lite" | "standard" | "advanced";
};

export type OrgApprovalChainRecommendation = {
  key: string;
  name: string;
  workflowKey?: string;
  steps: string[];
  description?: string;
};

export type OrgCybercrowBaselineRecommendation = {
  key: string;
  name: string;
  controls: string[];
  riskFocus: string;
  monitoringLevel: "standard" | "elevated" | "critical";
};

export type OrgSareaProfileRecommendation = {
  key: string;
  name: string;
  positionKey?: string;
  experienceProfile: string;
  dashboardType: string;
  complexityLevel: "executive" | "manager" | "specialist" | "frontline" | "security";
  personaKey: string;
};

export type OrgBranchTypeRecommendation = {
  key: string;
  name: string;
  description?: string;
};

export type OrgIntelligenceModel = {
  sectorTemplateKey: SectorTemplateKey;
  sectorName: string;
  industry: string;
  maturityLevel: string;
  departments: OrgDepartmentRecommendation[];
  positions: OrgPositionRecommendation[];
  workflows: OrgWorkflowRecommendation[];
  approvalChains: OrgApprovalChainRecommendation[];
  cybercrowBaselines: OrgCybercrowBaselineRecommendation[];
  sareaProfiles: OrgSareaProfileRecommendation[];
  branchTypes: OrgBranchTypeRecommendation[];
};

export type OrgIntelligenceCustomizations = {
  removedDepartmentKeys?: string[];
  removedPositionKeys?: string[];
  removedWorkflowKeys?: string[];
  renamedDepartments?: Record<string, string>;
  renamedPositions?: Record<string, string>;
  headcountOverrides?: Record<string, { min: number; max: number }>;
};

export function applyOrgCustomizations(
  model: OrgIntelligenceModel,
  customizations?: OrgIntelligenceCustomizations | null
): OrgIntelligenceModel {
  if (!customizations) return model;

  const removedDept = new Set(customizations.removedDepartmentKeys ?? []);
  const removedPos = new Set(customizations.removedPositionKeys ?? []);
  const removedWf = new Set(customizations.removedWorkflowKeys ?? []);

  return {
    ...model,
    departments: model.departments
      .filter((d) => !removedDept.has(d.key))
      .map((d) => ({
        ...d,
        name: customizations.renamedDepartments?.[d.key] ?? d.name,
        recommendedHeadcount:
          customizations.headcountOverrides?.[d.key] ?? d.recommendedHeadcount,
      })),
    positions: model.positions
      .filter((p) => !removedPos.has(p.key))
      .map((p) => ({
        ...p,
        title: customizations.renamedPositions?.[p.key] ?? p.title,
      })),
    workflows: model.workflows.filter((w) => !removedWf.has(w.key)),
  };
}
