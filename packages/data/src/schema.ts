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
