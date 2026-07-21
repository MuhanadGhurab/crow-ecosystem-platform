-- GHURAVIA VALIDATION ONLY NOT PRODUCT SCHEMA
CREATE SCHEMA IF NOT EXISTS ghv_validation_1b;
SET search_path TO ghv_validation_1b;

CREATE TABLE activation (
  id text PRIMARY KEY,
  state text NOT NULL CHECK (state IN ('draft', 'active', 'revoked')),
  version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE idempotency (
  key text PRIMARY KEY,
  response text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE domain_event (
  sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aggregate_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE derived_ledger (
  scope_id text PRIMARY KEY,
  total integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE transactional_outbox (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_sequence bigint NOT NULL REFERENCES domain_event(sequence),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE audit_event (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action text NOT NULL,
  actor text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE learning_graph (
  parent_id text,
  node_id text PRIMARY KEY,
  label text NOT NULL
);
