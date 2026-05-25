/**
 * Trim sector org models to subscription plan depth (advisory generation — not hard enforcement).
 */

import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";
import { getPlanProfile } from "@/lib/subscription/plan-capabilities";
import type { OrgIntelligenceModel } from "@/lib/org-intelligence/types";

/** Logistics positions retained at Crow Start depth (4–6 core roles). */
const LOGISTICS_STARTUP_POSITION_KEYS = [
  "ceo",
  "coo",
  "ops-mgr",
  "logistics-mgr",
  "dispatcher",
  "driver",
] as const;

const LOGISTICS_STARTUP_DEPARTMENT_KEYS = [
  "exec",
  "ops",
  "logistics",
  "fleet",
  "warehouse",
  "finance",
] as const;

const LOGISTICS_STARTUP_WORKFLOW_KEYS = [
  "delivery-assign",
  "shipment-track",
  "incident-report",
  "vehicle-inspect",
  "employee-onboard",
] as const;

const LOGISTICS_GROWTH_EXTRA_WORKFLOW_KEYS = [
  "route-approval",
  "inv-transfer",
  "wh-dispatch",
  "cust-escalation",
] as const;

const CYBERCROW_BASIC_KEYS = ["mobile-workforce", "driver-trust", "logistics-audit"];
const CYBERCROW_STANDARD_EXTRA = ["branch-boundary", "privileged-monitor"];
const SAREA_BASIC_KEYS = ["exec-dash", "ops-dash", "driver-dash"];
const SAREA_STANDARD_EXTRA = ["dispatcher-dash", "warehouse-dash"];

function takeByKeys<T extends { key: string }>(items: T[], keys: readonly string[], max: number): T[] {
  const keySet = new Set(keys);
  const preferred = items.filter((i) => keySet.has(i.key));
  const rest = items.filter((i) => !keySet.has(i.key));
  return [...preferred, ...rest].slice(0, max);
}

function filterByDepth<T extends { key: string }>(
  items: T[],
  depth: "basic" | "standard" | "full",
  basicKeys: readonly string[],
  standardExtra: readonly string[]
): T[] {
  if (depth === "full") return items;
  if (depth === "standard") {
    const keys = [...basicKeys, ...standardExtra];
    return takeByKeys(items, keys, items.length);
  }
  return takeByKeys(items, basicKeys, basicKeys.length);
}

export type OrgModelTrimStats = {
  planKey: SubscriptionTierKey;
  discoveryDepth: "basic" | "standard" | "full";
  cybercrowDepth: "basic" | "standard" | "full";
  sareaDepth: "basic" | "standard" | "full";
  departmentsShown: number;
  departmentsTrimmed: number;
  positionsShown: number;
  positionsTrimmed: number;
  workflowsShown: number;
  workflowsTrimmed: number;
  approvalChainsShown: number;
  approvalChainsTrimmed: number;
  cybercrowBaselinesShown: number;
  cybercrowBaselinesTrimmed: number;
  sareaProfilesShown: number;
  sareaProfilesTrimmed: number;
  rolesHiddenCount: number;
};

function countTrimmed(before: number, after: number): number {
  return Math.max(0, before - after);
}

