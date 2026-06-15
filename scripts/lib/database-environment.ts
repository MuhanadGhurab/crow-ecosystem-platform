import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./database-fingerprint";

export type AppEnvironment = "production" | "preview" | "development" | "local" | "ci";
export type DatabaseEnvironment = "production" | "preview" | "local" | "ci";

export const CONTROLLED_MIGRATION_PHRASES = {
  preview: "APPLY PREVIEW DATABASE MIGRATIONS",
  production: "APPLY PRODUCTION DATABASE MIGRATIONS",
} as const;

export type ControlledMigrationEnvironment = keyof typeof CONTROLLED_MIGRATION_PHRASES;

export function resolveAppEnvironment(): AppEnvironment {
  const vercelEnv = process.env.VERCEL_ENV?.trim().toLowerCase();
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  if (vercelEnv === "development") return "development";

  const explicit = process.env.APP_ENVIRONMENT?.trim().toLowerCase();
  if (explicit === "production") return "production";
  if (explicit === "preview") return "preview";
  if (explicit === "development") return "development";
  if (explicit === "local") return "local";
  if (explicit === "ci" || process.env.CI === "true") return "ci";

  if (process.env.NODE_ENV === "production") return "production";
  return "local";
}

export function resolveDatabaseEnvironment(): DatabaseEnvironment | null {
  const raw = process.env.DATABASE_ENVIRONMENT?.trim().toLowerCase();
  if (raw === "production" || raw === "preview" || raw === "local" || raw === "ci") {
    return raw;
  }
  return null;
}

export function expectedDatabaseFingerprint(): string | null {
  const value = process.env.EXPECTED_DATABASE_FINGERPRINT?.trim();
  return value || null;
}

export function isMigrationExplicitlyAllowed(): boolean {
  return process.env.ALLOW_DATABASE_MIGRATION === "true";
}

export function assertAppDatabaseEnvironmentAlignment(): void {
  const appEnv = resolveAppEnvironment();
  const dbEnv = resolveDatabaseEnvironment();

  if (!dbEnv) {
    throw new Error(
      "DATABASE_ENVIRONMENT is not set. Set production, preview, local, or ci to match the database target."
    );
  }

  if (appEnv === "preview" && dbEnv !== "preview") {
    throw new Error(
      `App environment is preview but DATABASE_ENVIRONMENT is ${dbEnv}. Preview deployments must use a preview-class database.`
    );
  }

  if (appEnv === "production" && dbEnv !== "production") {
    throw new Error(
      `App environment is production but DATABASE_ENVIRONMENT is ${dbEnv}. Production deployments must use a production-class database.`
    );
  }
}

export function assertDatabaseFingerprintMatches(): void {
  const expected = expectedDatabaseFingerprint();
  const url = process.env.DATABASE_URL?.trim();
  if (!expected) {
    throw new Error("EXPECTED_DATABASE_FINGERPRINT is not set.");
  }
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }

  const actual = fingerprintDatabaseUrl(url).targetHash;
  if (actual !== expected) {
    throw new Error(
      `Database fingerprint mismatch (expected ${expected}, actual ${actual}). Target: ${maskDatabaseTarget(url)}`
    );
  }
}

export function assertControlledMigrationPhrase(
  environment: ControlledMigrationEnvironment,
  confirmPhrase: string | undefined
): void {
  const expected = CONTROLLED_MIGRATION_PHRASES[environment];
  if (!confirmPhrase || confirmPhrase.trim() !== expected) {
    throw new Error(
      `Missing or incorrect confirmation phrase. Required for ${environment}: "${expected}"`
    );
  }
}

export function assertControlledEnvironmentTarget(
  environment: ControlledMigrationEnvironment
): void {
  const dbEnv = resolveDatabaseEnvironment();
  if (!dbEnv) {
    throw new Error("DATABASE_ENVIRONMENT must be set for controlled migration.");
  }
  if (dbEnv !== environment) {
    throw new Error(
      `DATABASE_ENVIRONMENT is ${dbEnv} but --environment ${environment} was requested.`
    );
  }
}

export type DatabaseEnvironmentWarning = {
  code: string;
  message: string;
};

export function collectDatabaseEnvironmentWarnings(): DatabaseEnvironmentWarning[] {
  const warnings: DatabaseEnvironmentWarning[] = [];
  const appEnv = resolveAppEnvironment();
  const dbEnv = resolveDatabaseEnvironment();
  const url = process.env.DATABASE_URL?.trim();
  const expected = expectedDatabaseFingerprint();

  if (!dbEnv) {
    warnings.push({
      code: "DATABASE_ENVIRONMENT_MISSING",
      message: "DATABASE_ENVIRONMENT is not configured.",
    });
  } else if (appEnv === "preview" && dbEnv !== "preview") {
    warnings.push({
      code: "PREVIEW_DB_MISMATCH",
      message: `Vercel Preview is paired with DATABASE_ENVIRONMENT=${dbEnv}.`,
    });
  } else if (appEnv === "production" && dbEnv !== "production") {
    warnings.push({
      code: "PRODUCTION_DB_MISMATCH",
      message: `Production app is paired with DATABASE_ENVIRONMENT=${dbEnv}.`,
    });
  }

  if (url && expected) {
    const actual = fingerprintDatabaseUrl(url).targetHash;
    if (actual !== expected) {
      warnings.push({
        code: "FINGERPRINT_MISMATCH",
        message: `Database fingerprint does not match EXPECTED_DATABASE_FINGERPRINT (${maskDatabaseTarget(url)}).`,
      });
    }
  } else if (url && !expected) {
    warnings.push({
      code: "EXPECTED_FINGERPRINT_MISSING",
      message: "EXPECTED_DATABASE_FINGERPRINT is not configured.",
    });
  }

  return warnings;
}
