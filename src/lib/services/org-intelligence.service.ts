import { Prisma } from "@prisma/client";
import { prisma, prismaTransaction } from "@/lib/db";
import {
  applyOrgCustomizations,
  type OrgIntelligenceCustomizations,
  type OrgIntelligenceModel,
} from "@/lib/org-intelligence/types";
import {
  getSectorTemplateModel,
  SECTOR_TEMPLATE_KEYS,
} from "@/lib/org-intelligence/sector-template-data";
import {
  resolveSectorTemplateKey,
  scaleHeadcountByEmployeeBand,
} from "@/lib/org-intelligence/resolve-sector";
import {
  applyPlanDepthToOrgModel,
  applyPlanDepthToOrgModelWithStats,
  type OrgModelTrimStats,
} from "@/lib/org-intelligence/apply-plan-depth";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { resolvePlanKeyForRequest } from "@/lib/services/subscription-capability.service";
import { PLAN_DISPLAY_NAMES } from "@/lib/subscription/plan-capabilities";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

function parseModel(json: Prisma.JsonValue): OrgIntelligenceModel {
  return json as unknown as OrgIntelligenceModel;
}

function scaleModelForContext(
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

export async function listSectorTemplates() {
  const rows = await prisma.sectorTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  if (rows.length > 0) return rows;

  return SECTOR_TEMPLATE_KEYS.map((key) => {
    const model = getSectorTemplateModel(key);
    return {
      id: key,
      key,
      name: model.sectorName,
      description: `Recommended org model for ${model.industry}`,
      industry: model.industry,
      maturityLevel: model.maturityLevel,
      isActive: true,
      configJson: model as unknown as Prisma.JsonValue,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  });
}

export async function loadSectorTemplateModel(
  key: SectorTemplateKey
): Promise<OrgIntelligenceModel> {
  const row = await prisma.sectorTemplate.findUnique({ where: { key } });
  if (row?.configJson) return parseModel(row.configJson);
  return getSectorTemplateModel(key);
}

export async function generateOrgIntelligenceRecommendations(
  requestId: string,
  options?: { sectorTemplateKey?: SectorTemplateKey; force?: boolean }
) {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedModules: true,
      discoveryProfile: { include: { orgIntelligence: true, answers: true } },
    },
  });

  if (!request?.discoveryProfile) {
    throw new Error("Discovery profile not found");
  }

  const profile = request.discoveryProfile;
  if (profile.orgIntelligence && !options?.force) {
    return profile.orgIntelligence;
  }

  const sectorKey =
    options?.sectorTemplateKey ??
    resolveSectorTemplateKey({
      industry: request.industry,
      moduleKeys: request.requestedModules.map((m) => m.moduleKey),
      explicitKey: profile.answers.find(
        (a) => a.sectionKey === "org_intelligence" && a.questionKey === "sectorTemplateKey"
      )?.valueJson as string | undefined,
    });

  const base = await loadSectorTemplateModel(sectorKey);
  const scaled = scaleModelForContext(base, request.employeeBand);
  const planKey = await resolvePlanKeyForRequest(requestId);
  const { model: recommendations } = applyPlanDepthToOrgModelWithStats(scaled, planKey);

  return prisma.discoveryOrgIntelligence.upsert({
    where: { profileId: profile.id },
    create: {
      profileId: profile.id,
      sectorTemplateKey: sectorKey,
      status: "RECOMMENDED",
      recommendationsJson: recommendations as unknown as Prisma.InputJsonValue,
    },
    update: {
      sectorTemplateKey: sectorKey,
      status: "RECOMMENDED",
      recommendationsJson: recommendations as unknown as Prisma.InputJsonValue,
      customizationsJson: Prisma.DbNull,
      acceptedAt: null,
    },
  });
}

export function getEffectiveOrgModel(
  row: {
    recommendationsJson: Prisma.JsonValue;
    customizationsJson: Prisma.JsonValue | null;
  }
): OrgIntelligenceModel {
  const base = parseModel(row.recommendationsJson);
  const customizations = row.customizationsJson
    ? (row.customizationsJson as unknown as OrgIntelligenceCustomizations)
    : null;
  return applyOrgCustomizations(base, customizations);
}

