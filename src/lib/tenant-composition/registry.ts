import type { ComposeTenantBlueprintInput, TenantBlueprintComposition } from "./types";
import { CAPABILITY_CATALOG } from "./capability-catalog";
import { WORKFLOW_PATTERN_CATALOG } from "./workflow-pattern-catalog";
import { ROLE_ARCHETYPE_CATALOG, JOB_FAMILY_CATALOG } from "./role-job-catalog";
import { PERMISSION_BUNDLE_CATALOG, FORBIDDEN_PLATFORM_BUNDLE_KEYS } from "./permission-bundle-catalog";
import { SAREA_EXPERIENCE_PATTERN_CATALOG } from "./sarea-pattern-catalog";
import { CYBERCROW_POLICY_PACK_CATALOG } from "./cybercrow-policy-catalog";
import { INDUSTRY_ARCHETYPE_CATALOG, ORGANIZATIONAL_OVERLAY_CATALOG } from "./industry-archetype-catalog";

export type CatalogKind =
  | "industryArchetype"
  | "capability"
  | "workflow"
  | "role"
  | "jobFamily"
  | "permissionBundle"
  | "sareaPattern"
  | "cyberCrowPolicyPack"
  | "overlay";

const capabilityByKey = new Map(CAPABILITY_CATALOG.map((c) => [c.key, c]));
const workflowByKey = new Map(WORKFLOW_PATTERN_CATALOG.map((w) => [w.key, w]));
const roleByKey = new Map(ROLE_ARCHETYPE_CATALOG.map((r) => [r.key, r]));
const jobFamilyByKey = new Map(JOB_FAMILY_CATALOG.map((j) => [j.key, j]));
const permissionByKey = new Map(PERMISSION_BUNDLE_CATALOG.map((p) => [p.key, p]));
const sareaByKey = new Map(SAREA_EXPERIENCE_PATTERN_CATALOG.map((s) => [s.key, s]));
const policyByKey = new Map(CYBERCROW_POLICY_PACK_CATALOG.map((p) => [p.key, p]));
const archetypeByKey = new Map(INDUSTRY_ARCHETYPE_CATALOG.map((a) => [a.key, a]));
const overlayByKey = new Map(ORGANIZATIONAL_OVERLAY_CATALOG.map((o) => [o.key, o]));

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort();
}

export function listIndustryArchetypes() {
  return [...INDUSTRY_ARCHETYPE_CATALOG];
}

export function listCapabilities() {
  return [...CAPABILITY_CATALOG];
}

export function listWorkflowPatterns() {
  return [...WORKFLOW_PATTERN_CATALOG];
}

export function listRoleArchetypes() {
  return [...ROLE_ARCHETYPE_CATALOG];
}

export function listJobFamilies() {
  return [...JOB_FAMILY_CATALOG];
}

export function listPermissionBundles() {
  return [...PERMISSION_BUNDLE_CATALOG];
}

export function listSareaExperiencePatterns() {
  return [...SAREA_EXPERIENCE_PATTERN_CATALOG];
}

export function listCyberCrowPolicyPacks() {
  return [...CYBERCROW_POLICY_PACK_CATALOG];
}

export function listOrganizationalOverlays() {
  return [...ORGANIZATIONAL_OVERLAY_CATALOG];
}

export function resolveCatalogKey(kind: CatalogKind, key: string): boolean {
  switch (kind) {
    case "industryArchetype":
      return archetypeByKey.has(key);
    case "capability":
      return capabilityByKey.has(key);
    case "workflow":
      return workflowByKey.has(key);
    case "role":
      return roleByKey.has(key);
    case "jobFamily":
      return jobFamilyByKey.has(key);
    case "permissionBundle":
      return permissionByKey.has(key);
    case "sareaPattern":
      return sareaByKey.has(key);
    case "cyberCrowPolicyPack":
      return policyByKey.has(key);
    case "overlay":
      return overlayByKey.has(key);
    default:
      return false;
  }
}

export type ValidationResult = {
  valid: boolean;
  missingDependencies: string[];
  conflicts: string[];
  unknownKeys: string[];
};

