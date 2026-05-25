/**
 * Remove all tenants except meem-global (and optional MEEM pipeline request).
 * Uses .env.staging / DATABASE_URL — run: npm run staging:prune:meem
 */
import { PrismaClient } from "@prisma/client";

const MEEM_TENANT_SLUG = "meem-global";
const MEEM_REFERENCE_CODE = "CROW-2026-MEEM";

const prisma = new PrismaClient();
const keepMeemRequestOnly = !process.argv.includes("--keep-non-meem-requests");

async function deleteTenantScopedEvents(tenantIds) {
  if (!tenantIds.length) return { login: 0, session: 0, access: 0 };
  const r1 = await prisma.loginEvent.deleteMany({ where: { tenantId: { in: tenantIds } } });
  const r2 = await prisma.sessionEvent.deleteMany({ where: { tenantId: { in: tenantIds } } });
  const r3 = await prisma.accessAttempt.deleteMany({ where: { tenantId: { in: tenantIds } } });
  return { login: r1.count, session: r2.count, access: r3.count };
}

async function main() {
  const meem = await prisma.tenant.findUnique({ where: { slug: MEEM_TENANT_SLUG } });
  if (!meem) {
    console.error(`\n✗ Tenant "${MEEM_TENANT_SLUG}" not found. Run: npm run db:seed:meem (with .env.staging)\n`);
    process.exit(1);
  }

  const others = await prisma.tenant.findMany({
    where: { slug: { not: MEEM_TENANT_SLUG } },
    select: { id: true, slug: true },
  });

  console.log(`\n=== Keep MEEM only ===\n`);
  console.log(`Keeping tenant: ${MEEM_TENANT_SLUG} (${meem.id})`);

  if (others.length === 0) {
    console.log("No other tenants to remove.\n");
  } else {
    const ids = others.map((t) => t.id);
    console.log(`Removing ${others.length} tenant(s): ${others.map((t) => t.slug).join(", ")}\n`);

    const events = await deleteTenantScopedEvents(ids);
    console.log(
      `Deleted orphan events — login: ${events.login}, session: ${events.session}, access: ${events.access}`
    );

    const deleted = await prisma.tenant.deleteMany({
      where: { id: { in: ids } },
    });
    console.log(`Deleted tenants: ${deleted.count}`);
  }

  if (keepMeemRequestOnly) {
    const meemRequest = await prisma.implementationRequest.findFirst({
      where: { referenceCode: MEEM_REFERENCE_CODE },
      select: { id: true },
    });
    const otherRequests = await prisma.implementationRequest.findMany({
      where: meemRequest ? { id: { not: meemRequest.id } } : {},
      include: { enterpriseBlueprint: { include: { tenant: true } } },
    });
    let removedRequests = 0;
    for (const req of otherRequests) {
      const tenant = req.enterpriseBlueprint?.tenant;
      if (tenant) {
        await deleteTenantScopedEvents([tenant.id]);
        await prisma.tenant.delete({ where: { id: tenant.id } });
      }
      if (req.enterpriseBlueprint) {
        await prisma.enterpriseBlueprint.delete({ where: { id: req.enterpriseBlueprint.id } });
      }
      await prisma.implementationRequest.delete({ where: { id: req.id } });
      removedRequests += 1;
    }
    console.log(
      `Deleted other implementation requests: ${removedRequests}${
        meemRequest ? ` (kept ${MEEM_REFERENCE_CODE})` : ""
      }`
    );
  }

  const orphanOrgs = await prisma.organization.findMany({
    where: { tenants: { none: {} } },
    select: { id: true },
  });
  if (orphanOrgs.length > 0) {
    const orgDel = await prisma.organization.deleteMany({
      where: { id: { in: orphanOrgs.map((o) => o.id) } },
    });
    console.log(`Deleted orphan organizations: ${orgDel.count}`);
  }

  const remaining = await prisma.tenant.findMany({ select: { slug: true } });
  const reqCount = await prisma.implementationRequest.count();

  console.log(`\n✓ Done. Tenants left: ${remaining.map((t) => t.slug).join(", ") || "(none)"}`);
  console.log(`  Implementation requests: ${reqCount}`);
  console.log(`  MEEM dashboard: http://localhost:3000/${MEEM_TENANT_SLUG}/dashboard\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
