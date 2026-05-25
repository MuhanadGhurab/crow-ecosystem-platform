/**
 * Subscription capability resolution — advisory source of truth (not Stripe enforcement).
 */

import { prisma } from "@/lib/db";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";
import {
  type CapabilityKey,
  type PlanLimits,
  type PlanDepth,
  PLAN_DISPLAY_NAMES,
  advisoryHintForCapability,
  advisoryLabelForHint,
  getPlanProfile,
  normalizePlanKey,
  planHasCapability,
} from "@/lib/subscription/plan-capabilities";

export { PLAN_DISPLAY_NAMES, CROW_START_PACKAGES } from "@/lib/subscription/plan-capabilities";

export async function resolvePlanKeyForRequest(requestId: string): Promise<SubscriptionTierKey> {
  const row = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedPlans: { take: 1 },
      discoveryProfile: {
        include: {
          enterpriseBlueprint: { include: { tenant: { select: { planKey: true } } } },
        },
      },
    },
  });

  const tenantPlan = row?.discoveryProfile?.enterpriseBlueprint?.tenant?.planKey;
  if (tenantPlan) return normalizePlanKey(tenantPlan);

  const requestPlan = row?.requestedPlans[0]?.planKey;
  if (requestPlan) return normalizePlanKey(requestPlan);

  return "startup";
}

export async function getTenantPlan(tenantId: string): Promise<{
  planKey: SubscriptionTierKey;
  displayName: string;
  subscriptionId: string | null;
}> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      planKey: true,
      subscription: { include: { plan: { select: { key: true } } } },
    },
  });
  if (!tenant) {
    return { planKey: "startup", displayName: PLAN_DISPLAY_NAMES.startup, subscriptionId: null };
  }

  const planKey = normalizePlanKey(tenant.subscription?.plan.key ?? tenant.planKey);
  return {
    planKey,
    displayName: PLAN_DISPLAY_NAMES[planKey],
    subscriptionId: tenant.subscription?.id ?? null,
  };
}

export async function canTenantUseCapability(
  tenantId: string,
  capabilityKey: CapabilityKey
): Promise<boolean> {
  const { planKey } = await getTenantPlan(tenantId);
  return planHasCapability(planKey, capabilityKey);
}

export async function getPlanLimits(tenantId: string): Promise<PlanLimits> {
  const { planKey } = await getTenantPlan(tenantId);
  return getPlanProfile(planKey).limits;
}

export async function getIdentityModeAllowed(
  tenantId: string
): Promise<"native" | "native_mfa" | "entra" | "entra_scim"> {
  const { planKey } = await getTenantPlan(tenantId);
  return getPlanProfile(planKey).identityMode;
}

export async function getCybercrowDepthAllowed(tenantId: string): Promise<PlanDepth> {
  const { planKey } = await getTenantPlan(tenantId);
  return getPlanProfile(planKey).cybercrowDepth;
}

export async function getSareaDepthAllowed(tenantId: string): Promise<PlanDepth> {
  const { planKey } = await getTenantPlan(tenantId);
  return getPlanProfile(planKey).sareaDepth;
}

export async function getDiscoveryDepthAllowed(tenantId: string): Promise<PlanDepth> {
  const { planKey } = await getTenantPlan(tenantId);
  return getPlanProfile(planKey).discoveryDepth;
}

export function getPlanLimitsForKey(planKey: SubscriptionTierKey): PlanLimits {
  return getPlanProfile(planKey).limits;
}

export function getAdvisoryLabel(
  planKey: SubscriptionTierKey,
  capabilityKey: CapabilityKey
): string {
  return advisoryLabelForHint(advisoryHintForCapability(planKey, capabilityKey), planKey);
}

export type TenantCapabilitySnapshot = {
  tenantId: string;
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  tenantPlanKey: string;
  subscriptionPlanKey: string | null;
  subscriptionStatus: string | null;
  hasTenantSubscription: boolean;
  planKeyMismatch: boolean;
  identityMode: ReturnType<typeof getPlanProfile>["identityMode"];
  cybercrowDepth: PlanDepth;
  sareaDepth: PlanDepth;
  discoveryDepth: PlanDepth;
  limits: PlanLimits;
  upgradeRecommendation: string | null;
};

