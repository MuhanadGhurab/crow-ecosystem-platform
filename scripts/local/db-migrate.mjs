import { loadConfig } from "@ghuravia/config";
import postgres from "postgres";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const c = loadConfig();
const sql = postgres(c.GHURAVIA_DATABASE_URL);
const dir = dirname(fileURLToPath(import.meta.url));
const migrations = [
  "0000_foundation.sql",
  "0001_activation_runtime.sql",
  "0002_onboarding_personalization_origin.sql",
];
for (const name of migrations) {
  const path = join(dir, "../../packages/data/drizzle", name);
  await sql.unsafe(await readFile(path, "utf8"));
  console.log("Applied", name);
}
await sql.end();
console.log("Local migration complete");
