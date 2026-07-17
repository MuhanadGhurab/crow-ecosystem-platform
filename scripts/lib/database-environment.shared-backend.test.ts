import assert from "node:assert/strict";
import {
  SHARED_PRODUCTION_BACKEND_WARNING,
  assertAppDatabaseEnvironmentAlignment,
  assertSharedProductionBackendAcknowledged,
  isSharedProductionBackendPairing,
} from "./database-environment";

const baseEnv = { ...process.env };

function withEnv(overrides: Record<string, string | undefined>, fn: () => void) {
  process.env = { ...baseEnv, ...overrides };
  try {
    fn();
  } finally {
    process.env = baseEnv;
  }
}

withEnv(
  {
    APP_ENVIRONMENT: "preview",
    DATABASE_ENVIRONMENT: "production",
    BACKEND_ISOLATION: "shared",
    VERCEL_ENV: undefined,
  },
  () => {
    assert.equal(isSharedProductionBackendPairing(), true);
    assert.throws(
      () => assertSharedProductionBackendAcknowledged(false),
      /--allow-shared-production-backend/
    );
    assert.throws(() => assertAppDatabaseEnvironmentAlignment(), /--allow-shared-production-backend/);
    assert.doesNotThrow(() => assertSharedProductionBackendAcknowledged(true));
    assert.doesNotThrow(() =>
      assertAppDatabaseEnvironmentAlignment({ allowSharedProductionBackend: true })
    );
    assert.ok(SHARED_PRODUCTION_BACKEND_WARNING.includes("SHARED PRODUCTION BACKEND"));
  }
);

withEnv(
  {
    APP_ENVIRONMENT: "preview",
    DATABASE_ENVIRONMENT: "production",
    BACKEND_ISOLATION: undefined,
    VERCEL_ENV: undefined,
  },
  () => {
    assert.throws(
      () => assertSharedProductionBackendAcknowledged(true),
      /BACKEND_ISOLATION=shared/
    );
  }
);

withEnv(
  {
    APP_ENVIRONMENT: "preview",
    DATABASE_ENVIRONMENT: "preview",
    VERCEL_ENV: undefined,
  },
  () => {
    assert.equal(isSharedProductionBackendPairing(), false);
    assert.doesNotThrow(() => assertAppDatabaseEnvironmentAlignment());
  }
);

console.log("database-environment.shared-backend.test.ts PASSED");
