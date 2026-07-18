/**
 * CROW.DEVFLOW.4 — Alpha Demo write guard + action allowlist.
 *
 * Pure evaluation only. Does not connect to DB, import Prisma, or persist domain data.
 * Callers in future milestones must invoke this before any demo hosted write.
 */

import {
  isAlphaDemoBackendModeEnabled,
  isBlueprintGenerationEnvEnabled,
  isPaymentRuntimeEnvEnabled,
  isRealCustomerDataFlagSet,
  isTenantGoLiveEnvEnabled,
} from "@/lib/runtime/alpha-demo-backend-mode";
import {
  getCrowDataClassification,
  getCrowRuntimeMode,
  isCommercialProductionMode,
} from "@/lib/runtime/crow-runtime-mode";

/** Allowlisted demo-only actions (no handlers in DEVFLOW.4). */
export const ALPHA_DEMO_WRITE_ACTIONS = [
  "demo_request_create",
  "demo_discovery_draft_save",
  "demo_discovery_answer_save",
  "demo_procrow_note_save",
  "demo_feedback_save",
  "demo_review_package_create",
] as const;

export type AlphaDemoWriteAction = (typeof ALPHA_DEMO_WRITE_ACTIONS)[number];

/** Explicitly forbidden action names (must never pass the guard). */
export const ALPHA_DEMO_FORBIDDEN_ACTIONS = [
  "blueprint_generate",
  "blueprint_complete",
  "complete_discovery",
  "payment_checkout",
  "payment_charge",
  "tenant_provision",
  "tenant_go_live",
  "tenant_membership_create",
  "platform_role_create",
  "croai_production_action",
] as const;

export type AlphaDemoForbiddenAction = (typeof ALPHA_DEMO_FORBIDDEN_ACTIONS)[number];

export type AlphaDemoWriteMarkers = {
  isDemo: boolean;
  dataClassification: "demo_only";
  runtimeMode: "alpha_development";
  notProduction: true;
  sourceEnvironment?: string;
  demoOwner?: string;
  relatedRequestId?: string;
  relatedDiscoveryId?: string;
};

export type AlphaDemoWriteGuardBlockReason =
  | "alpha_demo_backend_disabled"
  | "action_not_allowlisted"
  | "forbidden_action"
  | "markers_missing"
  | "is_demo_not_true"
  | "data_classification_not_demo_only"
  | "runtime_mode_not_alpha_development"
  | "not_production_not_true"
  | "real_customer_data_flag"
  | "commercial_production_context"
  | "payment_intent"
  | "blueprint_intent"
  | "tenant_intent"
  | "croai_intent"
  | "uncertain_fail_closed";

export type AlphaDemoWriteGuardContext = {
  claimsCommercialProduction?: boolean;
  intendsPayment?: boolean;
  intendsBlueprint?: boolean;
  intendsTenantGoLive?: boolean;
  intendsCroAiProduction?: boolean;
};

export type AlphaDemoWriteGuardDecision = {
  allowed: boolean;
  reasons: AlphaDemoWriteGuardBlockReason[];
  action: string;
};

export class AlphaDemoWriteBlockedError extends Error {
  readonly code = "ALPHA_DEMO_WRITE_BLOCKED" as const;
  readonly decision: AlphaDemoWriteGuardDecision;

  constructor(decision: AlphaDemoWriteGuardDecision) {
    super(
      `Alpha demo write blocked for action "${decision.action}": ${decision.reasons.join(", ")}`,
    );
    this.name = "AlphaDemoWriteBlockedError";
    this.decision = decision;
  }
}

export function isAlphaDemoWriteAction(action: string): action is AlphaDemoWriteAction {
  return (ALPHA_DEMO_WRITE_ACTIONS as readonly string[]).includes(action);
}

export function isAlphaDemoForbiddenAction(
  action: string,
): action is AlphaDemoForbiddenAction {
  return (ALPHA_DEMO_FORBIDDEN_ACTIONS as readonly string[]).includes(action);
}

function hasRequiredMarkers(
  markers: Partial<AlphaDemoWriteMarkers> | null | undefined,
): markers is AlphaDemoWriteMarkers {
  if (!markers || typeof markers !== "object") return false;
  return (
    markers.isDemo === true &&
    markers.dataClassification === "demo_only" &&
    markers.runtimeMode === "alpha_development" &&
    markers.notProduction === true
  );
}

