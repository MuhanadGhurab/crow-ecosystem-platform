/**
 * Reset disposable C3 Docker Postgres volume and re-apply migrations.
 * Usage: npm run local:db:reset -- --confirm-local-reset
 */
import { execSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import {
  assertDisposableLocalDatabase,
  requireExplicitLocalResetConfirmation,
} from "./lib/local-database-safety";

requireExplicitLocalResetConfirmation(process.argv.slice(2));

const url = process.env.DATABASE_URL;
assertDisposableLocalDatabase(url);

async function waitForPostgresReady(maxAttempts = 30, delayMs = 2000) {
  console.log("Waiting for Postgres health...");
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      execSync(
        "docker compose -f docker-compose.local.yml exec -T postgres pg_isready -U crow -d crow_ecosystem",
        { stdio: "pipe" }
      );
      console.log("Postgres is ready.");
      return;
    } catch {
      if (attempt === maxAttempts) {
        throw new Error("Postgres did not become ready in time.");
      }
      await sleep(delayMs);
    }
  }
}

async function main() {
  console.log("Stopping C3 local stack and removing Postgres volume...");
  execSync("docker compose -f docker-compose.local.yml down -v", {
    stdio: "inherit",
  });

  console.log("Starting fresh C3 local stack...");
  execSync("docker compose -f docker-compose.local.yml up -d", {
    stdio: "inherit",
  });

  await waitForPostgresReady();

  execSync("npx tsx --env-file=.env.local scripts/run-local-disposable-migrate.ts", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("Seeding legal documents and local fixtures...");
  execSync("npx tsx --env-file=.env.local prisma/seed.ts", {
    stdio: "inherit",
    env: { ...process.env, SEED_LEGAL_DOCUMENTS: "true" },
  });

  console.log("\nlocal:db:reset complete.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
