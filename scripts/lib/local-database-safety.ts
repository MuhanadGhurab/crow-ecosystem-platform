import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./database-fingerprint";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

/** Approved disposable C3 Docker Postgres host port (docker-compose.local.yml). */
export const C3_DISPOSABLE_HOST_PORT = "5433";

/** Documented hosted Supabase refs that must never receive local C3 mutations. */
export const FORBIDDEN_HOSTED_SUPABASE_REFS = new Set([
  "wbwnsndcxrgyqwppurms",
]);

export type DisposableDatabaseProof = {
  ok: boolean;
  maskedTarget: string;
  host: string;
  port: string;
  database: string;
  reasons: string[];
};

function parseDatabaseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function classifyDisposableLocalDatabase(url: string | undefined): DisposableDatabaseProof {
  const reasons: string[] = [];
  if (!url?.trim()) {
    return {
      ok: false,
      maskedTarget: "(unset)",
      host: "",
      port: "",
      database: "",
      reasons: ["DATABASE_URL is not set."],
    };
  }

  const fp = fingerprintDatabaseUrl(url);
  const parsed = parseDatabaseUrl(url);
  const host = parsed?.hostname.toLowerCase() ?? "";
  const port = parsed?.port || "5432";
  const database = parsed?.pathname.replace(/^\//, "") || "";

  if (fp.supabaseProjectRef) {
    reasons.push(`Hosted Supabase database ref detected (${fp.supabaseProjectRef}).`);
    if (FORBIDDEN_HOSTED_SUPABASE_REFS.has(fp.supabaseProjectRef)) {
      reasons.push("Target matches documented Preview/Production Supabase ref.");
    }
  }

  if (!LOCAL_HOSTS.has(host)) {
    reasons.push(`Host must be localhost/127.0.0.1 (got ${host || "unknown"}).`);
  }

  if (port !== C3_DISPOSABLE_HOST_PORT) {
    reasons.push(
      `Port must be ${C3_DISPOSABLE_HOST_PORT} for C3 disposable Docker Postgres (got ${port}).`
    );
  }

  if (database !== "crow_ecosystem") {
    reasons.push(`Database must be crow_ecosystem (got ${database || "unknown"}).`);
  }

  return {
    ok: reasons.length === 0,
    maskedTarget: maskDatabaseTarget(url),
    host,
    port,
    database,
    reasons,
  };
}

export function isDisposableLocalDatabase(url: string | undefined): boolean {
  return classifyDisposableLocalDatabase(url).ok;
}

export function assertDisposableLocalDatabase(url: string | undefined): void {
  const proof = classifyDisposableLocalDatabase(url);
  if (!proof.ok) {
    throw new Error(
      `Refusing local mutation: target is not the approved disposable C3 database.\n` +
        `  ${proof.maskedTarget}\n` +
        proof.reasons.map((r) => `  - ${r}`).join("\n") +
        `\n  Use docker-compose.local.yml on 127.0.0.1:${C3_DISPOSABLE_HOST_PORT}.`
    );
  }
}

export function requireExplicitLocalResetConfirmation(argv: string[]): void {
  const confirmed = argv.includes("--confirm-local-reset");
  if (!confirmed) {
    throw new Error(
      "Local reset requires explicit confirmation: pass --confirm-local-reset"
    );
  }
}
