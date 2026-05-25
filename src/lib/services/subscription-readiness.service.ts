/**
 * Blueprint-scoped subscription / capability readiness — advisory warnings only (never blockers).
 */

import { prisma } from "@/lib/db";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";
import {
  PLAN_DISPLAY_NAMES,
  getPlanProfile,
  normalizePlanKey,
  planHasCapability,
  type PlanDepth,
} from "@/lib/subscription/plan-capabilities";
import { resolveBlueprintPlanContext } from "@/lib/services/subscription-capability.service";
import type { ReadinessGroupItem } from "@/lib/services/readiness.service";

export type SubscriptionAdvisoryStatus =
  | "advisory"
  | "review_required"
  | "upgrade_recommended";

const DEPTH_RANK: Record<PlanDepth, number> = { basic: 0, standard: 1, full: 2 };

function depthExceedsPlan(actual: PlanDepth, allowed: PlanDepth): boolean {
  return DEPTH_RANK[actual] > DEPTH_RANK[allowed];
}

function inferBlueprintScopeDepth(ctx: {
  moduleCount: number;
  workflowCount: number;
  roleCount: number;
  sareaCount: number;
}): PlanDepth {
  if (ctx.workflowCount >= 8 || ctx.moduleCount >= 12 || ctx.roleCount >= 15 || ctx.sareaCount >= 6) {
    return "full";
  }
  if (ctx.workflowCount >= 4 || ctx.moduleCount >= 6 || ctx.roleCount >= 8) {
    return "standard";
  }
  return "basic";
}

function advisoryItem(
  key: string,
  label: string,
  status: SubscriptionAdvisoryStatus,
  detail: string
): ReadinessGroupItem {
  const passed = status === "advisory";
  const statusNote =
    status === "upgrade_recommended"
      ? "Upgrade recommended"
      : status === "review_required"
        ? "Review recommended"
        : "Advisory";
  return {
    key,
    label,
    required: false,
    passed,
    detail: `${detail} · ${statusNote}`,
  };
}

function discoveryRequestsEntra(discovery: {
  integrations: { providerKey: string }[];
  answers?: { sectionKey: string; questionKey: string; valueJson: unknown }[];
} | null): boolean {
  if (!discovery) return false;
  if (
    discovery.integrations.some(
      (i) =>
        i.providerKey.toLowerCase().includes("entra") ||
        i.providerKey.toLowerCase().includes("microsoft")
    )
  ) {
    return true;
  }
  const answers = discovery.answers ?? [];
  return answers.some((a) => {
    if (a.sectionKey !== "identity") return false;
    const v = a.valueJson;
    if (typeof v === "string") {
      return v.toLowerCase().includes("entra");
    }
    return false;
  });
}

export type BlueprintSubscriptionReadiness = {
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  items: ReadinessGroupItem[];
  upgradeRecommendation: string | null;
  proceedNote: string;
};

