import { detectForbiddenPlatformOwnerCredentials } from "@/lib/platform/platform-owner-bootstrap.guards";
import { EXPECTED_DATABASE_FINGERPRINT } from "./ftgp-implementer-grant-manifest";
import { fingerprintDatabaseUrl } from "./database-fingerprint";

export const FTGP_IMPLEMENTER_GRANT_EXECUTE_PHRASE =
  "GRANT IMPLEMENTER TO DESIGNATED FTGP OPERATOR";

export type ImplementerGrantExecuteGateResult = {
  allowed: boolean;
  refusal: string | null;
  message: string;
};

export function validateFtgpImplementerGrantExecuteGates(input: {
  targetAccountId: string;
  grantorAccountId: string;
  correlationId: string;
  manifestCorrelationId: string;
  operatorAuthorizationFlag: boolean;
}): ImplementerGrantExecuteGateResult {
  const passwordRefusal = detectForbiddenPlatformOwnerCredentials();
  if (passwordRefusal) {
    return {
      allowed: false,
      refusal: passwordRefusal,
      message: "Passwords must never be supplied to IMPLEMENTER grant execute tooling.",
    };
  }

  if (!input.operatorAuthorizationFlag) {
    return {
      allowed: false,
      refusal: "execute_not_authorized",
      message: "FTGP_IMPLEMENTER_GRANT_EXECUTE_AUTHORIZED must be true",
    };
  }

  const phrase = process.env.FTGP_IMPLEMENTER_GRANT_EXECUTE_PHRASE?.trim();
  if (phrase !== FTGP_IMPLEMENTER_GRANT_EXECUTE_PHRASE) {
    return {
      allowed: false,
      refusal: "execute_phrase_invalid",
      message: "Valid FTGP IMPLEMENTER grant execute phrase required",
    };
  }

  const envTarget = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
  if (!envTarget || envTarget !== input.targetAccountId) {
    return {
      allowed: false,
      refusal: "target_mismatch",
      message: "Execute target must match operator env PlatformAccount.id",
    };
  }

  const envGrantor = process.env.FTGP_IMPLEMENTER_GRANTOR_ACCOUNT_ID?.trim();
  if (!envGrantor || envGrantor !== input.grantorAccountId) {
    return {
      allowed: false,
      refusal: "grantor_mismatch",
      message: "Execute grantor must match verified Platform Admin assignment",
    };
  }

  const envCorrelation = process.env.FTGP_IMPLEMENTER_GRANT_CORRELATION_ID?.trim();
  if (!envCorrelation || envCorrelation !== input.manifestCorrelationId) {
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

  if (process.env.VERCEL === "1" && process.env.CYBERCROW_SCRIPT_PRISMA !== "1") {
    return {
      allowed: false,
      refusal: "vercel_runtime_forbidden",
      message: "IMPLEMENTER grant execute cannot run on Vercel runtime",
    };
  }

  return { allowed: true, refusal: null, message: "Execute gates satisfied" };
}
