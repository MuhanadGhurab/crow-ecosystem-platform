/**
 * Lighthouse seed — MEEM Holding Logistics / tenant slug meem-global.
 *
 *   npx tsx --env-file=.env prisma/seed-meem.ts
 *
 * Prerequisite: base catalog (`npm run db:seed`).
 */
import { PrismaClient } from "@prisma/client";

import {
  MEEM_MODULE_KEYS,
  MEEM_REFERENCE_CODE,
  MEEM_TENANT_SLUG,
} from "../src/lib/mock/meem-global";
import { upsertDiscoveryAnswer } from "../src/lib/services/discovery.service";
import { createImplementationRequest } from "../src/lib/services/implementation-request.service";
import { refreshRequestPricingEstimate } from "../src/lib/services/commercial.service";
import {
  completeDiscoveryAndCreateBlueprint,
  provisionAndInitializeTenant,
  startDiscovery,
} from "../src/lib/services/pipeline.service";
import {
  addDiscoveryBranch,
  addDiscoveryDepartment,
  addDiscoveryExperienceRequirement,
  addDiscoveryRole,
  addDiscoveryWorkflow,
} from "../src/lib/services/discovery.service";
import { enrichMeemGlobalOps } from "../src/lib/services/meem-ops.service";
import {
  ensureTenantSareaPersonas,
  SAREA_DEFAULT_PERSONA_KEYS,
  upgradeLogisticsSareaForTenant,
} from "../src/lib/services/sarea-seed.service";

const prisma = new PrismaClient();

const MEEM_SECURITY = ["crow_sentinel", "crow_fortress"] as const;

/** Optional E9 demo module — enabled on lighthouse tenant, not in baseline pricing keys. */
const MEEM_PROCUREMENT_MODULE = "procurement" as const;

