import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const sareaProfileListArgs = {
  include: {
    tenant: {
      select: {
        id: true,
        slug: true,
        organization: { select: { displayName: true } },
      },
    },
    _count: {
      select: {
        roleExperienceMaps: true,
        dashboardLayouts: true,
        widgetRules: true,
        navigationProfiles: true,
        deviceRules: true,
        adaptiveRules: true,
      },
    },
  },
} satisfies Prisma.SareaExperienceProfileFindManyArgs;

const layoutListArgs = {
  include: {
    profile: {
      select: {
        id: true,
        name: true,
        personaKey: true,
        tenant: { select: { slug: true, organization: { select: { displayName: true } } } },
      },
    },
  },
  orderBy: { name: "asc" },
} satisfies Prisma.DashboardLayoutFindManyArgs;

const roleMapListArgs = {
  include: {
    profile: {
      select: {
        id: true,
        name: true,
        personaKey: true,
        tenant: { select: { slug: true } },
      },
    },
  },
  orderBy: { roleSlug: "asc" },
} satisfies Prisma.RoleExperienceMapFindManyArgs;

const widgetListArgs = {
  include: {
    profile: {
      select: { id: true, name: true, personaKey: true, tenant: { select: { slug: true } } },
    },
  },
  orderBy: [{ profileId: "asc" }, { widgetKey: "asc" }],
} satisfies Prisma.WidgetRuleFindManyArgs;

const navListArgs = {
  include: {
    profile: {
      select: { id: true, name: true, personaKey: true, tenant: { select: { slug: true } } },
    },
  },
} satisfies Prisma.NavigationProfileFindManyArgs;

const deviceListArgs = {
  include: {
    profile: {
      select: { id: true, name: true, personaKey: true, tenant: { select: { slug: true } } },
    },
  },
  orderBy: { deviceType: "asc" },
} satisfies Prisma.DeviceExperienceRuleFindManyArgs;

const adaptiveListArgs = {
  include: {
    profile: {
      select: { id: true, name: true, personaKey: true, tenant: { select: { slug: true } } },
    },
  },
  orderBy: { ruleKey: "asc" },
} satisfies Prisma.AdaptiveUiRuleFindManyArgs;

export type SareaExperienceProfileListItem = Prisma.SareaExperienceProfileGetPayload<
  typeof sareaProfileListArgs
>;
export type DashboardLayoutListItem = Prisma.DashboardLayoutGetPayload<typeof layoutListArgs>;
export type RoleExperienceMapListItem = Prisma.RoleExperienceMapGetPayload<typeof roleMapListArgs>;
export type WidgetRuleListItem = Prisma.WidgetRuleGetPayload<typeof widgetListArgs>;
export type NavigationProfileListItem = Prisma.NavigationProfileGetPayload<typeof navListArgs>;
export type DeviceExperienceRuleListItem = Prisma.DeviceExperienceRuleGetPayload<
  typeof deviceListArgs
>;
export type AdaptiveUiRuleListItem = Prisma.AdaptiveUiRuleGetPayload<typeof adaptiveListArgs>;

export async function listSareaExperienceProfiles(): Promise<SareaExperienceProfileListItem[]> {
  return prisma.sareaExperienceProfile.findMany({
    orderBy: [{ tenantId: "asc" }, { personaKey: "asc" }],
    ...sareaProfileListArgs,
  });
}

export async function listSareaProfilesForTenant(
  tenantId: string
): Promise<SareaExperienceProfileListItem[]> {
  return prisma.sareaExperienceProfile.findMany({
    where: { tenantId },
    orderBy: { personaKey: "asc" },
    ...sareaProfileListArgs,
  });
}

export async function listDashboardLayouts(): Promise<DashboardLayoutListItem[]> {
  return prisma.dashboardLayout.findMany(layoutListArgs);
}

export async function listRoleExperienceMaps(): Promise<RoleExperienceMapListItem[]> {
  return prisma.roleExperienceMap.findMany(roleMapListArgs);
}

export async function listWidgetRules(): Promise<WidgetRuleListItem[]> {
  return prisma.widgetRule.findMany(widgetListArgs);
}

export async function listNavigationProfiles(): Promise<NavigationProfileListItem[]> {
  return prisma.navigationProfile.findMany(navListArgs);
}

