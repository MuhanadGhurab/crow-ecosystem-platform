import type { DraftWorkPersona } from "@/lib/model-forge/domain-types";
import type { WorkPersonaDefinition } from "@/lib/model-forge/types";
import { getWorkPersona } from "@/lib/model-forge/work-personas/index";

export function createDraftPersonaFromTemplate(templateKey: string, displayName?: string): DraftWorkPersona | null {
  const template = getWorkPersona(templateKey);
  if (!template) return null;
  return {
    key: `draft_${template.key}_${Date.now()}`,
    displayName: displayName ?? `Draft — ${template.displayName}`,
    purpose: template.purpose,
    responsibilities: template.responsibilities,
    workflowParticipation: template.workflowParticipation,
    workflowPositions: template.workflowPositions,
    buildingBlockKeys: template.sourceRoleArchetypeKeys,
    advisory: true,
    grantsPermissions: false,
    authoritative: false,
  };
}

export function duplicateDraftPersona(persona: DraftWorkPersona): DraftWorkPersona {
  return {
    ...persona,
    key: `${persona.key}_copy_${Date.now()}`,
    displayName: `${persona.displayName} (copy)`,
  };
}

export function exportDraftPersonaJson(persona: DraftWorkPersona): string {
  return JSON.stringify({ ...persona, _boundary: "ADVISORY — NOT AN AUTHORITY ASSIGNMENT" }, null, 2);
}

export function compareDraftPersonas(a: DraftWorkPersona, b: DraftWorkPersona): string[] {
  const diffs: string[] = [];
  if (a.purpose !== b.purpose) diffs.push("purpose");
  if (a.responsibilities.length !== b.responsibilities.length) diffs.push("responsibilities");
  if (a.workflowParticipation.join() !== b.workflowParticipation.join()) diffs.push("workflowParticipation");
  return diffs;
}

export function mergeDraftPersonas(a: DraftWorkPersona, b: DraftWorkPersona): DraftWorkPersona {
  return {
    key: `merged_${a.key}_${b.key}`,
    displayName: `${a.displayName} + ${b.displayName}`,
    purpose: `${a.purpose}; ${b.purpose}`,
    responsibilities: [...new Set([...a.responsibilities, ...b.responsibilities])],
    workflowParticipation: [...new Set([...a.workflowParticipation, ...b.workflowParticipation])],
    workflowPositions: a.workflowPositions,
    buildingBlockKeys: [...new Set([...a.buildingBlockKeys, ...b.buildingBlockKeys])],
    advisory: true,
    grantsPermissions: false,
    authoritative: false,
  };
}

export function personaDefinitionToDraft(p: WorkPersonaDefinition): DraftWorkPersona {
  return {
    key: `draft_${p.key}`,
    displayName: p.displayName,
    purpose: p.purpose,
    responsibilities: p.responsibilities,
    workflowParticipation: p.workflowParticipation,
    workflowPositions: p.workflowPositions,
    buildingBlockKeys: p.sourceRoleArchetypeKeys,
    advisory: true,
    grantsPermissions: false,
    authoritative: false,
  };
}