/**
 * Evaluate whether an allowlisted demo write may proceed.
 * Does not perform persistence.
 */
export function evaluateAlphaDemoWriteGuard(
  action: string,
  markers: Partial<AlphaDemoWriteMarkers> | null | undefined,
  context: AlphaDemoWriteGuardContext = {},
): AlphaDemoWriteGuardDecision {
  const reasons: AlphaDemoWriteGuardBlockReason[] = [];

  if (!isAlphaDemoBackendModeEnabled()) {
    reasons.push("alpha_demo_backend_disabled");
  }

  if (isAlphaDemoForbiddenAction(action)) {
    reasons.push("forbidden_action");
    if (
      action.startsWith("blueprint") ||
      action === "complete_discovery"
    ) {
      reasons.push("blueprint_intent");
    }
    if (action.startsWith("payment")) {
      reasons.push("payment_intent");
    }
    if (action.startsWith("tenant") || action === "platform_role_create") {
      reasons.push("tenant_intent");
    }
    if (action.startsWith("croai")) {
      reasons.push("croai_intent");
    }
  } else if (!isAlphaDemoWriteAction(action)) {
    reasons.push("action_not_allowlisted");
  }

  if (markers == null) {
    reasons.push("markers_missing");
  } else {
    if (markers.isDemo !== true) reasons.push("is_demo_not_true");
    if (markers.dataClassification !== "demo_only") {
      reasons.push("data_classification_not_demo_only");
    }
    if (markers.runtimeMode !== "alpha_development") {
      reasons.push("runtime_mode_not_alpha_development");
    }
    if (markers.notProduction !== true) reasons.push("not_production_not_true");
  }

  if (isRealCustomerDataFlagSet()) {
    reasons.push("real_customer_data_flag");
  }

  if (
    isCommercialProductionMode() ||
    context.claimsCommercialProduction === true ||
    getCrowRuntimeMode() === "commercial_production"
  ) {
    reasons.push("commercial_production_context");
  }

  if (getCrowDataClassification() !== "demo_only") {
    reasons.push("data_classification_not_demo_only");
  }

  if (context.intendsPayment === true || isPaymentRuntimeEnvEnabled()) {
    reasons.push("payment_intent");
  }
  if (context.intendsBlueprint === true || isBlueprintGenerationEnvEnabled()) {
    reasons.push("blueprint_intent");
  }
  if (context.intendsTenantGoLive === true || isTenantGoLiveEnvEnabled()) {
    reasons.push("tenant_intent");
  }
  if (context.intendsCroAiProduction === true) {
    reasons.push("croai_intent");
  }

  // Deduplicate reasons while preserving order
  const unique: AlphaDemoWriteGuardBlockReason[] = [];
  for (const r of reasons) {
    if (!unique.includes(r)) unique.push(r);
  }

  const allowed =
    unique.length === 0 &&
    isAlphaDemoWriteAction(action) &&
    hasRequiredMarkers(markers) &&
    isAlphaDemoBackendModeEnabled();

  return {
    allowed,
    reasons: allowed ? [] : unique.length > 0 ? unique : ["uncertain_fail_closed"],
    action,
  };
}

export function assertAlphaDemoWriteAllowed(
  action: string,
  markers: Partial<AlphaDemoWriteMarkers> | null | undefined,
  context: AlphaDemoWriteGuardContext = {},
): void {
  const decision = evaluateAlphaDemoWriteGuard(action, markers, context);
  if (decision.allowed) return;
  throw new AlphaDemoWriteBlockedError(decision);
}

/** Valid demo markers factory for tests / future callers. */
export function createValidAlphaDemoWriteMarkers(
  overrides: Partial<AlphaDemoWriteMarkers> = {},
): AlphaDemoWriteMarkers {
  return {
    sourceEnvironment: overrides.sourceEnvironment,
    demoOwner: overrides.demoOwner,
    relatedRequestId: overrides.relatedRequestId,
    relatedDiscoveryId: overrides.relatedDiscoveryId,
    isDemo: overrides.isDemo ?? true,
    dataClassification: overrides.dataClassification ?? "demo_only",
    runtimeMode: overrides.runtimeMode ?? "alpha_development",
    notProduction: overrides.notProduction ?? true,
  };
}
