/**
 * CROW.DEVFLOW.5 — Demo feedback validation (pure; no DB).
 */

import {
  DEMO_FEEDBACK_AREA_MAX,
  DEMO_FEEDBACK_CONTACT_MAX,
  DEMO_FEEDBACK_MESSAGE_MAX,
  DEMO_FEEDBACK_MESSAGE_MIN,
  DEMO_FEEDBACK_NAME_MAX,
  DEMO_FEEDBACK_REVIEWER_TYPES,
  DEMO_FEEDBACK_SEVERITIES,
  DEMO_FEEDBACK_TYPES,
  DEMO_FEEDBACK_URL_MAX,
  type DemoFeedbackPayload,
  type DemoFeedbackReviewerType,
  type DemoFeedbackSeverity,
  type DemoFeedbackType,
} from "@/lib/demo-feedback/demo-feedback-contract";
import type { AlphaDemoWriteMarkers } from "@/lib/runtime/alpha-demo-write-guard";

export type DemoFeedbackValidationOk = {
  ok: true;
  payload: DemoFeedbackPayload;
  markers: AlphaDemoWriteMarkers;
};

export type DemoFeedbackValidationErr = {
  ok: false;
  code: string;
  message: string;
};

function trimStr(v: unknown, max: number): string | undefined {
  if (v == null) return undefined;
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t) return undefined;
  return t.slice(0, max);
}

function isReviewerType(v: unknown): v is DemoFeedbackReviewerType {
  return (
    typeof v === "string" &&
    (DEMO_FEEDBACK_REVIEWER_TYPES as readonly string[]).includes(v)
  );
}

function isFeedbackType(v: unknown): v is DemoFeedbackType {
  return typeof v === "string" && (DEMO_FEEDBACK_TYPES as readonly string[]).includes(v);
}

function isSeverity(v: unknown): v is DemoFeedbackSeverity {
  return (
    typeof v === "string" && (DEMO_FEEDBACK_SEVERITIES as readonly string[]).includes(v)
  );
}

/** Build required demo markers for demo_feedback_save. */
export function buildDemoFeedbackMarkers(
  sourceEnvironment: string,
  demoOwner?: string,
): AlphaDemoWriteMarkers {
  return {
    isDemo: true,
    dataClassification: "demo_only",
    runtimeMode: "alpha_development",
    notProduction: true,
    sourceEnvironment: sourceEnvironment.slice(0, 80),
    ...(demoOwner ? { demoOwner: demoOwner.slice(0, 120) } : {}),
  };
}

/**
 * Validate and sanitize a raw feedback submission.
 * Does not check alpha demo backend mode (caller / service does).
 */
export function validateDemoFeedbackInput(
  raw: Record<string, unknown>,
): DemoFeedbackValidationOk | DemoFeedbackValidationErr {
  if (!isFeedbackType(raw.feedbackType)) {
    return {
      ok: false,
      code: "invalid_feedback_type",
      message: "Choose a valid feedback type.",
    };
  }

  if (!isReviewerType(raw.reviewerType)) {
    return {
      ok: false,
      code: "invalid_reviewer_type",
      message: "Choose a valid reviewer type.",
    };
  }

  const message = trimStr(raw.message, DEMO_FEEDBACK_MESSAGE_MAX);
  if (!message || message.length < DEMO_FEEDBACK_MESSAGE_MIN) {
    return {
      ok: false,
      code: "message_too_short",
      message: `Enter at least ${DEMO_FEEDBACK_MESSAGE_MIN} characters.`,
    };
  }
  if (typeof raw.message === "string" && raw.message.length > DEMO_FEEDBACK_MESSAGE_MAX) {
    return {
      ok: false,
      code: "message_too_long",
      message: `Message must be at most ${DEMO_FEEDBACK_MESSAGE_MAX} characters.`,
    };
  }

  const pageOrArea = trimStr(raw.pageOrArea, DEMO_FEEDBACK_AREA_MAX);
  if (!pageOrArea) {
    return {
      ok: false,
      code: "page_or_area_required",
      message: "Page or area is required.",
    };
  }

  const sourceEnvironment =
    trimStr(raw.sourceEnvironment, 80) ?? "unknown";

  if (raw.severity != null && raw.severity !== "" && !isSeverity(raw.severity)) {
    return {
      ok: false,
      code: "invalid_severity",
      message: "Choose a valid severity.",
    };
  }

  const payload: DemoFeedbackPayload = {
    reviewerType: raw.reviewerType,
    feedbackType: raw.feedbackType,
    message,
    pageOrArea,
    sourceEnvironment,
    reviewerName: trimStr(raw.reviewerName, DEMO_FEEDBACK_NAME_MAX),
    severity: isSeverity(raw.severity) ? raw.severity : undefined,
    contact: trimStr(raw.contact, DEMO_FEEDBACK_CONTACT_MAX),
    previewUrl: trimStr(raw.previewUrl, DEMO_FEEDBACK_URL_MAX),
  };

  const markers = buildDemoFeedbackMarkers(
    payload.sourceEnvironment,
    payload.reviewerName,
  );

  return { ok: true, payload, markers };
}
