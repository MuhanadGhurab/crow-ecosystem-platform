import { createHash } from "node:crypto";

export type DatabaseFingerprint = {
  provider: "supabase" | "postgres" | "unknown";
  maskedHost: string;
  maskedDatabase: string;
  schema: string;
  port: string;
  /** Stable hash of host|database|schema|port — target identity only; does NOT change when schema changes. */
  targetHash: string;
  supabaseProjectRef: string | null;
};

/** Human-readable label for reports — avoids implying schema-structure fingerprinting. */
export function targetIdentityFingerprintLabel(): string {
  return "target_identity_fingerprint";
}

function maskSegment(value: string, keepStart = 2, keepEnd = 2): string {
  if (value.length <= keepStart + keepEnd + 1) return "***";
  return `${value.slice(0, keepStart)}***${value.slice(-keepEnd)}`;
}

export function fingerprintDatabaseUrl(url: string): DatabaseFingerprint {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      provider: "unknown",
      maskedHost: "***",
      maskedDatabase: "***",
      schema: "public",
      port: "?",
      targetHash: createHash("sha256").update("invalid").digest("hex").slice(0, 16),
      supabaseProjectRef: null,
    };
  }

  const host = parsed.hostname;
  const database = parsed.pathname.replace(/^\//, "") || "postgres";
  const schema = parsed.searchParams.get("schema") ?? "public";
  const supabaseMatch = host.match(/db\.([a-z0-9]+)\.supabase\.co/i);
  const poolerHostMatch = host.match(/postgres\.([a-z0-9]+)\.supabase\.co/i);
  const poolerUserMatch = parsed.username.match(/^postgres\.([a-z0-9]{20,})$/i);
  const projectRef =
    supabaseMatch?.[1] ?? poolerHostMatch?.[1] ?? poolerUserMatch?.[1] ?? null;

  const provider =
    host.includes("supabase.com") || host.includes("supabase.co")
      ? "supabase"
      : host.includes("localhost") || host.includes("127.0.0.1")
        ? "postgres"
        : "postgres";

  const stableId = `${host}|${database}|${schema}|${parsed.port || "5432"}`;
  const targetHash = createHash("sha256").update(stableId).digest("hex").slice(0, 16);

  return {
    provider,
    maskedHost: maskSegment(host, 3, 4),
    maskedDatabase: maskSegment(database, 2, 2),
    schema,
    port: parsed.port || "5432",
    targetHash,
    supabaseProjectRef: projectRef,
  };
}

export function maskId(id: string): string {
  if (id.length <= 8) return "***";
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

/** Operator-safe one-line target summary (no credentials). */
export function maskDatabaseTarget(url: string): string {
  const fp = fingerprintDatabaseUrl(url);
  const ref = fp.supabaseProjectRef ? ` ref=${maskId(fp.supabaseProjectRef)}` : "";
  return `${fp.provider} host=${fp.maskedHost} db=${fp.maskedDatabase} schema=${fp.schema} port=${fp.port}${ref} target_identity_fingerprint=${fp.targetHash}`;
}
