import { prisma } from "@/lib/db";

/** Workshop-friendly display names (MEEM Global). */
export const PERSONA_DISPLAY_NAMES: Record<string, string> = {
  executive: "MEEM Group CIO view",
  manager: "Hub operations manager",
  frontline: "Dispatcher mobile",
};

const PERSONA_ROLE_ALIASES: Record<string, string[]> = {
  executive: ["tenant-admin"],
  manager: ["manager", "hub-manager"],
  frontline: ["employee", "dispatcher"],
};

const PERSONA_NAV: Record<string, string[]> = {
  executive: ["dashboard", "tasks", "workflows", "reports", "cybercrow"],
  manager: ["dashboard", "tasks", "workflows", "cybercrow"],
  frontline: ["dashboard", "tasks"],
};

const CORE_WIDGETS = [
  "tasks",
  "alerts",
  "reports",
  "modules",
  "structure",
  "operational_load",
  "cybercrow_posture",
] as const;
const LOGISTICS_WIDGETS = ["fleet_kpis", "ops_board", "pod_mobile"] as const;

type WidgetVisibility = "visible" | "hidden" | "optional";

function widgetVisibility(personaKey: string, widgetKey: string): WidgetVisibility {
  const matrix: Record<string, Record<string, WidgetVisibility>> = {
    executive: {
      tasks: "visible",
      alerts: "visible",
      reports: "visible",
      modules: "visible",
      structure: "visible",
      operational_load: "visible",
      cybercrow_posture: "visible",
      fleet_kpis: "visible",
      ops_board: "visible",
      pod_mobile: "hidden",
    },
    manager: {
      tasks: "visible",
      alerts: "optional",
      reports: "visible",
      modules: "visible",
      structure: "hidden",
      operational_load: "visible",
      cybercrow_posture: "visible",
      fleet_kpis: "visible",
      ops_board: "visible",
      pod_mobile: "optional",
    },
    frontline: {
      tasks: "visible",
      alerts: "hidden",
      reports: "hidden",
      modules: "hidden",
      structure: "hidden",
      operational_load: "hidden",
      cybercrow_posture: "hidden",
      fleet_kpis: "hidden",
      ops_board: "hidden",
      pod_mobile: "visible",
    },
  };

  return matrix[personaKey]?.[widgetKey] ?? "optional";
}

/** Default SAREA child records for one experience profile. */
export async function seedSareaProfileDefaults(profileId: string, personaKey: string) {
  const roleSlugs = PERSONA_ROLE_ALIASES[personaKey] ?? ["employee"];
  const navKeys = PERSONA_NAV[personaKey] ?? ["dashboard", "tasks"];
  const allWidgets = [...CORE_WIDGETS, ...LOGISTICS_WIDGETS];

  await prisma.dashboardLayout.create({
    data: {
      profileId,
      name: personaKey === "executive" ? "Executive KPI grid" : "Operations dashboard",
      layoutJson: {
        columns: 12,
        widgets: allWidgets.filter((w) => widgetVisibility(personaKey, w) !== "hidden"),
      },
    },
  });

  await prisma.widgetRule.createMany({
    data: allWidgets.map((widgetKey) => ({
      profileId,
      widgetKey,
      visibility: widgetVisibility(personaKey, widgetKey),
    })),
  });

  await prisma.roleExperienceMap.createMany({
    data: roleSlugs.map((roleSlug) => ({ profileId, roleSlug })),
  });

  await prisma.navigationProfile.create({
    data: {
      profileId,
      configJson: { primary: navKeys },
    },
  });

  await prisma.deviceExperienceRule.create({
    data: {
      profileId,
      deviceType: personaKey === "frontline" ? "mobile" : "desktop",
      rulesJson: { compact: personaKey === "frontline", touchTargets: "large" },
    },
  });

  await prisma.adaptiveUiRule.create({
    data: {
      profileId,
      ruleKey: "density",
      configJson: { level: personaKey === "executive" ? "spacious" : "comfortable" },
    },
  });
}

/** Backfill SAREA child data for profiles that only have the parent row. */
export async function backfillSareaProfileDefaults(tenantId?: string) {
  const profiles = await prisma.sareaExperienceProfile.findMany({
    where: tenantId ? { tenantId } : undefined,
    include: {
      _count: {
        select: { dashboardLayouts: true },
      },
    },
  });

  let seeded = 0;
  for (const p of profiles) {
    if (p._count.dashboardLayouts > 0) continue;
    await seedSareaProfileDefaults(p.id, p.personaKey);
    seeded++;
  }
  return { seeded };
}

/** Idempotent MEEM / logistics SAREA upgrade — names, role aliases, logistics widgets, nav. */
export async function upgradeLogisticsSareaForTenant(tenantId: string) {
  const profiles = await prisma.sareaExperienceProfile.findMany({
    where: { tenantId },
    include: {
      roleExperienceMaps: true,
      widgetRules: true,
      navigationProfiles: true,
    },
  });

  let updated = 0;
  for (const profile of profiles) {
    const personaKey = profile.personaKey;
    const displayName = PERSONA_DISPLAY_NAMES[personaKey];
    if (displayName && profile.name !== displayName) {
      await prisma.sareaExperienceProfile.update({
        where: { id: profile.id },
        data: { name: displayName },
      });
      updated++;
    }

    const expectedRoles = PERSONA_ROLE_ALIASES[personaKey] ?? ["employee"];
    const existingRoles = new Set(profile.roleExperienceMaps.map((m) => m.roleSlug));
    for (const roleSlug of expectedRoles) {
      if (existingRoles.has(roleSlug)) continue;
      await prisma.roleExperienceMap.create({ data: { profileId: profile.id, roleSlug } });
      updated++;
    }

    const navKeys = PERSONA_NAV[personaKey];
    if (navKeys && profile.navigationProfiles[0]) {
      await prisma.navigationProfile.update({
        where: { id: profile.navigationProfiles[0].id },
        data: { configJson: { primary: navKeys } },
      });
      updated++;
    }

    const existingWidgets = new Set(profile.widgetRules.map((w) => w.widgetKey));
    const allWidgets = [...CORE_WIDGETS, ...LOGISTICS_WIDGETS];
    for (const widgetKey of allWidgets) {
      const visibility = widgetVisibility(personaKey, widgetKey);
      if (existingWidgets.has(widgetKey)) {
        await prisma.widgetRule.updateMany({
          where: { profileId: profile.id, widgetKey },
          data: { visibility },
        });
      } else {
        await prisma.widgetRule.create({
          data: { profileId: profile.id, widgetKey, visibility },
        });
      }
      updated++;
    }
  }

  return { profiles: profiles.length, updates: updated };
}