function advisoryUpgradeRecommendation(
  planKey: SubscriptionTierKey,
  ctx: { moduleCount: number; membershipCount: number; workflowCount: number }
): string | null {
  const limits = getPlanProfile(planKey).limits;
  if (planKey === "enterprise") return null;
  if (planKey === "startup") {
    if (ctx.membershipCount > limits.max_users * 0.8 || ctx.moduleCount >= limits.max_modules - 1) {
      return "Upgrade to Crow Growth for multi-branch operations, incident reporting, and deeper SAREA layouts.";
    }
    if (ctx.workflowCount >= limits.max_workflows) {
      return "Crow Start workflow band is full — Crow Growth adds operational blueprint depth and more workflows.";
    }
    return null;
  }
  if (planKey === "growth") {
    if (ctx.membershipCount > 80) {
      return "Enterprise unlocks Entra ID SSO, SCIM provisioning, full GRC, and executive command center experiences.";
    }
    return null;
  }
  return null;
}

export async function getTenantCapabilitySnapshot(
  tenantId: string
): Promise<TenantCapabilitySnapshot | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      planKey: true,
      subscription: { include: { plan: { select: { key: true } } } },
      _count: {
        select: {
          modules: { where: { enabled: true } },
          memberships: true,
          workflows: true,
        },
      },
    },
  });
  if (!tenant) return null;

  const tenantPlanKey = normalizePlanKey(tenant.planKey);
  const subscriptionPlanKey = tenant.subscription
    ? normalizePlanKey(tenant.subscription.plan.key)
    : null;
  const planKey = subscriptionPlanKey ?? tenantPlanKey;
  const profile = getPlanProfile(planKey);

  return {
    tenantId,
    planKey,
    planDisplayName: PLAN_DISPLAY_NAMES[planKey],
    tenantPlanKey: tenant.planKey,
    subscriptionPlanKey,
    subscriptionStatus: tenant.subscription?.status ?? null,
    hasTenantSubscription: Boolean(tenant.subscription),
    planKeyMismatch: Boolean(subscriptionPlanKey && subscriptionPlanKey !== tenantPlanKey),
    identityMode: profile.identityMode,
    cybercrowDepth: profile.cybercrowDepth,
    sareaDepth: profile.sareaDepth,
    discoveryDepth: profile.discoveryDepth,
    limits: profile.limits,
    upgradeRecommendation: advisoryUpgradeRecommendation(planKey, {
      moduleCount: tenant._count.modules,
      membershipCount: tenant._count.memberships,
      workflowCount: tenant._count.workflows,
    }),
  };
}

export type TenantUsageIntelRow = {
  id: string;
  slug: string;
  displayName: string;
  planKey: SubscriptionTierKey;
  overallStatus: string;
  highlight?: string;
};

export type SubscriptionPlatformSummary = {
  planDistribution: Record<SubscriptionTierKey, number>;
  tenantsMissingSubscription: { id: string; slug: string; displayName: string }[];
  tenantsWithPlanKeyMismatch: { id: string; slug: string; displayName: string; tenantPlan: string; subscriptionPlan: string }[];
  tenantsNearLimit: TenantUsageIntelRow[];
  tenantsOverRecommendedLimit: TenantUsageIntelRow[];
  tenantsEnterpriseLikeOnLowerPlans: TenantUsageIntelRow[];
  planHealthSummary: {
    healthy: number;
    nearLimit: number;
    overLimit: number;
    upgradeRecommended: number;
  };
  readinessReadyCount: number;
  readinessWatchCount: number;
  subscriptionHealth: {
    active: number;
    nonActive: number;
    withoutStripe: number;
  };
};

