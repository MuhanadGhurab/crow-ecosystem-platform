import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3010";

export default defineConfig({
  testDir: "apps/web/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start --workspace=@ghuravia/web -- -p 3010 -H 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      GHURAVIA_RUNTIME_MODE:
        process.env.GHURAVIA_RUNTIME_MODE ?? "automated_test",
      GHURAVIA_DATABASE_URL:
        process.env.GHURAVIA_DATABASE_URL ??
        "postgresql://ghuravia:ghuravia_ci_only@127.0.0.1:5432/ghuravia_test_ci",
      GHURAVIA_APP_VERSION: process.env.GHURAVIA_APP_VERSION ?? "0.3.0-ci",
      GHURAVIA_LOCAL_CONFIRM: "1",
      GHURAVIA_SYNTHETIC_SESSION_SECRET:
        process.env.GHURAVIA_SYNTHETIC_SESSION_SECRET ??
        "ci-synthetic-session-secret-32b",
    },
  },
});
