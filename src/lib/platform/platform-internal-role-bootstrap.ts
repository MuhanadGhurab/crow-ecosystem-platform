import "server-only";

/**
 * FTGP controlled bootstrap for the first database-backed Platform Admin.
 * Execute path remains disabled until operator authorization — this module documents gates only.
 */
export const PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV = {
  enabled: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENABLED",
  targetAccountId: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID",
  targetFingerprint: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_FINGERPRINT",
  executePhrase: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_EXECUTE_PHRASE",
  correlationId: "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_CORRELATION_ID",
} as const;

export type PlatformInternalRoleBootstrapRefusal =
  | "bootstrap_disabled"
  | "production_forbidden"
  | "missing_target"
  | "target_not_active"
  | "existing_platform_admin"
  | "vercel_runtime_forbidden"
  | "execute_not_authorized";

export function detectPlatformInternalRoleBootstrapRefusal(): PlatformInternalRoleBootstrapRefusal | null {
  if (process.env.VERCEL === "1") {
    return "vercel_runtime_forbidden";
  }
  if (process.env.APP_ENVIRONMENT === "production") {
    return "production_forbidden";
  }
  if (process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.enabled] !== "true") {
    return "bootstrap_disabled";
  }
  const hasTarget =
    Boolean(process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.targetAccountId]?.trim()) ||
    Boolean(process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.targetFingerprint]?.trim());
  if (!hasTarget) {
    return "missing_target";
  }
  return null;
}

/** No first-user-admin: bootstrap requires explicit target binding and operator phrase. */
export function bootstrapRequiresExplicitTarget(): boolean {
  return true;
}
