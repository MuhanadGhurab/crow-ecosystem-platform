/**
 * C3.10R — Verify hosted backend parity for Production-class runtime configuration.
 * Run: npm run c3-production-backend-parity:verify
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import {
  assertAppDatabaseEnvironmentAlignment,
  assertDatabaseFingerprintMatches,
  assertDirectDatabaseFingerprintMatches,
  collectDatabaseEnvironmentWarnings,
  resolveAppEnvironment,
  resolveDatabaseEnvironment,
} from "./lib/database-environment";
import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";

const RUNTIME_ENV = join(process.cwd(), ".env.production.runtime");

function loadRuntimeEnvOverride(): void {
  const content = readFileSync(RUNTIME_ENV, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadRuntimeEnvOverride();

const EXPECTED_SUPABASE_REF = "wbwnsndcxrgyqwppurms";
const EXPECTED_POOLER_FP = "b7f801cfe5e30009";
const EXPECTED_DIRECT_FP = "0355c17692e2a90d";

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  console.error(`  ✗ ${msg}`);
  process.exit(1);
}

async function main() {
  console.log("\n=== C3.10R Production backend parity ===\n");

  const appEnv = resolveAppEnvironment();
  const dbEnv = resolveDatabaseEnvironment();
  console.log(`  appEnvironment: ${appEnv}`);
  console.log(`  databaseEnvironment: ${dbEnv ?? "(unset)"}`);

  if (!dbEnv) fail("DATABASE_ENVIRONMENT is not set");
  if (appEnv === "production" && dbEnv !== "production") {
    fail(`Production app paired with DATABASE_ENVIRONMENT=${dbEnv}`);
  }

  try {
    assertAppDatabaseEnvironmentAlignment({ allowSharedProductionBackend: true });
    ok("App/database environment alignment");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  const directUrl = process.env.DIRECT_URL?.trim();
  if (!databaseUrl) fail("DATABASE_URL is not set");
  if (!directUrl) fail("DIRECT_URL is not set");

  const poolerFp = fingerprintDatabaseUrl(databaseUrl);
  const directFp = fingerprintDatabaseUrl(directUrl);

  console.log(`  runtimeTarget: ${maskDatabaseTarget(databaseUrl)}`);
  console.log(`  directTarget: ${maskDatabaseTarget(directUrl)}`);

  if (poolerFp.supabaseProjectRef !== EXPECTED_SUPABASE_REF) {
    fail(`Supabase project ref mismatch on DATABASE_URL`);
  }
  ok(`Supabase project ref ${EXPECTED_SUPABASE_REF.slice(0, 4)}…`);

  if (poolerFp.targetHash !== EXPECTED_POOLER_FP) {
    fail(`Pooler fingerprint ${poolerFp.targetHash} != expected ${EXPECTED_POOLER_FP}`);
  }
  ok(`Runtime pooler fingerprint ${EXPECTED_POOLER_FP}`);

  if (directFp.targetHash !== EXPECTED_DIRECT_FP) {
    fail(`Direct fingerprint ${directFp.targetHash} != expected ${EXPECTED_DIRECT_FP}`);
  }
  ok(`Direct fingerprint ${EXPECTED_DIRECT_FP}`);

  try {
    assertDatabaseFingerprintMatches();
    ok("EXPECTED_DATABASE_FINGERPRINT matches DATABASE_URL");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  try {
    assertDirectDatabaseFingerprintMatches();
    ok("EXPECTED_DIRECT_DATABASE_FINGERPRINT matches DIRECT_URL");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) fail("Supabase public URL or service role key missing");

  const supabaseRef =
    supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1] ?? null;
  if (supabaseRef !== EXPECTED_SUPABASE_REF) {
    fail("NEXT_PUBLIC_SUPABASE_URL project ref mismatch");
  }
  ok("Browser/server Supabase project ref aligned");

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: adminError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (adminError) fail(`Supabase admin client unreachable (${adminError.message})`);
  ok("Supabase admin verifier client reachable");

  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    ok("Prisma runtime client reachable");

    const migrationCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations" WHERE finished_at IS NOT NULL
    `;
    if (Number(migrationCount[0]?.count ?? 0) < 1) fail("Migration history missing");
    ok("Prisma migration history readable");
  } finally {
    await prisma.$disconnect();
  }

  const warnings = collectDatabaseEnvironmentWarnings();
  if (warnings.length > 0) {
    for (const w of warnings) {
      console.log(`  ⚠ ${w.code}: ${w.message}`);
    }
    fail("Database environment warnings present");
  }

  console.log(
    "\nPASS — PRODUCTION CALLBACK, RESOLVER, LEGAL ACTION, PRISMA AND VERIFIERS TARGET THE SAME HOSTED BACKEND\n"
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
