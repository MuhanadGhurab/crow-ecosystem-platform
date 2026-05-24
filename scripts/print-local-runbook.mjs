/**
 * Print localhost MEEM E2E + Omar sign-off URLs (uses .env.staging DB).
 * Usage: npm run staging:runbook
 */
import { PrismaClient } from "@prisma/client";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "" },
  },
});

try {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "meem-global" },
    select: { slug: true, isActive: true },
  });
  const request = await prisma.implementationRequest.findFirst({
    where: { referenceCode: "CROW-2026-MEEM" },
    select: { id: true, status: true },
    orderBy: { createdAt: "desc" },
  });
  const blueprint = request
    ? await prisma.enterpriseBlueprint.findFirst({
        where: { requestId: request.id },
        select: { id: true },
      })
    : null;

  const rid = request?.id ?? "(run db:seed:meem)";
  const bid = blueprint?.id ?? "(run db:seed:meem)";

  console.log("\n=== Local staging runbook ===\n");
  console.log(`Base:   ${BASE}`);
  console.log(`Tenant: ${tenant?.slug ?? "missing"} ${tenant?.isActive ? "(active)" : ""}`);
  console.log(`Request: ${rid} · ${request?.status ?? "—"}`);
  console.log(`Blueprint: ${bid}\n`);

  console.log("Start:  npm run staging:local");
  console.log(`Login:  ${BASE}/login\n`);

  console.log("--- Muhanad E2E ---");
  for (const [label, path] of [
    ["Admin request", `/admin/requests/${rid}`],
    ["Discovery org", `/discovery/${rid}/organization`],
    ["Discovery experience", `/discovery/${rid}/experience`],
    ["Blueprint pricing", `/blueprints/${bid}/pricing`],
    ["Blueprint SAREA", `/blueprints/${bid}/sarea`],
    ["Readiness", `/blueprints/${bid}/readiness`],
    ["Go-live", `/blueprints/${bid}/go-live`],
    ["MEEM dashboard", `/meem-global/dashboard`],
    ["CyberCrow", `/meem-global/cybercrow/dashboard`],
    ["Logistics", `/meem-global/logistics`],
    ["Workflows", `/meem-global/workflows`],
    ["Admin audit", `/admin/audit?category=logistics&tenant=meem-global`],
  ]) {
    console.log(`  ${label.padEnd(22)} ${BASE}${path}`);
  }

  console.log("\n--- Omar sign-off (5 steps) ---");
  for (const [label, path] of [
    ["1 Experience", `/discovery/${rid}/experience`],
    ["2 Blueprint SAREA", `/blueprints/${bid}/sarea`],
    ["3 SAREA preview", `/sarea/preview`],
    ["4 Personas", `/meem-global/dashboard`],
    ["5 Doc", "docs/internal/customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md"],
  ]) {
    console.log(`  ${label.padEnd(18)} ${path.startsWith("docs") ? path : BASE + path}`);
  }

  console.log("\nSupabase Auth allowlist: http://localhost:3000/auth/callback");
  console.log("Docs: docs/internal/LOCAL_STAGING.md\n");
} finally {
  await prisma.$disconnect();
}
