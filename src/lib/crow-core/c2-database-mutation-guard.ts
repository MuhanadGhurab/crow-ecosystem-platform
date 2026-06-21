import { prisma } from "@/lib/db";
import { BlueprintAuthorizationError } from "@/lib/crow-core/blueprint-runtime/blueprint-errors";
import {
  assertAppDatabaseEnvironmentAlignment,
  assertDatabaseFingerprintMatches,
  expectedDatabaseFingerprint,
  isSharedProductionBackendPairing,
  resolveBackendIsolation,
  resolveDatabaseEnvironment,
} from "@/lib/crow-core/database-environment";

async function c2PersistenceTablesPresent(): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'enterprise_blueprint_versions'
    ) AS "exists"
  `;
  return rows[0]?.exists === true;
}

/**
 * Fail closed when C2 persistence is active but database environment markers are missing or mismatched.
 */
export async function assertC2DatabaseEnvironmentSafe(): Promise<void> {
  const tablesPresent = await c2PersistenceTablesPresent();
  if (!tablesPresent) {
    return;
  }

  try {
    const allowSharedProductionBackend =
      isSharedProductionBackendPairing() && resolveBackendIsolation() === "shared";
    assertAppDatabaseEnvironmentAlignment({ allowSharedProductionBackend });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new BlueprintAuthorizationError(message);
  }

  const dbEnv = resolveDatabaseEnvironment();
  const expected = expectedDatabaseFingerprint();
  if (!dbEnv || !expected) {
    throw new BlueprintAuthorizationError(
      "C2 persistence tables are present but DATABASE_ENVIRONMENT or EXPECTED_DATABASE_FINGERPRINT is not configured."
    );
  }

  try {
    assertDatabaseFingerprintMatches();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new BlueprintAuthorizationError(message);
  }
}
