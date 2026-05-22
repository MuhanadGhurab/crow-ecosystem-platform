/**
 * M7 deploy readiness — validates env for Vercel/production (no secrets printed).
 * Usage: npm run deploy:check
 * Optional: DEPLOY_TARGET=vercel npm run deploy:check
 */

function hostFromUrl(raw) {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.replace(/^postgresql:/, "postgres:"));
    const port = u.port ? `:${u.port}` : "";
    const db = u.pathname?.replace(/^\//, "").split("?")[0] || "";
    return `${u.hostname}${port}${db ? `/${db}` : ""}`;
  } catch {
    return null;
  }
}

const isProd = process.env.NODE_ENV === "production";
const authDisabled = process.env.AUTH_DISABLED === "true";
const useMock = process.env.USE_MOCK_DATA === "true";
const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const resend = process.env.RESEND_API_KEY ?? "";
const stripe = process.env.STRIPE_SECRET_KEY ?? "";

const errors = [];
const warnings = [];

console.log("\n=== M7 deploy readiness ===\n");

if (!databaseUrl) errors.push("DATABASE_URL is required");
if (!directUrl) errors.push("DIRECT_URL is required (Prisma migrate on Vercel build)");
if (!supabaseUrl) errors.push("NEXT_PUBLIC_SUPABASE_URL is required");
if (/\/rest\/v1\/?$/i.test(supabaseUrl)) {
  errors.push("NEXT_PUBLIC_SUPABASE_URL must not include /rest/v1/");
}
if (!anonKey) errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
if (!serviceRole) warnings.push("SUPABASE_SERVICE_ROLE_KEY missing (bootstrap scripts will fail)");
if (!siteUrl) warnings.push("NEXT_PUBLIC_SITE_URL missing (OAuth redirects may break)");

if (authDisabled) {
  errors.push("AUTH_DISABLED=true is not allowed for production deploy");
}
if (useMock) {
  errors.push("USE_MOCK_DATA=true is not allowed for production deploy");
}

const dbHost = hostFromUrl(databaseUrl);
const isLocalDb = dbHost && /localhost|127\.0\.0\.1/i.test(dbHost);
const isSupabaseDb = /supabase\.co/i.test(databaseUrl) || /supabase\.co/i.test(directUrl);

if (process.env.DEPLOY_TARGET === "vercel" && isLocalDb) {
  warnings.push("DATABASE_URL points at localhost — use Supabase pooler URLs on Vercel");
}

if (databaseUrl && !databaseUrl.includes("pgbouncer=true") && isSupabaseDb) {
  warnings.push("DATABASE_URL should use transaction pooler (port 6543) with ?pgbouncer=true");
}

if (isProd && authDisabled) {
  errors.push("NODE_ENV=production with AUTH_DISABLED=true is blocked by instrumentation");
}

console.log(`NODE_ENV:              ${process.env.NODE_ENV ?? "(unset)"}`);
console.log(`DATABASE_URL host:     ${dbHost ?? "(not set)"}`);
console.log(`DIRECT_URL host:       ${hostFromUrl(directUrl) ?? "(not set)"}`);
console.log(`Supabase host:         ${hostFromUrl(supabaseUrl.replace(/^https?:/, "postgres:")) ?? "(not set)"}`);
console.log(`NEXT_PUBLIC_SITE_URL:  ${siteUrl || "(not set)"}`);
console.log(`AUTH_DISABLED:         ${authDisabled}`);
console.log(`USE_MOCK_DATA:         ${useMock}`);
console.log(`Resend:                ${resend ? "configured" : "skipped (OK for M7)"}`);
console.log(`Stripe:                ${stripe ? "configured" : "not configured (M8)"}`);

if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}

if (errors.length) {
  console.log("\nBlockers:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("\nSee docs/M7_CLOUD_DEPLOY.md\n");
  process.exit(1);
}

console.log("\n✓ Deploy readiness OK (fix warnings before customer go-live).\n");
console.log("Next: Vercel env → deploy → GET /api/health → optional smoke with SMOKE_CHECK_HEALTH=1\n");
