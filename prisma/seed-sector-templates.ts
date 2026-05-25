/**
 * Seed sector templates into Postgres (idempotent).
 * Run: npm run db:seed:sectors
 */
import { PrismaClient } from "@prisma/client";
import {
  SECTOR_TEMPLATE_CATALOG,
  SECTOR_TEMPLATE_KEYS,
} from "../src/lib/org-intelligence/sector-template-data";

const prisma = new PrismaClient();

async function main() {
  for (const key of SECTOR_TEMPLATE_KEYS) {
    const model = SECTOR_TEMPLATE_CATALOG[key];
    await prisma.sectorTemplate.upsert({
      where: { key },
      create: {
        key,
        name: model.sectorName,
        description: `Crow Intelligence sector template — ${model.industry}`,
        industry: model.industry,
        maturityLevel: model.maturityLevel,
        isActive: true,
        configJson: model as object,
      },
      update: {
        name: model.sectorName,
        description: `Crow Intelligence sector template — ${model.industry}`,
        industry: model.industry,
        maturityLevel: model.maturityLevel,
        isActive: true,
        configJson: model as object,
      },
    });
    console.log(`✓ sector template: ${key}`);
  }
  console.log(`\nSeeded ${SECTOR_TEMPLATE_KEYS.length} sector templates.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
