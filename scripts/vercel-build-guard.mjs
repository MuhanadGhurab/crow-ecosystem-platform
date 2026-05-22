/**
 * Fail Vercel/CI builds early if DATABASE_URL points at localhost.
 * Usage: prepended to vercel.json buildCommand
 */
const url = process.env.DATABASE_URL ?? "";

if (!url.trim()) {
  console.error("\n✗ Vercel build: DATABASE_URL is not set.");
  console.error("  Add Supabase pooler URLs in Vercel → Settings → Environment Variables.");
  console.error("  See docs/VERCEL_CONNECT.md\n");
  process.exit(1);
}

if (/localhost|127\.0\.0\.1/i.test(url)) {
  console.error("\n✗ Vercel build: DATABASE_URL points at localhost — Vercel cannot reach your PC.");
  console.error("  Replace on Vercel (Production):");
  console.error("    DATABASE_URL → Supabase Transaction pooler (port 6543, ?pgbouncer=true)");
  console.error("    DIRECT_URL     → Supabase Session pooler (port 5432)");
  console.error("  Dashboard: Supabase → Project Settings → Database → Connection string");
  console.error("  See docs/VERCEL_CONNECT.md § Step 1\n");
  process.exit(1);
}

console.log("✓ Vercel build guard: DATABASE_URL is a remote host");
