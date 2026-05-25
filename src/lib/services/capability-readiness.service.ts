/**
 * Non-blocking tenant subscription / capability readiness checks (advisory warnings only).
 */

import { prisma } from "@/lib/db";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";
import {
  getPlanProfile,
  normalizePlanKey,
  PLAN_DISPLAY_NAMES,
} from "@/lib/subscription/plan-capabilities";
import {
  getCybercrowDepthAllowed,
  getDiscoveryDepthAllowed,
  getIdentityModeAllowed,
  getSareaDepthAllowed,
  getTenantPlan,
} from "@/lib/services/subscription-capability.service";

export type CapabilityReadinessWarning = {
  code: string;
  message: string;
  severity: "info" | "watch";
};

export type CapabilityReadinessResult = {
  tenantId: string;
  ready: boolean;
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  warnings: CapabilityReadinessWarning[];
};

export async function checkTenantCapabilityReadiness(
  tenantId: string
): Promise<CapabilityReadinessResult> {
  const warnings: CapabilityReadinessWarning[] = [];

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      planKey: true,
      subscription: { include: { plan: { select: { key: true, nameEn: true } } } },
    },
  });

  if (!tenant) {
    return {
      tenantId,
      ready: false,
      planKey: "startup",
      planDisplayName: PLAN_DISPLAY_NAMES.startup,
      warnings: [{ code: "tenant_missing", message: "Tenant record not found.", severity: "watch" }],
    };
  }

  if (!tenant.subscription) {
    warnings.push({
      code: "missing_tenant_subscription",
      message:
        "No TenantSubscription row — plan capabilities are inferred from Tenant.planKey only. Re-run provisioning or link a subscription plan.",
      severity: "watch",
    });
  }

  const tenantPlanKey = normalizePlanKey(tenant.planKey);
  const subscriptionPlanKey = tenant.subscription
    ? normalizePlanKey(tenant.subscription.plan.key)
    : null;

  if (subscriptionPlanKey && subscriptionPlanKey !== tenantPlanKey) {
    warnings.push({
      code: "plan_key_mismatch",
      message: `Tenant.planKey (${PLAN_DISPLAY_NAMES[tenantPlanKey]}) differs from TenantSubscription plan (${PLAN_DISPLAY_NAMES[subscriptionPlanKey]}). Align before go-live billing.`,
      severity: "watch",
    });
  }

  const effectivePlanKey = subscriptionPlanKey ?? tenantPlanKey;

  const profile = getPlanProfile(effectivePlanKey);

  const [identityMode, cybercrowDepth, sareaDepth, discoveryDepth] = await Promise.all([
    getIdentityModeAllowed(tenantId).catch(() => null),
    getCybercrowDepthAllowed(tenantId).catch(() => null),
    getSareaDepthAllowed(tenantId).catch(() => null),
    getDiscoveryDepthAllowed(tenantId).catch(() => null),
  ]);

  if (!identityMode || identityMode !== profile.identityMode) {
    warnings.push({
      code: "identity_mode_unresolved",
      message: `Identity mode could not be confirmed (expected ${profile.identityMode} for ${PLAN_DISPLAY_NAMES[effectivePlanKey]}).`,
      severity: "info",
    });
  }
  if (!cybercrowDepth || cybercrowDepth !== profile.cybercrowDepth) {
    warnings.push({
      code: "cybercrow_depth_unresolved",
      message: `CyberCrow depth advisory not aligned (expected ${profile.cybercrowDepth}).`,
      severity: "info",
    });
  }
  if (!sareaDepth || sareaDepth !== profile.sareaDepth) {
    warnings.push({
      code: "sarea_depth_unresolved",
      message: `SAREA depth advisory not aligned (expected ${profile.sareaDepth}).`,
      severity: "info",
    });
  }
  if (!discoveryDepth || discoveryDepth !== profile.discoveryDepth) {
    warnings.push({
      code: "discovery_depth_unresolved",
      message: `Discovery depth advisory not aligned (expected ${profile.discoveryDepth}).`,
      severity: "info",
    });
  }

  if (tenant.subscription && tenant.subscription.status !== "active") {
    warnings.push({
      code: "subscription_status",
      message: `TenantSubscription status is "${tenant.subscription.status}" — capabilities remain advisory until billing is active.`,
      severity: "info",
    });
  }

  return {
    tenantId,
    ready: warnings.filter((w) => w.severity === "watch").length === 0,
    planKey: effectivePlanKey,
    planDisplayName: PLAN_DISPLAY_NAMES[effectivePlanKey],
    warnings,
  };
}

export async function checkAllTenantsCapabilityReadiness(): Promise<CapabilityReadinessResult[]> {
  const tenants = await prisma.tenant.findMany({ select: { id: true }, orderBy: { createdAt: "desc" } });
  return Promise.all(tenants.map((t) => checkTenantCapabilityReadiness(t.id)));
}
