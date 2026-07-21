import { z } from "zod";
export const RuntimeMode = z.enum(["local_development", "automated_test"]);
export const ErrorCategory = z.enum([
  "VALIDATION_ERROR",
  "CONFLICT",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "INVALID_TRANSITION",
  "IDEMPOTENCY_CONFLICT",
  "LOCAL_RUNTIME_ONLY",
  "PROVIDER_UNAVAILABLE",
  "INTERNAL_ERROR",
]);
export const ErrorResponse = z.object({
  category: ErrorCategory,
  message: z.string(),
  correlationId: z.string().optional(),
});
export const HealthResponse = z.object({
  status: z.enum(["ok", "degraded"]),
  version: z.string(),
  runtimeMode: RuntimeMode,
  dbConnectivityCategory: z.enum([
    "connected",
    "unavailable",
    "not_configured",
  ]),
  migrationStatusCategory: z.enum(["current", "pending", "unknown"]),
  workerStatusCategory: z.enum(["idle", "unavailable"]),
});
export const ScreenMetadata = z.object({
  id: z.string(),
  shell: z.string(),
  status: z.literal("ACTIVE"),
  title: z.string(),
});
export const ActivationState = z.enum([
  "ACCOUNT_CLAIMED",
  "EMAIL_VERIFICATION_PENDING",
  "EMAIL_VERIFIED",
  "TERMS_ACCEPTED",
  "ACCOUNT_RISK_ACCEPTED",
  "ACTIVATION_RECOVERY_REQUIRED",
  "RISK_REVIEW_REQUIRED",
  "ACTIVATED",
  "SUSPENDED",
  "CLOSED",
]);
export const ActivationCommand = z.object({
  type: z.enum([
    "REQUEST_EMAIL_VERIFICATION",
    "VERIFY_EMAIL",
    "ACCEPT_TERMS",
    "ACCEPT_ACCOUNT_RISK",
    "ACTIVATE",
    "SUSPEND",
    "CLOSE",
    "PRIVILEGED_CORRECTION",
  ]),
  idempotencyKey: z.string().min(1),
  actorRef: z.string().min(1),
  authority: z.string().optional(),
  reason: z.string().optional(),
});
export const AuditEnvelope = z.object({
  actorRef: z.string(),
  action: z.string(),
  subject: z.string(),
  reason: z.string().optional(),
  authority: z.string().optional(),
  correlationId: z.string(),
});
export const OutboxEnvelope = z.object({
  eventId: z.string(),
  eventType: z.string(),
  payload: z.record(z.string(), z.unknown()),
  idempotencyKey: z.string(),
});
export const ProviderMockResponse = z.object({
  outcome: z.enum(["success", "failure", "timeout", "duplicate"]),
  provider: z.string(),
  correlationId: z.string(),
});
export type ActivationState = z.infer<typeof ActivationState>;
export type ActivationCommand = z.infer<typeof ActivationCommand>;
