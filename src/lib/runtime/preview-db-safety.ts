/**
 * CROW.GAP004.ALT2 — Preview DB-disabled fail-closed safety helpers.
 *
 * No secrets printed. No DB connections. No hosted writes.
 * Default: Vercel Preview blocks DB/hosted business access unless isolation is
 * explicitly proven via all required env flags.
 */

export type VercelEnvironment = "production" | "preview" | "development" | null;

export type PreviewDbSafetyStatus = {
  vercelEnv: VercelEnvironment;
  isVercelPreview: boolean;
  isProductionRuntime: boolean;
  isolationProven: boolean;
  dbDisabledMode: boolean;
  reason: string | null;
  /** Redacted — never includes connection strings or secrets. */
  flags: {
    DATABASE_ENVIRONMENT: string | null;
    BACKEND_ISOLATION: string | null;
    PREVIEW_DATABASE_ISOLATION_PROVEN: string | null;
    PREVIEW_DB_DISABLED: string | null;
  };
};

export class PreviewDbDisabledError extends Error {
  readonly code = "PREVIEW_DB_DISABLED" as const;

  constructor(message?: string) {
    super(message ?? getPreviewDbDisabledReason());
    this.name = "PreviewDbDisabledError";
  }
}

function envFlag(name: string): string | null {
  const raw = process.env[name]?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function envFlagLower(name: string): string | null {
  const v = envFlag(name);
  return v ? v.toLowerCase() : null;
}

export function getVercelEnvironment(): VercelEnvironment {
  const v = envFlagLower("VERCEL_ENV");
  if (v === "production" || v === "preview" || v === "development") return v;
  return null;
}

export function isVercelPreview(): boolean {
  return getVercelEnvironment() === "preview";
}

export function isProductionRuntime(): boolean {
  return getVercelEnvironment() === "production";
}

/**
 * Strict positive proof only. All four conditions required.
 * Missing any condition → not proven (fail closed).
 */
export function isPreviewDatabaseIsolationProven(): boolean {
  if (getVercelEnvironment() !== "preview") return false;
  if (envFlagLower("DATABASE_ENVIRONMENT") !== "preview") return false;
  if (envFlagLower("BACKEND_ISOLATION") !== "isolated") return false;
  if (envFlagLower("PREVIEW_DATABASE_ISOLATION_PROVEN") !== "true") return false;
  return true;
}

/**
 * Preview DB-disabled mode.
 * Never true on Production runtime (protect live).
 * On Preview: disabled unless isolation proven; PREVIEW_DB_DISABLED=true forces disabled.
 */
export function isPreviewDbDisabledMode(): boolean {
  if (isProductionRuntime()) return false;
  if (!isVercelPreview()) return false;
  if (envFlagLower("PREVIEW_DB_DISABLED") === "true") return true;
  return !isPreviewDatabaseIsolationProven();
}

export function getPreviewDbDisabledReason(): string {
  if (!isVercelPreview()) {
    return "Preview database safety mode is not active outside Vercel Preview.";
  }
  if (isPreviewDatabaseIsolationProven() && envFlagLower("PREVIEW_DB_DISABLED") !== "true") {
    return "Preview database isolation is proven; DB-disabled mode is not active.";
  }
  const missing: string[] = [];
  if (envFlagLower("DATABASE_ENVIRONMENT") !== "preview") {
    missing.push("DATABASE_ENVIRONMENT=preview");
  }
  if (envFlagLower("BACKEND_ISOLATION") !== "isolated") {
    missing.push("BACKEND_ISOLATION=isolated");
  }
  if (envFlagLower("PREVIEW_DATABASE_ISOLATION_PROVEN") !== "true") {
    missing.push("PREVIEW_DATABASE_ISOLATION_PROVEN=true");
  }
  if (envFlagLower("PREVIEW_DB_DISABLED") === "true") {
    return "Preview database access is disabled (PREVIEW_DB_DISABLED=true). Hosted actions are blocked to protect Production data.";
  }
  if (missing.length > 0) {
    return `Preview database access is disabled because isolation is not proven (missing: ${missing.join(", ")}). Hosted actions are blocked to protect Production data.`;
  }
  return "Preview database access is disabled. Hosted actions are blocked to protect Production data.";
}

export function getPreviewDbSafetyStatus(): PreviewDbSafetyStatus {
  const dbDisabledMode = isPreviewDbDisabledMode();
  return {
    vercelEnv: getVercelEnvironment(),
    isVercelPreview: isVercelPreview(),
    isProductionRuntime: isProductionRuntime(),
    isolationProven: isPreviewDatabaseIsolationProven(),
    dbDisabledMode,
    reason: dbDisabledMode ? getPreviewDbDisabledReason() : null,
    flags: {
      DATABASE_ENVIRONMENT: envFlag("DATABASE_ENVIRONMENT"),
      BACKEND_ISOLATION: envFlag("BACKEND_ISOLATION"),
      PREVIEW_DATABASE_ISOLATION_PROVEN: envFlag("PREVIEW_DATABASE_ISOLATION_PROVEN"),
      PREVIEW_DB_DISABLED: envFlag("PREVIEW_DB_DISABLED"),
    },
  };
}

export function assertPreviewDbAccessAllowed(context = "database access"): void {
  if (!isPreviewDbDisabledMode()) return;
  throw new PreviewDbDisabledError(
    `Blocked ${context}: ${getPreviewDbDisabledReason()}`,
  );
}

export function assertHostedBusinessReadAllowed(context = "hosted business read"): void {
  assertPreviewDbAccessAllowed(context);
}

export function assertHostedBusinessWriteAllowed(context = "hosted business write"): void {
  assertPreviewDbAccessAllowed(context);
}

/** True when status payload contains no secret-like substrings (test helper). */
export function previewDbSafetyStatusLooksRedacted(status: PreviewDbSafetyStatus): boolean {
  const blob = JSON.stringify(status).toLowerCase();
  if (blob.includes("postgresql://")) return false;
  if (blob.includes("password")) return false;
  if (blob.includes("service_role")) return false;
  if (/eyj[a-z0-9_-]+\.[a-z0-9_-]+/i.test(blob)) return false;
  return true;
}
