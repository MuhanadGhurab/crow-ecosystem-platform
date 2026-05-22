/**
 * M8 — Provision a non-MEEM tenant from CLI (staging / second customer).
 *
 *   npx tsx --env-file=.env scripts/onboard-tenant-from-blueprint.ts \
 *     --slug=acme-logistics \
 *     --name="ACME Logistics" \
 *     --industry=logistics \
 *     --modules=sales,logistics,warehouse,inventory,finance
 */
import { PrismaClient } from "@prisma/client";

import { createImplementationRequest } from "../src/lib/services/implementation-request.service";
import {
  completeDiscoveryAndCreateBlueprint,
  provisionAndInitializeTenant,
  startDiscovery,
} from "../src/lib/services/pipeline.service";
import { upsertDiscoveryAnswer } from "../src/lib/services/discovery.service";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (key: string) => {
    const hit = args.find((a) => a.startsWith(`--${key}=`));
    return hit?.split("=").slice(1).join("=")?.trim();
  };
  const slug = get("slug");
  const name = get("name");
  const industry = get("industry") ?? "logistics";
  const modulesRaw = get("modules") ?? "sales,logistics,crm";
  const moduleKeys = modulesRaw.split(",").map((m) => m.trim()).filter(Boolean);
  if (!slug || !name) {
    console.error(
      "Usage: --slug=<tenant-slug> --name=\"Org Name\" [--industry=logistics] [--modules=sales,logistics,...]"
    );
    process.exit(1);
  }
  return { slug, name, industry, moduleKeys };
}

async function main() {
  const { slug, name, industry, moduleKeys } = parseArgs();

  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    console.log(`Tenant /${slug}/ already exists (${existing.id}).`);
    console.log(`  Dashboard: /${slug}/dashboard`);
    return;
  }

  console.log(`Onboarding ${name} → /${slug}/ …`);

  const request = await createImplementationRequest({
    organizationName: name,
    industry,
    employeeBand: "51-200",
    countryCode: "SA",
    planKey: "growth",
    moduleKeys,
    securityPackageKeys: ["crow_shield"],
    contact: {
      fullName: "Tenant Admin",
      email: `admin+${slug}@customer.demo`,
      jobTitle: "IT Director",
    },
    notes: `M8 CLI onboard — ${slug}`,
  });

  await startDiscovery(request.id);
  await upsertDiscoveryAnswer(request.id, "modules", "confirmedKeys", moduleKeys);
  await upsertDiscoveryAnswer(request.id, "organization", "employeeBand", "51-200");

  const blueprint = await completeDiscoveryAndCreateBlueprint(request.id);

  const tenant = await provisionAndInitializeTenant(
    blueprint.id,
    slug,
    name,
    "growth",
    ["manager", "frontline"]
  );

  console.log(`Done.`);
  console.log(`  Request:   /admin/requests/${request.id}`);
  console.log(`  Blueprint: /blueprints/${blueprint.id}/overview`);
  console.log(`  Tenant:    /${tenant.slug}/dashboard`);
  console.log(`  Modules:   ${moduleKeys.join(", ")}`);
  console.log(`\nGrant access: USER_EMAIL=... TENANT_SLUG=${slug} npm run auth:grant-tenant`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
