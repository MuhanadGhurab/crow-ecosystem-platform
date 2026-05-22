import { prisma } from "../src/lib/db";
import {
  seedCybercrowBaseline,
  seedCybercrowEvidenceIfMissing,
} from "../src/lib/services/cybercrow-seed.service";

async function main() {
  const slug = process.env.TENANT_SLUG;
  const tenants = slug
    ? await prisma.tenant.findMany({ where: { slug } })
    : await prisma.tenant.findMany();

  for (const t of tenants) {
    const result = await seedCybercrowBaseline(t.id);
    await seedCybercrowEvidenceIfMissing(t.id);
    console.log(`/${t.slug}:`, result.skipped ? "skipped (evidence checked)" : "seeded");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
