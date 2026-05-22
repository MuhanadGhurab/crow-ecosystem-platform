/**
 * Backfill SAREA child records (layouts, widgets, etc.) for profiles missing them.
 * Usage: npm run sarea:backfill-seed
 * Optional: TENANT_SLUG=my-tenant npm run sarea:backfill-seed
 */

import { prisma } from "../src/lib/db";
import { backfillSareaProfileDefaults } from "../src/lib/services/sarea-seed.service";

async function main() {
  const slug = process.env.TENANT_SLUG;
  let tenantId: string | undefined;

  if (slug) {
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) {
      console.error(`Tenant not found: ${slug}`);
      process.exit(1);
    }
    tenantId = tenant.id;
    console.log(`Backfilling SAREA for tenant /${slug}`);
  }

  const result = await backfillSareaProfileDefaults(tenantId);
  console.log(`Seeded ${result.seeded} profile(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
