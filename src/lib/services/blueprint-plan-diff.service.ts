/**
 * Blueprint plan comparison — current vs Growth vs Enterprise for same sector org model.
 * Advisory only — does not block go-live.
 */

import {
  applyPlanDepthToOrgModelWithStats,
  type OrgModelTrimStats,
} from "@/lib/org-intelligence/apply-plan-depth";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import {
  loadSectorTemplateModel,
} from "@/lib/services/org-intelligence.service";
import { scaleHeadcountByEmployeeBand } from "@/lib/org-intelligence/resolve-sector";
import type { OrgIntelligenceModel } from "@/lib/org-intelligence/types";
import {
  normalizePlanKey,
  PLAN_DISPLAY_NAMES,
  PLAN_CAPABILITY_PROFILES,
  type PlanDepth,
} from "@/lib/subscription/plan-capabilities";
import {
  resolveBlueprintPlanContext,
  resolvePlanKeyForRequest,
} from "@/lib/services/subscription-capability.service";
import { prisma } from "@/lib/db";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

function scaleModelForEmployeeBand(
  model: OrgIntelligenceModel,
  employeeBand?: string | null
): OrgIntelligenceModel {
  return {
    ...model,
    departments: model.departments.map((d) => ({
      ...d,
      recommendedHeadcount: d.recommendedHeadcount
        ? scaleHeadcountByEmployeeBand(
            d.recommendedHeadcount.min,
            d.recommendedHeadcount.max,
            employeeBand
          )
        : undefined,
    })),
  };
}

export type PlanDiffAdvisoryLabel =
  | "included"
  | "growth"
  | "enterprise";

export type BlueprintPlanDiffDimension = {
  key: string;
  label: string;
  current: string | number;
  growth: string | number;
  enterprise: string | number;
  advisoryForCurrent: PlanDiffAdvisoryLabel;
};

export type BlueprintPlanDiff = {
  blueprintId: string;
  sectorTemplateKey: SectorTemplateKey;
  currentPlanKey: SubscriptionTierKey;
  currentPlanDisplayName: string;
  dimensions: BlueprintPlanDiffDimension[];
  roleSamples: {
    tier: SubscriptionTierKey;
    tierLabel: string;
    positionCount: number;
    sampleTitles: string[];
  }[];
  trimStatsByTier: Record<SubscriptionTierKey, OrgModelTrimStats>;
};

function advisoryForNumeric(
  currentPlan: SubscriptionTierKey,
  currentVal: number,
  growthVal: number,
  enterpriseVal: number
): PlanDiffAdvisoryLabel {
  if (currentPlan === "enterprise") return "included";
  if (currentPlan === "startup") {
    if (currentVal < growthVal) return "growth";
    if (currentVal < enterpriseVal) return "enterprise";
    return "included";
  }
  if (currentVal < enterpriseVal) return "enterprise";
  return "included";
}

function advisoryForDepth(
  currentPlan: SubscriptionTierKey,
  currentDepth: PlanDepth,
  growthDepth: PlanDepth,
  enterpriseDepth: PlanDepth
): PlanDiffAdvisoryLabel {
  if (currentPlan === "enterprise") return "included";
  if (currentDepth === enterpriseDepth) return "included";
  if (currentPlan === "startup" && currentDepth !== growthDepth) return "growth";
  if (currentDepth !== enterpriseDepth) return "enterprise";
  return "included";
}

function depthLabel(d: PlanDepth): string {
  return d;
}

