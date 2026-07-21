import { loadConfig } from "@ghuravia/config";
import postgres from "postgres";
import { readFile } from "node:fs/promises";
const c = loadConfig();
const sql = postgres(c.GHURAVIA_DATABASE_URL);
await sql.unsafe(
  await readFile(
    new URL("../../packages/data/drizzle/0000_foundation.sql", import.meta.url),
    "utf8",
  ),
);
await sql.end();
console.log("Local migration applied");
