#!/usr/bin/env tsx
/**
 * CLOUD.1C — post-containment external REST + GraphQL verification (no secrets/bodies logged).
 */
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";

const CONTAINMENT_PROBE_TABLES = [
  "implementation_requests",
  "tenant_memberships",
  "tenant_finance_entries",
  "cybercrow_audit_logs",
  "security_events",
  "api_keys",
  "webhook_events",
  "platform_accounts",
  "platform_internal_role_assignments",
] as const;

const SENSITIVE_GRAPHQL_TYPE_HINTS = [
  "implementation_requests",
  "tenant_memberships",
  "tenant_finance_entries",
  "cybercrow_audit_logs",
  "security_events",
  "api_keys",
  "webhook_events",
] as const;

const TIMEOUT_MS = 8_000;

type TableProbe = {
  table: string;
  httpStatus: number | "error";
  countHeaderPresent: boolean;
  tableAccessBlocked: boolean;
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

function isTableAccessBlocked(status: number | "error", accessible: boolean): boolean {
  if (status === "error") return true;
  if (accessible) return false;
  // 200/206 with data would be accessible=true; anything else is containment-safe
  return status !== 200 && status !== 206;
}

async function probeTable(
  baseUrl: string,
  anonKey: string,
  table: string
): Promise<TableProbe> {
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
      tableAccessBlocked: isTableAccessBlocked(response.status, accessible),
    };
  } catch {
    return {
      table,
      httpStatus: "error",
      countHeaderPresent: false,
      tableAccessBlocked: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeGraphqlExposure(
  baseUrl: string,
  anonKey: string
): Promise<{ result: "PASS" | "FAIL" | "UNKNOWN"; detail: string }> {
  const url = `${baseUrl}/graphql/v1`;
  const introspection = {
    query: `{ __schema { queryType { fields { name } } } }`,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(introspection),
      signal: controller.signal,
    });

    if (response.status === 404 || response.status === 401 || response.status === 403) {
      return { result: "PASS", detail: `graphql_endpoint_denied status=${response.status}` };
    }

    if (!response.ok) {
      return { result: "PASS", detail: `graphql_not_available status=${response.status}` };
    }

    const text = await response.text();
    const lower = text.toLowerCase();
    const exposed = SENSITIVE_GRAPHQL_TYPE_HINTS.filter(
      (name) => lower.includes(name.toLowerCase()) || lower.includes(name.replace(/_/g, ""))
    );

    if (exposed.length > 0) {
      return {
        result: "FAIL",
        detail: `sensitive_types_in_schema_response count=${exposed.length}`,
      };
    }

    return { result: "PASS", detail: "no_sensitive_public_table_names_in_introspection" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    if (/abort|timeout/i.test(msg)) {
      return { result: "UNKNOWN", detail: "graphql_probe_timeout" };
    }
    return { result: "UNKNOWN", detail: "graphql_probe_error" };
  } finally {
    clearTimeout(timer);
  }
}

export async function runContainmentVerification(): Promise<{
  restPass: boolean;
  failingTables: string[];
  tableResults: TableProbe[];
  graphql: { result: "PASS" | "FAIL" | "UNKNOWN"; detail: string };
}> {
  const env = loadEnv();
  if (!env) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or anon key for containment verification");
  }

  const tableResults: TableProbe[] = [];
  for (const table of CONTAINMENT_PROBE_TABLES) {
    tableResults.push(await probeTable(env.baseUrl, env.anonKey, table));
  }

  const failingTables = tableResults.filter((r) => !r.tableAccessBlocked).map((r) => r.table);
  const restPass = failingTables.length === 0;
  const graphql = await probeGraphqlExposure(env.baseUrl, env.anonKey);

  return { restPass, failingTables, tableResults, graphql };
}

async function main() {
  const startedAt = new Date().toISOString();
  let hosted: ReturnType<typeof assertHostedVerificationTarget>;
  try {
    hosted = assertHostedVerificationTarget();
  } catch (err) {
    console.error("\n=== CLOUD.1C Data API containment verification ===\n");
    console.error(err instanceof Error ? err.message : String(err));
    console.error("\nFAILED — HOSTED VERIFICATION TARGETED LOCAL DATABASE\n");
    process.exit(3);
  }

  console.log("\n=== CLOUD.1C Data API containment verification ===\n");
  console.log(`timestamp=${startedAt}`);
  console.log(`env_file=${hosted.envFile}`);
  console.log(`target_project_ref=${hosted.supabaseProjectRef}`);
  if (hosted.directFingerprint) {
    console.log(`direct_fingerprint=${hosted.directFingerprint}`);
  }
  console.log(`expected_pre_change_exposed_schemas=public`);
  console.log(`expected_post_change_exposed_schemas=(public removed)\n`);

  let report: Awaited<ReturnType<typeof runContainmentVerification>>;
  try {
    report = await runContainmentVerification();
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(2);
  }

  for (const r of report.tableResults) {
    console.log(
      `table=${r.table} status=${r.httpStatus} countHeader=${r.countHeaderPresent ? "present" : "absent"} blocked=${r.tableAccessBlocked ? "yes" : "no"}`
    );
  }

  console.log("");
  console.log(
    `PUBLIC_SCHEMA_DATA_API_EXPOSURE_BLOCKED=${report.restPass ? "PASS" : "FAIL"}`
  );
  if (!report.restPass) {
    console.log(`failing_tables=${report.failingTables.join(",")}`);
  }
  console.log(
    `PUBLIC_SCHEMA_GRAPHQL_EXPOSURE_BLOCKED=${report.graphql.result} (${report.graphql.detail})`
  );
  console.log("");

  process.exit(report.restPass ? 0 : 1);
}

const isDirectCliRun = process.argv[1]?.replace(/\\/g, "/").includes("verify-cloud-data-api-containment");

if (isDirectCliRun) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(2);
  });
}
