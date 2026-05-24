/**
 * Staging / Vercel go-live readiness (no secrets printed).
 * Usage: npm run staging:ready
 *        node --env-file=.env.staging scripts/staging-ready.mjs
 */
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const blockers = [];
const warnings = [];
const ok = [];

function run(label, cmd, args, env = process.env) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: true, env, stdio: "pipe" });
  if (r.status === 0) {
    ok.push(label);
    return true;
  }
  blockers.push(`${label} failed (exit ${r.status ?? 1})`);
  const tail = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n").slice(-3).join("\n");
  if (tail) blockers.push(`  ${tail}`);
  return false;
}

console.log("\n=== Staging readiness ===\n");

run("db:test:full", "node", ["--env-file=.env.staging", "scripts/test-db-connection.mjs", "--full"]);
run("validate:vercel-env", "node", ["--env-file=.env.staging", "scripts/validate-vercel-env.mjs"]);
run("deploy:check:staging", "node", ["--env-file=.env.staging", "scripts/deploy-readiness.mjs"]);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DIRECT_URL ??
        process.env.DATABASE_URL ??
        "",
    },
  },
});

try {
  const mig = await prisma.$queryRaw`
    SELECT count(*)::int AS c
    FROM "_prisma_migrations"
    WHERE finished_at IS NOT NULL
  `;
  const applied = Number(mig[0]?.c ?? 0);
  if (applied >= 9) ok.push(`migrations applied (${applied})`);
  else blockers.push(`migrations: only ${applied}/9 applied — run db push + baseline on staging`);

  const tables = await prisma.$queryRaw`
    SELECT count(*)::bigint AS c
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `;
  const tableCount = Number(tables[0]?.c ?? 0);
  if (tableCount >= 50) ok.push(`schema tables (${tableCount})`);
  else blockers.push(`schema: only ${tableCount} public tables — seed staging DB`);

  const meem = await prisma.tenant.findUnique({
    where: { slug: "meem-global" },
    select: { slug: true, isActive: true },
  });
  if (meem?.isActive) ok.push("MEEM tenant meem-global active");
  else blockers.push("MEEM tenant missing — npm run db:seed:meem (with staging env)");
} catch (e) {
  blockers.push(`database check: ${e instanceof Error ? e.message : String(e)}`);
} finally {
  await prisma.$disconnect();
}

if (!siteUrl || siteUrl.includes("your-app.vercel.app")) {
  warnings.push("NEXT_PUBLIC_SITE_URL is placeholder — set http://localhost:3000 for local staging");
} else {
  ok.push(`SITE_URL configured (${siteUrl})`);
  const isLocal = /localhost|127\.0\.0\.1/i.test(siteUrl);
  try {
    const healthUrl = `${siteUrl}/api/health`;
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(20_000) });
    if (res.ok) {
      const body = await res.json();
      if (body.deployReady && body.db === "ok") {
        ok.push(isLocal ? "localhost /api/health deployReady" : "remote /api/health deployReady");
      } else warnings.push(`/api/health returned but not deployReady: ${JSON.stringify(body)}`);
    } else {
      warnings.push(
        isLocal
          ? `localhost /api/health HTTP ${res.status} — run npm run staging:local`
          : `/api/health HTTP ${res.status} — confirm deploy succeeded`
      );
    }
  } catch {
    warnings.push(
      isLocal
        ? `Cannot reach ${siteUrl}/api/health — run npm run staging:local in another terminal`
        : `Cannot reach ${siteUrl}/api/health — check host or use LOCAL_STAGING.md`
    );
  }
}

console.log("Passed:");
ok.forEach((line) => console.log(`  ✓ ${line}`));

if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}

if (blockers.length) {
  console.log("\nBlockers:");
  blockers.forEach((b) => console.log(`  ✗ ${b}`));
  console.log("\nSee docs/internal/P2_STAGING_PREP.md\n");
  process.exit(1);
}

const base = siteUrl && !siteUrl.includes("your-app") ? siteUrl : "https://YOUR-VERCEL-URL";
console.log("\n✓ Staging backend is ready.\n");
console.log("Local: npm run staging:local  →  npm run staging:runbook");
console.log(`  Health:  ${base}/api/health`);
console.log(`  Login:   ${base}/login`);
console.log(`  MEEM:    ${base}/meem-global/dashboard`);
console.log(`  Admin:   mkkaweg4mer@gmail.com (platform_admin)\n`);
console.log("Supabase Auth → URL config: Site URL + /auth/callback on same domain.\n");
