/**
 * Generic tenant ERP ops enrichment (idempotent).
 *
 *   npm run db:seed:tenant:ops -- --tenant=meem-global
 *   npm run db:seed:tenant:ops -- --slug=acme-logistics
 *
 * Requires tenant provisioned with enabled modules on blueprint.
 */
import { prisma } from "../src/lib/db";
import { enrichTenantFromBlueprint } from "../src/lib/services/tenant-ops-seed.service";

function parseSlugArg(argv: string[]): string | null {
  for (const arg of argv) {
    if (arg.startsWith("--tenant=")) return arg.slice("--tenant=".length);
    if (arg.startsWith("--slug=")) return arg.slice("--slug=".length);
    if (arg === "--tenant" || arg === "--slug") {
      const i = argv.indexOf(arg);
      if (i >= 0 && argv[i + 1]) return argv[i + 1];
    }
  }
  return null;
}

async function main() {
  const slug = parseSlugArg(process.argv.slice(2));
  if (!slug) {
    console.error("Usage: npm run db:seed:tenant:ops -- --tenant=<slug>");
    process.exit(1);
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });
  if (!tenant) {
    console.error(`Tenant not found: ${slug}`);
    process.exit(1);
  }

  console.log(`Enriching tenant ops: ${slug}…`);
  const result = await enrichTenantFromBlueprint(tenant.id);

  console.log(`Tenant: /${result.tenantSlug}/dashboard`);
  console.log(`Industry pack: ${result.industryKey}`);
  console.log(`Modules: ${result.moduleKeys.join(", ")}`);
  console.log(
    `Samples: ${result.salesOpportunities} sales · ${result.inventoryItems} inventory · ${result.warehouseLocations} warehouse · ${result.financeEntries} finance · ${result.purchaseRequests} procurement · ${result.tasks} tasks`
  );
  console.log(`Logistics CyberCrow audit events seeded: ${result.logisticsAuditEvents}`);
  console.log(`Reports KPIs: /${result.tenantSlug}/reports`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
