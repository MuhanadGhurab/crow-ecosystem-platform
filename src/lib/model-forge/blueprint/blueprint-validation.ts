import type { EnterpriseBlueprintDraft, EnterpriseBlueprintValidation } from "./blueprint-types";
import type { EnterpriseModelDraft } from "../types";
import { FORBIDDEN_PLATFORM_BUNDLE_KEYS } from "@/lib/tenant-composition/permission-bundle-catalog";

export function validateEnterpriseBlueprintDraft(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintValidation {
  const findings: EnterpriseBlueprintValidation["findings"][number][] = [];

  for (const wf of draft.workflows.items) {
    const w = wf as { key: string; states?: string[] };
    const ownerPersona = draft.workPersonas.items.find((p) => {
      const persona = p as { workflowParticipation?: string[] };
      return persona.workflowParticipation?.includes(w.key);
    });
    if (!ownerPersona) {
      findings.push({ severity: "WARNING", code: "WORKFLOW_WITHOUT_OWNER", message: `Workflow ${w.key} lacks owner persona recommendation`, path: `workflows.${w.key}` });
    }
    const states = (w.states ?? []) as string[];
    if (states.length < 2) {
      findings.push({ severity: "WARNING", code: "WORKFLOW_STATES", message: `Workflow ${w.key} needs valid start and final states`, path: `workflows.${w.key}` });
    }
    const outcome = draft.outcomes.items.find((o) => (o as { workflowKey: string }).workflowKey === w.key);
    if (!outcome) {
      findings.push({ severity: "RECOMMENDATION", code: "WORKFLOW_WITHOUT_OUTCOME", message: `Workflow ${w.key} missing outcome`, path: `workflows.${w.key}` });
    }
  }

  for (const ent of draft.entities.items) {
    const e = ent as { key: string; lifecycle?: string[] };
    if (!e.lifecycle || e.lifecycle.length === 0) {
      findings.push({ severity: "WARNING", code: "ENTITY_LIFECYCLE", message: `Entity ${e.key} missing lifecycle`, path: `entities.${e.key}` });
    }
  }

  for (const p of draft.workPersonas.items) {
    const persona = p as { key: string; grantsPermissions: boolean; authoritative: boolean };
    if (persona.grantsPermissions !== false) {
      findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "PERSONA_GRANTS_AUTHORITY", message: `Persona ${persona.key} must not grant permissions`, path: `workPersonas.${persona.key}` });
    }
    if (persona.authoritative !== false) {
      findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "PERSONA_AUTHORITATIVE", message: `Persona ${persona.key} must remain non-authoritative`, path: `workPersonas.${persona.key}` });
    }
  }

  for (const a of draft.authorityProposals.items) {
    const proposal = a as { authoritative: boolean; recommendedPermissionBundleKeys: string[]; key: string };
    if (proposal.authoritative !== false) {
      findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "AUTHORITY_NOT_ADVISORY", message: "Authority proposal must be advisory", path: `authority.${proposal.key}` });
    }
    for (const b of proposal.recommendedPermissionBundleKeys) {
      if (FORBIDDEN_PLATFORM_BUNDLE_KEYS.includes(b as (typeof FORBIDDEN_PLATFORM_BUNDLE_KEYS)[number])) {
        findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "PLATFORM_ROLE", message: `Forbidden platform bundle: ${b}`, path: `authority.${proposal.key}` });
      }
    }
  }

  for (const c of draft.complianceOverlays.items) {
    const overlay = c as { advisoryStatus?: string };
    if (!overlay.advisoryStatus?.toLowerCase().includes("advisory")) {
      findings.push({ severity: "WARNING", code: "COMPLIANCE_ADVISORY", message: "Compliance overlay must state advisory status", path: "compliance" });
    }
  }

  for (const s of draft.sareaExperiences.items) {
    const hasPersona = draft.workPersonas.items.length > 0;
    if (!hasPersona) {
      findings.push({ severity: "RECOMMENDATION", code: "SAREA_WITHOUT_PERSONA", message: "SAREA experience should map to a persona", path: `sarea.${(s as { key: string }).key}` });
    }
  }

  if (draft.metadata.authoritative !== false || draft.metadata.advisory !== true) {
    findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "METADATA_BOUNDARY", message: "Blueprint metadata must be advisory preview" });
  }

  const blocking = findings.some((f) => f.severity === "BLOCKING_DRAFT_ERROR");
  return { valid: !blocking, findings };
}

export function validateModelDraftForBlueprint(draft: EnterpriseModelDraft): EnterpriseBlueprintValidation {
  const findings: EnterpriseBlueprintValidation["findings"][number][] = [];
  if (draft.unresolvedDecisions.length > 0) {
    findings.push({ severity: "INFO", code: "UNRESOLVED", message: "Model has unresolved decisions" });
  }
  return { valid: true, findings };
}
