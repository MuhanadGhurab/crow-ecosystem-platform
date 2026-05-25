import type { PrismaClient } from "@prisma/client";
import { SAREA_PREVIEW_PERSONA_KEYS } from "@/lib/constants/sarea-personas";

/** Default persona keys provisioned on tenant go-live (F5 — all five). */
export const SAREA_DEFAULT_PERSONA_KEYS: readonly string[] = SAREA_PREVIEW_PERSONA_KEYS;

/** Workshop-friendly display names (MEEM Global). */
export const PERSONA_DISPLAY_NAMES: Record<string, string> = {
  executive: "MEEM Group CIO view",
  manager: "Hub operations manager",
  frontline: "Dispatcher mobile",
  analyst: "CyberCrow analyst console",
  tenant_admin: "Tenant administrator workspace",
};

export const PERSONA_ROLE_ALIASES: Record<string, string[]> = {
  executive: ["tenant-admin"],
  manager: ["manager", "hub-manager"],
  frontline: ["employee", "dispatcher"],
  analyst: ["analyst", "security-analyst"],
  tenant_admin: ["tenant-admin"],
};

const PERSONA_NAV: Record<string, string[]> = {
  executive: ["dashboard", "tasks", "workflows", "reports", "cybercrow"],
  manager: ["dashboard", "tasks", "workflows", "cybercrow"],
  frontline: ["dashboard", "tasks"],
  analyst: ["dashboard", "cybercrow", "reports", "tasks"],
  tenant_admin: ["dashboard", "users", "modules", "cybercrow", "settings", "reports"],
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
    analyst: {
      tasks: "optional",
      alerts: "visible",
      reports: "visible",
      modules: "hidden",
      structure: "hidden",
      operational_load: "hidden",
      cybercrow_posture: "visible",
      fleet_kpis: "hidden",
      ops_board: "hidden",
      pod_mobile: "hidden",
    },
    tenant_admin: {
      tasks: "visible",
      alerts: "optional",
      reports: "visible",
      modules: "visible",
      structure: "visible",
      operational_load: "visible",
      cybercrow_posture: "visible",
      fleet_kpis: "optional",
      ops_board: "optional",
      pod_mobile: "hidden",
    },
  };

  return matrix[personaKey]?.[widgetKey] ?? "optional";
}

function layoutNameForPersona(personaKey: string): string {
  if (personaKey === "executive") return "Executive KPI grid";
  if (personaKey === "analyst") return "Security analyst triage";
  if (personaKey === "tenant_admin") return "Tenant admin control surface";
  return "Operations dashboard";
}

function densityForPersona(personaKey: string): "spacious" | "comfortable" | "compact" {
  if (personaKey === "executive") return "spacious";
  if (personaKey === "frontline") return "compact";
  return "comfortable";
}

/** Default SAREA child records for one experience profile. */
export async function seedSareaProfileDefaults(
  db: PrismaClient,
  profileId: string,
  personaKey: string
) {
  const roleSlugs = PERSONA_ROLE_ALIASES[personaKey] ?? ["employee"];
  const navKeys = PERSONA_NAV[personaKey] ?? ["dashboard", "tasks"];
  const allWidgets = [...CORE_WIDGETS, ...LOGISTICS_WIDGETS];

  await db.dashboardLayout.create({
    data: {
      profileId,
      name: layoutNameForPersona(personaKey),
      layoutJson: {
        columns: 12,
        widgets: allWidgets.filter((w) => widgetVisibility(personaKey, w) !== "hidden"),
      },
    },
  });

  await db.widgetRule.createMany({
    data: allWidgets.map((widgetKey) => ({
      profileId,
      widgetKey,
      visibility: widgetVisibility(personaKey, widgetKey),
    })),
  });

  await db.roleExperienceMap.createMany({
    data: roleSlugs.map((roleSlug) => ({ profileId, roleSlug })),
  });

  await db.navigationProfile.create({
    data: {
      profileId,
      configJson: { primary: navKeys },
    },
  });

  await db.deviceExperienceRule.create({
    data: {
      profileId,
      deviceType: personaKey === "frontline" ? "mobile" : "desktop",
      rulesJson: { compact: personaKey === "frontline", touchTargets: "large" },
    },
  });

  await db.adaptiveUiRule.create({
    data: {
      profileId,
      ruleKey: "density",
      configJson: { level: densityForPersona(personaKey) },
    },
  });
}

/**
 * Idempotent: ensure each personaKey has a tenant profile + child defaults.
 * Safe for MEEM re-seeds and F5 backfill — does not delete or remap roles.
 */
export async function ensureTenantSareaPersonas(
  db: PrismaClient,
  tenantId: string,
  personaKeys: readonly string[] = SAREA_DEFAULT_PERSONA_KEYS
) {
  const existing = await db.sareaExperienceProfile.findMany({
    where: { tenantId },
    include: {
      _count: { select: { dashboardLayouts: true } },
    },
  });
  const byKey = new Map(existing.map((p) => [p.personaKey, p]));

  let created = 0;
  let backfilled = 0;

  for (const personaKey of personaKeys) {
    const found = byKey.get(personaKey);
    if (!found) {
      const profile = await db.sareaExperienceProfile.create({
        data: {
          tenantId,
          name: PERSONA_DISPLAY_NAMES[personaKey] ?? `${personaKey} experience`,
          personaKey,
          configJson: {
            complexity: personaKey === "analyst" || personaKey === "tenant_admin" ? "high" : "adaptive",
            mobileFirst: personaKey === "frontline",
            cybercrowFocus: personaKey === "analyst",
          },
        },
      });
      await seedSareaProfileDefaults(db, profile.id, personaKey);
      created++;
      continue;
    }

    if (found._count.dashboardLayouts === 0) {
      await seedSareaProfileDefaults(db, found.id, personaKey);
      backfilled++;
    }
  }

  return { created, backfilled, total: personaKeys.length };
}

/** Backfill SAREA child data for profiles that only have the parent row. */
export async function backfillSareaProfileDefaults(db: PrismaClient, tenantId?: string) {
  const profiles = await db.sareaExperienceProfile.findMany({
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
    await seedSareaProfileDefaults(db, p.id, p.personaKey);
    seeded++;
  }
  return { seeded };
}

/** Idempotent MEEM / logistics SAREA upgrade — names, role aliases, logistics widgets, nav. */
export async function upgradeLogisticsSareaForTenant(db: PrismaClient, tenantId: string) {
  await ensureTenantSareaPersonas(db, tenantId, SAREA_DEFAULT_PERSONA_KEYS);

  const profiles = await db.sareaExperienceProfile.findMany({
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
      await db.sareaExperienceProfile.update({
        where: { id: profile.id },
        data: { name: displayName },
      });
      updated++;
    }

    const expectedRoles = PERSONA_ROLE_ALIASES[personaKey] ?? ["employee"];
    const existingRoles = new Set(profile.roleExperienceMaps.map((m) => m.roleSlug));
    for (const roleSlug of expectedRoles) {
      if (existingRoles.has(roleSlug)) continue;
      await db.roleExperienceMap.create({ data: { profileId: profile.id, roleSlug } });
      updated++;
    }

    const navKeys = PERSONA_NAV[personaKey];
    if (navKeys && profile.navigationProfiles[0]) {
      await db.navigationProfile.update({
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
        await db.widgetRule.updateMany({
          where: { profileId: profile.id, widgetKey },
          data: { visibility },
        });
      } else {
        await db.widgetRule.create({
          data: { profileId: profile.id, widgetKey, visibility },
        });
      }
      updated++;
    }
  }

  return { profiles: profiles.length, updates: updated };
}
