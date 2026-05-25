/**
 * F11 — Start discovery + draft blueprint for organic request (no tenant provision).
 * Uses createScriptPrisma only (no pipeline.service — avoids server-only in tsx).
 *
 *   npx tsx --env-file=.env.staging scripts/f11-discovery-blueprint-staging.ts --reference=CROW-2026-ARAX9K
 */
import { createScriptPrisma } from "../src/lib/prisma-script";
import { resolveSectorTemplateKey } from "../src/lib/org-intelligence/resolve-sector";

const prisma = createScriptPrisma();

function parseReference(): string {
  const arg = process.argv.find((a) => a.startsWith("--reference="));
  const ref = arg?.split("=")[1]?.trim().toUpperCase();
  if (!ref) {
    console.error("Usage: --reference=CROW-2026-XXXXXX");
    process.exit(1);
  }
  return ref;
}

async function main() {
  const referenceCode = parseReference();
  const req = await prisma.implementationRequest.findFirst({
    where: { referenceCode },
    include: { requestedModules: true },
  });
  if (!req) {
    console.error(`Request not found: ${referenceCode}`);
    process.exit(1);
  }

  const moduleKeys = req.requestedModules.map((m) => m.moduleKey);
  const sectorKey = resolveSectorTemplateKey({
    industry: req.industry,
    moduleKeys,
  });

  console.log(`F11 pipeline (DB-only, no provision): ${referenceCode}`);
  console.log(`  id: ${req.id}`);
  console.log(`  status before: ${req.status}`);
  console.log(`  industry: ${req.industry}`);
  console.log(`  resolved sector: ${sectorKey}`);

  await prisma.implementationRequest.update({
    where: { id: req.id },
    data: { status: "UNDER_DISCOVERY" },
  });

  const profile = await prisma.discoveryProfile.upsert({
    where: { requestId: req.id },
    create: { requestId: req.id, status: "IN_PROGRESS" },
    update: { status: "IN_PROGRESS" },
  });
  console.log(`  discovery profile: ${profile.id}`);

  await prisma.discoveryAnswer.upsert({
    where: {
      profileId_sectionKey_questionKey: {
        profileId: profile.id,
        sectionKey: "org_intelligence",
        questionKey: "sectorTemplateKey",
      },
    },
    create: {
      profileId: profile.id,
      sectionKey: "org_intelligence",
      questionKey: "sectorTemplateKey",
      valueJson: sectorKey,
    },
    update: { valueJson: sectorKey },
  });

  await prisma.discoveryAnswer.upsert({
    where: {
      profileId_sectionKey_questionKey: {
        profileId: profile.id,
        sectionKey: "modules",
        questionKey: "confirmedKeys",
      },
    },
    create: {
      profileId: profile.id,
      sectionKey: "modules",
      questionKey: "confirmedKeys",
      valueJson: moduleKeys,
    },
    update: { valueJson: moduleKeys },
  });

  await prisma.discoveryProfile.update({
    where: { id: profile.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await prisma.implementationRequest.update({
    where: { id: req.id },
    data: { status: "BLUEPRINT_BUILD" },
  });

  const blueprint = await prisma.enterpriseBlueprint.upsert({
    where: { requestId: req.id },
    create: {
      requestId: req.id,
      discoveryProfileId: profile.id,
      status: "DRAFT",
    },
    update: {
      discoveryProfileId: profile.id,
      status: "DRAFT",
    },
  });

  await prisma.blueprintModule.deleteMany({ where: { blueprintId: blueprint.id } });
  if (moduleKeys.length > 0) {
    await prisma.blueprintModule.createMany({
      data: moduleKeys.map((moduleKey) => ({
        blueprintId: blueprint.id,
        moduleKey,
        enabled: true,
      })),
    });
  }

  console.log(`  blueprint id: ${blueprint.id} status ${blueprint.status}`);
  console.log("\nNOTE: Org-intelligence sync skipped (pipeline.service blocked in tsx).");
  console.log("Operator should open discovery/org UI on staging to confirm aviation content.");
  console.log("Tenant provisioning: SKIPPED (F11 policy)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
