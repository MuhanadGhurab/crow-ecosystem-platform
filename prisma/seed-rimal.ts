/**
 * Second-tenant seed — Rimal Construction / slug rimal-construction (construction sector).
 *
 *   npm run tenant:seed:rimal
 *   npm run tenant:seed:rimal -- --dry-run
 *
 * Prerequisite: base catalog (`npm run db:seed`) + sector templates (`npm run db:seed:sectors`).
 * Uses `.env.staging` via package.json script.
 */
import { PrismaClient } from "@prisma/client";

import {
  RIMAL_MODULE_KEYS,
  RIMAL_REFERENCE_CODE,
  RIMAL_TENANT_SLUG,
} from "../src/lib/constants/rimal";
import { upsertDiscoveryAnswer } from "../src/lib/services/discovery.service";
import { createImplementationRequest } from "../src/lib/services/implementation-request.service";
import { refreshRequestPricingEstimate } from "../src/lib/services/commercial.service";
import {
  acceptOrgIntelligenceIntoDiscovery,
  generateOrgIntelligenceRecommendations,
} from "../src/lib/services/org-intelligence.service";
import {
  completeDiscoveryAndCreateBlueprint,
  provisionAndInitializeTenant,
  startDiscovery,
} from "../src/lib/services/pipeline.service";
import {
  addDiscoveryBranch,
  addDiscoveryExperienceRequirement,
} from "../src/lib/services/discovery.service";
import { enrichTenantFromBlueprint } from "../src/lib/services/tenant-ops-seed.service";
import {
  ensureTenantSareaPersonas,
  SAREA_DEFAULT_PERSONA_KEYS,
} from "../src/lib/services/sarea-seed.service";

const prisma = new PrismaClient();

const RIMAL_SECURITY = ["crow_shield", "crow_sentinel"] as const;

const dryRun = process.argv.includes("--dry-run");

async function alignRimalModules(blueprintId: string, tenantId: string, requestId: string) {
  for (const moduleKey of RIMAL_MODULE_KEYS) {
    await prisma.blueprintModule.upsert({
      where: { blueprintId_moduleKey: { blueprintId, moduleKey } },
      create: { blueprintId, moduleKey, enabled: true },
      update: { enabled: true },
    });
    await prisma.organizationModule.upsert({
      where: { tenantId_moduleKey: { tenantId, moduleKey } },
      create: { tenantId, moduleKey, enabled: true },
      update: { enabled: true },
    });
    await prisma.requestedModule.upsert({
      where: { requestId_moduleKey: { requestId, moduleKey } },
      create: { requestId, moduleKey },
      update: {},
    });
  }
  await upsertDiscoveryAnswer(requestId, "modules", "confirmedKeys", [...RIMAL_MODULE_KEYS]);
  await refreshRequestPricingEstimate(requestId);
}

