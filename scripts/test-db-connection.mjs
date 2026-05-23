/**
 * Test DATABASE_URL / DIRECT_URL against Supabase (no secrets printed).
 * Usage: npm run db:test
 *        node --env-file=.env.staging scripts/test-db-connection.mjs
 */
import { spawnSync } from "node:child_process";

function hostFromUrl(raw) {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.replace(/^postgresql:/, "postgres:"));
    return `${u.hostname}:${u.port || "5432"}`;
  } catch {
    return "(invalid URL)";
  }
}

const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";

console.log("\n=== Database connection test ===\n");
console.log(`DATABASE_URL host: ${hostFromUrl(databaseUrl)}`);
console.log(`DIRECT_URL host:   ${hostFromUrl(directUrl)}`);

if (!databaseUrl || !directUrl) {
  console.error("\n✗ Set DATABASE_URL and DIRECT_URL (use .env.staging on Vercel).\n");
  process.exit(1);
}

if (/localhost|127\.0\.0\.1/i.test(databaseUrl)) {
  console.error("\n✗ DATABASE_URL is localhost — use Supabase pooler URLs for staging/Vercel.\n");
  process.exit(1);
}

if (databaseUrl.includes(":6543") && !databaseUrl.includes("pgbouncer=true")) {
  console.warn("\n⚠ DATABASE_URL uses port 6543 but missing ?pgbouncer=true — add it for transaction pooler.\n");
}

console.log("\nTesting DIRECT_URL (used by prisma migrate deploy)…\n");

const r = spawnSync(
  "npx",
  ["prisma", "db", "execute", "--url", directUrl, "--stdin"],
  {
    input: "SELECT 1 AS ok;",
    encoding: "utf8",
    shell: true,
    env: process.env,
  }
);

const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
if (r.status === 0) {
  console.log("✓ Database credentials OK — safe to run migrate on Vercel.\n");
  process.exit(0);
}

if (/P1000/i.test(out)) {
  console.error("✗ P1000 Authentication failed — password or username wrong for this Supabase project.\n");
  console.error("Fix:");
  console.error("  1. Supabase Dashboard → your project → Database → Reset database password");
  console.error("  2. Connection string → copy URI for Session (5432) and Transaction (6543)");
  console.error("  3. Paste into Vercel env — do not hand-edit; encode @ in password as %40");
  console.error("  4. Auth keys (NEXT_PUBLIC_SUPABASE_*) must be from the SAME project\n");
  process.exit(1);
}

console.error("✗ Connection failed:\n");
if (out) console.error(out.slice(0, 800));
process.exit(r.status ?? 1);
