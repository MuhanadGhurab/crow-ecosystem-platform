/**
 * Print non-secret env hints for hybrid local DB + Supabase Auth setup.
 * Usage: npm run env:check  (loads .env via node --env-file)
 */

function hostFromDatabaseUrl(raw) {
  if (!raw?.trim()) return "(not set)";
  try {
    const u = new URL(raw.replace(/^postgresql:/, "postgres:"));
    const port = u.port ? `:${u.port}` : "";
    const db = u.pathname?.replace(/^\//, "") || "";
    return `${u.hostname}${port}${db ? `/${db.split("?")[0]}` : ""}`;
  } catch {
    return "(invalid URL)";
  }
}

function hostFromSupabaseUrl(raw) {
  if (!raw?.trim()) return "(not set)";
  try {
    const u = new URL(raw);
    return u.hostname;
  } catch {
    return "(invalid URL)";
  }
}

const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const authDisabled = process.env.AUTH_DISABLED === "true";
const useMock = process.env.USE_MOCK_DATA === "true";

console.log("Crow Ecosystem — env check (no secrets printed)\n");
console.log(`DATABASE_URL host:     ${hostFromDatabaseUrl(databaseUrl)}`);
console.log(`DIRECT_URL host:       ${hostFromDatabaseUrl(directUrl)}`);
console.log(`Supabase URL host:     ${hostFromSupabaseUrl(supabaseUrl)}`);
console.log(`AUTH_DISABLED:         ${authDisabled}`);
console.log(`USE_MOCK_DATA:         ${useMock}`);
console.log(
  `Supabase auth keys:    ${
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ? "set"
      : "missing"
  }`
);
console.log(
  `Service role key:      ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing"}`
);

const resendKey = process.env.RESEND_API_KEY?.trim();
const notifyOverride = process.env.PIPELINE_NOTIFY_EMAIL_OVERRIDE?.trim();
console.log(`RESEND_API_KEY:        ${resendKey ? "set" : "missing (audit shows skipped)"}`);
if (resendKey) {
  console.log(
    `Notify override:       ${notifyOverride ? notifyOverride : "(none — uses request contact email)"}`
  );
  if (!notifyOverride) {
    console.warn(
      "  ⚠ MEEM seed uses faisal@meem-logistics.demo — set PIPELINE_NOTIFY_EMAIL_OVERRIDE for deliverable mail"
    );
  }
} else {
  console.warn("  → docs/internal/RESEND_SETUP.md · npm run test:resend");
}

const dbLooksSupabase =
  /supabase\.co/i.test(databaseUrl) || /supabase\.co/i.test(directUrl);
const dbLooksLocal =
  /localhost|127\.0\.0\.1/i.test(databaseUrl) ||
  /localhost|127\.0\.0\.1/i.test(directUrl);

console.log("");
if (dbLooksSupabase) {
  console.warn(
    "⚠ DATABASE_URL or DIRECT_URL contains supabase.co — Option B hybrid expects local Postgres."
  );
  console.warn(
    "  See docs/internal/HYBRID_LOCAL_DB_SUPABASE_AUTH.md — keep Prisma on localhost; use Supabase keys for auth only."
  );
} else if (dbLooksLocal) {
  console.log("✓ Database URLs look local (Option B friendly).");
} else if (!databaseUrl) {
  console.warn("⚠ DATABASE_URL is not set — Prisma routes will not persist data.");
}

if (!authDisabled && !supabaseUrl.includes("supabase.co")) {
  console.warn(
    "⚠ NEXT_PUBLIC_SUPABASE_URL does not look like a real Supabase project URL."
  );
}

if (/\/rest\/v1\/?$/i.test(supabaseUrl.trim())) {
  console.warn(
    "⚠ NEXT_PUBLIC_SUPABASE_URL ends with /rest/v1 — use project base URL only (https://<ref>.supabase.co)."
  );
}

if (authDisabled) {
  console.log("\nNote: AUTH_DISABLED=true — middleware uses synthetic dev user (not production).");
  if (process.env.NODE_ENV === "production") {
    console.error(
      "\n✗ AUTH_DISABLED=true is not allowed when NODE_ENV=production. See docs/M6_AUTH_SAAS.md."
    );
    process.exit(1);
  }
}

const turnstileEnabled = process.env.TURNSTILE_ENABLED === "true";
const turnstileReady =
  turnstileEnabled &&
  Boolean(process.env.TURNSTILE_SECRET_KEY?.trim()) &&
  Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
console.log(`TURNSTILE_ENABLED:     ${turnstileEnabled}`);
console.log(
  `Turnstile configured:  ${turnstileReady ? "yes (enforced on intake)" : turnstileEnabled ? "partial (check keys)" : "no (skipped — OK for local dev)"}`
);

console.log("\nDocs: docs/internal/HYBRID_LOCAL_DB_SUPABASE_AUTH.md");
console.log("F1: docs/internal/PRODUCTION_READINESS.md");
