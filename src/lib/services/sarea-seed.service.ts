import { prisma } from "@/lib/db";

const PERSONA_ROLE_SLUG: Record<string, string> = {
  executive: "tenant-admin",
  manager: "manager",
  frontline: "employee",
};

/** Default SAREA child records for one experience profile. */
export async function seedSareaProfileDefaults(profileId: string, personaKey: string) {
  const roleSlug = PERSONA_ROLE_SLUG[personaKey] ?? "employee";

  await prisma.dashboardLayout.create({
    data: {
      profileId,
      name: "Default dashboard",
      layoutJson: { columns: 12, widgets: ["tasks", "alerts", "modules"] },
    },
  });

  await prisma.widgetRule.createMany({
    data: [
      { profileId, widgetKey: "tasks", visibility: "visible" },
      { profileId, widgetKey: "alerts", visibility: personaKey === "executive" ? "visible" : "optional" },
      { profileId, widgetKey: "reports", visibility: personaKey === "frontline" ? "hidden" : "visible" },
    ],
  });

  await prisma.roleExperienceMap.create({
    data: { profileId, roleSlug },
  });

  await prisma.navigationProfile.create({
    data: {
      profileId,
      configJson: {
        primary: ["dashboard", "tasks", ...(personaKey === "executive" ? ["reports"] : [])],
      },
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
