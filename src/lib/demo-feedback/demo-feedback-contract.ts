/**
 * CROW.DEVFLOW.5 — Demo feedback pilot contract (payload + limits).
 * Demo/test feedback only — not client Request lifecycle.
 */

export const DEMO_FEEDBACK_EVENT_TYPE = "alpha_demo_feedback" as const;

export const DEMO_FEEDBACK_RECIPIENT_EMAIL = "demo-feedback@internal.crow" as const;

export const DEMO_FEEDBACK_REVIEWER_TYPES = [
  "owner",
  "friend",
  "tester",
  "internal",
] as const;

export type DemoFeedbackReviewerType = (typeof DEMO_FEEDBACK_REVIEWER_TYPES)[number];

export const DEMO_FEEDBACK_TYPES = [
  "bug",
  "idea",
  "confusion",
  "design",
  "wording",
  "flow",
  "other",
] as const;

export type DemoFeedbackType = (typeof DEMO_FEEDBACK_TYPES)[number];

export const DEMO_FEEDBACK_SEVERITIES = ["low", "medium", "high"] as const;

export type DemoFeedbackSeverity = (typeof DEMO_FEEDBACK_SEVERITIES)[number];

export const DEMO_FEEDBACK_MESSAGE_MAX = 4000;
export const DEMO_FEEDBACK_MESSAGE_MIN = 8;
export const DEMO_FEEDBACK_NAME_MAX = 120;
export const DEMO_FEEDBACK_AREA_MAX = 200;
export const DEMO_FEEDBACK_CONTACT_MAX = 200;
export const DEMO_FEEDBACK_URL_MAX = 500;

/** UI / policy copy — must appear on the feedback surface. */
export const DEMO_FEEDBACK_SENSITIVE_WARNING =
  "Demo feedback only. Not production. Do not enter real customer or sensitive data.";

export type DemoFeedbackPayload = {
  reviewerName?: string;
  reviewerType: DemoFeedbackReviewerType;
  pageOrArea: string;
  feedbackType: DemoFeedbackType;
  message: string;
  severity?: DemoFeedbackSeverity;
  /** Optional contact — demo only; never treated as verified identity. */
  contact?: string;
  sourceEnvironment: string;
  previewUrl?: string;
};

export type DemoFeedbackSubmitResult =
  | { ok: true; id: string; message: string }
  | { ok: false; code: string; message: string };
