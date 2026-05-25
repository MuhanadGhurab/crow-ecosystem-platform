/**
 * Subscription capability matrix — source of truth for tier behavior (advisory by default).
 * Plan keys in DB: startup | growth | enterprise
 * Display names: Crow Start | Crow Growth | Crow Enterprise
 */

import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

export const PLAN_DISPLAY_NAMES: Record<SubscriptionTierKey, string> = {
  startup: "Crow Start",
  growth: "Crow Growth",
  enterprise: "Crow Enterprise",
};

/** Capability keys grouped by product area */
export type IdentityCapability =
  | "native_auth"
  | "optional_mfa"
  | "microsoft_entra_sso"
  | "entra_group_mapping"
  | "scim_provisioning";

export type CemCapability =
  | "core_modules"
  | "advanced_modules"
  | "custom_workflows"
  | "advanced_analytics"
  | "multi_branch_operations";

export type CybercrowCapability =
  | "basic_audit_logs"
  | "session_tracking"
  | "basic_risk_events"
  | "incident_reporting"
  | "advanced_risk_scoring"
  | "compliance_evidence"
  | "full_grc";

export type SareaCapability =
  | "basic_role_dashboards"
  | "role_based_layouts"
  | "adaptive_contextual_experience"
  | "mobile_frontline_experience"
  | "executive_command_center"
  | "analyst_security_console";

export type DiscoveryCapability =
  | "guided_setup"
  | "sector_template_recommendations"
  | "full_organizational_intelligence"
  | "advanced_approval_chain_modeling";

export type BlueprintCapability =
  | "lightweight_blueprint"
  | "operational_blueprint"
  | "full_enterprise_blueprint";

export type CapabilityKey =
  | IdentityCapability
  | CemCapability
  | CybercrowCapability
  | SareaCapability
  | DiscoveryCapability
  | BlueprintCapability;

export type PlanLimits = {
  max_users: number;
  max_departments: number;
  max_branches: number;
  max_workflows: number;
  max_modules: number;
  max_sarea_profiles: number;
};

export type PlanDepth = "basic" | "standard" | "full";

export type PlanCapabilityProfile = {
  capabilities: ReadonlySet<CapabilityKey>;
  limits: PlanLimits;
  identityMode: "native" | "native_mfa" | "entra" | "entra_scim";
  cybercrowDepth: PlanDepth;
  sareaDepth: PlanDepth;
  discoveryDepth: PlanDepth;
  blueprintDepth: PlanDepth;
  /** Logistics sector: max recommended positions after depth trim */
  logisticsCorePositionCap?: number;
};

const STARTUP_CAPABILITIES: CapabilityKey[] = [
  "native_auth",
  "optional_mfa",
  "core_modules",
  "basic_audit_logs",
  "session_tracking",
  "basic_risk_events",
  "basic_role_dashboards",
  "guided_setup",
  "sector_template_recommendations",
  "lightweight_blueprint",
];

const GROWTH_CAPABILITIES: CapabilityKey[] = [
  ...STARTUP_CAPABILITIES,
  "advanced_modules",
  "multi_branch_operations",
  "incident_reporting",
  "role_based_layouts",
  "adaptive_contextual_experience",
  "advanced_approval_chain_modeling",
  "operational_blueprint",
];

const ENTERPRISE_CAPABILITIES: CapabilityKey[] = [
  ...GROWTH_CAPABILITIES,
  "microsoft_entra_sso",
  "entra_group_mapping",
  "scim_provisioning",
  "custom_workflows",
  "advanced_analytics",
  "advanced_risk_scoring",
  "compliance_evidence",
  "full_grc",
  "mobile_frontline_experience",
  "executive_command_center",
  "analyst_security_console",
  "full_organizational_intelligence",
  "full_enterprise_blueprint",
];

export const PLAN_CAPABILITY_PROFILES: Record<SubscriptionTierKey, PlanCapabilityProfile> = {
  startup: {
    capabilities: new Set(STARTUP_CAPABILITIES),
    limits: {
      max_users: 50,
      max_departments: 6,
      max_branches: 2,
      max_workflows: 5,
      max_modules: 8,
      max_sarea_profiles: 3,
    },
    identityMode: "native",
    cybercrowDepth: "basic",
    sareaDepth: "basic",
    discoveryDepth: "basic",
    blueprintDepth: "basic",
    logisticsCorePositionCap: 6,
  },
  growth: {
    capabilities: new Set(GROWTH_CAPABILITIES),
    limits: {
      max_users: 100,
      max_departments: 10,
      max_branches: 5,
      max_workflows: 10,
      max_modules: 15,
      max_sarea_profiles: 5,
    },
    identityMode: "native_mfa",
    cybercrowDepth: "standard",
    sareaDepth: "standard",
    discoveryDepth: "standard",
    blueprintDepth: "standard",
    logisticsCorePositionCap: 12,
  },
  enterprise: {
    capabilities: new Set(ENTERPRISE_CAPABILITIES),
    limits: {
      max_users: 500,
      max_departments: 99,
      max_branches: 99,
      max_workflows: 99,
      max_modules: 99,
      max_sarea_profiles: 99,
    },
    identityMode: "entra_scim",
    cybercrowDepth: "full",
    sareaDepth: "full",
    discoveryDepth: "full",
    blueprintDepth: "full",
  },
};

