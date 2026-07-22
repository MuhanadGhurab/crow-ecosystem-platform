-- GHURAVIA onboarding personalization + Origin extension
-- Gate: GHV.IMPLEMENTATION.0D
-- Synthetic data only · disposable local PostgreSQL only — NOT Production-proven
-- NO prohibited PII columns (legal name, national ID, passport, precise address/GPS,
-- exact DOB, religion, tribe, ethnicity, medical, income, employer, school,
-- immigration, political opinion, unrestricted free text)
-- NO plaintext secrets
-- Reuses command_receipts, audit_events, outbox_events (do not duplicate)

CREATE TABLE IF NOT EXISTS "onboarding_aggregates" (
  "id" text PRIMARY KEY NOT NULL REFERENCES "activation_aggregates"("id"),
  "state" text NOT NULL,
  "version" integer NOT NULL,
  "personalization_catalogue_version" text NOT NULL,
  "origin_catalogue_version" text NOT NULL,
  "path" text,
  "crow_option_id" text,
  "color_option_id" text,
  "style_option_id" text,
  "habitat_option_id" text,
  "character_option_id" text,
  "accessory_option_id" text,
  "personalization_status" text NOT NULL,
  "origin_status" text NOT NULL,
  "origin_region_option" text,
  "origin_experience_option" text,
  "origin_goals_options" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "contrast_override_acknowledged" boolean NOT NULL DEFAULT false,
  "privacy_preview_acknowledged" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL,
  "latest_correlation_id" text
);