export function validateCapabilityDependencies(capabilityKeys: readonly string[]): ValidationResult {
  const unknownKeys: string[] = [];
  const missingDependencies: string[] = [];
  const conflicts: string[] = [];

  for (const key of capabilityKeys) {
    const cap = capabilityByKey.get(key);
    if (!cap) {
      unknownKeys.push(key);
      continue;
    }
    for (const dep of cap.dependencies ?? []) {
      if (!capabilityKeys.includes(dep)) missingDependencies.push(`${key}→${dep}`);
    }
    for (const conflict of cap.conflicts ?? []) {
      if (capabilityKeys.includes(conflict)) conflicts.push(`${key}↔${conflict}`);
    }
  }

  return {
    valid: unknownKeys.length === 0 && missingDependencies.length === 0 && conflicts.length === 0,
    missingDependencies: uniqueSorted(missingDependencies),
    conflicts: uniqueSorted(conflicts),
    unknownKeys: uniqueSorted(unknownKeys),
  };
}

const OVERLAY_CAPABILITY_BOOSTS: Record<string, readonly string[]> = {
  field_workforce: ["field_service", "time_tracking"],
  asset_heavy: ["asset_registry", "preventive_maintenance"],
  vendor_heavy: ["vendor_management", "procurement"],
  customer_membership: ["customer_portal"],
  highly_regulated: ["audit", "policy_management", "incident_management"],
  multi_branch: ["organization_structure"],
  enterprise: ["audit", "analytics"],
  project_based: ["project_management", "time_tracking"],
};

const OVERLAY_POLICY_BOOSTS: Record<string, readonly string[]> = {
  field_workforce: ["field_device_trust"],
  highly_regulated: ["audit_and_evidence", "high_risk_workflow_approval"],
  multi_branch: ["branch_access_control"],
  enterprise: ["privileged_access", "data_export_control"],
  vendor_heavy: ["vendor_access"],
};

const OVERLAY_SAREA_BOOSTS: Record<string, readonly string[]> = {
  field_workforce: ["field_task_mobile"],
  enterprise: ["executive_command_center"],
  customer_membership: ["member_portal"],
  highly_regulated: ["compliance_cockpit"],
};

const OVERLAY_PERMISSION_BOOSTS: Record<string, readonly string[]> = {
  enterprise: ["tenant_executive_read", "auditor_read_only"],
  small_business: ["self_service", "team_supervisor"],
};

