import { assertDestructiveLocalOperation, loadConfig } from "@ghuravia/config";
import postgres from "postgres";
const c = loadConfig();
assertDestructiveLocalOperation(c);
const sql = postgres(c.GHURAVIA_DATABASE_URL);
await sql.unsafe(`
DROP TABLE IF EXISTS command_receipts CASCADE;
DROP TABLE IF EXISTS verification_challenges CASCADE;
DROP TABLE IF EXISTS outbox_events CASCADE;
DROP TABLE IF EXISTS audit_events CASCADE;
DROP TABLE IF EXISTS activation_aggregates CASCADE;
`);
await sql.end();
console.log("Local database reset");
