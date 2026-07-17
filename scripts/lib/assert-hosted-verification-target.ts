import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./database-fingerprint";

const EXPECTED_PROJECT_REF = "wbwnsndcxrgyqwppurms";
const EXPECTED_DIRECT_FINGERPRINT = "0355c17692e2a90d";

export type HostedVerificationTarget = {
  envFile: string;
  supabaseProjectRef: string;
  directFingerprint: string | null;
  poolFingerprint: string | null;
};

export function assertHostedVerificationTarget(options?: {
  envFile?: string;
  requireDatabaseUrls?: boolean;
}): HostedVerificationTarget {
  const envFile = options?.envFile ?? process.env.CLOUD_HOSTED_ENV_FILE ?? ".env.staging.runtime";
  const requireDatabaseUrls = options?.requireDatabaseUrls ?? false;

  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ""
  ).trim();
  const projectRef =
    supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null;

  if (!projectRef || projectRef !== EXPECTED_PROJECT_REF) {
    throw new Error(
      `Hosted verification requires Supabase project ${EXPECTED_PROJECT_REF} (got ${projectRef ?? "unknown"}).`
    );
  }

  const direct = process.env.DIRECT_URL?.trim() ?? "";
  const pool = process.env.DATABASE_URL?.trim() ?? "";

  if (/127\.0\.0\.1|localhost/i.test(supabaseUrl)) {
    throw new Error("Hosted verification blocked: Supabase URL resolves to localhost.");
  }

  let directFingerprint: string | null = null;
  let poolFingerprint: string | null = null;

  if (direct) {
    if (/127\.0\.0\.1|localhost/i.test(direct)) {
      throw new Error(
        `Hosted verification blocked: DIRECT_URL targets localhost (${maskDatabaseTarget(direct)}).`
      );
    }
    const fp = fingerprintDatabaseUrl(direct);
    directFingerprint = fp.targetHash;
    if (fp.supabaseProjectRef && fp.supabaseProjectRef !== EXPECTED_PROJECT_REF) {
      throw new Error(
        `Hosted verification blocked: DIRECT_URL project ref mismatch (expected ${EXPECTED_PROJECT_REF}).`
      );
    }
    if (directFingerprint !== EXPECTED_DIRECT_FINGERPRINT) {
      throw new Error(
        `Hosted verification blocked: direct fingerprint mismatch (expected ${EXPECTED_DIRECT_FINGERPRINT}, got ${directFingerprint ?? "unknown"}).`
      );
    }
  } else if (requireDatabaseUrls) {
    throw new Error("Hosted verification requires DIRECT_URL.");
  }

  if (pool) {
    if (/127\.0\.0\.1|localhost/i.test(pool)) {
      throw new Error(
        `Hosted verification blocked: DATABASE_URL targets localhost (${maskDatabaseTarget(pool)}).`
      );
    }
    poolFingerprint = fingerprintDatabaseUrl(pool).targetHash;
  } else if (requireDatabaseUrls) {
    throw new Error("Hosted verification requires DATABASE_URL.");
  }

  return {
    envFile,
    supabaseProjectRef: projectRef,
    directFingerprint,
    poolFingerprint,
  };
}
