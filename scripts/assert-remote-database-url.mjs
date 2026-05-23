/**
 * Block cloud builds (Vercel/CI) from using localhost DATABASE_URL.
 * Import at top of migrate-deploy.mjs and vercel-build-guard.mjs.
 */
const url = process.env.DATABASE_URL ?? "";
const onCloud = process.env.VERCEL === "1" || process.env.CI === "true";

if (onCloud) {
  if (!url.trim()) {
    console.error("\n✗ Cloud build: DATABASE_URL is not set.");
    console.error("  Vercel → Settings → Environment Variables → Production");
    console.error("  Copy from .env.staging (Supabase pooler URLs, not localhost)\n");
    process.exit(1);
  }

  if (/localhost|127\.0\.0\.1/i.test(url)) {
    console.error("\n✗ Cloud build: DATABASE_URL points at localhost — Vercel cannot reach your PC.");
    console.error("  You pasted your local dev URL into Vercel. Replace with Supabase pooler URLs:");
    console.error("    DATABASE_URL → port 6543 + ?pgbouncer=true");
    console.error("    DIRECT_URL     → port 5432 (no pgbouncer param)");
    console.error("  See docs/internal/VERCEL_CONNECT.md\n");
    process.exit(1);
  }
}
