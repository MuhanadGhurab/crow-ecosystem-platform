import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { RIMAL_TENANT_SLUG } from "@/lib/constants/rimal";
import { SAREA_PERSONA_DEFINITIONS } from "@/lib/constants/sarea-personas";
import {
  experienceImpactForPersona,
  mappingAlignment,
  rbacSummaryForPersona,
  recommendedPersonaKeyForRole,
} from "@/lib/sarea/studio-helpers";
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
  listSareaProfilesForTenant,
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
  const profilesByTenant = new Map<string, typeof profiles>();
  for (const p of profiles) {
    if (!p.tenantId) continue;
    const list = profilesByTenant.get(p.tenantId) ?? [];
    list.push(p);
    profilesByTenant.set(p.tenantId, list);
  }

  return maps.map((m) => {
    const full = profiles.find((p) => p.id === m.profileId);
    const profile = full ?? byProfileId.get(m.profileId) ?? m.profile;
    const personaKey = profile.personaKey;
    const recommendedPersonaKey = recommendedPersonaKeyForRole(m.roleSlug);
    const tenantProfiles = full?.tenantId ? profilesByTenant.get(full.tenantId) ?? [] : [];
    const recommendedProfile =
      recommendedPersonaKey && full?.tenantId
        ? tenantProfiles.find((p) => p.personaKey === recommendedPersonaKey)
        : undefined;
    return {
      ...m,
      profile,
      tenantId: full?.tenantId ?? null,
      profileCounts: full?._count,
      materialization: full ? profileMaterializationLabel(full) : ("not_materialized" as const),
      recommendedPersonaKey,
      recommendedProfileName: recommendedProfile?.name ?? null,
      recommendedProfileId: recommendedProfile?.id ?? null,
      mappingAlignment: mappingAlignment(m.roleSlug, personaKey),
      rbacSummary: rbacSummaryForPersona(personaKey),
      experienceImpact: experienceImpactForPersona(personaKey),
    };
  });
}

export type TenantSareaHealthAdvisory =
  | "healthy"
  | "needs_review"
  | "missing_mapping"
  | "fallback_only";

export type TenantSareaHealthDetail = {
  backedPersonas: number;
  totalPersonas: number;
  advisory: TenantSareaHealthAdvisory;
  unmappedRoleSlugs: string[];
  profilesWithoutWidgets: { personaKey: string; name: string }[];
  profilesWithoutNavigation: { personaKey: string; name: string }[];
  fallbackPersonaCount: number;
  partialPersonaCount: number;
  nextActions: string[];
};

// Used by admin tenant control room to render tenant-backed vs fallback-only posture.
export async function getTenantSareaHealthDetail(tenantId: string): Promise<TenantSareaHealthDetail> {
  const [materialization, profiles] = await Promise.all([
    getTenantPersonaMaterialization(tenantId),
    listSareaProfilesForTenant(tenantId),
  ]);

  const backedPersonas = materialization.filter((r) => r.state === "tenant_backed").length;
  const fallbackPersonaCount = materialization.filter((r) => r.state === "recommended_fallback").length;
  const partialPersonaCount = materialization.filter((r) => r.state === "partial").length;
  const totalPersonas = materialization.length;

  const allMapped = new Set(
    materialization.flatMap((r) => r.mappedRoleSlugs.map((s) => s.toLowerCase()))
  );
  const unmappedRoleSlugs = [
    ...new Set(
      materialization.flatMap((r) =>
        r.recommendedRoleSlugs.filter((slug) => !allMapped.has(slug.toLowerCase()))
      )
    ),
  ];

  const profilesWithoutWidgets = profiles
    .filter((p) => p._count.widgetRules === 0)
    .map((p) => ({ personaKey: p.personaKey, name: p.name }));
  const profilesWithoutNavigation = profiles
    .filter((p) => p._count.navigationProfiles === 0)
    .map((p) => ({ personaKey: p.personaKey, name: p.name }));

  const nextActions: string[] = [];
  if (backedPersonas < totalPersonas) {
    nextActions.push("Review persona materialization in SAREA studio (layouts, widgets, navigation).");
  }
  if (unmappedRoleSlugs.length > 0) {
    nextActions.push(
      `Map RBAC slugs in role mapping: ${unmappedRoleSlugs.slice(0, 4).join(", ")}${unmappedRoleSlugs.length > 4 ? "…" : ""}.`
    );
  }
  if (profilesWithoutWidgets.length > 0) {
    nextActions.push("Add or seed widget rules for profiles missing dashboard widgets.");
  }
  if (profilesWithoutNavigation.length > 0) {
    nextActions.push("Configure navigation profiles for personas without primary nav keys.");
  }
  if (nextActions.length === 0) {
    nextActions.push("Tenant SAREA posture is healthy — use preview to validate experience changes.");
  }

  let advisory: TenantSareaHealthAdvisory = "healthy";
  if (backedPersonas === 0 && fallbackPersonaCount > 0) {
    advisory = "fallback_only";
  } else if (unmappedRoleSlugs.length > 0) {
    advisory = "missing_mapping";
  } else if (
    backedPersonas < totalPersonas ||
    partialPersonaCount > 0 ||
    profilesWithoutWidgets.length > 0 ||
    profilesWithoutNavigation.length > 0
  ) {
    advisory = "needs_review";
  }

  return {
    backedPersonas,
    totalPersonas,
    advisory,
    unmappedRoleSlugs,
    profilesWithoutWidgets,
    profilesWithoutNavigation,
    fallbackPersonaCount,
    partialPersonaCount,
    nextActions,
  };
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
