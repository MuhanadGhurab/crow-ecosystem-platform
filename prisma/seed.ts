import { PrismaClient } from "@prisma/client";
import { SUBSCRIPTION_TIERS } from "../src/lib/constants/subscriptions";

const prisma = new PrismaClient();

const PLANS = SUBSCRIPTION_TIERS.map((t) => ({
  key: t.key,
  nameEn: t.nameEn,
  nameAr: t.nameAr,
  baseMonthlySar: t.baseMonthlySar,
}));

const PERMISSIONS = [
  "cem.dashboard.view",
  "cem.workflows.manage",
  "cem.users.manage",
  "cem.roles.manage",
  "cem.hr.write",
  "cem.crm.write",
  "cem.logistics.view",
  "cem.logistics.manage",
  "cem.sales.view",
  "cem.inventory.view",
  "cem.warehouse.view",
  "cem.finance.view",
  "cem.procurement.view",
  "cybercrow.dashboard.view",
  "cybercrow.audit.view",
  "cybercrow.incidents.manage",
  "sarea.experience.configure",
];

async function main() {
  for (const plan of PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { key: plan.key },
      create: {
        key: plan.key,
        nameEn: plan.nameEn,
        nameAr: plan.nameAr,
        baseMonthlySar: plan.baseMonthlySar,
        descriptionEn: `${plan.nameEn} tier for Crow Ecosystem`,
        isActive: true,
      },
      update: {
        baseMonthlySar: plan.baseMonthlySar,
        nameEn: plan.nameEn,
        nameAr: plan.nameAr,
      },
    });
  }

  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      create: { key },
      update: {},
    });
  }

  console.log("Seeded subscription plans and permissions");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
