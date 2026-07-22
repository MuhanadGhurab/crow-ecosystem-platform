import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const activationAggregates = pgTable("activation_aggregates", {
  id: text().primaryKey(),
  state: text().notNull(),
  version: integer().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  accountRiskAcceptable: boolean("account_risk_acceptable")
    .notNull()
    .default(false),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
  riskAcceptedAt: timestamp("risk_accepted_at", { withTimezone: true }),
  termsVersion: text("terms_version"),
  riskDisclosureVersion: text("risk_disclosure_version"),
  contactRef: text("contact_ref"),
  latestCorrelationId: text("latest_correlation_id"),
});

export const auditEvents = pgTable("audit_events", {
  id: text().primaryKey(),
  actorRef: text("actor_ref").notNull(),
  action: text().notNull(),
  subject: text().notNull(),
  reason: text(),
  authority: text(),
  priorStateRef: text("prior_state_ref"),
  resultingStateRef: text("resulting_state_ref"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  correlationId: text("correlation_id").notNull(),
});

export const outboxEvents = pgTable(
  "outbox_events",
  {
    eventId: text("event_id").primaryKey(),
    eventType: text("event_type").notNull(),
    payload: jsonb().notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    status: text().notNull(),
    retryCount: integer("retry_count").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
  },
  (t) => [uniqueIndex("outbox_events_idempotency_key").on(t.idempotencyKey)],
);

export const verificationChallenges = pgTable("verification_challenges", {
  id: text().primaryKey(),
  aggregateId: text("aggregate_id").notNull(),
  purpose: text().notNull(),
  tokenHash: text("token_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  supersededAt: timestamp("superseded_at", { withTimezone: true }),
  failedAttemptCount: integer("failed_attempt_count").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(5),
  status: text().notNull(),
  correlationId: text("correlation_id").notNull(),
});

export const commandReceipts = pgTable(
  "command_receipts",
  {
    id: text().primaryKey(),
    aggregateId: text("aggregate_id").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    commandType: text("command_type").notNull(),
    requestFingerprint: text("request_fingerprint").notNull(),
    responseStatus: text("response_status").notNull(),
    resultRef: text("result_ref"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    correlationId: text("correlation_id").notNull(),
  },
  (t) => [
    uniqueIndex("command_receipts_aggregate_idempotency").on(
      t.aggregateId,
      t.idempotencyKey,
    ),
  ],
);

/** Crow personalization + Origin + Nest readiness — id equals activation_aggregates.id */
export const onboardingAggregates = pgTable("onboarding_aggregates", {
  id: text()
    .primaryKey()
    .references(() => activationAggregates.id),
  state: text().notNull(),
  version: integer().notNull(),
  personalizationCatalogueVersion: text(
    "personalization_catalogue_version",
  ).notNull(),
  originCatalogueVersion: text("origin_catalogue_version").notNull(),
  nestReadinessCatalogueVersion: text("nest_readiness_catalogue_version")
    .notNull()
    .default("0.1.0"),
  path: text(),
  crowOptionId: text("crow_option_id"),
  colorOptionId: text("color_option_id"),
  styleOptionId: text("style_option_id"),
  habitatOptionId: text("habitat_option_id"),
  characterOptionId: text("character_option_id"),
  accessoryOptionId: text("accessory_option_id"),
  personalizationStatus: text("personalization_status").notNull(),
  originStatus: text("origin_status").notNull(),
  originRegionOption: text("origin_region_option"),
  originExperienceOption: text("origin_experience_option"),
  originGoalsOptions: jsonb("origin_goals_options")
    .$type<string[]>()
    .notNull()
    .default([]),
  contrastOverrideAcknowledged: boolean("contrast_override_acknowledged")
    .notNull()
    .default(false),
  privacyPreviewAcknowledged: boolean("privacy_preview_acknowledged")
    .notNull()
    .default(false),
  nestAttemptId: text("nest_attempt_id"),
  nestAttemptStatus: text("nest_attempt_status").notNull().default("NONE"),
  nestScore: integer("nest_score"),
  nestBand: text("nest_band"),
  nestWeakCapabilityIds: jsonb("nest_weak_capability_ids")
    .$type<string[]>()
    .notNull()
    .default([]),
  nestResultAcknowledged: boolean("nest_result_acknowledged")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  latestCorrelationId: text("latest_correlation_id"),
});

export const nestReadinessAttempts = pgTable("nest_readiness_attempts", {
  id: text().primaryKey(),
  onboardingId: text("onboarding_id")
    .notNull()
    .references(() => onboardingAggregates.id),
  catalogueVersion: text("catalogue_version").notNull(),
  status: text().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  score: integer(),
  band: text(),
  weakCapabilityIds: jsonb("weak_capability_ids")
    .$type<string[]>()
    .notNull()
    .default([]),
  version: integer().notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const nestReadinessAnswers = pgTable(
  "nest_readiness_answers",
  {
    id: text().primaryKey(),
    attemptId: text("attempt_id")
      .notNull()
      .references(() => nestReadinessAttempts.id),
    itemId: text("item_id").notNull(),
    selectedOptionId: text("selected_option_id").notNull(),
    capabilityIds: jsonb("capability_ids")
      .$type<string[]>()
      .notNull()
      .default([]),
    correct: boolean().notNull(),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    uniqueIndex("nest_readiness_answers_attempt_item_unique").on(
      t.attemptId,
      t.itemId,
    ),
  ],
);
