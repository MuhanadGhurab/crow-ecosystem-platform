/**
 * Read-only Rimal second-tenant verification (isolation + materialization + sector).
 *
 *   npm run tenant:verify:rimal
 *
 * Optional: TENANT_SLUG=rimal-construction MEEM_SLUG=meem-global
 */

import { MEEM_TENANT_SLUG } from "../src/lib/constants/meem";
import {
  RIMAL_REFERENCE_CODE,
  RIMAL_TENANT_SLUG,
} from "../src/lib/constants/rimal";
import { SAREA_PREVIEW_PERSONA_KEYS } from "../src/lib/constants/sarea-personas";
import { createScriptPrisma } from "../src/lib/prisma-script";

const prisma = createScriptPrisma();

async function main() {
  const rimalSlug = process.env.TENANT_SLUG ?? RIMAL_TENANT_SLUG;
  const meemSlug = process.env.MEEM_SLUG ?? MEEM_TENANT_SLUG;

  const [rimal, meem] = await Promise.all([
    prisma.tenant.findUnique({
      where: { slug: rimalSlug },
      include: {
        organization: true,
        modules: { where: { enabled: true } },
        blueprint: {
          include: {
            request: {
              include: {
                discoveryProfile: { include: { orgIntelligence: true } },
              },
            },
          },
        },
      },
    }),
    prisma.tenant.findUnique({ where: { slug: meemSlug }, select: { id: true, slug: true } }),
  ]);

  if (!rimal) {
    console.error(`Tenant not found: ${rimalSlug}. Run: npm run tenant:seed:rimal`);
    process.exit(1);
  }

  let failed = false;
  const fail = (msg: string) => {
    console.error(`FAIL: ${msg}`);
    failed = true;
  };
  const ok = (msg: string) => console.log(`OK: ${msg}`);

  console.log(`\n=== Rimal verify (${rimalSlug}) ===`);
  console.log(`Tenant id: ${rimal.id}`);

  const request = rimal.blueprint?.request;
  if (!request) fail("No implementation request on blueprint");
  else if (request.referenceCode !== RIMAL_REFERENCE_CODE)
    fail(`Reference code ${request.referenceCode} !== ${RIMAL_REFERENCE_CODE}`);
  else ok(`Reference ${request.referenceCode}`);

  if (rimal.organization.industry !== "construction") {
    fail(`Organization industry is ${rimal.organization.industry ?? "(null)"}, expected construction`);
  } else ok("Organization industry construction");

  const sectorKey = request?.discoveryProfile?.orgIntelligence?.sectorTemplateKey;
  if (sectorKey !== "construction") {
    fail(`Org intelligence sector ${sectorKey ?? "(none)"}, expected construction`);
  } else ok("Org intelligence sector construction");

  const moduleKeys = rimal.modules.map((m) => m.moduleKey).sort();
  if (moduleKeys.includes("logistics")) {
    fail("Logistics module enabled — should not mirror MEEM logistics stack");
  } else ok(`Modules (no logistics): ${moduleKeys.join(", ")}`);

  const profiles = await prisma.sareaExperienceProfile.findMany({
    where: { tenantId: rimal.id },
    include: {
      _count: {
        select: {
          dashboardLayouts: true,
          widgetRules: true,
          navigationProfiles: true,
        },
      },
    },
  });
  const byKey = new Map(profiles.map((p) => [p.personaKey, p]));
  for (const key of SAREA_PREVIEW_PERSONA_KEYS) {
    const p = byKey.get(key);
    if (!p) {
      fail(`Missing SAREA persona ${key}`);
      continue;
    }
    const complete =
      p._count.dashboardLayouts > 0 &&
      p._count.widgetRules > 0 &&
      p._count.navigationProfiles > 0;
    if (!complete) fail(`SAREA persona ${key} partial materialization`);
    else ok(`SAREA persona ${key} tenant-backed`);
  }

  const ccLogs = await prisma.cybercrowAuditLog.count({ where: { tenantId: rimal.id } });
  if (ccLogs < 1) fail("No CyberCrow audit logs for Rimal");
  else ok(`CyberCrow audit logs: ${ccLogs}`);

  const cemDepts = await prisma.department.count({ where: { tenantId: rimal.id } });
  const cemRoles = await prisma.role.count({ where: { tenantId: rimal.id } });
  if (cemDepts < 1) fail("No CEM departments seeded");
  else ok(`CEM departments: ${cemDepts}, roles: ${cemRoles}`);

  if (meem) {
    console.log(`\n=== Isolation vs ${meemSlug} ===`);
    const crossIncidents = await prisma.incident.count({
      where: {
        tenantId: meem.id,
        OR: [{ title: { contains: "Rimal", mode: "insensitive" } }],
      },
    });
    if (crossIncidents > 0) fail("MEEM incidents contain Rimal-specific titles");
    else ok("No obvious cross-tenant incident title bleed");

    const rimalOnMeem = await prisma.sareaExperienceProfile.count({
      where: { tenantId: meem.id, name: { contains: "Rimal", mode: "insensitive" } },
    });
    if (rimalOnMeem > 0) fail("MEEM SAREA profiles mention Rimal");
    else ok("MEEM SAREA names clean");

    const meemLogisticsOnly = await prisma.organizationModule.findFirst({
      where: { tenantId: meem.id, moduleKey: "logistics", enabled: true },
    });
    const rimalLogistics = await prisma.organizationModule.findFirst({
      where: { tenantId: rimal.id, moduleKey: "logistics", enabled: true },
    });
    if (meemLogisticsOnly && rimalLogistics) fail("Both tenants have logistics — check isolation intent");
    else ok("Module stacks differ (MEEM logistics vs Rimal construction set)");
  } else {
    console.log(`\nWARN: MEEM tenant ${meemSlug} not found — skipped isolation checks`);
  }

  console.log(failed ? "\nRimal verify: FAILED" : "\nRimal verify: PASSED");
  process.exit(failed ? 1 : 0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
