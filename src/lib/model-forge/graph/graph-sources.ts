import type { EnterpriseModelDraft } from "../types";
import { listSpecialistDomains } from "../specialist-domains/index";
import { DOMAIN_PACK_CATALOG } from "../domain-packs/domain-pack-catalog";
import { DEPARTMENT_ARCHETYPE_CATALOG } from "../departments/department-archetype-catalog";
import { ALL_ENTITIES, ENTITY_PACK_CATALOG } from "../entities/entity-pack-catalog";
import { INTEGRATION_PACK_CATALOG } from "../integrations/integration-pack-catalog";
import { COMPLIANCE_OVERLAY_CATALOG } from "../compliance/compliance-overlay-catalog";
import { listCapabilities, listSareaExperiencePatterns, listCyberCrowPolicyPacks } from "@/lib/tenant-composition/registry";

export type GraphResolvedSources = {
  specialistKeys: string[];
  domainPackKeys: string[];
  departmentKeys: string[];
  capabilityKeys: string[];
  entityKeys: string[];
  entityPackKeys: string[];
  sareaPatternKeys: string[];
  cyberCrowPolicyKeys: string[];
  integrationKeys: string[];
  complianceOverlayKeys: string[];
  coverageNotes: Record<string, string>;
};

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort();
}

export function resolveGraphSources(
  draft: EnterpriseModelDraft,
  specialistKeys: string[] = [],
): GraphResolvedSources {
  const coverageNotes: Record<string, string> = {};
  const sk = specialistKeys.length > 0 ? specialistKeys : [...draft.dna.specialistDomains];

  const domainPackKeys = uniqueSorted(
    DOMAIN_PACK_CATALOG.filter((p) => p.specialistDomainKeys.some((d) => sk.includes(d))).map((p) => p.key),
  );
  if (domainPackKeys.length === 0 && sk.length > 0) {
    coverageNotes.domain_pack = "not_recommended_for_selection";
  }

  const capabilityKeys = uniqueSorted([
    ...DOMAIN_PACK_CATALOG.filter((p) => domainPackKeys.includes(p.key)).flatMap((p) => p.capabilityKeys),
    ...listSpecialistDomains()
      .filter((d) => sk.includes(d.key))
      .flatMap((d) => d.recommendedCapabilityKeys),
  ]);
  if (capabilityKeys.length === 0) coverageNotes.capability = "not_selected";

  const entityPackKeys = uniqueSorted(
    DOMAIN_PACK_CATALOG.filter((p) => domainPackKeys.includes(p.key)).flatMap((p) => p.entityPackKeys),
  );
  if (entityPackKeys.length === 0) entityPackKeys.push("core_operating");

  const entityKeys = uniqueSorted(
    ENTITY_PACK_CATALOG.filter((p) => entityPackKeys.includes(p.key)).flatMap((p) => [...p.coreEntityKeys, ...p.specialistEntityKeys]),
  );

  const specialistEntities = listSpecialistDomains()
    .filter((d) => sk.includes(d.key))
    .flatMap((d) => d.entitySuggestionKeys);
  const allEntityKeys = uniqueSorted([...entityKeys, ...specialistEntities]);

  const sareaPatternKeys = uniqueSorted(
    draft.workPersonas
      .map((p) => p.recommendedSareaPatternKey)
      .filter((x): x is string => !!x)
      .concat(
        listSpecialistDomains()
          .filter((d) => sk.includes(d.key))
          .flatMap((d) => d.recommendedSareaPatternKeys),
      ),
  );
  if (sareaPatternKeys.length === 0) coverageNotes.sarea = "not_recommended";

  const cyberCrowPolicyKeys = uniqueSorted([
    ...draft.trustControls.map((t) => t.cyberCrowPolicyPackKey),
    ...draft.workPersonas.flatMap((p) => p.recommendedCyberCrowPolicyPackKeys),
    ...DOMAIN_PACK_CATALOG.filter((p) => domainPackKeys.includes(p.key)).flatMap((p) => p.cyberCrowPolicyPackKeys),
  ]);

  const integrationKeys = uniqueSorted(
    DOMAIN_PACK_CATALOG.filter((p) => domainPackKeys.includes(p.key)).flatMap((p) => p.integrationPackKeys),
  );
  if (integrationKeys.length === 0) coverageNotes.integration = "not_selected";

  const complianceOverlayKeys = uniqueSorted(
    DOMAIN_PACK_CATALOG.filter((p) => domainPackKeys.includes(p.key)).flatMap((p) => p.complianceOverlayKeys),
  );
  if (complianceOverlayKeys.length === 0 && sk.some((k) => k.includes("legal"))) {
    complianceOverlayKeys.push("legal_confidentiality");
  }

  const departmentKeys = uniqueSorted(draft.dna.departmentKeys ?? []);

  // Validate catalog resolution
  for (const c of capabilityKeys) {
    if (!listCapabilities().some((x) => x.key === c)) coverageNotes[`capability:${c}`] = "catalog_mapping_unavailable";
  }

  return {
    specialistKeys: sk,
    domainPackKeys,
    departmentKeys,
    capabilityKeys,
    entityKeys: allEntityKeys,
    entityPackKeys,
    sareaPatternKeys,
    cyberCrowPolicyKeys,
    integrationKeys,
    complianceOverlayKeys,
    coverageNotes,
  };
}

export function getEntityDefinition(key: string) {
  return ALL_ENTITIES.find((e) => e.key === key);
}

export function getCapabilityLabel(key: string) {
  return listCapabilities().find((c) => c.key === key)?.displayName ?? key;
}

export function getSareaLabel(key: string) {
  return listSareaExperiencePatterns().find((s) => s.key === key)?.displayName ?? key;
}

export function getCyberCrowLabel(key: string) {
  return listCyberCrowPolicyPacks().find((p) => p.key === key)?.displayName ?? key;
}

export function getDepartmentLabel(key: string) {
  return DEPARTMENT_ARCHETYPE_CATALOG.find((d) => d.key === key)?.displayName ?? key;
}

export function getDomainPackLabel(key: string) {
  return DOMAIN_PACK_CATALOG.find((p) => p.key === key)?.displayName ?? key;
}

export function getIntegrationLabel(key: string) {
  return INTEGRATION_PACK_CATALOG.find((i) => i.key === key)?.displayName ?? key;
}

export function getComplianceLabel(key: string) {
  return COMPLIANCE_OVERLAY_CATALOG.find((c) => c.key === key)?.displayName ?? key;
}
