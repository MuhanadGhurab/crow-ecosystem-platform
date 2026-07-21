-- GHURAVIA Product Code foundation migration
-- Gate: GHV.IMPLEMENTATION.0A
-- Scope: activation aggregate, audit events, outbox events only
-- NO personal data columns
-- Local disposable PostgreSQL only — NOT Production-proven

CREATE TABLE IF NOT EXISTS "activation_aggregates" (
  "id" text PRIMARY KEY NOT NULL,
  "state" text NOT NULL,
  "version" integer NOT NULL,
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_events" (
  "id" text PRIMARY KEY NOT NULL,
  "actor_ref" text NOT NULL,
  "action" text NOT NULL,
  "subject" text NOT NULL,
  "reason" text,
  "authority" text,
  "prior_state_ref" text,
  "resulting_state_ref" text,
  "recorded_at" timestamp with time zone NOT NULL,
  "correlation_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "outbox_events" (
  "event_id" text PRIMARY KEY NOT NULL,
  "event_type" text NOT NULL,
  "payload" jsonb NOT NULL,
  "recorded_at" timestamp with time zone NOT NULL,
  "status" text NOT NULL,
  "retry_count" integer NOT NULL,
  "idempotency_key" text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "outbox_events_idempotency_key"
  ON "outbox_events" USING btree ("idempotency_key");
