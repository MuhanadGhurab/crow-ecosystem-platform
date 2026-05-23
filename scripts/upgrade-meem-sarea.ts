/**
 * Upgrade logistics SAREA profiles (MEEM names, hub-manager/dispatcher maps, logistics widgets).
 * Usage: npm run sarea:meem-upgrade
 * Optional: TENANT_SLUG=meem-global npm run sarea:meem-upgrade
 */

import { prisma } from "../src/lib/db";
import { upgradeLogisticsSareaForTenant } from "../src/lib/services/sarea-seed.service";

async function main() {
  const slug = process.env.TENANT_SLUG ?? "meem-global";
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    console.error(`Tenant not found: ${slug}`);
    process.exit(1);
  }

  const result = await upgradeLogisticsSareaForTenant(tenant.id);
  console.log(`Upgraded SAREA for /${slug}: ${result.profiles} profile(s), ${result.updates} change(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
