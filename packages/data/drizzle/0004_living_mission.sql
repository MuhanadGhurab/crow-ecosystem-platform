-- GHURAVIA Living Mission runtime — First Flight Black Signal
-- Gate: GHV.IMPLEMENTATION.0F · Auth: GHV-IMP-AUTH-006
-- Synthetic data only · disposable local PostgreSQL only — NOT Production-proven
-- Additive only · PRIVATE learner data · NO plaintext secrets
-- Reuses command_receipts, audit_events, outbox_events

CREATE TABLE IF NOT EXISTS "mission_runs" (
  "id" text PRIMARY KEY NOT NULL,
  "learner_ref" text NOT NULL,
  "mission_id" text NOT NULL,
  "mission_version" text NOT NULL,
  "ruleset_version" text NOT NULL,
  "kind" text NOT NULL,
  "status" text NOT NULL,
  "current_node_id" text,
  "world" jsonb NOT NULL,
  "world_hash" text NOT NULL,
  "signals" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "choice_history" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "outcome_id" text,
  "parent_run_id" text REFERENCES "mission_runs"("id"),
  "echo_fork_node_id" text,
  "version" integer NOT NULL DEFAULT 0,
  "crowprint" jsonb,
  "suggestion" jsonb,
  "flight_log" jsonb,
  "route_recommendation" jsonb,
  "reflection" text,
  "route_override" text,
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL,
  "completed_at" timestamp with time zone,
  "latest_correlation_id" text,
  CONSTRAINT "mission_runs_kind_check"
    CHECK ("kind" IN ('CANONICAL', 'ECHO')),
  CONSTRAINT "mission_runs_status_check"
    CHECK ("status" IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED'))
);

CREATE INDEX IF NOT EXISTS "mission_runs_learner_ref_idx"
  ON "mission_runs" ("learner_ref");
CREATE INDEX IF NOT EXISTS "mission_runs_parent_run_id_idx"
  ON "mission_runs" ("parent_run_id");

CREATE TABLE IF NOT EXISTS "mission_events" (
  "id" text PRIMARY KEY NOT NULL,
  "run_id" text NOT NULL REFERENCES "mission_runs"("id"),
  "seq" integer NOT NULL,
  "event_type" text NOT NULL,
  "actor_ref" text NOT NULL,
  "mission_version" text NOT NULL,
  "node_id" text,
  "choice_id" text,
  "prior_state_hash" text,
  "resulting_state_hash" text,
  "state_effects" jsonb,
  "signals_emitted" jsonb,
  "idempotency_key" text NOT NULL,
  "correlation_id" text NOT NULL,
  "ruleset_version" text NOT NULL,
  "recorded_at" timestamp with time zone NOT NULL,
  CONSTRAINT "mission_events_run_seq_unique" UNIQUE ("run_id", "seq"),
  CONSTRAINT "mission_events_run_idempotency_unique" UNIQUE ("run_id", "idempotency_key")
);

CREATE TABLE IF NOT EXISTS "mission_snapshots" (
  "id" text PRIMARY KEY NOT NULL,
  "run_id" text NOT NULL REFERENCES "mission_runs"("id"),
  "seq" integer NOT NULL,
  "node_id" text,
  "world" jsonb NOT NULL,
  "world_hash" text NOT NULL,
  "signals" jsonb NOT NULL,
  "choice_history" jsonb NOT NULL,
  "version" integer NOT NULL,
  "recorded_at" timestamp with time zone NOT NULL,
  CONSTRAINT "mission_snapshots_run_seq_unique" UNIQUE ("run_id", "seq")
);
