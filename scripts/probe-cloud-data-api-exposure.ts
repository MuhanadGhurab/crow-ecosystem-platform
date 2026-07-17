#!/usr/bin/env tsx
/**
 * CLOUD.1B — safe external PostgREST probe (count-only / zero-row; no secrets logged).
 */
const PROBE_TABLES = [
  "implementation_requests",
  "tenant_memberships",
  "tenant_finance_entries",
  "cybercrow_audit_logs",
  "security_events",
  "platform_accounts",
] as const;

const TIMEOUT_MS = 8_000;

type ProbeResult = {
  table: string;
  httpStatus: number | "error";
  countHeaderPresent: boolean;
  accessible: boolean;
};

function loadEnv(): { baseUrl: string; anonKey: string } | null {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ""
  )
    .trim()
    .replace(/\/$/, "");
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  ).trim();

  if (!baseUrl || !anonKey) return null;
  if (baseUrl.includes("/rest/v1")) return null;
  return { baseUrl, anonKey };
}

async function probeTable(baseUrl: string, anonKey: string, table: string): Promise<ProbeResult> {
  const url = `${baseUrl}/rest/v1/${table}?select=id`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
        Prefer: "count=exact",
        Range: "0-0",
      },
      signal: controller.signal,
    });

    const countHeader =
      response.headers.get("content-range") ?? response.headers.get("Content-Range");
    const accessible = response.ok;

    return {
      table,
      httpStatus: response.status,
      countHeaderPresent: Boolean(countHeader),
      accessible,
    };
  } catch {
    return {
      table,
      httpStatus: "error",
      countHeaderPresent: false,
      accessible: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function runExternalDataApiProbe(): Promise<{
  classification: string;
  results: ProbeResult[];
}> {
  const env = loadEnv();
  if (!env) {
    return { classification: "DATA_API_EXTERNAL_PROBE_BLOCKED", results: [] };
  }

  const results: ProbeResult[] = [];
  for (const table of PROBE_TABLES) {
    results.push(await probeTable(env.baseUrl, env.anonKey, table));
  }

  const anyAccessible = results.some((r) => r.accessible);
  const allBlocked = results.every(
    (r) =>
      !r.accessible &&
      (r.httpStatus === 401 ||
        r.httpStatus === 403 ||
        r.httpStatus === 404 ||
        r.httpStatus === "error")
  );

  let classification: string;
  if (anyAccessible) {
    classification = "DATA_API_PUBLIC_EXPOSURE_CONFIRMED";
  } else if (allBlocked) {
    classification = "DATA_API_PUBLIC_EXPOSURE_CONTAINED";
  } else {
    classification = "DATA_API_PUBLIC_EXPOSURE_INCONCLUSIVE";
  }

  return { classification, results };
}

async function main() {
  const { classification, results } = await runExternalDataApiProbe();

  console.log("\n=== CLOUD external PostgREST probe (no body logged) ===\n");
  console.log(`classification=${classification}\n`);

  for (const r of results) {
    console.log(
      `table=${r.table} status=${r.httpStatus} countHeader=${r.countHeaderPresent ? "present" : "absent"} accessible=${r.accessible ? "yes" : "no"}`
    );
  }

  if (results.length === 0) {
    console.log("\nProbe skipped — configure NEXT_PUBLIC_SUPABASE_URL + anon key locally.\n");
    process.exit(0);
  }

  console.log("");
}

const isDirectCliRun = process.argv[1]?.replace(/\\/g, "/").includes("probe-cloud-data-api-exposure");

if (isDirectCliRun) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
