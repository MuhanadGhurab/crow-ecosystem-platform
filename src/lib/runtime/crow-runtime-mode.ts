/**
 * CROW.DEVFLOW.2 — Crow runtime mode + data classification helpers.
 *
 * Makes Alpha Development Mode visible and testable.
 * Does not authorize hosted writes, Blueprint generation, payment, or tenant go-live.
 * Does not replace Preview DB-disabled safety (GAP-004A / preview-db-safety.ts).
 */

import { getVercelEnvironment, type VercelEnvironment } from "@/lib/runtime/preview-db-safety";

export type CrowRuntimeMode =
  | "alpha_development"
  | "demo_sandbox"
  | "production_grade"
  | "commercial_production";

export type CrowDataClassification =
  | "demo_only"
  | "internal_test"
  | "production_sensitive_blocked"
  | "real_customer";

export type CrowRuntimeModeStatus = {
  runtimeMode: CrowRuntimeMode;
  dataClassification: CrowDataClassification;
  vercelEnv: VercelEnvironment;
  isAlphaDevelopment: boolean;
  isDemoSandbox: boolean;
  isCommercialProduction: boolean;
  realCustomerDataAllowed: boolean;
  showAlphaBanner: boolean;
  safetyNotice: string;
  /** Redacted — never includes connection strings or secrets. */
  flags: {
    CROW_RUNTIME_MODE: string | null;
    CROW_DATA_CLASSIFICATION: string | null;
    VERCEL_ENV: string | null;
    CROW_ALLOW_REAL_CUSTOMER_DATA: string | null;
  };
};

/** Canonical alpha/demo safety copy (banner + notice). */
export const CROW_ALPHA_RUNTIME_SAFETY_NOTICE =
  "Crow Alpha Development Environment — demo/test data only. Not production. Do not enter real customer or sensitive data.";

function envFlag(name: string): string | null {
  const raw = process.env[name]?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function envFlagLower(name: string): string | null {
  const v = envFlag(name);
  return v ? v.toLowerCase() : null;
}

function parseRuntimeMode(raw: string | null): CrowRuntimeMode | null {
  if (!raw) return null;
  switch (raw) {
    case "alpha_development":
    case "demo_sandbox":
    case "production_grade":
    case "commercial_production":
      return raw;
    default:
      return null;
  }
}

function parseDataClassification(raw: string | null): CrowDataClassification | null {
  if (!raw) return null;
  switch (raw) {
    case "demo_only":
    case "internal_test":
    case "production_sensitive_blocked":
    case "real_customer":
      return raw;
    default:
      return null;
  }
}

/**
 * Default: alpha_development for local, preview, development, and unset Vercel env.
 * Vercel production domain still defaults to alpha under Crow Alpha Development Mode
 * unless CROW_RUNTIME_MODE is explicitly set (commercial Production is not claimed by domain alone).
 */
export function getCrowRuntimeMode(): CrowRuntimeMode {
  const explicit = parseRuntimeMode(envFlagLower("CROW_RUNTIME_MODE"));
  if (explicit) return explicit;
  return "alpha_development";
}

/**
 * Default: demo_only. Never defaults to real_customer.
 */
export function getCrowDataClassification(): CrowDataClassification {
  const explicit = parseDataClassification(envFlagLower("CROW_DATA_CLASSIFICATION"));
  if (explicit) return explicit;
  return "demo_only";
}

export function isAlphaDevelopmentMode(): boolean {
  return getCrowRuntimeMode() === "alpha_development";
}

export function isDemoSandboxMode(): boolean {
  const mode = getCrowRuntimeMode();
  if (mode === "demo_sandbox") return true;
  return getCrowDataClassification() === "demo_only";
}

export function isCommercialProductionMode(): boolean {
  return getCrowRuntimeMode() === "commercial_production";
}

/**
 * Real customer data is hard-blocked unless commercial_production + real_customer
 * and an explicit future gate flag. Alpha Mode always returns false.
 */
export function isRealCustomerDataAllowed(): boolean {
  if (!isCommercialProductionMode()) return false;
  if (getCrowDataClassification() !== "real_customer") return false;
  return envFlagLower("CROW_ALLOW_REAL_CUSTOMER_DATA") === "true";
}

export function getRuntimeSafetyNotice(): string {
  if (isCommercialProductionMode() && isRealCustomerDataAllowed()) {
    return "Crow commercial Production mode — handle customer data under production policy only.";
  }
  return CROW_ALPHA_RUNTIME_SAFETY_NOTICE;
}

export function shouldShowCrowAlphaRuntimeBanner(): boolean {
  if (isCommercialProductionMode() && isRealCustomerDataAllowed()) return false;
  const mode = getCrowRuntimeMode();
  if (mode === "alpha_development" || mode === "demo_sandbox") return true;
  if (getCrowDataClassification() === "demo_only") return true;
  const vercel = getVercelEnvironment();
  if (vercel === "preview" || vercel === "development" || vercel === null) return true;
  return !isCommercialProductionMode();
}

export function getRuntimeModeStatus(): CrowRuntimeModeStatus {
  return {
    runtimeMode: getCrowRuntimeMode(),
    dataClassification: getCrowDataClassification(),
    vercelEnv: getVercelEnvironment(),
    isAlphaDevelopment: isAlphaDevelopmentMode(),
    isDemoSandbox: isDemoSandboxMode(),
    isCommercialProduction: isCommercialProductionMode(),
    realCustomerDataAllowed: isRealCustomerDataAllowed(),
    showAlphaBanner: shouldShowCrowAlphaRuntimeBanner(),
    safetyNotice: getRuntimeSafetyNotice(),
    flags: {
      CROW_RUNTIME_MODE: envFlag("CROW_RUNTIME_MODE"),
      CROW_DATA_CLASSIFICATION: envFlag("CROW_DATA_CLASSIFICATION"),
      VERCEL_ENV: envFlag("VERCEL_ENV"),
      CROW_ALLOW_REAL_CUSTOMER_DATA: envFlag("CROW_ALLOW_REAL_CUSTOMER_DATA"),
    },
  };
}

/** True when status payload contains no secret-like substrings (test helper). */
export function crowRuntimeModeStatusLooksRedacted(status: CrowRuntimeModeStatus): boolean {
  const blob = JSON.stringify(status).toLowerCase();
  if (blob.includes("postgresql://")) return false;
  if (blob.includes("password")) return false;
  if (blob.includes("service_role")) return false;
  if (/eyj[a-z0-9_-]+\.[a-z0-9_-]+/i.test(blob)) return false;
  return true;
}
