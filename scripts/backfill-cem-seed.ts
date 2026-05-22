/**
 * Seed CEM identity for existing tenants that have no departments yet.
 * Usage: npm run cem:backfill-seed
 */
import { prisma } from "../src/lib/db";
import { seedTenantCemFromDiscovery } from "../src/lib/services/tenant-cem-seed.service";

async function main() {
  const tenants = await prisma.tenant.findMany({
    include: { blueprint: { select: { discoveryProfileId: true } } },
  });

  let seeded = 0;
  let skipped = 0;

  for (const t of tenants) {
    if (!t.blueprint?.discoveryProfileId) {
      skipped++;
      continue;
    }
    const result = await seedTenantCemFromDiscovery(t.id, t.blueprint.discoveryProfileId);
    if (result.skipped) skipped++;
    else seeded++;
    console.log(`${t.slug}: ${result.skipped ? "skipped" : "seeded"}`);
  }

  console.log(`\nDone. Seeded ${seeded}, skipped ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