/** Idempotent: align blueprint + tenant modules with MEEM ERP chain (E8). */
async function alignMeemErpModules(blueprintId: string, tenantId: string, requestId: string) {
  for (const moduleKey of MEEM_MODULE_KEYS) {
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

  await prisma.blueprintModule.upsert({
    where: { blueprintId_moduleKey: { blueprintId, moduleKey: MEEM_PROCUREMENT_MODULE } },
    create: { blueprintId, moduleKey: MEEM_PROCUREMENT_MODULE, enabled: true },
    update: { enabled: true },
  });
  await prisma.organizationModule.upsert({
    where: { tenantId_moduleKey: { tenantId, moduleKey: MEEM_PROCUREMENT_MODULE } },
    create: { tenantId, moduleKey: MEEM_PROCUREMENT_MODULE, enabled: true },
    update: { enabled: true },
  });

  await upsertDiscoveryAnswer(requestId, "modules", "confirmedKeys", [...MEEM_MODULE_KEYS]);
  await refreshRequestPricingEstimate(requestId);
}

async function main() {
  const existing = await prisma.implementationRequest.findFirst({
    where: { referenceCode: MEEM_REFERENCE_CODE },
    include: {
      enterpriseBlueprint: {
        include: { tenant: { include: { modules: true } } },
      },
    },
  });

  if (existing?.enterpriseBlueprint?.tenant) {
    const t = existing.enterpriseBlueprint.tenant;
    const bp = existing.enterpriseBlueprint;
    console.log(`MEEM already seeded: request ${existing.id}, tenant /${t.slug}/dashboard`);
    await alignMeemErpModules(bp.id, t.id, existing.id);
    console.log(
      `MEEM modules aligned: ${MEEM_MODULE_KEYS.join(", ")}, ${MEEM_PROCUREMENT_MODULE}`
    );
    const ops = await enrichMeemGlobalOps();
    const sareaEnsure = await ensureTenantSareaPersonas(t.id, SAREA_DEFAULT_PERSONA_KEYS);
    const sareaUpgrade = await upgradeLogisticsSareaForTenant(t.id);
    console.log(`MEEM ops enriched: ${ops.workflowNames.length} workflows, AI: ${ops.aiExtraKeys.join(", ")}`);
    console.log(
      `MEEM SAREA ensured: created ${sareaEnsure.created}, backfilled ${sareaEnsure.backfilled}; upgrade ${sareaUpgrade.updates} change(s)`
    );
    return;
  }

  console.log("Seeding MEEM lighthouse pipeline…");

  const request = await createImplementationRequest({
    organizationName: "MEEM Holding Logistics",
    organizationNameAr: "ميم القابضة للخدمات اللوجستية",
    industry: "logistics",
    employeeBand: "50-250",
    countryCode: "SA",
    planKey: "enterprise",
    moduleKeys: [...MEEM_MODULE_KEYS],
    securityPackageKeys: [...MEEM_SECURITY],
    contact: {
      fullName: "Faisal Al-Meem",
      email: "faisal@meem-logistics.demo",
      phone: "+966551002000",
      jobTitle: "Group CIO",
    },
    notes:
      "Lighthouse demo — logistics, fleet AI routing, warehouse visibility, Entra SSO, NCA-aligned CyberCrow.",
  });

  await prisma.implementationRequest.update({
    where: { id: request.id },
    data: { referenceCode: MEEM_REFERENCE_CODE, status: "UNDER_DISCOVERY" },
  });

  await startDiscovery(request.id);

  await upsertDiscoveryAnswer(request.id, "organization", "operatingModel", "multi_hub_logistics");
  await upsertDiscoveryAnswer(request.id, "organization", "employeeBand", "50-250");
  await upsertDiscoveryAnswer(request.id, "organization", "goLiveTarget", "Q4 2026");
  await upsertDiscoveryAnswer(request.id, "modules", "confirmedKeys", [...MEEM_MODULE_KEYS]);
  await upsertDiscoveryAnswer(request.id, "identity", "idpPreference", "entra_id");
  await upsertDiscoveryAnswer(request.id, "identity", "mfaRequired", "required_all_staff");
  await upsertDiscoveryAnswer(request.id, "security", "reviewed", true);
  await upsertDiscoveryAnswer(request.id, "experience", "aiExtras", [
    "route_optimization",
    "demand_forecast",
    "anomaly_detection",
    "doc_intelligence",
  ]);
  await upsertDiscoveryAnswer(request.id, "experience", "sareaPackageKey", "executive");

  await addDiscoveryDepartment(request.id, {
    name: "Fleet Operations",
    nameAr: "عمليات الأسطول",
    headcount: 85,
  });
  await addDiscoveryDepartment(request.id, {
    name: "Warehouse & Inventory",
    headcount: 120,
  });
  await addDiscoveryRole(request.id, { name: "Hub Manager", level: "manager" });
  await addDiscoveryRole(request.id, { name: "Dispatcher", level: "frontline" });
  await addDiscoveryBranch(request.id, {
    name: "Riyadh HQ",
    city: "Riyadh",
    region: "Central",
  });
  await addDiscoveryBranch(request.id, { name: "Jeddah Hub", city: "Jeddah", region: "Western" });
  await addDiscoveryWorkflow(request.id, {
    name: "Shipment dispatch approval",
    description: "Multi-hub routing with SLA breach escalation",
  });
  await addDiscoveryWorkflow(request.id, {
    name: "Warehouse intake",
    description: "ASN → QC scan → putaway with inventory sync",
  });
  await addDiscoveryWorkflow(request.id, {
    name: "OCR document capture",
    description: "POD/BOL upload, OCR extraction, human-in-the-loop verify",
  });
  await addDiscoveryWorkflow(request.id, {
    name: "AI route optimization",
    description: "Load plan → AI optimize routes → dispatcher approval",
  });

  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "executive",
    requirement: "Fleet KPIs, SLA breaches, regional hub map",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "manager",
    requirement: "Dispatch board, warehouse throughput",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "frontline",
    requirement: "Mobile-first shipment scan and POD",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "analyst",
    requirement: "CyberCrow incidents, security events, identity telemetry — triage-first",
  });
  await addDiscoveryExperienceRequirement(request.id, {
    personaKey: "tenant_admin",
    requirement: "Users, roles, modules, plan, and CyberCrow governance visibility",
  });

  const blueprint = await completeDiscoveryAndCreateBlueprint(request.id);

  const tenant = await provisionAndInitializeTenant(
    blueprint.id,
    MEEM_TENANT_SLUG,
    "MEEM Holding Logistics",
    "enterprise",
    [...SAREA_DEFAULT_PERSONA_KEYS]
  );

  const sareaEnsure = await ensureTenantSareaPersonas(tenant.id, SAREA_DEFAULT_PERSONA_KEYS);
  const sareaUpgrade = await upgradeLogisticsSareaForTenant(tenant.id);
  console.log(
    `MEEM SAREA personas: created ${sareaEnsure.created}, backfilled ${sareaEnsure.backfilled}; upgrade ${sareaUpgrade.updates} change(s)`
  );

  await prisma.enterpriseBlueprint.update({
    where: { id: blueprint.id },
    data: {
      status: "APPROVED",
      proposalStatus: "CLIENT_APPROVED",
      proposalToken: "meem-demo-proposal-token",
      proposalSentAt: new Date(),
      clientApprovedAt: new Date(),
    },
  });

  await prisma.discoveryProfile.update({
    where: { requestId: request.id },
    data: {
      summary:
        "Multi-hub logistics, Entra ID, AI-assisted dispatch and inventory signals.",
    },
  });

  const ops = await enrichMeemGlobalOps();

  console.log(`MEEM seeded: ${MEEM_REFERENCE_CODE}`);
  console.log(`  Request:  /admin/requests/${request.id}`);
  console.log(`  Blueprint: /blueprints/${blueprint.id}/overview`);
  console.log(`  Tenant:   /${tenant.slug}/dashboard`);
  console.log(`  Modules:  ${MEEM_MODULE_KEYS.join(", ")}`);
  console.log(`  Workflows: ${ops.workflowNames.join(" · ")}`);
  console.log(`  Ops only:  npm run db:seed:meem:ops`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