export async function listDeviceExperienceRules(): Promise<DeviceExperienceRuleListItem[]> {
  return prisma.deviceExperienceRule.findMany(deviceListArgs);
}

export async function listAdaptiveUiRules(): Promise<AdaptiveUiRuleListItem[]> {
  return prisma.adaptiveUiRule.findMany(adaptiveListArgs);
}

export async function updateDashboardLayout(id: string, name: string) {
  return prisma.dashboardLayout.update({ where: { id }, data: { name } });
}

export async function updateWidgetRuleVisibility(id: string, visibility: string) {
  return prisma.widgetRule.update({ where: { id }, data: { visibility } });
}

export async function updateRoleExperienceMap(id: string, roleSlug: string) {
  return prisma.roleExperienceMap.update({ where: { id }, data: { roleSlug } });
}

export async function updateAdaptiveUiRule(id: string, ruleKey: string) {
  return prisma.adaptiveUiRule.update({ where: { id }, data: { ruleKey } });
}

export async function updateDeviceExperienceRule(id: string, deviceType: string) {
  return prisma.deviceExperienceRule.update({ where: { id }, data: { deviceType } });
}

export async function updateDeviceRuleJson(id: string, rulesJson: { compact?: boolean; touchTargets?: string }) {
  return prisma.deviceExperienceRule.update({ where: { id }, data: { rulesJson } });
}

export async function updateNavigationPrimaryKeys(id: string, primary: string[]) {
  return prisma.navigationProfile.update({
    where: { id },
    data: { configJson: { primary } },
  });
}

export async function updateAdaptiveRuleDensity(id: string, level: string) {
  return prisma.adaptiveUiRule.update({
    where: { id },
    data: { configJson: { level } },
  });
}

export async function updateExperienceProfileName(id: string, name: string) {
  return prisma.sareaExperienceProfile.update({ where: { id }, data: { name } });
}

/** Merge safe presentation fields into profile configJson (no raw JSON editor). */
export async function updateExperienceProfileConfig(
  id: string,
  patch: { complexity?: string }
) {
  const row = await prisma.sareaExperienceProfile.findUnique({ where: { id } });
  if (!row) throw new Error("Profile not found");
  const prev =
    row.configJson && typeof row.configJson === "object"
      ? (row.configJson as Record<string, unknown>)
      : {};
  const allowed = ["low", "medium", "high", "adaptive"];
  const complexity =
    patch.complexity && allowed.includes(patch.complexity) ? patch.complexity : prev.complexity;
  return prisma.sareaExperienceProfile.update({
    where: { id },
    data: {
      configJson: {
        ...prev,
        ...(complexity ? { complexity } : {}),
      },
    },
  });
}

/** Reassign an existing role map to another profile on the same tenant (experience only). */
export async function updateRoleMapProfile(id: string, profileId: string) {
  const map = await prisma.roleExperienceMap.findUnique({
    where: { id },
    include: { profile: true },
  });
  if (!map) throw new Error("Role map not found");
  const target = await prisma.sareaExperienceProfile.findUnique({ where: { id: profileId } });
  if (!target) throw new Error("Target profile not found");
  if (target.tenantId !== map.profile.tenantId) {
    throw new Error("Profile must belong to the same tenant");
  }
  return prisma.roleExperienceMap.update({
    where: { id },
    data: { profileId },
  });
}

export async function getSareaStudioSummary() {
  const [profileCount, tenantCount, layoutCount, ruleCount, widgetCount, navCount, deviceCount] =
    await Promise.all([
      prisma.sareaExperienceProfile.count(),
      prisma.sareaExperienceProfile.groupBy({
        by: ["tenantId"],
        where: { tenantId: { not: null } },
      }),
      prisma.dashboardLayout.count(),
      prisma.adaptiveUiRule.count(),
      prisma.widgetRule.count(),
      prisma.navigationProfile.count(),
      prisma.deviceExperienceRule.count(),
    ]);

  return {
    profileCount,
    tenantsWithProfiles: tenantCount.length,
    layoutCount,
    adaptiveRuleCount: ruleCount,
    widgetRuleCount: widgetCount,
    navigationProfileCount: navCount,
    deviceRuleCount: deviceCount,
  };
}
