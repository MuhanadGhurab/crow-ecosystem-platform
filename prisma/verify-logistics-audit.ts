import { prisma } from "../src/lib/db";
import {
  CYBERCROW_AUDIT_ACTIONS,
  LOGISTICS_AUDIT_ACTIONS,
} from "../src/lib/constants/cybercrow-audit-events";

async function main() {
  const tenant = await prisma.tenant.findUnique({ where: { slug: "meem-global" } });
  if (!tenant) {
    console.error("meem-global not found");
    process.exit(1);
  }
  const init = await prisma.cybercrowAuditLog.findFirst({
    where: { tenantId: tenant.id, action: CYBERCROW_AUDIT_ACTIONS.CYBERCROW_INITIALIZED },
  });
  const logistics = await prisma.cybercrowAuditLog.count({
    where: { tenantId: tenant.id, action: { in: [...LOGISTICS_AUDIT_ACTIONS] } },
  });
  const security = await prisma.securityEvent.count({
    where: {
      tenantId: tenant.id,
      eventType: { in: ["ROUTE_ANOMALY_DETECTED", "DISPATCH_SLA_BREACH"] },
    },
  });
  const samples = await prisma.cybercrowAuditLog.findMany({
    where: { tenantId: tenant.id, entityId: { startsWith: "seed:logistics:" } },
    select: { action: true, entityId: true },
  });
  console.log({
    cybercrowInit: Boolean(init),
    logisticsAudit: logistics,
    logisticsSecurity: security,
    seedRows: samples,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
