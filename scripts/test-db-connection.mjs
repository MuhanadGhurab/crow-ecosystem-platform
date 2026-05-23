/**
 * Test DATABASE_URL / DIRECT_URL against Supabase (no secrets printed).
 *
 * Usage:
 *   npm run db:test              # fast — DIRECT_URL only (~3–8s)
 *   npm run db:test:full         # both pooler URLs
 *   node --env-file=.env.staging scripts/test-db-connection.mjs --full
 */
import { PrismaClient } from "@prisma/client";

const full = process.argv.includes("--full");

function hostFromUrl(raw) {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.replace(/^postgresql:/, "postgres:"));
    const q = u.searchParams.has("pgbouncer") ? " (pgbouncer)" : "";
    return `${u.hostname}:${u.port || "5432"}${q}`;
  } catch {
    return "(invalid URL)";
  }
}

function projectRefFromUrl(raw) {
  try {
    const u = new URL(raw.replace(/^postgresql:/, "postgres:"));
    const user = decodeURIComponent(u.username || "");
    const m = user.match(/^postgres\.(.+)$/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Cap wait time so a bad host does not hang for minutes. */
function withConnectTimeout(url, seconds = 10) {
  try {
    const u = new URL(url.replace(/^postgresql:/, "postgres:"));
    if (!u.searchParams.has("connect_timeout")) {
      u.searchParams.set("connect_timeout", String(seconds));
    }
    return u.toString().replace(/^postgres:/, "postgresql:");
  } catch {
    return url;
  }
}

function printAuthHelp() {
  console.error("Fix:");
  console.error("  1. Supabase Dashboard -> your project -> Database -> Reset database password");
  console.error("  2. Connection string -> copy URI for Session (5432) and Transaction (6543)");
  console.error("  3. Paste into Vercel env — do not hand-edit; encode @ in password as %40");
  console.error("  4. Auth keys (NEXT_PUBLIC_SUPABASE_*) must be from the SAME project\n");
}

async function ping(url, label) {
  const prisma = new PrismaClient({
    datasources: { db: { url: withConnectTimeout(url) } },
  });
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log(`✓ ${label}: OK (${Date.now() - started}ms)`);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const ms = Date.now() - started;
    if (/P1000|Authentication failed|credentials.*not valid/i.test(msg)) {
      console.error(`✗ ${label}: P1000 Authentication failed (${ms}ms)`);
      return { ok: false, p1000: true, msg };
    }
    console.error(`✗ ${label}: connection failed (${ms}ms)`);
    if (msg) console.error(msg.slice(0, 400));
    return { ok: false, msg };
  } finally {
    await prisma.$disconnect();
  }
}

async function tryDirectHostDiagnostic(directUrl) {
  const ref =
    projectRefFromUrl(directUrl) ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null);
  if (!ref) return;

  let password = "";
  try {
    const u = new URL(directUrl.replace(/^postgresql:/, "postgres:"));
    password = u.password;
  } catch {
    return;
  }
  if (!password) return;

  const enc = encodeURIComponent(password);
  const directHost = `postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`;
  console.log("\nPooler failed — trying direct db host (diagnostic, 10s timeout)…\n");
  const c = await ping(directHost, "Direct host db.<ref>.supabase.co:5432");
  if (c.ok) {
    console.log("  → Password likely OK; fix pooler URLs from Supabase Connect UI.");
  } else if (c.p1000) {
    console.log("  → P1000 on direct host — password does not match this project.");
  }
}

const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";

console.log("\n=== Database connection test ===\n");
console.log(`Mode: ${full ? "full (6543 + 5432)" : "quick (DIRECT_URL / 5432 only) — use npm run db:test:full for both"}`);
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
  console.warn(
    "\n⚠ DATABASE_URL uses port 6543 but missing ?pgbouncer=true — add it for transaction pooler.\n"
  );
}

const tests = full
  ? [
      ["DATABASE_URL (runtime / 6543)", databaseUrl],
      ["DIRECT_URL (migrate / 5432)", directUrl],
    ]
  : [["DIRECT_URL (migrate / 5432)", directUrl]];

console.log("");
let failedP1000 = false;
let anyOk = false;

for (const [label, url] of tests) {
  console.log(`Testing ${label}…`);
  const c = await ping(url, label);
  if (c.ok) anyOk = true;
  else if (c.p1000) failedP1000 = true;
  console.log("");
}

if (failedP1000) {
  console.error("✗ P1000 — password or username wrong for this Supabase project.\n");
  printAuthHelp();
  await tryDirectHostDiagnostic(directUrl);
  process.exit(1);
}

if (!anyOk) {
  await tryDirectHostDiagnostic(directUrl);
  process.exit(1);
}

if (!full) {
  console.log(
    "✓ DIRECT_URL OK — migrate deploy will work. Run npm run db:test:full to also test DATABASE_URL (6543).\n"
  );
} else {
  console.log("✓ Database credentials OK — safe to run migrate on Vercel.\n");
}
