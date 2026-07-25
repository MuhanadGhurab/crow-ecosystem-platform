/**
 * Apply Drizzle SQL migrations to a verified non-production Preview database.
 * Does not use local-only loadConfig — caller must supply GHURAVIA_DATABASE_URL
 * pointing at the dedicated Preview project/database.
 */
import postgres from "postgres";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  assertControlledPreviewDatabase,
  FORBIDDEN_DATABASE_FINGERPRINTS,
  fingerprintDatabaseUrl,
} from "@ghuravia/config";

const url = process.env.GHURAVIA_DATABASE_URL;
const previewRef = process.env.GHURAVIA_PREVIEW_PROJECT_REF;
if (!url || !previewRef) {
  console.error(
    "Require GHURAVIA_DATABASE_URL and GHURAVIA_PREVIEW_PROJECT_REF",
  );
  process.exit(1);
}

const fp = fingerprintDatabaseUrl(url);
const hay = `${fp.host} ${fp.username} ${fp.database}`.toLowerCase();
for (const forbidden of FORBIDDEN_DATABASE_FINGERPRINTS) {
  if (hay.includes(forbidden.toLowerCase())) {
    console.error("Refusing migration: forbidden Production fingerprint");
    process.exit(1);
  }
}
assertControlledPreviewDatabase(url, previewRef);
console.log(
  "Migrating Preview target",
  JSON.stringify({
    host: fp.host,
    database: fp.database,
    usernamePrefix: fp.username.split(".")[0],
    previewRef,
  }),
);

const sql = postgres(url, { ssl: "require", max: 1 });
const dir = dirname(fileURLToPath(import.meta.url));
const migrations = [
  "0000_foundation.sql",
  "0001_activation_runtime.sql",
  "0002_onboarding_personalization_origin.sql",
  "0003_nest_readiness.sql",
  "0004_living_mission.sql",
];
try {
  for (const name of migrations) {
    const path = join(dir, "../../packages/data/drizzle", name);
    await sql.unsafe(await readFile(path, "utf8"));
    console.log("Applied", name);
  }
  console.log("Preview migration complete");
} finally {
  await sql.end({ timeout: 5 });
}
