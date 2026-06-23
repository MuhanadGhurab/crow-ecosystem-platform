/**
 * Legacy catalog adapters — preserve runtime behavior, return advisory mappings only.
 */

export type LegacyAdapterResult<T> = {
  value: T | null;
  mapped: boolean;
  source: string;
  target: string | null;
  compatibilityNote: string;
  grantsAuthority: false;
};

const SECTOR_TO_ARCHETYPE: Record<string, string> = {
  logistics: "logistics_and_fleet",
  retail: "retail_and_commerce",
  healthcare: "healthcare_operations",
  construction: "construction_and_epc",
  aviation: "professional_services",
};

const MODULE_TO_CAPABILITY: Record<string, string> = {
  logistics: "dispatch",
  inventory: "inventory",
  warehouse: "warehouse",
  hr: "workforce_directory",
  crm: "crm",
  sales: "sales_pipeline",
  finance: "invoice_workflow",
  procurement: "procurement",
  reports: "analytics",
  tasks: "task_management",
  workflows: "workflow_automation",
};

const SAREA_PACKAGE_TO_PATTERN: Record<string, string> = {
  dispatch_console: "dispatch_console",
  manager_dashboard: "manager_work_queue",
  executive: "executive_command_center",
  field_mobile: "field_task_mobile",
  customer_portal: "customer_portal",
};

const CYBERCROW_PACKAGE_TO_POLICY: Record<string, string> = {
  crow_shield: "baseline_identity_trust",
  crow_sentinel: "privileged_access",
  crow_fortress: "high_risk_workflow_approval",
};

const LOGISTICS_ROLE_TO_PERSONA: Record<string, string> = {
  hub_manager: "field_coordinator",
  dispatcher: "resource_allocator",
  driver: "field_coordinator",
};

export function adaptLegacySectorToArchetype(sectorKey: string): LegacyAdapterResult<string> {
  const target = SECTOR_TO_ARCHETYPE[sectorKey] ?? null;
  return {
    value: target,
    mapped: target !== null,
    source: `sector:${sectorKey}`,
    target,
    compatibilityNote: target ? "Legacy sector mapped to industry archetype (advisory)" : `Unmapped legacy sector: ${sectorKey}`,
    grantsAuthority: false,
  };
}

export function adaptErpModuleToCapability(moduleKey: string): LegacyAdapterResult<string> {
  const target = MODULE_TO_CAPABILITY[moduleKey] ?? null;
  return {
    value: target,
    mapped: target !== null,
    source: `cem_module:${moduleKey}`,
    target,
    compatibilityNote: target ? "ERP module mapped to capability definition (advisory)" : `Unmapped module: ${moduleKey}`,
    grantsAuthority: false,
  };
}

export function adaptLegacySareaPackageToPattern(packageKey: string): LegacyAdapterResult<string> {
  const target = SAREA_PACKAGE_TO_PATTERN[packageKey] ?? packageKey;
  return {
    value: target,
    mapped: packageKey in SAREA_PACKAGE_TO_PATTERN,
    source: `sarea_package:${packageKey}`,
    target,
    compatibilityNote: "Legacy SAREA package mapped to experience pattern (presentation only)",
    grantsAuthority: false,
  };
}

export function adaptLegacyCyberCrowPackageToPolicy(packageKey: string): LegacyAdapterResult<string> {
  const target = CYBERCROW_PACKAGE_TO_POLICY[packageKey] ?? "baseline_identity_trust";
  return {
    value: target,
    mapped: packageKey in CYBERCROW_PACKAGE_TO_POLICY,
    source: `cybercrow_package:${packageKey}`,
    target,
    compatibilityNote: "Legacy CyberCrow tier mapped to policy pack recommendation (tenant-scoped)",
    grantsAuthority: false,
  };
}

export function adaptLogisticsSampleRoleToPersona(roleKey: string): LegacyAdapterResult<string> {
  const target = LOGISTICS_ROLE_TO_PERSONA[roleKey] ?? null;
  return {
    value: target,
    mapped: target !== null,
    source: `logistics_role:${roleKey}`,
    target,
    compatibilityNote: target ? "Logistics sample role mapped to Work Persona reference (non-authoritative)" : `Unmapped logistics role: ${roleKey}`,
    grantsAuthority: false,
  };
}

export function listUnmappedLegacySectors(sectors: readonly string[]): string[] {
  return sectors.filter((s) => !SECTOR_TO_ARCHETYPE[s]);
}
