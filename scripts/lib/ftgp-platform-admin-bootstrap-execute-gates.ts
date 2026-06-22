import { PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV } from "@/lib/platform/platform-internal-role-bootstrap";
import { detectForbiddenPlatformOwnerCredentials } from "@/lib/platform/platform-owner-bootstrap.guards";
import { EXPECTED_DATABASE_FINGERPRINT } from "./ftgp-platform-admin-bootstrap-manifest";
import { fingerprintDatabaseUrl } from "./database-fingerprint";

export const PLATFORM_INTERNAL_ROLE_BOOTSTRAP_EXECUTE_PHRASE =
  "GRANT FIRST PLATFORM ADMIN TO DESIGNATED ACCOUNT";

export type BootstrapExecuteGateResult = {
  allowed: boolean;
  refusal: string | null;
  message: string;
};

export function validateFtgpPlatformAdminBootstrapExecuteGates(input: {
  targetAccountId: string;
  correlationId: string;
  manifestCorrelationId: string;
  operatorAuthorizationFlag: boolean;
}): BootstrapExecuteGateResult {
  const passwordRefusal = detectForbiddenPlatformOwnerCredentials();
  if (passwordRefusal) {
    return {
      allowed: false,
      refusal: passwordRefusal,
      message: "Passwords must never be supplied to bootstrap execute tooling.",
    };
  }

  if (!input.operatorAuthorizationFlag) {
    return {
      allowed: false,
      refusal: "execute_not_authorized",
      message: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_EXECUTE_AUTHORIZED must be true",
    };
  }

  const phrase = process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.executePhrase]?.trim();
  if (phrase !== PLATFORM_INTERNAL_ROLE_BOOTSTRAP_EXECUTE_PHRASE) {
    return {
      allowed: false,
      refusal: "execute_phrase_invalid",
      message: "Valid FTGP bootstrap execute phrase required",
    };
  }

  if (process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.enabled] !== "true") {
    return {
      allowed: false,
      refusal: "bootstrap_disabled",
      message: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENABLED must be true for execute",
    };
  }

  const envTarget = process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.targetAccountId]?.trim();
  if (!envTarget || envTarget !== input.targetAccountId) {
    return {
      allowed: false,
      refusal: "target_mismatch",
      message: "Execute target must match operator env PlatformAccount.id",
    };
  }

  const envCorrelation =
    process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.correlationId]?.trim() ||
    input.correlationId;
  if (envCorrelation !== input.manifestCorrelationId) {
    return {
      allowed: false,
      refusal: "correlation_mismatch",
      message: "Correlation ID must match manifest and operator env",
    };
  }

  const dbUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
  if (dbUrl) {
    const fp = fingerprintDatabaseUrl(dbUrl);
    if (fp.targetHash !== EXPECTED_DATABASE_FINGERPRINT) {
      return {
        allowed: false,
        refusal: "database_fingerprint_mismatch",
        message: "Hosted database fingerprint mismatch",
      };
    }
  }

  if (
    process.env.VERCEL === "1" &&
    process.env.CYBERCROW_SCRIPT_PRISMA !== "1"
  ) {
    return {
      allowed: false,
      refusal: "vercel_runtime_forbidden",
      message: "Bootstrap execute cannot run on Vercel runtime",
    };
  }

  if (process.env.APP_ENVIRONMENT === "production") {
    return {
      allowed: false,
      refusal: "production_forbidden",
      message: "Bootstrap execute forbidden on production",
    };
  }

  return { allowed: true, refusal: null, message: "Execute gates satisfied" };
}
