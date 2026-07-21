import "server-only";
import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
export const activationAggregates = pgTable("activation_aggregates", {
  id: text().primaryKey(),
  state: text().notNull(),
  version: integer().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
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
