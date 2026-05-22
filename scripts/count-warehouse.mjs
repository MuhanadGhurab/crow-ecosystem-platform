import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const t = await prisma.tenant.findFirst({ where: { slug: "meem-global" } });
const n = t
  ? await prisma.tenantWarehouseLocation.count({ where: { tenantId: t.id } })
  : -1;
console.log("TenantWarehouseLocation count:", n);
await prisma.$disconnect();
