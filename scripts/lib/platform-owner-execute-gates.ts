import { fingerprintDatabaseUrl } from "./database-fingerprint";
import {
  PLATFORM_OWNER_BOOTSTRAP_EXECUTE_PHRASE,
  PLATFORM_OWNER_BOOTSTRAP_EXECUTE_PHRASE_ENV,
  PLATFORM_OWNER_CONFIRM_DESIGNATION_ENV,
  PLATFORM_OWNER_DATABASE_FINGERPRINT_ENV,
  PLATFORM_OWNER_PLAN_DIGEST_ENV,
} from "@/lib/platform/platform-owner-bootstrap.constants";
import type { PlatformOwnerBootstrapRefusal } from "@/lib/platform/platform-owner-bootstrap.resolution";
import { detectForbiddenPlatformOwnerCredentials } from "@/lib/platform/platform-owner-bootstrap.guards";

export type PlatformOwnerExecuteGateResult = {
  allowed: boolean;
  refusal: PlatformOwnerBootstrapRefusal | null;
  message: string;
};

export function validatePlatformOwnerExecuteGates(input: {
  platformAccountId: string;
  planDigest: string | null;
  expectedPlanDigest: string | null;
}): PlatformOwnerExecuteGateResult {
  const passwordRefusal = detectForbiddenPlatformOwnerCredentials();
  if (passwordRefusal) {
    return {
      allowed: false,
      refusal: passwordRefusal,
      message: "Passwords must never be supplied to platform-owner bootstrap tooling.",
    };
  }

  if (process.env.VERCEL === "1" && process.env.ALLOW_HOSTED_IDENTITY_CENSUS !== "true") {
    return {
      allowed: false,
      refusal: "vercel_runtime_forbidden",
      message: "Platform-owner bootstrap execute cannot run on Vercel build/runtime.",
    };
  }

  if (!input.platformAccountId.trim()) {
    return {
      allowed: false,
      refusal: "missing_account_reference",
      message: "Exact internal PlatformAccount ID is required for execute.",
    };
  }

  const phrase = process.env[PLATFORM_OWNER_BOOTSTRAP_EXECUTE_PHRASE_ENV]?.trim();
  if (phrase !== PLATFORM_OWNER_BOOTSTRAP_EXECUTE_PHRASE) {
    return {
      allowed: false,
      refusal: "execute_phrase_invalid",
      message: "Valid product-owner authorization phrase is required for execute.",
    };
  }

  const expectedFp = process.env[PLATFORM_OWNER_DATABASE_FINGERPRINT_ENV]?.trim();
  const dbUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
  if (expectedFp && dbUrl) {
    const fp = fingerprintDatabaseUrl(dbUrl);
    if (fp.targetHash !== expectedFp) {
      return {
        allowed: false,
        refusal: "database_fingerprint_mismatch",
        message: "Database fingerprint validation failed.",
      };
    }
  }

  const suppliedDigest =
    process.env[PLATFORM_OWNER_PLAN_DIGEST_ENV]?.trim() ?? input.planDigest;
  const expectedDigest = input.expectedPlanDigest;
  if (!suppliedDigest || !expectedDigest || suppliedDigest !== expectedDigest) {
    return {
      allowed: false,
      refusal: "plan_digest_missing",
      message: "Successful dry-run plan digest must be supplied before execute.",
    };
  }

  if (process.env[PLATFORM_OWNER_CONFIRM_DESIGNATION_ENV]?.trim() !== "true") {
    return {
      allowed: false,
      refusal: "designation_not_confirmed",
      message:
        "Operator must set PLATFORM_OWNER_CONFIRM_DESIGNATION=true after verifying the intended Platform Owner account.",
    };
  }

  return {
    allowed: false,
    refusal: "execute_disabled",
    message:
      "Execute gates satisfied structurally — grant authority remains disabled until a later authorized phase.",
  };
}
