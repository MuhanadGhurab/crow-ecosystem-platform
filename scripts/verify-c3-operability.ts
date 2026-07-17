/**
 * C3 Operability & UX Gate — static wiring + optional local DB privilege checks.
 * Run: npm run c3-operability:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertDisposableLocalDatabase,
  classifyDisposableLocalDatabase,
} from "./lib/local-database-safety";

const ROOT = process.cwd();

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function check(cond: boolean, passMsg: string, failMsg: string): boolean {
  if (cond) {
    ok(passMsg);
    return true;
  }
  fail(failMsg);
  return false;
}

async function verifyLeastPrivilegeOnLocalDb(): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    ok("Skipping DB privilege probe (DATABASE_URL unset)");
    return true;
  }

  try {
    assertDisposableLocalDatabase(url);
  } catch (err) {
    ok(
      `Skipping DB privilege probe (${err instanceof Error ? err.message.split("\n")[0] : "not disposable local"})`
    );
    return true;
  }

  const proof = classifyDisposableLocalDatabase(url);
  ok(`Disposable DB proof: ${proof.maskedTarget}`);

  if (process.env.ACCOUNT_REGISTRATION_ENABLED !== "true") {
    ok("Skipping DB privilege probe (ACCOUNT_REGISTRATION_ENABLED !== true)");
    return true;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  let passed = true;

  try {
    const activeAccounts = await prisma.platformAccount.findMany({
      where: { status: "ACTIVE" },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, supabaseUserId: true, email: true },
    });

    for (const account of activeAccounts) {
      const memberships = await prisma.tenantMembership.count({
        where: { supabaseUserId: account.supabaseUserId },
      });
      passed =
        check(
          memberships === 0,
          `ACTIVE account ${account.email} has no tenant membership`,
          `ACTIVE account ${account.email} has unexpected tenant membership`
        ) && passed;
    }

    if (activeAccounts.length === 0) {
      ok("No ACTIVE platform accounts in local DB (privilege probe N/A until journey run)");
    }
  } finally {
    await prisma.$disconnect();
  }

  return passed;
}

async function main() {
  let passed = true;
  const gate = (cond: boolean, passMsg: string, failMsg: string) => {
    if (!check(cond, passMsg, failMsg)) passed = false;
  };

  console.log("\n=== C3 Operability & UX Gate ===\n");

  const pkg = fileText("package.json");
  gate(pkg.includes('"c3-operability:verify"'), "package.json defines c3-operability:verify", "Add c3-operability:verify script");
  gate(pkg.includes('"local:services:up"'), "package.json defines local:services:up", "Add local:services:up script");
  gate(existsSync(join(ROOT, "docker-compose.local.yml")), "docker-compose.local.yml exists", "Missing docker-compose.local.yml");
  gate(existsSync(join(ROOT, ".env.local.example")), ".env.local.example exists", "Missing .env.local.example");

  gate(
    fileText("src/lib/auth/local-auth-mode.ts").includes("isRealLocalAuthMode"),
    "local-auth-mode helper exists",
    "Missing isRealLocalAuthMode"
  );
  gate(
    fileText("src/lib/email/mailpit-email-delivery.adapter.ts").includes("MailpitEmailDeliveryAdapter"),
    "Mailpit email adapter exists",
    "Missing Mailpit adapter"
  );
  gate(
    fileText("src/lib/auth/public-auth-paths.ts").includes("isStartupLoaderBypassPath"),
    "Startup loader uses dedicated bypass list",
    "public-auth-paths must export isStartupLoaderBypassPath"
  );
  gate(
    fileText("src/lib/auth/public-auth-paths.ts").includes("isAuthEntryPath") &&
      fileText("src/lib/auth/public-auth-paths.ts").includes("isProtectedSelfServicePath"),
    "Auth path concepts split (entry vs protected self-service)",
    "public-auth-paths must split entry and protected self-service paths"
  );
  gate(
    !fileText("src/lib/auth/public-auth-paths.ts").includes('"/account"') ||
      fileText("src/lib/auth/public-auth-paths.ts").includes("PROTECTED_SELF_SERVICE"),
    "/account classified as protected self-service (not public auth entry)",
    "document /account under PROTECTED_SELF_SERVICE_PREFIXES"
  );
  gate(
    existsSync(join(ROOT, "src/app/account/requests/page.tsx")),
    "/account/requests page exists",
    "Add src/app/account/requests/page.tsx"
  );
  gate(
    fileText("scripts/capture-c3-operability-screenshots.mjs").includes("c3-operability"),
    "Operability screenshot capture script exists",
    "Add scripts/capture-c3-operability-screenshots.mjs"
  );

  const envExample = fileText(".env.local.example");
  gate(envExample.includes("AUTH_DISABLED=false"), ".env.local.example uses real auth", "Set AUTH_DISABLED=false in example");
  gate(envExample.includes("LOCAL_EMAIL_PROVIDER=mailpit"), ".env.local.example uses Mailpit", "Set LOCAL_EMAIL_PROVIDER=mailpit");

  passed = (await verifyLeastPrivilegeOnLocalDb()) && passed;

  console.log(passed ? "\nc3-operability:verify PASSED\n" : "\nc3-operability:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
