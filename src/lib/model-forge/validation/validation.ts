import { listSpecialistDomains } from "../specialist-domains/index";
import { listWorkPersonas } from "../work-personas/index";
import { listWorkflowTemplates } from "../workflows/index";
import { KPI_CATALOG, EVIDENCE_CATALOG } from "../metrics/kpi-outcomes";
import { resolveCatalogKey } from "@/lib/tenant-composition/registry";

export function validateWorkflowTemplate(templateKey: string): { valid: boolean; errors: string[] } {
  const t = listWorkflowTemplates().find((w) => w.key === templateKey);
  if (!t) return { valid: false, errors: [`Unknown template: ${templateKey}`] };
  const errors: string[] = [];
  if (t.states.length === 0) errors.push("Template must have states");
  if (t.transitions.length === 0) errors.push("Template must have transitions");
  for (const e of t.evidenceRequirementKeys) {
    if (!EVIDENCE_CATALOG.some((x) => x.key === e)) errors.push(`Unknown evidence: ${e}`);
  }
  for (const k of t.kpiKeys) {
    if (!KPI_CATALOG.some((x) => x.key === k)) errors.push(`Unknown KPI: ${k}`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateSpecialistDomainReferences(): string[] {
  const errors: string[] = [];
  for (const d of listSpecialistDomains()) {
    for (const cap of d.recommendedCapabilityKeys) {
      if (!resolveCatalogKey("capability", cap)) errors.push(`${d.key} → capability ${cap}`);
    }
    for (const p of d.personaSuggestionKeys) {
      if (!listWorkPersonas().some((x) => x.key === p)) errors.push(`${d.key} → persona ${p}`);
    }
    for (const wf of d.workflowFamilyKeys) {
      if (!listWorkflowTemplates().some((x) => x.key === wf)) errors.push(`${d.key} → workflow ${wf}`);
    }
  }
  return errors;
}

export const MODEL_FORGE_BOUNDARY = {
  canonicalPath: "src/lib/model-forge/",
  tenantCompositionPath: "src/lib/tenant-composition/",
  broadMoveExecuted: false,
  destructiveChangesExecuted: false,
  targetedRefoundationExecuted: true,
} as const;