export async function getOrgIntelligenceTrimStatsForRequest(
  requestId: string
): Promise<OrgModelTrimStats | null> {
  const profile = await prisma.discoveryProfile.findUnique({
    where: { requestId },
    include: { orgIntelligence: true, request: { include: { requestedModules: true } } },
  });
  if (!profile?.orgIntelligence) return null;

  const request = profile.request;
  const sectorKey = profile.orgIntelligence.sectorTemplateKey as SectorTemplateKey;
  const base = await loadSectorTemplateModel(sectorKey);
  const scaled = scaleModelForContext(base, request?.employeeBand);
  const planKey = await resolvePlanKeyForRequest(requestId);
  const { trimStats } = applyPlanDepthToOrgModelWithStats(scaled, planKey);
  return trimStats;
}

export async function getOrgIntelligenceForRequest(requestId: string) {
  const profile = await prisma.discoveryProfile.findUnique({
    where: { requestId },
    include: { orgIntelligence: true },
  });
  if (!profile?.orgIntelligence) return null;
  const planKey = await resolvePlanKeyForRequest(requestId);
  const trimStats = await getOrgIntelligenceTrimStatsForRequest(requestId).catch(() => null);
  return {
    record: profile.orgIntelligence,
    model: getEffectiveOrgModel(profile.orgIntelligence),
    planKey,
    planDisplayName: PLAN_DISPLAY_NAMES[planKey],
    trimStats,
  };
}

export async function getOrgIntelligencePlanContext(requestId: string): Promise<{
  planKey: SubscriptionTierKey;
  planDisplayName: string;
}> {
  const planKey = await resolvePlanKeyForRequest(requestId);
  return { planKey, planDisplayName: PLAN_DISPLAY_NAMES[planKey] };
}

