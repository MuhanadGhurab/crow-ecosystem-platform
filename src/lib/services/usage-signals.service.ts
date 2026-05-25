/**

 * Tenant usage vs plan limits — advisory signals only (no runtime enforcement).

 */



import { prisma } from "@/lib/db";

import {

  getPlanLimits,

  getTenantPlan,

} from "@/lib/services/subscription-capability.service";

import type { PlanLimits } from "@/lib/subscription/plan-capabilities";



export type UsageSignalStatus =

  | "healthy"

  | "near_limit"

  | "over_recommended_limit"

  | "upgrade_recommended";



export type UsageMetricSignal = {

  key: keyof PlanLimits | "branches";

  label: string;

  used: number;

  max: number;

  percent: number;

  status: UsageSignalStatus;

};



export type TenantUsageSignals = {

  tenantId: string;

  planDisplayName: string;

  overallStatus: UsageSignalStatus;

  metrics: UsageMetricSignal[];

  upgradeNote: string | null;

};



function metricStatus(used: number, max: number): UsageSignalStatus {

  if (max >= 99) return "healthy";

  if (used > max) return "over_recommended_limit";

  if (used >= Math.ceil(max * 0.8)) return "near_limit";

  return "healthy";

}



function worstStatus(statuses: UsageSignalStatus[]): UsageSignalStatus {

  const order: UsageSignalStatus[] = [

    "healthy",

    "near_limit",

    "over_recommended_limit",

    "upgrade_recommended",

  ];

  let worst: UsageSignalStatus = "healthy";

  for (const s of statuses) {

    if (order.indexOf(s) > order.indexOf(worst)) worst = s;

  }

  return worst;

}



export async function getTenantUsageSignals(tenantId: string): Promise<TenantUsageSignals | null> {

  const [plan, limits, counts] = await Promise.all([

    getTenantPlan(tenantId),

    getPlanLimits(tenantId),

    prisma.tenant.findUnique({

      where: { id: tenantId },

      select: {

        _count: {

          select: {

            memberships: true,

            departments: true,

            branches: true,

            workflows: true,

            modules: { where: { enabled: true } },

            sareaProfiles: true,

          },

        },

        profiles: { select: { id: true } },

      },

    }),

  ]);



  if (!counts) return null;



  const usersUsed = Math.max(counts._count.memberships, counts.profiles.length);



  const raw: { key: UsageMetricSignal["key"]; label: string; used: number; max: number }[] = [

    { key: "max_users", label: "Users", used: usersUsed, max: limits.max_users },

    { key: "max_departments", label: "Departments", used: counts._count.departments, max: limits.max_departments },

    { key: "branches", label: "Branches", used: counts._count.branches, max: limits.max_branches },

    { key: "max_workflows", label: "Workflows", used: counts._count.workflows, max: limits.max_workflows },

    { key: "max_modules", label: "Modules", used: counts._count.modules, max: limits.max_modules },

    {

      key: "max_sarea_profiles",

      label: "SAREA profiles",

      used: counts._count.sareaProfiles,

      max: limits.max_sarea_profiles,

    },

  ];



  const metrics: UsageMetricSignal[] = raw.map((r) => {

    const status = metricStatus(r.used, r.max);

    return {

      key: r.key,

      label: r.label,

      used: r.used,

      max: r.max,

      percent: r.max >= 99 ? 0 : Math.round((r.used / r.max) * 100),

      status,

    };

  });



  let overallStatus = worstStatus(metrics.map((m) => m.status));

  let upgradeNote: string | null = null;



  if (overallStatus === "over_recommended_limit" && plan.planKey !== "enterprise") {

    overallStatus = "upgrade_recommended";

    upgradeNote =

      plan.planKey === "startup"

        ? "Usage exceeds Crow Start recommended bands — Crow Growth adds operational depth and higher limits."

        : "Usage exceeds Crow Growth recommended bands — Crow Enterprise unlocks full governance and identity depth.";

  } else if (overallStatus === "near_limit" && plan.planKey === "startup") {

    upgradeNote = "Approaching Crow Start limits — consider Crow Growth before the next expansion wave.";

  }



  return {

    tenantId,

    planDisplayName: plan.displayName,

    overallStatus,

    metrics,

    upgradeNote,

  };

}



export const USAGE_STATUS_LABELS: Record<UsageSignalStatus, string> = {

  healthy: "Healthy",

  near_limit: "Near limit",

  over_recommended_limit: "Over recommended limit",

  upgrade_recommended: "Upgrade recommended",

};


