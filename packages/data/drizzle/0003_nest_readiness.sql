-- GHURAVIA Nest readiness assessment extension
-- Gate: GHV.IMPLEMENTATION.0E
-- Synthetic data only · disposable local PostgreSQL only — NOT Production-proven
-- Additive only · NO plaintext secrets · NO Origin fields in scoring tables
-- Reuses command_receipts, audit_events, outbox_events (do not duplicate)

ALTER TABLE "onboarding_aggregates"
  ADD COLUMN IF NOT EXISTS "nest_readiness_catalogue_version" text NOT NULL DEFAULT '0.1.0',
  ADD COLUMN IF NOT EXISTS "nest_attempt_id" text,
  ADD COLUMN IF NOT EXISTS "nest_attempt_status" text NOT NULL DEFAULT 'NONE',
  ADD COLUMN IF NOT EXISTS "nest_score" integer,
  ADD COLUMN IF NOT EXISTS "nest_band" text,
  ADD COLUMN IF NOT EXISTS "nest_weak_capability_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "nest_result_acknowledged" boolean NOT NULL DEFAULT false;

ALTER TABLE "onboarding_aggregates"
  DROP CONSTRAINT IF EXISTS "onboarding_aggregates_nest_attempt_status_check";
ALTER TABLE "onboarding_aggregates"
  ADD CONSTRAINT "onboarding_aggregates_nest_attempt_status_check"
  CHECK ("nest_attempt_status" IN ('NONE', 'IN_PROGRESS', 'SUBMITTED'));

ALTER TABLE "onboarding_aggregates"
  DROP CONSTRAINT IF EXISTS "onboarding_aggregates_nest_score_check";
ALTER TABLE "onboarding_aggregates"
  ADD CONSTRAINT "onboarding_aggregates_nest_score_check"
  CHECK ("nest_score" IS NULL OR ("nest_score" >= 0 AND "nest_score" <= 100));

ALTER TABLE "onboarding_aggregates"
  DROP CONSTRAINT IF EXISTS "onboarding_aggregates_nest_band_check";
ALTER TABLE "onboarding_aggregates"
  ADD CONSTRAINT "onboarding_aggregates_nest_band_check"
  CHECK (
    "nest_band" IS NULL
    OR "nest_band" IN ('READY_TO_FLY', 'GUIDED_SKIP', 'NEST_RECOMMENDED')
  );

CREATE TABLE IF NOT EXISTS "nest_readiness_attempts" (
  "id" text PRIMARY KEY NOT NULL,
  "onboarding_id" text NOT NULL REFERENCES "onboarding_aggregates"("id"),
  "catalogue_version" text NOT NULL,
  "status" text NOT NULL,
  "started_at" timestamp with time zone NOT NULL,
  "submitted_at" timestamp with time zone,
  "score" integer,
  "band" text,
  "weak_capability_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "version" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL,
  CONSTRAINT "nest_readiness_attempts_status_check"
    CHECK ("status" IN ('IN_PROGRESS', 'SUBMITTED')),
  CONSTRAINT "nest_readiness_attempts_score_check"
    CHECK ("score" IS NULL OR ("score" >= 0 AND "score" <= 100)),
  CONSTRAINT "nest_readiness_attempts_band_check"
    CHECK (
      "band" IS NULL
      OR "band" IN ('READY_TO_FLY', 'GUIDED_SKIP', 'NEST_RECOMMENDED')
    ),
  CONSTRAINT "nest_readiness_attempts_submitted_consistency_check"
    CHECK (
      ("status" = 'IN_PROGRESS' AND "submitted_at" IS NULL AND "score" IS NULL AND "band" IS NULL)
      OR ("status" = 'SUBMITTED' AND "submitted_at" IS NOT NULL AND "score" IS NOT NULL AND "band" IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS "nest_readiness_attempts_onboarding_id_idx"
  ON "nest_readiness_attempts" ("onboarding_id");

CREATE TABLE IF NOT EXISTS "nest_readiness_answers" (
  "id" text PRIMARY KEY NOT NULL,
  "attempt_id" text NOT NULL REFERENCES "nest_readiness_attempts"("id"),
  "item_id" text NOT NULL,
  "selected_option_id" text NOT NULL,
  "capability_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "correct" boolean NOT NULL,
  "saved_at" timestamp with time zone NOT NULL,
  CONSTRAINT "nest_readiness_answers_attempt_item_unique"
    UNIQUE ("attempt_id", "item_id")
);

CREATE INDEX IF NOT EXISTS "nest_readiness_answers_attempt_id_idx"
  ON "nest_readiness_answers" ("attempt_id");