/** Deterministic draft composition — advisory only, no provisioning. */
export function composeTenantBlueprint(input: ComposeTenantBlueprintInput): TenantBlueprintComposition {
  const archetype = archetypeByKey.get(input.industryArchetype);
  const overlayKeys = input.overlays ?? [];
  const organizationSignals = input.organizationSignals ?? {};
  const warnings: string[] = [];
  const unresolvedDecisions: string[] = [];

  if (!archetype) {
    return {
      industryArchetypeKey: input.industryArchetype,
      overlayKeys,
      selectedCapabilityKeys: [],
      organizationSignals,
      recommendedDepartments: [],
      recommendedCapabilities: [],
      recommendedWorkflows: [],
      recommendedRoles: [],
      recommendedJobFamilies: [],
      recommendedPermissionBundles: [],
      recommendedSareaPatterns: [],
      recommendedCyberCrowPolicyPacks: [],
      warnings: [`Unknown industry archetype: ${input.industryArchetype}`],
      unresolvedDecisions: ["Select a valid industry archetype"],
    };
  }

  for (const overlayKey of overlayKeys) {
    if (!overlayByKey.has(overlayKey)) warnings.push(`Unknown overlay: ${overlayKey}`);
  }

  const capabilitySet = new Set<string>([
    ...archetype.recommendedCapabilityKeys,
    ...(input.selectedCapabilities ?? []),
  ]);

  for (const overlayKey of overlayKeys) {
    for (const cap of OVERLAY_CAPABILITY_BOOSTS[overlayKey] ?? []) capabilitySet.add(cap);
  }

  if (organizationSignals.inventory_needs === true) capabilitySet.add("inventory");
  if (organizationSignals.field_workforce === true) {
    capabilitySet.add("field_service");
    capabilitySet.add("dispatch");
  }
  if (organizationSignals.regulatory_needs === "high") {
    capabilitySet.add("audit");
    capabilitySet.add("incident_management");
  }

  const capabilityKeys = uniqueSorted(capabilitySet);
  const depValidation = validateCapabilityDependencies(capabilityKeys);
  warnings.push(...depValidation.missingDependencies.map((d) => `Missing dependency: ${d}`));
  warnings.push(...depValidation.conflicts.map((c) => `Conflict: ${c}`));
  warnings.push(...depValidation.unknownKeys.map((k) => `Unknown capability: ${k}`));

  const workflowSet = new Set<string>(archetype.commonWorkflowPatternKeys);
  for (const capKey of capabilityKeys) {
    const cap = capabilityByKey.get(capKey);
    if (cap) for (const wf of cap.typicalWorkflowPatternKeys) workflowSet.add(wf);
  }
  if (overlayKeys.includes("vendor_heavy")) workflowSet.add("procure_to_receive");
  if (overlayKeys.includes("project_based")) workflowSet.add("project_delivery");

  const roleSet = new Set<string>(archetype.commonRoleArchetypeKeys);
  roleSet.add("tenant_administrator");
  for (const capKey of capabilityKeys) {
    const cap = capabilityByKey.get(capKey);
    if (cap) for (const role of cap.recommendedRoleArchetypeKeys) roleSet.add(role);
  }

  const jobFamilySet = new Set<string>(archetype.commonJobFamilyKeys);
  for (const roleKey of roleSet) {
    const role = roleByKey.get(roleKey);
    if (role) for (const jf of role.suggestedJobFamilyKeys) jobFamilySet.add(jf);
  }

  const permissionSet = new Set<string>();
  for (const roleKey of roleSet) {
    const role = roleByKey.get(roleKey);
    if (role) for (const pb of role.suggestedPermissionBundleKeys) permissionSet.add(pb);
  }
  for (const wfKey of workflowSet) {
    const wf = workflowByKey.get(wfKey);
    if (wf) for (const pb of wf.requiredPermissionBundleKeys) permissionSet.add(pb);
  }
  for (const overlayKey of overlayKeys) {
    for (const pb of OVERLAY_PERMISSION_BOOSTS[overlayKey] ?? []) permissionSet.add(pb);
  }
  for (const forbidden of FORBIDDEN_PLATFORM_BUNDLE_KEYS) permissionSet.delete(forbidden);

  const sareaSet = new Set<string>(archetype.recommendedSareaPatternKeys);
  for (const capKey of capabilityKeys) {
    const cap = capabilityByKey.get(capKey);
    if (cap) for (const sp of cap.recommendedSareaPatternKeys) sareaSet.add(sp);
  }
  for (const overlayKey of overlayKeys) {
    for (const sp of OVERLAY_SAREA_BOOSTS[overlayKey] ?? []) sareaSet.add(sp);
  }

  const policySet = new Set<string>(archetype.recommendedCyberCrowPolicyPackKeys);
  for (const overlayKey of overlayKeys) {
    for (const pp of OVERLAY_POLICY_BOOSTS[overlayKey] ?? []) policySet.add(pp);
  }
  if (organizationSignals.security_sensitivity === "high") {
    policySet.add("session_risk");
    policySet.add("privileged_access");
  }

  if (!organizationSignals.approval_complexity) {
    unresolvedDecisions.push("Define approval complexity (low / medium / high)");
  }
  if (organizationSignals.branch_count === undefined && overlayKeys.includes("multi_branch")) {
    unresolvedDecisions.push("Confirm branch count for multi-branch overlay");
  }

  warnings.push("Industry archetype recommendations are advisory — they do not grant permissions.");
  warnings.push("Job titles and SAREA patterns do not grant permissions.");
  warnings.push("Human blueprint review and approval required before any tenant build.");

  return {
    industryArchetypeKey: archetype.key,
    overlayKeys,
    selectedCapabilityKeys: capabilityKeys,
    organizationSignals,
    recommendedDepartments: uniqueSorted(archetype.commonDepartments),
    recommendedCapabilities: capabilityKeys,
    recommendedWorkflows: uniqueSorted(workflowSet),
    recommendedRoles: uniqueSorted(roleSet),
    recommendedJobFamilies: uniqueSorted(jobFamilySet),
    recommendedPermissionBundles: uniqueSorted(permissionSet),
    recommendedSareaPatterns: uniqueSorted(sareaSet),
    recommendedCyberCrowPolicyPacks: uniqueSorted(policySet),
    warnings: uniqueSorted(warnings),
    unresolvedDecisions: uniqueSorted(unresolvedDecisions),
  };
}

export function resolveArchetypeRecommendations(industryArchetypeKey: string) {
  return composeTenantBlueprint({ industryArchetype: industryArchetypeKey });
}

export function applyOverlays(
  base: TenantBlueprintComposition,
  overlays: readonly string[],
): TenantBlueprintComposition {
  return composeTenantBlueprint({
    industryArchetype: base.industryArchetypeKey,
    overlays,
    selectedCapabilities: base.selectedCapabilityKeys,
    organizationSignals: base.organizationSignals,
  });
}

export function detectConflicts(capabilityKeys: readonly string[]): string[] {
  return validateCapabilityDependencies(capabilityKeys).conflicts;
}
