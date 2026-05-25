/**
 * Read-only MEEM SAREA materialization report (no writes).
 * Usage: npm run sarea:meem-verify
 * Optional: TENANT_SLUG=meem-global npm run sarea:meem-verify
 */

import {
  SAREA_PERSONA_DEFINITIONS,
  SAREA_PREVIEW_PERSONA_KEYS,
} from "../src/lib/constants/sarea-personas";
import { createScriptPrisma } from "../src/lib/prisma-script";
import {
  PERSONA_DISPLAY_NAMES,
  PERSONA_ROLE_ALIASES,
} from "../src/lib/services/sarea-seed-core";
import type { SareaPersonaMaterializationState } from "../src/lib/services/sarea-materialization.service";

const prisma = createScriptPrisma();

function materializationState(
  hasProfile: boolean,
  layoutCount: number,
  widgetCount: number,
  navCount: number
): SareaPersonaMaterializationState {
  if (!hasProfile) return "not_materialized";
  if (layoutCount > 0 && widgetCount > 0 && navCount > 0) return "tenant_backed";
  if (layoutCount > 0 || widgetCount > 0 || navCount > 0) return "partial";
  return "not_materialized";
}

async function main() {
  const slug = process.env.TENANT_SLUG ?? "meem-global";
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    console.error(`Tenant not found: ${slug}`);
    process.exit(1);
  }

  const profiles = await prisma.sareaExperienceProfile.findMany({
    where: { tenantId: tenant.id },
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

  console.log(`SAREA verify — tenant: ${slug} (${tenant.id})`);
  console.log("persona | profile | layout | widgets | nav | role_maps | materialization | display_name");
  console.log("-".repeat(100));

  for (const personaKey of SAREA_PREVIEW_PERSONA_KEYS) {
    const profile = byKey.get(personaKey);
    const def = SAREA_PERSONA_DEFINITIONS.find((d) => d.key === personaKey);
    const layoutCount = profile?._count.dashboardLayouts ?? 0;
    const widgetCount = profile?._count.widgetRules ?? 0;
    const navCount = profile?._count.navigationProfiles ?? 0;
    const roleMapCount = profile?.roleExperienceMaps.length ?? 0;
    let state = materializationState(!!profile, layoutCount, widgetCount, navCount);
    if (!profile && def?.previewMode === "recommended_mapping") {
      state = "recommended_fallback";
    }
    const displayName =
      profile?.name ?? PERSONA_DISPLAY_NAMES[personaKey] ?? def?.label ?? personaKey;
    const expectedRoles = (PERSONA_ROLE_ALIASES[personaKey] ?? []).join(",");

    console.log(
      [
        personaKey.padEnd(14),
        profile ? "yes" : "no",
        layoutCount > 0 ? "yes" : "no",
        String(widgetCount).padStart(7),
        navCount > 0 ? "yes" : "no",
        String(roleMapCount).padStart(9),
        state.padEnd(18),
        displayName.slice(0, 40),
      ].join(" | ")
    );
    if (profile && expectedRoles) {
      const mapped = profile.roleExperienceMaps.map((m) => m.roleSlug).join(",");
      console.log(`  expected roles: ${expectedRoles} | mapped: ${mapped || "(none)"}`);
    }
  }

  const missing = SAREA_PREVIEW_PERSONA_KEYS.filter((k) => !byKey.has(k));
  if (missing.length > 0) {
    console.log(`\nMissing persona profiles: ${missing.join(", ")}`);
    console.log("Run: npm run sarea:meem-upgrade");
    process.exit(1);
  }

  const partial = SAREA_PREVIEW_PERSONA_KEYS.filter((k) => {
    const p = byKey.get(k)!;
    const lc = p._count.dashboardLayouts;
    const wc = p._count.widgetRules;
    const nc = p._count.navigationProfiles;
    return !(lc > 0 && wc > 0 && nc > 0);
  });
  if (partial.length > 0) {
    console.log(`\nPartial personas (need backfill): ${partial.join(", ")}`);
    process.exit(1);
  }

  console.log("\nAll five personas tenant-backed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
