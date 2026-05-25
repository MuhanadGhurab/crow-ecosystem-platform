import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { RIMAL_TENANT_SLUG } from "@/lib/constants/rimal";
import { SAREA_PERSONA_DEFINITIONS } from "@/lib/constants/sarea-personas";
import { prisma } from "@/lib/db";
import {
  getTenantPersonaMaterialization,
  type SareaPersonaMaterializationRow,
  type SareaPersonaMaterializationState,
} from "@/lib/services/sarea-materialization.service";
import {
  listDashboardLayouts,
  listRoleExperienceMaps,
  listSareaExperienceProfiles,
  type SareaExperienceProfileListItem,
} from "@/lib/services/sarea.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export type ProfileConfigMeta = {
  complexity?: string;
  mobileFirst?: boolean;
  cybercrowFocus?: boolean;
  purpose?: string;
};

export function parseProfileConfig(
  configJson: unknown,
  personaKey?: string
): ProfileConfigMeta {
  const def = personaKey
    ? SAREA_PERSONA_DEFINITIONS.find((d) => d.key === personaKey)
    : undefined;
  if (!configJson || typeof configJson !== "object") {
    return { purpose: def?.dashboardPurpose };
  }
  const c = configJson as Record<string, unknown>;
  return {
    complexity: typeof c.complexity === "string" ? c.complexity : def?.complexity,
    mobileFirst: typeof c.mobileFirst === "boolean" ? c.mobileFirst : undefined,
    cybercrowFocus: typeof c.cybercrowFocus === "boolean" ? c.cybercrowFocus : undefined,
    purpose: def?.dashboardPurpose,
  };
}

export function profileMaterializationLabel(
  profile: SareaExperienceProfileListItem
): SareaPersonaMaterializationState {
  const { dashboardLayouts, widgetRules, navigationProfiles } = profile._count;
  if (dashboardLayouts > 0 && widgetRules > 0 && navigationProfiles > 0) {
    return "tenant_backed";
  }
  if (dashboardLayouts > 0 || widgetRules > 0 || navigationProfiles > 0) {
    return "partial";
  }
  if (!profile.tenantId) return "recommended_fallback";
  return "not_materialized";
}

export type SareaStudioHealthSummary = {
  tenantsWithProfiles: number;
  profileCount: number;
  roleMapCount: number;
  layoutCount: number;
  navigationProfileCount: number;
  widgetRuleCount: number;
  deviceRuleCount: number;
  adaptiveRuleCount: number;
  tenantBackedPersonas: number;
  partialPersonas: number;
  fallbackPersonas: number;
  notMaterializedPersonas: number;
  tenantsNeedingReview: number;
  lighthouseTenants: {
    id: string;
    slug: string;
    displayName: string;
    backed: number;
    total: number;
  }[];
};

export async function getSareaStudioHealthSummary(): Promise<SareaStudioHealthSummary> {
  const [profiles, roleMaps, navigationProfileCount, widgetRuleCount, deviceRuleCount, adaptiveRuleCount, layouts] =
    await Promise.all([
      listSareaExperienceProfiles(),
      listRoleExperienceMaps(),
      prisma.navigationProfile.count(),
      prisma.widgetRule.count(),
      prisma.deviceExperienceRule.count(),
      prisma.adaptiveUiRule.count(),
      listDashboardLayouts(),
    ]);

  const tenantIds = [...new Set(profiles.map((p) => p.tenantId).filter(Boolean))] as string[];
  let tenantBackedPersonas = 0;
  let partialPersonas = 0;
  let fallbackPersonas = 0;
  let notMaterializedPersonas = 0;
  let tenantsNeedingReview = 0;

  const lighthouseSlugs = [MEEM_TENANT_SLUG, RIMAL_TENANT_SLUG];
  const lighthouseTenants: SareaStudioHealthSummary["lighthouseTenants"] = [];

  for (const slug of lighthouseSlugs) {
    const tenant = await getTenantBySlug(slug);
    if (!tenant) continue;
    const rows = await getTenantPersonaMaterialization(tenant.id);
    const backed = rows.filter((r) => r.state === "tenant_backed").length;
    const needsReview = rows.some(
      (r) => r.state === "partial" || r.state === "not_materialized" || r.state === "recommended_fallback"
    );
    if (needsReview) tenantsNeedingReview++;
    lighthouseTenants.push({
      id: tenant.id,
      slug,
      displayName: tenant.organization.displayName,
      backed,
      total: rows.length,
    });
    for (const row of rows) {
      switch (row.state) {
        case "tenant_backed":
          tenantBackedPersonas++;
          break;
        case "partial":
          partialPersonas++;
          break;
        case "recommended_fallback":
          fallbackPersonas++;
          break;
        case "not_materialized":
          notMaterializedPersonas++;
          break;
        default:
          break;
      }
    }
  }

  for (const p of profiles) {
    if (p.tenant?.slug && lighthouseSlugs.includes(p.tenant.slug)) continue;
    const state = profileMaterializationLabel(p);
    if (state === "tenant_backed") tenantBackedPersonas++;
    else if (state === "partial") partialPersonas++;
    else if (state === "recommended_fallback") fallbackPersonas++;
    else notMaterializedPersonas++;
  }

  return {
    tenantsWithProfiles: tenantIds.length,
    profileCount: profiles.length,
    roleMapCount: roleMaps.length,
    layoutCount: layouts.length,
    navigationProfileCount,
    widgetRuleCount,
    deviceRuleCount,
    adaptiveRuleCount,
    tenantBackedPersonas,
    partialPersonas,
    fallbackPersonas,
    notMaterializedPersonas,
    tenantsNeedingReview,
    lighthouseTenants,
  };
}

export type RoleMapStudioRow = Awaited<ReturnType<typeof listRoleMapsForStudio>>[number];

export async function listRoleMapsForStudio() {
  const maps = await listRoleExperienceMaps();
  const profiles = await listSareaExperienceProfiles();
  const byProfileId = new Map(profiles.map((p) => [p.id, p]));

  return maps.map((m) => {
    const full = profiles.find((p) => p.id === m.profileId);
    const profile = full ?? byProfileId.get(m.profileId) ?? m.profile;
    return {
      ...m,
      profile,
      tenantId: full?.tenantId ?? null,
      profileCounts: full?._count,
      materialization: full ? profileMaterializationLabel(full) : ("not_materialized" as const),
    };
  });
}

export async function getLighthouseMaterialization(): Promise<
  { slug: string; rows: SareaPersonaMaterializationRow[] }[]
> {
  const out: { slug: string; rows: SareaPersonaMaterializationRow[] }[] = [];
  for (const slug of [MEEM_TENANT_SLUG, RIMAL_TENANT_SLUG]) {
    const tenant = await getTenantBySlug(slug);
    if (!tenant) continue;
    out.push({ slug, rows: await getTenantPersonaMaterialization(tenant.id) });
  }
  return out;
}

export async function listProfilesForStudio() {
  const profiles = await listSareaExperienceProfiles();
  return profiles.map((p) => ({
    profile: p,
    config: parseProfileConfig(p.configJson, p.personaKey),
    state: profileMaterializationLabel(p),
    def: SAREA_PERSONA_DEFINITIONS.find((d) => d.key === p.personaKey),
  }));
}
