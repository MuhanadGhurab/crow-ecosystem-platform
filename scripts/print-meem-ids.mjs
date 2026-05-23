import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const t = await p.tenant.findUnique({
  where: { slug: "meem-global" },
  select: { slug: true, isActive: true },
});
const r = await p.implementationRequest.findFirst({
  where: { organizationName: { contains: "MEEM" } },
  orderBy: { createdAt: "desc" },
  select: { id: true, referenceCode: true, status: true },
});
const b = r
  ? await p.enterpriseBlueprint.findFirst({
      where: { requestId: r.id },
      select: { id: true },
    })
  : null;

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
console.log("\n=== MEEM live IDs ===\n");
console.log(JSON.stringify({ tenant: t, request: r, blueprint: b }, null, 2));
if (r && b) {
  console.log("\nE2E URLs:\n");
  console.log(`${base}/admin/requests/${r.id}`);
  console.log(`${base}/blueprints/${b.id}/readiness`);
  console.log(`${base}/blueprints/${b.id}/go-live`);
  console.log(`${base}/meem-global/dashboard`);
  console.log(`${base}/admin/audit?category=logistics&tenant=meem-global`);
  console.log("");
}
await p.$disconnect();