export async function evaluateBlueprintSubscriptionReadiness(
  blueprintId: string
): Promise<BlueprintSubscriptionReadiness | null> {
  const planContext = await resolveBlueprintPlanContext(blueprintId);
  if (!planContext) return null;

  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    select: {
      tenant: {
        select: {
          id: true,
          planKey: true,
          subscription: { include: { plan: { select: { key: true } } } },
        },
      },
      modules: { where: { enabled: true }, select: { id: true } },
      workflows: { select: { id: true } },
      roles: { select: { id: true } },
      sareaProfiles: { select: { id: true } },
      request: {
        select: {
          requestedPlans: { take: 1, select: { planKey: true } },
          discoveryProfile: {
            select: {
              departments: { select: { id: true } },
              branches: { select: { id: true } },
              roles: { select: { id: true } },
              workflows: { select: { id: true } },
              integrations: { select: { providerKey: true } },
              answers: {
                where: { sectionKey: "identity" },
                select: { sectionKey: true, questionKey: true, valueJson: true },
              },
            },
          },
        },
      },
    },
  });

  if (!blueprint) return null;

  const { planKey, limits } = planContext;
  const profile = getPlanProfile(planKey);
  const discovery = blueprint.request.discoveryProfile;
  const items: ReadinessGroupItem[] = [];

  const tenant = blueprint.tenant;
  if (tenant && !tenant.subscription) {
    items.push(
      advisoryItem(
        "missing_tenant_subscription",
        "TenantSubscription record",
        "review_required",
        "No TenantSubscription row — plan inferred from Tenant.planKey only. Link subscription before billing go-live."
      )
    );
  }

  if (tenant?.subscription) {
    const tenantPlanKey = normalizePlanKey(tenant.planKey);
    const subPlanKey = normalizePlanKey(tenant.subscription.plan.key);
    if (tenantPlanKey !== subPlanKey) {
      items.push(
        advisoryItem(
          "plan_key_mismatch",
          "Plan key alignment",
          "review_required",
          `Tenant.planKey (${PLAN_DISPLAY_NAMES[tenantPlanKey]}) differs from subscription (${PLAN_DISPLAY_NAMES[subPlanKey]}).`
        )
      );
    }
  }

  const requestPlan = blueprint.request.requestedPlans[0]?.planKey;
  if (requestPlan && normalizePlanKey(requestPlan) !== planKey) {
    items.push(
      advisoryItem(
        "request_plan_drift",
        "Requested plan vs effective plan",
        "advisory",
        `Request selected ${PLAN_DISPLAY_NAMES[normalizePlanKey(requestPlan)]}; blueprint uses ${planContext.planDisplayName}. Proceed with current plan if intentional.`
      )
    );
  }

  const discDepts = discovery?.departments.length ?? 0;
  const discBranches = discovery?.branches.length ?? 0;
  const discRoles = discovery?.roles.length ?? 0;
  const discWorkflows = discovery?.workflows.length ?? 0;
  const bpModules = blueprint.modules.length;
  const bpWorkflows = blueprint.workflows.length;
  const bpRoles = blueprint.roles.length;
  const bpSarea = blueprint.sareaProfiles.length;

  const inferredDepth = inferBlueprintScopeDepth({
    moduleCount: bpModules,
    workflowCount: Math.max(bpWorkflows, discWorkflows),
    roleCount: Math.max(bpRoles, discRoles),
    sareaCount: bpSarea,
  });

  if (depthExceedsPlan(inferredDepth, profile.blueprintDepth)) {
    items.push(
      advisoryItem(
        "blueprint_depth_exceeds_plan",
        "Blueprint scope vs plan depth",
        "upgrade_recommended",
        `Blueprint scope reads as ${inferredDepth} depth; ${planContext.planDisplayName} includes ${profile.blueprintDepth} blueprint depth.`
      )
    );
  }

  if (discoveryRequestsEntra(discovery) && planKey !== "enterprise") {
    items.push(
      advisoryItem(
        "entra_on_non_enterprise",
        "Microsoft Entra ID in discovery",
        "upgrade_recommended",
        "Entra ID / Microsoft integration recorded — Enterprise capability detected. You can proceed; Crow recommends Crow Enterprise for Entra SSO and SCIM."
      )
    );
  }

  if (
    planKey === "startup" &&
    (bpSarea > profile.limits.max_sarea_profiles || (discovery?.integrations.length ?? 0) > 1)
  ) {
    items.push(
      advisoryItem(
        "cybercrow_depth_advisory",
        "CyberCrow / security depth",
        "upgrade_recommended",
        `Security and experience footprint suggests standard CyberCrow depth — ${planContext.planDisplayName} includes ${profile.cybercrowDepth}.`
      )
    );
  } else if (planKey !== "enterprise" && bpSarea > limits.max_sarea_profiles) {
    items.push(
      advisoryItem(
        "sarea_depth_advisory",
        "SAREA profile count",
        "upgrade_recommended",
        `${bpSarea} blueprint SAREA profile(s) vs plan band ${limits.max_sarea_profiles} — expand tier for executive and analyst consoles.`
      )
    );
  }

  const countChecks: { key: string; label: string; used: number; max: number }[] = [
    { key: "users_band", label: "Roles / positions (discovery)", used: discRoles, max: limits.max_users },
    { key: "departments_band", label: "Departments (discovery)", used: discDepts, max: limits.max_departments },
    { key: "branches_band", label: "Branches (discovery)", used: discBranches, max: limits.max_branches },
    {
      key: "workflows_band",
      label: "Workflows (discovery + blueprint)",
      used: Math.max(discWorkflows, bpWorkflows),
      max: limits.max_workflows,
    },
    { key: "modules_band", label: "Enabled modules (blueprint)", used: bpModules, max: limits.max_modules },
    { key: "sarea_band", label: "SAREA profiles (blueprint)", used: bpSarea, max: limits.max_sarea_profiles },
  ];

  for (const c of countChecks) {
    if (c.used > c.max) {
      items.push(
        advisoryItem(
          c.key,
          c.label,
          "upgrade_recommended",
          `${c.used} configured vs ${c.max} recommended for ${planContext.planDisplayName} — over recommended limit; upgrade expands bands.`
        )
      );
    } else if (c.used >= c.max * 0.85 && c.max < 99) {
      items.push(
        advisoryItem(
          `${c.key}_near`,
          c.label,
          "review_required",
          `${c.used} of ${c.max} recommended — near plan limit; review before go-live.`
        )
      );
    }
  }

  if (
    planKey !== "enterprise" &&
    !planHasCapability(planKey, "full_enterprise_blueprint") &&
    inferredDepth === "full"
  ) {
    items.push(
      advisoryItem(
        "enterprise_capability_detected",
        "Enterprise-scale blueprint",
        "upgrade_recommended",
        "Full organizational footprint detected — Enterprise capability detected. Proceed with current plan is supported as advisory."
      )
    );
  }

  let upgradeRecommendation: string | null = null;
  if (planKey === "startup") {
    upgradeRecommendation =
      "Crow Growth expands operational blueprint depth, incident reporting, and multi-branch workflows.";
  } else if (planKey === "growth" && items.some((i) => !i.passed)) {
    upgradeRecommendation =
      "Crow Enterprise unlocks Entra ID, SCIM, full GRC, and executive command center experiences.";
  }

  return {
    planKey,
    planDisplayName: planContext.planDisplayName,
    items,
    upgradeRecommendation,
    proceedNote:
      "You may proceed with your current plan — subscription checks are advisory and do not block provision in this phase.",
  };
}

export async function getBlueprintSubscriptionReadinessItems(
  blueprintId: string
): Promise<ReadinessGroupItem[]> {
  const result = await evaluateBlueprintSubscriptionReadiness(blueprintId);
  return result?.items ?? [];
}
