/**
 * Bootstrap disposable localhost Postgres for C3 local proof.
 *
 * The init migration is a stub; fresh Docker volumes use schema push + baseline
 * (same pattern as staging runbooks). Refuses Preview/Production targets.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { assertDisposableLocalDatabase } from "./lib/local-database-safety";

const url = process.env.DATABASE_URL;
assertDisposableLocalDatabase(url);

async function countFinishedMigrations(prisma: PrismaClient): Promise<number> {
  try {
    const rows = await prisma.$queryRaw<{ c: number }[]>`
      SELECT count(*)::int AS c
      FROM "_prisma_migrations"
      WHERE finished_at IS NOT NULL
    `;
    return Number(rows[0]?.c ?? 0);
  } catch {
    return 0;
  }
}

async function hasFailedMigration(prisma: PrismaClient): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<{ c: number }[]>`
      SELECT count(*)::int AS c
      FROM "_prisma_migrations"
      WHERE finished_at IS NULL
    `;
    return Number(rows[0]?.c ?? 0) > 0;
  } catch {
    return false;
  }
}

async function hasCoreSchema(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ ok: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'implementation_requests'
    ) AS ok
  `;
  return Boolean(rows[0]?.ok);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const finished = await countFinishedMigrations(prisma);
    const failed = await hasFailedMigration(prisma);
    const schemaReady = await hasCoreSchema(prisma);

    if (failed) {
      throw new Error(
        "Disposable database has a failed migration record. Run: npm run local:db:reset -- --confirm-local-reset"
      );
    }

    if (schemaReady && finished >= 1) {
      console.log(
        `Disposable local database already baselined (${finished} migration(s) recorded). Skipping push.`
      );
      return;
    }

    console.log("Applying schema to disposable local database (prisma db push)...");
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      env: process.env,
    });

    console.log("Recording migration history (baseline from push)...");
    execSync("node scripts/baseline-migrations-from-push.mjs", {
      stdio: "inherit",
      env: process.env,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
