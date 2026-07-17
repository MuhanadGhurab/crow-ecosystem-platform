import type { DomainPackDefinition } from "../domain-types";
import { DOMAIN_PACK_CATALOG } from "./domain-pack-catalog";
import { listSpecialistDomains } from "../specialist-domains/index";
import { DEPARTMENT_ARCHETYPE_CATALOG } from "../departments/department-archetype-catalog";
import { ENTITY_PACK_CATALOG } from "../entities/entity-pack-catalog";
import { INTEGRATION_PACK_CATALOG } from "../integrations/integration-pack-catalog";
import { COMPLIANCE_OVERLAY_CATALOG } from "../compliance/compliance-overlay-catalog";
import { listWorkPersonas } from "../work-personas/index";
import { listWorkflowTemplates } from "../workflows/index";

export type DomainPackValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function listDomainPacks(): readonly DomainPackDefinition[] {
  return DOMAIN_PACK_CATALOG;
}

export function getDomainPack(key: string): DomainPackDefinition | undefined {
  return DOMAIN_PACK_CATALOG.find((p) => p.key === key);
}

function resolveKeys(catalog: readonly { key: string }[], keys: readonly string[], label: string): string[] {
  const missing = keys.filter((k) => !catalog.some((c) => c.key === k));
  return missing.map((k) => `Unknown ${label}: ${k}`);
}

export function validateDomainPack(pack: DomainPackDefinition): DomainPackValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (pack.authoritative !== false) errors.push("Domain pack must not be authoritative");
  if (pack.grantsPermissions !== false) errors.push("Domain pack must not grant permissions");
  if (pack.provisionsTenant !== false) errors.push("Domain pack must not provision tenant");

  errors.push(...resolveKeys(listSpecialistDomains(), pack.specialistDomainKeys, "specialist domain"));
  errors.push(...resolveKeys(DEPARTMENT_ARCHETYPE_CATALOG, pack.recommendedDepartmentKeys, "department"));
  errors.push(...resolveKeys(ENTITY_PACK_CATALOG, pack.entityPackKeys, "entity pack"));
  errors.push(...resolveKeys(INTEGRATION_PACK_CATALOG, pack.integrationPackKeys, "integration pack"));
  errors.push(...resolveKeys(COMPLIANCE_OVERLAY_CATALOG, pack.complianceOverlayKeys, "compliance overlay"));
  errors.push(...resolveKeys(listWorkPersonas(), pack.workPersonaKeys, "work persona"));
  errors.push(...resolveKeys(listWorkflowTemplates(), pack.workflowTemplateKeys, "workflow template"));

  for (const dep of pack.dependencies ?? []) {
    if (!DOMAIN_PACK_CATALOG.some((p) => p.key === dep)) warnings.push(`Unresolved dependency: ${dep}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function resolveDomainPackDependencies(packKey: string): DomainPackDefinition[] {
  const visited = new Set<string>();
  const result: DomainPackDefinition[] = [];

  function walk(key: string) {
    if (visited.has(key)) return;
    visited.add(key);
    const pack = getDomainPack(key);
    if (!pack) return;
    for (const dep of pack.dependencies ?? []) walk(dep);
    result.push(pack);
  }

  walk(packKey);
  return result;
}

export type ComposedDomainPack = DomainPackDefinition & {
  resolvedSpecialistDomains: readonly string[];
  resolvedDepartments: readonly string[];
  composedAt: string;
  advisory: true;
};

export function composeDomainPack(packKey: string): ComposedDomainPack | null {
  const pack = getDomainPack(packKey);
  if (!pack) return null;
  const deps = resolveDomainPackDependencies(packKey);
  const specialistSet = new Set<string>();
  const deptSet = new Set<string>();
  for (const p of deps) {
    for (const s of p.specialistDomainKeys) specialistSet.add(s);
    for (const d of p.recommendedDepartmentKeys) deptSet.add(d);
  }
  return {
    ...pack,
    resolvedSpecialistDomains: [...specialistSet],
    resolvedDepartments: [...deptSet],
    composedAt: "composition-local",
    advisory: true,
  };
}

export type DomainPackComparison = {
  packA: string;
  packB: string;
  addedDepartments: string[];
  removedDepartments: string[];
  addedWorkflows: string[];
  removedWorkflows: string[];
  addedPersonas: string[];
  removedPersonas: string[];
  sharedConflicts: string[];
};

export function compareDomainPacks(aKey: string, bKey: string): DomainPackComparison | null {
  const a = getDomainPack(aKey);
  const b = getDomainPack(bKey);
  if (!a || !b) return null;

  const diff = (xs: readonly string[], ys: readonly string[]) => ({
    added: ys.filter((x) => !xs.includes(x)),
    removed: xs.filter((x) => !ys.includes(x)),
  });

  const depts = diff(a.recommendedDepartmentKeys, b.recommendedDepartmentKeys);
  const wfs = diff(a.workflowTemplateKeys, b.workflowTemplateKeys);
  const personas = diff(a.workPersonaKeys, b.workPersonaKeys);
  const sharedConflicts = (a.conflicts ?? []).filter((k) => (b.conflicts ?? []).includes(k));

  return {
    packA: aKey,
    packB: bKey,
    addedDepartments: depts.added,
    removedDepartments: depts.removed,
    addedWorkflows: wfs.added,
    removedWorkflows: wfs.removed,
    addedPersonas: personas.added,
    removedPersonas: personas.removed,
    sharedConflicts,
  };
}