export async function getSubscriptionPlatformSummary(): Promise<SubscriptionPlatformSummary> {
  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      slug: true,
      planKey: true,
      organization: { select: { displayName: true } },
      subscription: { select: { status: true, stripeSubscriptionId: true, plan: { select: { key: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const planDistribution: Record<SubscriptionTierKey, number> = {
    startup: 0,
    growth: 0,
    enterprise: 0,
  };

  const tenantsMissingSubscription: SubscriptionPlatformSummary["tenantsMissingSubscription"] = [];
  const tenantsWithPlanKeyMismatch: SubscriptionPlatformSummary["tenantsWithPlanKeyMismatch"] = [];
  let active = 0;
  let nonActive = 0;
  let withoutStripe = 0;

  for (const t of tenants) {
    const effective = normalizePlanKey(t.subscription?.plan.key ?? t.planKey);
    planDistribution[effective] += 1;

    if (!t.subscription) {
      tenantsMissingSubscription.push({
        id: t.id,
        slug: t.slug,
        displayName: t.organization.displayName,
      });
    } else {
      if (t.subscription.status === "active") active++;
      else nonActive++;
      if (!t.subscription.stripeSubscriptionId) withoutStripe++;
      const subKey = normalizePlanKey(t.subscription.plan.key);
      const tenantKey = normalizePlanKey(t.planKey);
      if (subKey !== tenantKey) {
        tenantsWithPlanKeyMismatch.push({
          id: t.id,
          slug: t.slug,
          displayName: t.organization.displayName,
          tenantPlan: tenantKey,
          subscriptionPlan: subKey,
        });
      }
    }
  }

  const { checkAllTenantsCapabilityReadiness } = await import(
    "@/lib/services/capability-readiness.service"
  );
  const { getTenantUsageSignals, USAGE_STATUS_LABELS } = await import(
    "@/lib/services/usage-signals.service"
  );
  const readiness = await checkAllTenantsCapabilityReadiness();
  const readinessReadyCount = readiness.filter((r) => r.ready).length;
  const readinessWatchCount = readiness.filter((r) => !r.ready).length;

  const tenantsNearLimit: SubscriptionPlatformSummary["tenantsNearLimit"] = [];
  const tenantsOverRecommendedLimit: SubscriptionPlatformSummary["tenantsOverRecommendedLimit"] =
    [];
  const tenantsEnterpriseLikeOnLowerPlans: SubscriptionPlatformSummary["tenantsEnterpriseLikeOnLowerPlans"] =
    [];
  const planHealthSummary = {
    healthy: 0,
    nearLimit: 0,
    overLimit: 0,
    upgradeRecommended: 0,
  };

  const usageResults = await Promise.all(
    tenants.map(async (t) => {
      const effective = normalizePlanKey(t.subscription?.plan.key ?? t.planKey);
      const signals = await getTenantUsageSignals(t.id).catch(() => null);
      return { tenant: t, effective, signals };
    })
  );

  for (const { tenant: t, effective, signals } of usageResults) {
    if (!signals) continue;
    const row: TenantUsageIntelRow = {
      id: t.id,
      slug: t.slug,
      displayName: t.organization.displayName,
      planKey: effective,
      overallStatus: USAGE_STATUS_LABELS[signals.overallStatus],
    };

    switch (signals.overallStatus) {
      case "healthy":
        planHealthSummary.healthy += 1;
        break;
      case "near_limit":
        planHealthSummary.nearLimit += 1;
        tenantsNearLimit.push(row);
        break;
      case "over_recommended_limit":
        planHealthSummary.overLimit += 1;
        tenantsOverRecommendedLimit.push(row);
        break;
      case "upgrade_recommended":
        planHealthSummary.upgradeRecommended += 1;
        tenantsOverRecommendedLimit.push({
          ...row,
          highlight: signals.upgradeNote ?? undefined,
        });
        break;
    }

    if (effective !== "enterprise") {
      const entraProvider = await prisma.identityProvider.findFirst({
        where: {
          tenantId: t.id,
          OR: [
            { providerType: { contains: "entra", mode: "insensitive" } },
            { entraConfigs: { some: {} } },
          ],
        },
        select: { id: true },
      });
      if (entraProvider) {
        tenantsEnterpriseLikeOnLowerPlans.push({
          ...row,
          highlight: "Entra ID config present on non-Enterprise plan",
        });
      }
    }
  }

  return {
    planDistribution,
    tenantsMissingSubscription,
    tenantsWithPlanKeyMismatch,
    tenantsNearLimit,
    tenantsOverRecommendedLimit,
    tenantsEnterpriseLikeOnLowerPlans,
    planHealthSummary,
    readinessReadyCount,
    readinessWatchCount,
    subscriptionHealth: { active, nonActive, withoutStripe },
  };
}

export async function resolveBlueprintPlanContext(blueprintId: string): Promise<{
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  identityMode: ReturnType<typeof getPlanProfile>["identityMode"];
  cybercrowDepth: PlanDepth;
  sareaDepth: PlanDepth;
  discoveryDepth: PlanDepth;
  blueprintDepth: PlanDepth;
  limits: PlanLimits;
} | null> {
  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    select: {
      requestId: true,
      tenant: { select: { id: true, planKey: true } },
      request: { include: { requestedPlans: { take: 1 } } },
    },
  });
  if (!blueprint) return null;

  let planKey: SubscriptionTierKey = "startup";
  if (blueprint.tenant?.id) {
    const t = await getTenantPlan(blueprint.tenant.id);
    planKey = t.planKey;
  } else {
    planKey = await resolvePlanKeyForRequest(blueprint.requestId);
  }

  const profile = getPlanProfile(planKey);
  return {
    planKey,
    planDisplayName: PLAN_DISPLAY_NAMES[planKey],
    identityMode: profile.identityMode,
    cybercrowDepth: profile.cybercrowDepth,
    sareaDepth: profile.sareaDepth,
    discoveryDepth: profile.discoveryDepth,
    blueprintDepth: profile.blueprintDepth,
    limits: profile.limits,
  };
}
