#!/usr/bin/env tsx
/**
 * CLOUD.1C — Auth + Prisma/server HTTP smoke (no mutations, no secrets logged).
 */
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";

const TIMEOUT_MS = 15_000;

type SmokeResult = { name: string; pass: boolean; status: number | "error"; detail: string };

function siteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    if (u.protocol === "http:") {
      u.protocol = "https:";
    }
    return u.origin;
  } catch {
    return null;
  }
}

async function fetchStatus(path: string): Promise<{ status: number | "error"; detail: string }> {
  const origin = siteOrigin();
  if (!origin) return { status: "error", detail: "missing_site_url" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${origin}${path}`, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { Accept: "text/html,application/json" },
    });
    return { status: response.status, detail: `status=${response.status}` };
  } catch (err) {
    return {
      status: "error",
      detail: err instanceof Error ? err.message : "fetch_error",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log("\n=== CLOUD.1C Auth + server smoke ===\n");

  let hosted: ReturnType<typeof assertHostedVerificationTarget>;
  try {
    hosted = assertHostedVerificationTarget();
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    console.error("\nFAILED — HOSTED VERIFICATION TARGETED LOCAL DATABASE\n");
    process.exit(3);
  }

  console.log(`env_file=${hosted.envFile}`);
  console.log(`target_project_ref=${hosted.supabaseProjectRef}`);

  const origin = siteOrigin();
  console.log(`site_origin=${origin ?? "unknown"}`);

  const checks: Array<{ name: string; path: string; accept: (s: number | "error") => boolean }> = [
    { name: "login_renders", path: "/login", accept: (s) => s === 200 },
    {
      name: "password_recovery_route",
      path: "/login?recovery=1",
      accept: (s) => s === 200,
    },
    { name: "auth_callback_route", path: "/auth/callback", accept: (s) => s !== "error" },
    { name: "public_marketing", path: "/", accept: (s) => s === 200 },
    {
      name: "account_route",
      path: "/account",
      accept: (s) => s === 200 || s === 307 || s === 308 || s === 401 || s === 403,
    },
    { name: "health_api", path: "/api/health", accept: (s) => s === 200 },
  ];

  const results: SmokeResult[] = [];
  for (const check of checks) {
    const { status, detail } = await fetchStatus(check.path);
    results.push({
      name: check.name,
      pass: check.accept(status),
      status,
      detail,
    });
  }

  for (const r of results) {
    console.log(`check=${r.name} pass=${r.pass ? "yes" : "no"} ${r.detail}`);
  }

  const authChecks = results.filter((r) =>
    ["login_renders", "password_recovery_route", "auth_callback_route"].includes(r.name)
  );
  const serverChecks = results.filter((r) =>
    ["public_marketing", "account_route", "health_api"].includes(r.name)
  );

  const authPass = authChecks.every((r) => r.pass);
  const serverPass = serverChecks.every((r) => r.pass);

  console.log("");
  console.log(`SUPABASE_AUTH_UNAFFECTED=${authPass ? "PASS" : "FAIL"}`);
  console.log(`PRISMA_SERVER_ROUTES_UNAFFECTED=${serverPass ? "PASS" : "FAIL"}`);
  console.log("");

  process.exit(authPass && serverPass ? 0 : 1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(2);
});