async function main() {
  if (dryRun) {
    console.log("[dry-run] Would seed Rimal Construction pipeline:");
    console.log(`  slug: ${RIMAL_TENANT_SLUG}`);
    console.log(`  reference: ${RIMAL_REFERENCE_CODE}`);
    console.log(`  industry: construction`);
    console.log(`  modules: ${RIMAL_MODULE_KEYS.join(", ")}`);
    console.log(`  personas: ${SAREA_DEFAULT_PERSONA_KEYS.join(", ")}`);
    return;
  }

  const existing = await prisma.implementationRequest.findFirst({
    where: { referenceCode: RIMAL_REFERENCE_CODE },
    include: {
      enterpriseBlueprint: {
        include: { tenant: { include: { modules: true, organization: true } } },
      },
    },
  });

  if (existing?.enterpriseBlueprint?.tenant) {
    const t = existing.enterpriseBlueprint.tenant;
    const bp = existing.enterpriseBlueprint;
    console.log(`Rimal already seeded: request ${existing.id}, tenant /${t.slug}/dashboard`);
    await alignRimalModules(bp.id, t.id, existing.id);
    await prisma.organization.update({
      where: { id: t.organizationId },
      data: { industry: "construction" },
    });
    const sareaEnsure = await ensureTenantSareaPersonas(t.id, SAREA_DEFAULT_PERSONA_KEYS);
    const ops = await enrichTenantFromBlueprint(t.id, { industryPack: "construction" });
    console.log(
      `Rimal modules aligned: ${RIMAL_MODULE_KEYS.join(", ")} · SAREA created ${sareaEnsure.created}, backfilled ${sareaEnsure.backfilled}`
    );
    console.log(
      `Rimal ops: ${ops.salesOpportunities} sales · ${ops.financeEntries} finance · ${ops.purchaseRequests} procurement · ${ops.tasks} tasks`
    );
    console.log(`  Tenant id: ${t.id}`);
    return;
  }

  console.log("Seeding Rimal Construction pipeline…");

  const request = await createImplementationRequest({
    organizationName: "Rimal Construction",
    organizationNameAr: "رمال للمقاولات",
    industry: "construction",
    employeeBand: "51-200",
    countryCode: "SA",
    planKey: "growth",
    moduleKeys: [...RIMAL_MODULE_KEYS],
    securityPackageKeys: [...RIMAL_SECURITY],
    contact: {
      fullName: "Sara Al-Rimal",
      email: "sara@rimal-construction.demo",
      phone: "+966551003000",
      jobTitle: "IT Director",
    },
    notes:
      "Phase F6 synthetic tenant — construction sector, project sites, procurement, NCA-aligned CyberCrow baseline.",
  });

  await prisma.implementationRequest.update({
    where: { id: request.id },
    data: { referenceCode: RIMAL_REFERENCE_CODE, status: "UNDER_DISCOVERY" },
  });

  await startDiscovery(request.id);

  await upsertDiscoveryAnswer(request.id, "organization", "operatingModel", "multi_site_projects");
  await upsertDiscoveryAnswer(request.id, "organization", "employeeBand", "51-200");
  await upsertDiscoveryAnswer(request.id, "organization", "goLiveTarget", "Q1 2027");
  await upsertDiscoveryAnswer(request.id, "modules", "confirmedKeys", [...RIMAL_MODULE_KEYS]);
  await upsertDiscoveryAnswer(request.id, "identity", "idpPreference", "local_sso_ready");
  await upsertDiscoveryAnswer(request.id, "identity", "mfaRequired", "required_managers_up");
  await upsertDiscoveryAnswer(request.id, "security", "reviewed", true);
  await upsertDiscoveryAnswer(request.id, "experience", "sareaPackageKey", "growth");
  await upsertDiscoveryAnswer(request.id, "org_intelligence", "sectorTemplateKey", "construction");

  await generateOrgIntelligenceRecommendations(request.id, {
    sectorTemplateKey: "construction",
  });
  await acceptOrgIntelligenceIntoDiscovery(request.id);

  await addDiscoveryBranch(request.id, {
    name: "Riyadh Head Office",
    city: "Riyadh",
    region: "Central",
  });
  await addDiscoveryBranch(request.id, {
    name: "NEOM Site Yard",
    city: "Tabuk",
    region: "North",
  });

  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "executive",
    requirement: "Portfolio margin, safety KPIs, project milestone heatmap",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "manager",
    requirement: "RFI queue, site inspection status, procurement approvals",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "frontline",
    requirement: "Mobile site checklist and safety capture",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "analyst",
    requirement: "CyberCrow site access and vendor-trust controls — triage-first",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "tenant_admin",
    requirement: "Users, roles, modules, and construction governance visibility",
  });

  const blueprint = await completeDiscoveryAndCreateBlueprint(request.id);

  const tenant = await provisionAndInitializeTenant(
    blueprint.id,
    RIMAL_TENANT_SLUG,
    "Rimal Construction",
    "growth",
    [...SAREA_DEFAULT_PERSONA_KEYS]
  );

  await prisma.organization.update({
    where: { id: tenant.organizationId },
    data: { industry: "construction", displayName: "Rimal Construction" },
  });

  await alignRimalModules(blueprint.id, tenant.id, request.id);

  const sareaEnsure = await ensureTenantSareaPersonas(tenant.id, SAREA_DEFAULT_PERSONA_KEYS);
  const ops = await enrichTenantFromBlueprint(tenant.id, { industryPack: "construction" });

  await prisma.enterpriseBlueprint.update({
    where: { id: blueprint.id },
    data: {
      status: "APPROVED",
      proposalStatus: "CLIENT_APPROVED",
      proposalSentAt: new Date(),
      clientApprovedAt: new Date(),
    },
  });

  await prisma.discoveryProfile.update({
    where: { requestId: request.id },
    data: {
      summary:
        "Multi-site construction operator — project controls, procurement, site safety, CyberCrow baselines.",
    },
  });

  console.log(`Rimal seeded: ${RIMAL_REFERENCE_CODE}`);
  console.log(`  Request:   /admin/requests/${request.id}`);
  console.log(`  Blueprint: /blueprints/${blueprint.id}/overview`);
  console.log(`  Tenant:    /${tenant.slug}/dashboard`);
  console.log(`  Tenant id: ${tenant.id}`);
  console.log(`  Modules:   ${RIMAL_MODULE_KEYS.join(", ")}`);
  console.log(
    `  SAREA:     created ${sareaEnsure.created}, backfilled ${sareaEnsure.backfilled}`
  );
  console.log(
    `  Ops:       ${ops.salesOpportunities} sales · ${ops.financeEntries} finance · ${ops.purchaseRequests} procurement`
  );
  console.log(`  Verify:    npm run tenant:verify:rimal`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