export async function computeBlueprintPlanDiff(
  blueprintId: string
): Promise<BlueprintPlanDiff | null> {
  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    select: {
      requestId: true,
      request: {
        select: {
          employeeBand: true,
          industry: true,
          requestedModules: { select: { moduleKey: true } },
          discoveryProfile: {
            select: {
              orgIntelligence: { select: { sectorTemplateKey: true } },
              answers: {
                where: { sectionKey: "org_intelligence", questionKey: "sectorTemplateKey" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!blueprint) return null;

  const planContext = await resolveBlueprintPlanContext(blueprintId);
  const currentPlanKey = planContext?.planKey ?? (await resolvePlanKeyForRequest(blueprint.requestId));

  const orgIntel = blueprint.request.discoveryProfile?.orgIntelligence;
  const sectorKey = (orgIntel?.sectorTemplateKey ??
    (blueprint.request.discoveryProfile?.answers[0]?.valueJson as string | undefined) ??
    "logistics") as SectorTemplateKey;

  const base = await loadSectorTemplateModel(sectorKey);
  const scaled = scaleModelForEmployeeBand(base, blueprint.request.employeeBand);

  const tiers: SubscriptionTierKey[] = ["startup", "growth", "enterprise"];
  const trimStatsByTier = {} as Record<SubscriptionTierKey, OrgModelTrimStats>;
  const models = {} as Record<SubscriptionTierKey, ReturnType<typeof applyPlanDepthToOrgModelWithStats>["model"]>;

  for (const tier of tiers) {
    const { model, trimStats } = applyPlanDepthToOrgModelWithStats(scaled, tier);
    trimStatsByTier[tier] = trimStats;
    models[tier] = model;
  }

  const currentProfile = PLAN_CAPABILITY_PROFILES[currentPlanKey];
  const growthProfile = PLAN_CAPABILITY_PROFILES.growth;
  const enterpriseProfile = PLAN_CAPABILITY_PROFILES.enterprise;

  const dimensions: BlueprintPlanDiffDimension[] = [
    {
      key: "positions",
      label: "Roles / positions",
      current: models[currentPlanKey].positions.length,
      growth: models.growth.positions.length,
      enterprise: models.enterprise.positions.length,
      advisoryForCurrent: advisoryForNumeric(
        currentPlanKey,
        models[currentPlanKey].positions.length,
        models.growth.positions.length,
        models.enterprise.positions.length
      ),
    },
    {
      key: "workflows",
      label: "Workflows",
      current: models[currentPlanKey].workflows.length,
      growth: models.growth.workflows.length,
      enterprise: models.enterprise.workflows.length,
      advisoryForCurrent: advisoryForNumeric(
        currentPlanKey,
        models[currentPlanKey].workflows.length,
        models.growth.workflows.length,
        models.enterprise.workflows.length
      ),
    },
    {
      key: "sareaProfiles",
      label: "SAREA profiles",
      current: models[currentPlanKey].sareaProfiles.length,
      growth: models.growth.sareaProfiles.length,
      enterprise: models.enterprise.sareaProfiles.length,
      advisoryForCurrent: advisoryForNumeric(
        currentPlanKey,
        models[currentPlanKey].sareaProfiles.length,
        models.growth.sareaProfiles.length,
        models.enterprise.sareaProfiles.length
      ),
    },
    {
      key: "cybercrowBaselines",
      label: "CyberCrow baselines",
      current: models[currentPlanKey].cybercrowBaselines.length,
      growth: models.growth.cybercrowBaselines.length,
      enterprise: models.enterprise.cybercrowBaselines.length,
      advisoryForCurrent: advisoryForNumeric(
        currentPlanKey,
        models[currentPlanKey].cybercrowBaselines.length,
        models.growth.cybercrowBaselines.length,
        models.enterprise.cybercrowBaselines.length
      ),
    },
    {
      key: "identityMode",
      label: "Identity mode",
      current: currentProfile.identityMode.replace(/_/g, " "),
      growth: growthProfile.identityMode.replace(/_/g, " "),
      enterprise: enterpriseProfile.identityMode.replace(/_/g, " "),
      advisoryForCurrent:
        currentPlanKey === "enterprise"
          ? "included"
          : currentPlanKey === "startup"
            ? "growth"
            : "enterprise",
    },
    {
      key: "cybercrowDepth",
      label: "CyberCrow depth",
      current: depthLabel(currentProfile.cybercrowDepth),
      growth: depthLabel(growthProfile.cybercrowDepth),
      enterprise: depthLabel(enterpriseProfile.cybercrowDepth),
      advisoryForCurrent: advisoryForDepth(
        currentPlanKey,
        currentProfile.cybercrowDepth,
        growthProfile.cybercrowDepth,
        enterpriseProfile.cybercrowDepth
      ),
    },
    {
      key: "sareaDepth",
      label: "SAREA depth",
      current: depthLabel(currentProfile.sareaDepth),
      growth: depthLabel(growthProfile.sareaDepth),
      enterprise: depthLabel(enterpriseProfile.sareaDepth),
      advisoryForCurrent: advisoryForDepth(
        currentPlanKey,
        currentProfile.sareaDepth,
        growthProfile.sareaDepth,
        enterpriseProfile.sareaDepth
      ),
    },
  ];

  const roleSamples = tiers.map((tier) => ({
    tier,
    tierLabel: PLAN_DISPLAY_NAMES[tier],
    positionCount: models[tier].positions.length,
    sampleTitles: models[tier].positions.slice(0, 6).map((p) => p.title),
  }));

  return {
    blueprintId,
    sectorTemplateKey: sectorKey,
    currentPlanKey: normalizePlanKey(currentPlanKey),
    currentPlanDisplayName: PLAN_DISPLAY_NAMES[normalizePlanKey(currentPlanKey)],
    dimensions,
    roleSamples,
    trimStatsByTier,
  };
}
