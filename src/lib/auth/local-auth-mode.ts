import { assertAuthNotDisabledInProduction } from "@/lib/supabase/env";

const MOCK_DATA_PRODUCTION_ERROR =
  "USE_MOCK_DATA=true is not allowed when NODE_ENV=production. " +
  "Visual preview mode is for local development only.";

const DIAGNOSTICS_PRODUCTION_ERROR =
  "LOCAL_AUTH_DIAGNOSTICS_ENABLED is not allowed when NODE_ENV=production.";

export function assertMockDataNotInProduction(): void {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.USE_MOCK_DATA === "true"
  ) {
    throw new Error(MOCK_DATA_PRODUCTION_ERROR);
  }
}

export function isVisualMockMode(): boolean {
  assertAuthNotDisabledInProduction();
  assertMockDataNotInProduction();
  return process.env.USE_MOCK_DATA === "true";
}

export function isRealLocalAuthMode(): boolean {
  return (
    process.env.AUTH_DISABLED !== "true" &&
    process.env.USE_MOCK_DATA !== "true"
  );
}

export function getLocalEmailProvider(): "mailpit" | "in-memory" | "default" {
  const raw = process.env.LOCAL_EMAIL_PROVIDER?.trim().toLowerCase();
  if (process.env.NODE_ENV === "production") {
    return "default";
  }
  if (raw === "mailpit") return "mailpit";
  if (raw === "in-memory") return "in-memory";
  return "default";
}

export function isLocalAuthDiagnosticsEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return process.env.LOCAL_AUTH_DIAGNOSTICS_ENABLED === "true";
}

export function assertLocalAuthDiagnosticsAllowed(): void {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.LOCAL_AUTH_DIAGNOSTICS_ENABLED === "true"
  ) {
    throw new Error(DIAGNOSTICS_PRODUCTION_ERROR);
  }
}
