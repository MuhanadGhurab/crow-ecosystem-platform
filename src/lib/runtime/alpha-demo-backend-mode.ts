/**
 * CROW.DEVFLOW.4 — Alpha Demo Backend runtime gate.
 *
 * Pure evaluation only. Does not connect to DB, import Prisma, or write data.
 * Does not loosen Preview DB-disabled (GAP-004A). Domain persistence not wired.
 */

import {
  getCrowDataClassification,
  getCrowRuntimeMode,
  isCommercialProductionMode,
  type CrowDataClassification,
  type CrowRuntimeMode,
} from "@/lib/runtime/crow-runtime-mode";
import { getVercelEnvironment, type VercelEnvironment } from "@/lib/runtime/preview-db-safety";

export type AlphaDemoBackendBlockReason =
  | "missing_allow_shared_demo_backend"
  | "runtime_mode_not_alpha_development"
  | "data_classification_not_demo_only"
  | "real_customer_data_flag"
  | "commercial_production_mode"
  | "production_sensitive_classification"
  | "payment_enabled"
  | "blueprint_generation_enabled"
  | "tenant_go_live_enabled"
  | "uncertain_fail_closed";

export type AlphaDemoBackendDecision = {
  allowed: boolean;
  reasons: AlphaDemoBackendBlockReason[];
};

export type AlphaDemoBackendModeStatus = {
  enabled: boolean;
  decision: AlphaDemoBackendDecision;
  runtimeMode: CrowRuntimeMode;
  dataClassification: CrowDataClassification;
  vercelEnv: VercelEnvironment;
  /** Redacted — boolean / enum / flag presence only. Never secrets. */
  flags: {
    CROW_RUNTIME_MODE: string | null;
    CROW_DATA_CLASSIFICATION: string | null;
    ALLOW_SHARED_DEMO_BACKEND: string | null;
    CROW_ALLOW_REAL_CUSTOMER_DATA: string | null;
    CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE: string | null;
    CROW_PAYMENT_ENABLED: string | null;
    CROW_TENANT_GO_LIVE_ENABLED: string | null;
    VERCEL_ENV: string | null;
  };
};

function envFlag(name: string): string | null {
  const raw = process.env[name]?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function envFlagLower(name: string): string | null {
  const v = envFlag(name);
  return v ? v.toLowerCase() : null;
}

function isTruthyFlag(name: string): boolean {
  const v = envFlagLower(name);
  return v === "true" || v === "1" || v === "yes";
}

/** Blueprint Complete / generation override present. */
export function isBlueprintGenerationEnvEnabled(): boolean {
  return isTruthyFlag("CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE");
}

/** Explicit payment runtime enablement (Alpha Mode must stay off). */
export function isPaymentRuntimeEnvEnabled(): boolean {
  return (
    isTruthyFlag("CROW_PAYMENT_ENABLED") ||
    isTruthyFlag("CROW_ALLOW_PAYMENT_RUNTIME")
  );
}

/** Explicit tenant go-live / provisioning enablement. */
export function isTenantGoLiveEnvEnabled(): boolean {
  return (
    isTruthyFlag("CROW_TENANT_GO_LIVE_ENABLED") ||
    isTruthyFlag("CROW_ALLOW_TENANT_PROVISIONING")
  );
}

export function isRealCustomerDataFlagSet(): boolean {
  return isTruthyFlag("CROW_ALLOW_REAL_CUSTOMER_DATA");
}

/**
 * Evaluate whether Controlled Alpha Demo Backend Mode is enabled.
 * Fail closed on any missing/unsafe condition.
 */
export function evaluateAlphaDemoBackendMode(): AlphaDemoBackendDecision {
  const reasons: AlphaDemoBackendBlockReason[] = [];

  if (envFlagLower("ALLOW_SHARED_DEMO_BACKEND") !== "true") {
    reasons.push("missing_allow_shared_demo_backend");
  }

  const runtimeMode = getCrowRuntimeMode();
  if (runtimeMode !== "alpha_development") {
    reasons.push("runtime_mode_not_alpha_development");
  }

  const dataClassification = getCrowDataClassification();
  if (dataClassification !== "demo_only") {
    reasons.push("data_classification_not_demo_only");
  }

  if (dataClassification === "production_sensitive_blocked") {
    reasons.push("production_sensitive_classification");
  }
  if (dataClassification === "real_customer") {
    reasons.push("production_sensitive_classification");
  }

  if (isCommercialProductionMode()) {
    reasons.push("commercial_production_mode");
  }

  if (isRealCustomerDataFlagSet()) {
    reasons.push("real_customer_data_flag");
  }

  if (isPaymentRuntimeEnvEnabled()) {
    reasons.push("payment_enabled");
  }

  if (isBlueprintGenerationEnvEnabled()) {
    reasons.push("blueprint_generation_enabled");
  }

  if (isTenantGoLiveEnvEnabled()) {
    reasons.push("tenant_go_live_enabled");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

export function isAlphaDemoBackendModeEnabled(): boolean {
  return evaluateAlphaDemoBackendMode().allowed;
}

export function getAlphaDemoBackendModeStatus(): AlphaDemoBackendModeStatus {
  const decision = evaluateAlphaDemoBackendMode();
  return {
    enabled: decision.allowed,
    decision,
    runtimeMode: getCrowRuntimeMode(),
    dataClassification: getCrowDataClassification(),
    vercelEnv: getVercelEnvironment(),
    flags: {
      CROW_RUNTIME_MODE: envFlag("CROW_RUNTIME_MODE"),
      CROW_DATA_CLASSIFICATION: envFlag("CROW_DATA_CLASSIFICATION"),
      ALLOW_SHARED_DEMO_BACKEND: envFlag("ALLOW_SHARED_DEMO_BACKEND"),
      CROW_ALLOW_REAL_CUSTOMER_DATA: envFlag("CROW_ALLOW_REAL_CUSTOMER_DATA"),
      CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE: envFlag(
        "CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE",
      ),
      CROW_PAYMENT_ENABLED: envFlag("CROW_PAYMENT_ENABLED"),
      CROW_TENANT_GO_LIVE_ENABLED: envFlag("CROW_TENANT_GO_LIVE_ENABLED"),
      VERCEL_ENV: envFlag("VERCEL_ENV"),
    },
  };
}

/** True when status payload contains no secret-like substrings. */
export function alphaDemoBackendModeStatusLooksRedacted(
  status: AlphaDemoBackendModeStatus,
): boolean {
  const blob = JSON.stringify(status).toLowerCase();
  if (blob.includes("postgresql://")) return false;
  if (blob.includes("password")) return false;
  if (blob.includes("service_role")) return false;
  if (/eyj[a-z0-9_-]+\.[a-z0-9_-]+/i.test(blob)) return false;
  return true;
}