/** Crow Start fixed packages — metadata only (not separate DB tables). */
export const CROW_START_PACKAGES = [
  {
    key: "essentials",
    nameEn: "Crow Start Essentials",
    maxUsers: 10,
    modules: ["hr", "tasks", "crm"],
    moduleLabels: ["HR Lite", "Tasks", "CRM Lite"],
    mfaRequired: false,
  },
  {
    key: "operations",
    nameEn: "Crow Start Operations",
    maxUsers: 25,
    modules: ["hr", "tasks", "crm", "logistics", "inventory"],
    moduleLabels: ["HR Lite", "Tasks", "CRM Lite", "Logistics Lite", "Inventory"],
    mfaRequired: false,
  },
  {
    key: "secure",
    nameEn: "Crow Start Secure",
    maxUsers: 30,
    modules: ["hr", "tasks", "crm", "logistics"],
    moduleLabels: ["HR Lite", "Tasks", "CRM Lite", "Logistics Lite"],
    mfaRequired: true,
  },
] as const;

/** Minimum tier that unlocks a capability (for advisory UI labels). */
export const CAPABILITY_MIN_TIER: Partial<Record<CapabilityKey, SubscriptionTierKey>> = {
  advanced_approval_chain_modeling: "growth",
  incident_reporting: "growth",
  role_based_layouts: "growth",
  adaptive_contextual_experience: "growth",
  multi_branch_operations: "growth",
  operational_blueprint: "growth",
  microsoft_entra_sso: "enterprise",
  entra_group_mapping: "enterprise",
  scim_provisioning: "enterprise",
  custom_workflows: "enterprise",
  advanced_analytics: "enterprise",
  advanced_risk_scoring: "enterprise",
  compliance_evidence: "enterprise",
  full_grc: "enterprise",
  executive_command_center: "enterprise",
  analyst_security_console: "enterprise",
  full_organizational_intelligence: "enterprise",
  full_enterprise_blueprint: "enterprise",
};

const TIER_ORDER: SubscriptionTierKey[] = ["startup", "growth", "enterprise"];

export function normalizePlanKey(planKey?: string | null): SubscriptionTierKey {
  if (planKey === "growth" || planKey === "enterprise") return planKey;
  return "startup";
}

export function planHasCapability(
  planKey: SubscriptionTierKey,
  capabilityKey: CapabilityKey
): boolean {
  return PLAN_CAPABILITY_PROFILES[planKey].capabilities.has(capabilityKey);
}

export function getPlanProfile(planKey: SubscriptionTierKey): PlanCapabilityProfile {
  return PLAN_CAPABILITY_PROFILES[planKey];
}

export function tierMeetsMinimum(
  current: SubscriptionTierKey,
  required: SubscriptionTierKey
): boolean {
  return TIER_ORDER.indexOf(current) >= TIER_ORDER.indexOf(required);
}

export type AdvisoryTierHint = "included" | "growth" | "enterprise";

/** Advisory label for UI — does not block access. */
export function advisoryHintForCapability(
  currentPlanKey: SubscriptionTierKey,
  capabilityKey: CapabilityKey
): AdvisoryTierHint {
  if (planHasCapability(currentPlanKey, capabilityKey)) return "included";
  const min = CAPABILITY_MIN_TIER[capabilityKey];
  if (!min) return "included";
  if (tierMeetsMinimum(currentPlanKey, min)) return "included";
  if (min === "enterprise") return "enterprise";
  return "growth";
}

export function advisoryLabelForHint(
  hint: AdvisoryTierHint,
  currentPlanKey?: SubscriptionTierKey
): string {
  switch (hint) {
    case "included":
      return currentPlanKey
        ? `Included in ${PLAN_DISPLAY_NAMES[currentPlanKey]}`
        : "Included in your plan";
    case "growth":
      return "Recommended for Crow Growth";
    case "enterprise":
      return "Enterprise capability";
  }
}