export function computeOrgModelTrimStats(
  fullModel: OrgIntelligenceModel,
  trimmedModel: OrgIntelligenceModel,
  planKey: SubscriptionTierKey
): OrgModelTrimStats {
  const profile = getPlanProfile(planKey);
  const positionsTrimmed = countTrimmed(fullModel.positions.length, trimmedModel.positions.length);
  return {
    planKey,
    discoveryDepth: profile.discoveryDepth,
    cybercrowDepth: profile.cybercrowDepth,
    sareaDepth: profile.sareaDepth,
    departmentsShown: trimmedModel.departments.length,
    departmentsTrimmed: countTrimmed(fullModel.departments.length, trimmedModel.departments.length),
    positionsShown: trimmedModel.positions.length,
    positionsTrimmed,
    workflowsShown: trimmedModel.workflows.length,
    workflowsTrimmed: countTrimmed(fullModel.workflows.length, trimmedModel.workflows.length),
    approvalChainsShown: trimmedModel.approvalChains.length,
    approvalChainsTrimmed: countTrimmed(
      fullModel.approvalChains.length,
      trimmedModel.approvalChains.length
    ),
    cybercrowBaselinesShown: trimmedModel.cybercrowBaselines.length,
    cybercrowBaselinesTrimmed: countTrimmed(
      fullModel.cybercrowBaselines.length,
      trimmedModel.cybercrowBaselines.length
    ),
    sareaProfilesShown: trimmedModel.sareaProfiles.length,
    sareaProfilesTrimmed: countTrimmed(
      fullModel.sareaProfiles.length,
      trimmedModel.sareaProfiles.length
    ),
    rolesHiddenCount: positionsTrimmed,
  };
}

export function applyPlanDepthToOrgModelWithStats(
  model: OrgIntelligenceModel,
  planKey: SubscriptionTierKey
): { model: OrgIntelligenceModel; trimStats: OrgModelTrimStats } {
  const trimmed = applyPlanDepthToOrgModel(model, planKey);
  return {
    model: trimmed,
    trimStats: computeOrgModelTrimStats(model, trimmed, planKey),
  };
}

export function applyPlanDepthToOrgModel(
  model: OrgIntelligenceModel,
  planKey: SubscriptionTierKey
): OrgIntelligenceModel {
  const profile = getPlanProfile(planKey);
  const { limits, discoveryDepth, cybercrowDepth, sareaDepth } = profile;
  const isLogistics = model.sectorTemplateKey === "logistics";

  let departments = model.departments.slice(0, limits.max_departments);
  if (isLogistics && discoveryDepth === "basic") {
    departments = takeByKeys(
      model.departments,
      LOGISTICS_STARTUP_DEPARTMENT_KEYS,
      limits.max_departments
    );
  } else {
    departments = departments.sort(
      (a, b) => (a.recommendedPriority ?? 99) - (b.recommendedPriority ?? 99)
    );
  }

  let positions = model.positions;
  if (isLogistics && discoveryDepth === "basic") {
    positions = takeByKeys(
      model.positions,
      LOGISTICS_STARTUP_POSITION_KEYS,
      profile.logisticsCorePositionCap ?? 6
    );
  } else if (discoveryDepth === "standard") {
    positions = model.positions.slice(0, profile.logisticsCorePositionCap ?? 12);
  }

  let workflows = model.workflows.slice(0, limits.max_workflows);
  if (isLogistics) {
    if (discoveryDepth === "basic") {
      workflows = takeByKeys(model.workflows, LOGISTICS_STARTUP_WORKFLOW_KEYS, limits.max_workflows);
    } else if (discoveryDepth === "standard") {
      const keys = [...LOGISTICS_STARTUP_WORKFLOW_KEYS, ...LOGISTICS_GROWTH_EXTRA_WORKFLOW_KEYS];
      workflows = takeByKeys(model.workflows, keys, limits.max_workflows);
    }
  }

  const approvalChains =
    discoveryDepth === "basic"
      ? []
      : discoveryDepth === "standard"
        ? model.approvalChains.slice(0, 2)
        : model.approvalChains;

  const cybercrowBaselines = filterByDepth(
    model.cybercrowBaselines,
    cybercrowDepth,
    CYBERCROW_BASIC_KEYS,
    CYBERCROW_STANDARD_EXTRA
  );

  const sareaProfiles = filterByDepth(
    model.sareaProfiles,
    sareaDepth,
    SAREA_BASIC_KEYS,
    SAREA_STANDARD_EXTRA
  ).slice(0, limits.max_sarea_profiles);

  const branchTypes = model.branchTypes.slice(0, limits.max_branches);

  return {
    ...model,
    departments,
    positions,
    workflows,
    approvalChains,
    cybercrowBaselines,
    sareaProfiles,
    branchTypes,
  };
}
