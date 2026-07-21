import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const url = process.env.GHURAVIA_DATABASE_URL;
if (!url) {
  console.error("GHURAVIA_DATABASE_URL required for db:validate");
  process.exit(1);
}
const sql = postgres(url);
const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "../../packages/data/drizzle");
for (const name of ["0000_foundation.sql", "0001_activation_runtime.sql"]) {
  await sql.unsafe(await readFile(join(root, name), "utf8"));
}
const tables = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN (
    'activation_aggregates',
    'audit_events',
    'outbox_events',
    'verification_challenges',
    'command_receipts'
  )
`;
if (tables.length < 5) {
  console.error("Missing tables", tables);
  process.exit(1);
}
await sql.end();
console.log("db:validate OK — activation tables present");