/** Accept Crow Intelligence recommendations into discovery tables (editable source of truth pre-blueprint). */
export async function acceptOrgIntelligenceIntoDiscovery(
  requestId: string,
  customizations?: OrgIntelligenceCustomizations
) {
  await generateOrgIntelligenceRecommendations(requestId);

  return prismaTransaction(async (tx) => {
    const request = await tx.implementationRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: {
        discoveryProfile: { include: { orgIntelligence: true, enterpriseBlueprint: true } },
      },
    });

    const profile = request.discoveryProfile;
    if (!profile) throw new Error("Discovery profile not found");

    let orgRow = profile.orgIntelligence;
    if (!orgRow) {
      orgRow = await tx.discoveryOrgIntelligence.findUniqueOrThrow({
        where: { profileId: profile.id },
      });
    }

    if (customizations) {
      orgRow = await tx.discoveryOrgIntelligence.update({
        where: { id: orgRow.id },
        data: {
          customizationsJson: customizations as unknown as Prisma.InputJsonValue,
          status: "CUSTOMIZED",
        },
      });
    }

    const model = getEffectiveOrgModel(orgRow);

    await tx.discoveryDepartment.deleteMany({ where: { profileId: profile.id } });
    await tx.discoveryRole.deleteMany({ where: { profileId: profile.id } });
    await tx.discoveryWorkflow.deleteMany({ where: { profileId: profile.id } });
    await tx.discoverySecurityRequirement.deleteMany({ where: { profileId: profile.id } });
    await tx.discoveryExperienceRequirement.deleteMany({ where: { profileId: profile.id } });

    if (model.departments.length > 0) {
      await tx.discoveryDepartment.createMany({
        data: model.departments.map((d) => ({
          profileId: profile.id,
          name: d.name,
          headcount: d.recommendedHeadcount?.max,
        })),
      });
    }

    if (model.positions.length > 0) {
      await tx.discoveryRole.createMany({
        data: model.positions.map((p) => ({
          profileId: profile.id,
          name: p.title,
          level: p.level,
        })),
      });
    }

    if (model.workflows.length > 0) {
      await tx.discoveryWorkflow.createMany({
        data: model.workflows.map((w) => ({
          profileId: profile.id,
          name: w.name,
          description: w.description ?? null,
        })),
      });
    }

    for (const baseline of model.cybercrowBaselines) {
      await tx.discoverySecurityRequirement.create({
        data: {
          profileId: profile.id,
          requirement: `${baseline.name}: ${baseline.controls.join(", ")} (${baseline.riskFocus})`,
          priority: baseline.monitoringLevel,
        },
      });
    }

    for (const sarea of model.sareaProfiles) {
      await tx.discoveryExperienceRequirement.create({
        data: {
          profileId: profile.id,
          personaKey: sarea.personaKey,
          requirement: `${sarea.name} — ${sarea.experienceProfile}`,
        },
      });
    }

    await tx.discoveryAnswer.upsert({
      where: {
        profileId_sectionKey_questionKey: {
          profileId: profile.id,
          sectionKey: "org_intelligence",
          questionKey: "sectorTemplateKey",
        },
      },
      create: {
        profileId: profile.id,
        sectionKey: "org_intelligence",
        questionKey: "sectorTemplateKey",
        valueJson: model.sectorTemplateKey,
      },
      update: { valueJson: model.sectorTemplateKey },
    });

    const accepted = await tx.discoveryOrgIntelligence.update({
      where: { id: orgRow.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    const blueprint = profile.enterpriseBlueprint;
    if (blueprint) {
      await syncBlueprintOrgModelFromDiscoveryTx(tx, blueprint.id, profile.id);
    }

    return { orgIntelligence: accepted, model };
  });
}

export async function syncBlueprintOrgModelFromDiscovery(
  blueprintId: string,
  discoveryProfileId: string
) {
  return prismaTransaction((tx) =>
    syncBlueprintOrgModelFromDiscoveryTx(tx, blueprintId, discoveryProfileId)
  );
}

async function syncBlueprintOrgModelFromDiscoveryTx(
  tx: Prisma.TransactionClient,
  blueprintId: string,
  discoveryProfileId: string
) {
  const discovery = await tx.discoveryProfile.findUnique({
    where: { id: discoveryProfileId },
    include: {
      roles: true,
      workflows: true,
      securityRequirements: true,
      experienceRequirements: true,
      orgIntelligence: true,
    },
  });

  if (!discovery) return;

  await tx.blueprintRole.deleteMany({ where: { blueprintId } });
  await tx.blueprintWorkflow.deleteMany({ where: { blueprintId } });
  await tx.blueprintSecurityBaseline.deleteMany({ where: { blueprintId } });
  await tx.blueprintSareaProfile.deleteMany({ where: { blueprintId } });

  for (const role of discovery.roles) {
    const slug = role.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48) || "role";
    await tx.blueprintRole.create({
      data: { blueprintId, name: role.name, slug },
    });
  }

  for (const wf of discovery.workflows) {
    await tx.blueprintWorkflow.create({
      data: {
        blueprintId,
        name: wf.name,
        configJson: wf.description ? { description: wf.description } : undefined,
      },
    });
  }

  for (const sec of discovery.securityRequirements) {
    await tx.blueprintSecurityBaseline.create({
      data: {
        blueprintId,
        controlKey: sec.requirement.slice(0, 80),
        configJson: { priority: sec.priority, source: "org_intelligence" },
      },
    });
  }

  if (discovery.orgIntelligence?.status === "ACCEPTED") {
    const model = getEffectiveOrgModel(discovery.orgIntelligence);
    for (const sarea of model.sareaProfiles) {
      await tx.blueprintSareaProfile.create({
        data: {
          blueprintId,
          personaKey: sarea.personaKey,
          configJson: {
            name: sarea.name,
            dashboardType: sarea.dashboardType,
            complexityLevel: sarea.complexityLevel,
            source: "org_intelligence",
          },
        },
      });
    }
  } else {
    for (const exp of discovery.experienceRequirements) {
      await tx.blueprintSareaProfile.create({
        data: {
          blueprintId,
          personaKey: exp.personaKey,
          configJson: { requirement: exp.requirement, source: "discovery" },
        },
      });
    }
  }
}

export async function getOrgIntelligencePlatformSummary() {
  const [templateCount, acceptedCount, recommendedCount, profileCoverage] = await Promise.all([
    prisma.sectorTemplate.count({ where: { isActive: true } }).catch(() => SECTOR_TEMPLATE_KEYS.length),
    prisma.discoveryOrgIntelligence.count({ where: { status: "ACCEPTED" } }).catch(() => 0),
    prisma.discoveryOrgIntelligence.count({ where: { status: "RECOMMENDED" } }).catch(() => 0),
    prisma.discoveryOrgIntelligence.count().catch(() => 0),
  ]);

  return {
    templateCount: templateCount || SECTOR_TEMPLATE_KEYS.length,
    acceptedCount,
    recommendedCount,
    profileCoverage,
    live: true,
  };
}
