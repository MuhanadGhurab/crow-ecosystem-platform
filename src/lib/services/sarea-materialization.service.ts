import {
  SAREA_PERSONA_DEFINITIONS,
  SAREA_PREVIEW_PERSONA_KEYS,
  type SareaPreviewPersonaKey,
} from "@/lib/constants/sarea-personas";
import { prisma } from "@/lib/db";
import {
  PERSONA_DISPLAY_NAMES,
  PERSONA_ROLE_ALIASES,
  ensureTenantSareaPersonas,
} from "@/lib/services/sarea-seed.service";

export type SareaPersonaMaterializationState =
  | "tenant_backed"
  | "partial"
  | "not_materialized"
  | "recommended_fallback";

export type SareaPersonaMaterializationRow = {
  personaKey: SareaPreviewPersonaKey;
  label: string;
  state: SareaPersonaMaterializationState;
  profileName?: string;
  recommendedRoleSlugs: string[];
  mappedRoleSlugs: string[];
  layoutCount: number;
  widgetCount: number;
  navCount: number;
  roleMapCount: number;
};

function profileMaterializationState(
  layoutCount: number,
  widgetCount: number,
  navCount: number
): SareaPersonaMaterializationState {
  if (layoutCount > 0 && widgetCount > 0 && navCount > 0) return "tenant_backed";
  if (layoutCount > 0 || widgetCount > 0 || navCount > 0) return "partial";
  return "not_materialized";
}

/** Per-persona studio materialization for one tenant (F5 validation matrix). */
export async function getTenantPersonaMaterialization(
  tenantId: string
): Promise<SareaPersonaMaterializationRow[]> {
  const profiles = await prisma.sareaExperienceProfile.findMany({
    where: { tenantId },
    include: {
      roleExperienceMaps: true,
      _count: {
        select: {
          dashboardLayouts: true,
          widgetRules: true,
          navigationProfiles: true,
        },
      },
    },
    orderBy: { personaKey: "asc" },
  });

  const byKey = new Map(profiles.map((p) => [p.personaKey, p]));

  return SAREA_PREVIEW_PERSONA_KEYS.map((personaKey) => {
    const def = SAREA_PERSONA_DEFINITIONS.find((d) => d.key === personaKey);
    const profile = byKey.get(personaKey);
    const recommendedRoleSlugs = PERSONA_ROLE_ALIASES[personaKey] ?? [];

    if (!profile) {
      return {
        personaKey,
        label: def?.label ?? personaKey,
        state:
          def?.previewMode === "recommended_mapping"
            ? "recommended_fallback"
            : "not_materialized",
        recommendedRoleSlugs,
        mappedRoleSlugs: [],
        layoutCount: 0,
        widgetCount: 0,
        navCount: 0,
        roleMapCount: 0,
      };
    }

    const state = profileMaterializationState(
      profile._count.dashboardLayouts,
      profile._count.widgetRules,
      profile._count.navigationProfiles
    );

    return {
      personaKey,
      label: def?.label ?? profile.name,
      state,
      profileName: profile.name,
      recommendedRoleSlugs,
      mappedRoleSlugs: profile.roleExperienceMaps.map((m) => m.roleSlug),
      layoutCount: profile._count.dashboardLayouts,
      widgetCount: profile._count.widgetRules,
      navCount: profile._count.navigationProfiles,
      roleMapCount: profile.roleExperienceMaps.length,
    };
  });
}

/** Idempotent: create missing persona parent rows + child defaults for a tenant. */
export async function materializeMissingTenantPersonas(
  tenantId: string,
  personaKeys: readonly string[] = SAREA_PREVIEW_PERSONA_KEYS
) {
  return ensureTenantSareaPersonas(tenantId, [...personaKeys]);
}

export function materializationStateLabel(state: SareaPersonaMaterializationState): string {
  switch (state) {
    case "tenant_backed":
      return "Tenant-backed";
    case "partial":
      return "Partial (needs backfill)";
    case "not_materialized":
      return "Not materialized yet";
    case "recommended_fallback":
      return "Recommended fallback only";
    default:
      return state;
  }
}

export function materializationStateHint(state: SareaPersonaMaterializationState): string {
  switch (state) {
    case "tenant_backed":
      return "Studio profile with layout, widgets, and navigation — used at runtime when role-mapped or previewed.";
    case "partial":
      return "Profile row exists but child records are incomplete. Run sarea:backfill-seed or sarea:meem-upgrade.";
    case "not_materialized":
      return "No tenant profile row. Provision via pipeline, seed, or materializeMissingTenantPersonas — read-only mapping only until then.";
    case "recommended_fallback":
      return "Platform-staff preview uses built-in recommended nav/widgets until a tenant profile is created.";
    default:
      return "";
  }
}

export { PERSONA_DISPLAY_NAMES };
