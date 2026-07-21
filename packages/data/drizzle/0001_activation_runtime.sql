-- GHURAVIA activation runtime extension
-- Gate: GHV.IMPLEMENTATION.0B
-- Local disposable PostgreSQL only — NOT Production-proven
-- NO plaintext verification tokens · NO real PII columns

ALTER TABLE "activation_aggregates"
  ADD COLUMN IF NOT EXISTS "email_verified" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "terms_accepted" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "account_risk_acceptable" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "email_verified_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "terms_accepted_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "risk_accepted_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "terms_version" text,
  ADD COLUMN IF NOT EXISTS "risk_disclosure_version" text,
  ADD COLUMN IF NOT EXISTS "contact_ref" text,
  ADD COLUMN IF NOT EXISTS "latest_correlation_id" text;

CREATE TABLE IF NOT EXISTS "verification_challenges" (
  "id" text PRIMARY KEY NOT NULL,
  "aggregate_id" text NOT NULL REFERENCES "activation_aggregates"("id"),
  "purpose" text NOT NULL,
  "token_hash" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "consumed_at" timestamp with time zone,
  "superseded_at" timestamp with time zone,
  "failed_attempt_count" integer NOT NULL DEFAULT 0,
  "max_attempts" integer NOT NULL DEFAULT 5,
  "status" text NOT NULL,
  "correlation_id" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "verification_challenges_aggregate_id"
  ON "verification_challenges" USING btree ("aggregate_id");

CREATE TABLE IF NOT EXISTS "command_receipts" (
  "id" text PRIMARY KEY NOT NULL,
  "aggregate_id" text NOT NULL REFERENCES "activation_aggregates"("id"),
  "idempotency_key" text NOT NULL,
  "command_type" text NOT NULL,
  "request_fingerprint" text NOT NULL,
  "response_status" text NOT NULL,
  "result_ref" text,
  "recorded_at" timestamp with time zone NOT NULL,
  "correlation_id" text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "command_receipts_aggregate_idempotency"
  ON "command_receipts" USING btree ("aggregate_id", "idempotency_key");
