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
  "CHALLENGE_EXPIRED",
  "ACTIVATION_LOCKED",
  "LOCAL_RUNTIME_ONLY",
  "PROVIDER_UNAVAILABLE",
  "INTERNAL_ERROR",
  // Localization follow-up: add errCatalogueVersionConflict / errOriginSchemaConflict
  // keys in apps/web/lib/localization before surfacing these in Product UX.
  "CATALOGUE_VERSION_CONFLICT",
  "ORIGIN_SCHEMA_CONFLICT",
]);

export const ErrorResponse = z.object({
  category: ErrorCategory,
  message: z.string(),
  correlationId: z.string().optional(),
  lockCode: z.string().optional(),
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

export const ActivationCommandType = z.enum([
  "CLAIM_SYNTHETIC_ACCOUNT",
  "REQUEST_EMAIL_VERIFICATION",
  "CONFIRM_EMAIL_VERIFICATION",
  "ACCEPT_TERMS",
  "ACCEPT_ACCOUNT_RISK",
  "ACTIVATE",
  "BEGIN_ACTIVATION_RECOVERY",
  "REQUEST_REPLACEMENT_VERIFICATION",
  "SUSPEND",
  "CLOSE",
  "PRIVILEGED_CORRECTION",
]);

export const ActivationCommand = z.object({
  type: ActivationCommandType,
  idempotencyKey: z.string().min(1),
  actorRef: z.string().min(1),
  authority: z.string().optional(),
  reason: z.string().optional(),
  termsVersion: z.string().optional(),
  riskDisclosureVersion: z.string().optional(),
  token: z.string().optional(),
});

export const ExplainableLockCode = z.enum([
  "EMAIL_NOT_VERIFIED",
  "TERMS_NOT_ACCEPTED",
  "ACCOUNT_RISK_NOT_ACCEPTED",
  "RISK_REVIEW_REQUIRED",
  "RECOVERY_REQUIRED",
  "ACCOUNT_SUSPENDED",
  "ACCOUNT_CLOSED",
]);

export const ExplainableLock = z.object({
  code: ExplainableLockCode,
  messageAr: z.string(),
  messageEn: z.string().optional(),
  missingPrerequisite: z.string(),
  nextAction: z.string(),
  recoveryAvailable: z.boolean(),
  operatorReviewRequired: z.boolean().default(false),
});

export const ActivationGates = z.object({
  emailVerified: z.boolean(),
  termsAccepted: z.boolean(),
  accountRiskAcceptable: z.boolean(),
});

export const ActivationResource = z.object({
  aggregateId: z.string(),
  state: ActivationState,
  version: z.number().int().nonnegative(),
  gates: ActivationGates,
  satisfiedGates: z.array(z.string()),
  unsatisfiedGates: z.array(z.string()),
  locks: z.array(ExplainableLock),
  allowedNextActions: z.array(z.string()),
  recoveryAvailable: z.boolean(),
  localOnly: z.literal(true),
  correlationId: z.string().optional(),
});

export const ActivationCommandRequest = z.object({
  expectedVersion: z.number().int().nonnegative(),
  correlationId: z.string().optional(),
  termsVersion: z.string().optional(),
  riskDisclosureVersion: z.string().optional(),
  token: z.string().optional(),
});

export const ActivationCommandResponse = z.object({
  correlationId: z.string(),
  aggregateVersion: z.number().int().nonnegative(),
  state: ActivationState,
  idempotencyResult: z.enum(["applied", "replayed"]),
  resource: ActivationResource,
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
  outcome: z.enum(["success", "failure", "timeout", "duplicate", "delayed"]),
  provider: z.string(),
  correlationId: z.string(),
});

export const MockMailboxMessage = z.object({
  messageId: z.string(),
  purpose: z.literal("EMAIL_VERIFICATION"),
  contactRef: z.string(),
  correlationId: z.string(),
  createdAt: z.string(),
  /** Raw token — local/test mailbox only; never persisted in Product DB */
  token: z.string(),
});

export const OnboardingState = z.enum([
  "NOT_STARTED",
  "PERSONALIZATION_STARTED",
  "PERSONALIZATION_MINIMUM_COMPLETE",
  "ORIGIN_DRAFT",
  "ORIGIN_REVIEW_LATER",
  "ORIGIN_COMPLETE",
  "NEST_INTRO_HANDOFF",
]);

export const OnboardingPath = z.enum(["GUIDED", "QUICK_START"]);

export const PersonalizationStatus = z.enum([
  "NOT_STARTED",
  "DRAFT",
  "MINIMUM_COMPLETE",
  "REVIEWED",
]);

export const OriginStatus = z.enum([
  "NOT_STARTED",
  "DRAFT",
  "REVIEW_LATER",
  "COMPLETE",
]);

export const OnboardingCommandType = z.enum([
  "BEGIN_GUIDED_PERSONALIZATION",
  "BEGIN_QUICK_START",
  "SAVE_CROW_BASICS",
  "SELECT_HABITAT",
  "SELECT_CHARACTER",
  "SAVE_PERSONALIZATION_REVIEW",
  "SAVE_ORIGIN_DRAFT",
  "MARK_ORIGIN_REVIEW_LATER",
  "COMPLETE_ORIGIN",
  "ACK_NEST_INTRO_HANDOFF",
]);

export const PERSONALIZATION_CATALOGUE_VERSION = "0.1.0" as const;
export const ORIGIN_CATALOGUE_VERSION = "0.1.0" as const;

export const PersonalizationDraft = z.object({
  path: OnboardingPath.nullable(),
  status: PersonalizationStatus,
  crowOptionId: z.string().nullable(),
  colorOptionId: z.string().nullable(),
  styleOptionId: z.string().nullable(),
  habitatOptionId: z.string().nullable(),
  characterOptionId: z.string().nullable(),
  accessoryOptionId: z.string().nullable(),
  contrastOverrideAcknowledged: z.boolean(),
  privacyPreviewAcknowledged: z.boolean(),
});

export const OriginDraft = z.object({
  status: OriginStatus,
  regionOption: z.string().nullable(),
  experienceOption: z.string().nullable(),
  /** Catalogue option IDs only — never free text */
  goalsOptions: z.array(z.string()),
});

export const OnboardingCommand = z.object({
  type: OnboardingCommandType,
  idempotencyKey: z.string().min(1),
  actorRef: z.string().min(1),
  personalizationCatalogueVersion: z.string().optional(),
  originCatalogueVersion: z.string().optional(),
  crowOptionId: z.string().optional(),
  colorOptionId: z.string().optional(),
  styleOptionId: z.string().optional(),
  habitatOptionId: z.string().optional(),
  characterOptionId: z.string().optional(),
  accessoryOptionId: z.string().optional(),
  contrastOverrideAcknowledged: z.boolean().optional(),
  privacyPreviewAcknowledged: z.boolean().optional(),
  originRegionOption: z.string().optional(),
  originExperienceOption: z.string().optional(),
  originGoalsOptions: z.array(z.string()).max(3).optional(),
  reason: z.string().optional(),
  authority: z.string().optional(),
});

export const CosmeticsLockCode = z.enum([
  "HABITAT_LOCKED_PREVIEW_ONLY",
  "CHARACTER_LOCKED_PREVIEW_ONLY",
  "ACCESSORY_LOCKED_PREVIEW_ONLY",
]);

export const CosmeticsExplainableLock = z.object({
  code: CosmeticsLockCode,
  optionId: z.string(),
  messageAr: z.string(),
  messageEn: z.string().optional(),
  missingPrerequisite: z.string(),
  nextAction: z.string(),
  previewAllowed: z.boolean(),
  requiredForProgress: z.literal(false),
});

export const OnboardingResource = z.object({
  aggregateId: z.string(),
  state: OnboardingState,
  version: z.number().int().nonnegative(),
  personalizationCatalogueVersion: z.string(),
  originCatalogueVersion: z.string(),
  personalization: PersonalizationDraft,
  origin: OriginDraft,
  locks: z.array(CosmeticsExplainableLock),
  allowedNextActions: z.array(z.string()),
  accessibleScreens: z.array(z.string()),
  nestIntroHandoffAllowed: z.boolean(),
  /** Personalization / Origin never produce progression */
  progressionImpact: z.object({
    xp: z.literal(0),
    mastery: z.literal(0),
    rank: z.literal(0),
    prestige: z.literal(0),
    trust: z.literal(0),
  }),
  localOnly: z.literal(true),
  correlationId: z.string().optional(),
});

export const OnboardingCommandRequest = z.object({
  expectedVersion: z.number().int().nonnegative(),
  correlationId: z.string().optional(),
  personalizationCatalogueVersion: z.string().optional(),
  originCatalogueVersion: z.string().optional(),
  crowOptionId: z.string().optional(),
  colorOptionId: z.string().optional(),
  styleOptionId: z.string().optional(),
  habitatOptionId: z.string().optional(),
  characterOptionId: z.string().optional(),
  accessoryOptionId: z.string().optional(),
  contrastOverrideAcknowledged: z.boolean().optional(),
  privacyPreviewAcknowledged: z.boolean().optional(),
  originRegionOption: z.string().optional(),
  originExperienceOption: z.string().optional(),
  originGoalsOptions: z.array(z.string()).max(3).optional(),
});

export const OnboardingCommandResponse = z.object({
  correlationId: z.string(),
  aggregateVersion: z.number().int().nonnegative(),
  state: OnboardingState,
  idempotencyResult: z.enum(["applied", "replayed"]),
  resource: OnboardingResource,
});

export type ErrorCategory = z.infer<typeof ErrorCategory>;
export type ActivationState = z.infer<typeof ActivationState>;
export type ActivationCommand = z.infer<typeof ActivationCommand>;
export type ActivationCommandType = z.infer<typeof ActivationCommandType>;
export type ActivationResource = z.infer<typeof ActivationResource>;
export type ExplainableLock = z.infer<typeof ExplainableLock>;
export type ExplainableLockCode = z.infer<typeof ExplainableLockCode>;
export type ActivationGates = z.infer<typeof ActivationGates>;
export type OnboardingState = z.infer<typeof OnboardingState>;
export type OnboardingPath = z.infer<typeof OnboardingPath>;
export type PersonalizationStatus = z.infer<typeof PersonalizationStatus>;
export type OriginStatus = z.infer<typeof OriginStatus>;
export type OnboardingCommand = z.infer<typeof OnboardingCommand>;
export type OnboardingCommandType = z.infer<typeof OnboardingCommandType>;
export type PersonalizationDraft = z.infer<typeof PersonalizationDraft>;
export type OriginDraft = z.infer<typeof OriginDraft>;
export type OnboardingResource = z.infer<typeof OnboardingResource>;
export type CosmeticsExplainableLock = z.infer<typeof CosmeticsExplainableLock>;
export type CosmeticsLockCode = z.infer<typeof CosmeticsLockCode>;
