-- I9 — Client organization membership & linkage (minimal, isolated tables).
-- This migration creates three tables used by the client organization model.
-- It does not backfill data or modify existing tables.

CREATE TABLE "client_organizations" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "industry" TEXT,
  "employeeBand" TEXT,
  "region" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "client_organization_members" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "supabaseUserId" TEXT NOT NULL,
  "email" TEXT,
  "role" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending_verification',
  "linkSource" TEXT NOT NULL DEFAULT 'invitation',
  "verifiedByProcrow" BOOLEAN NOT NULL DEFAULT FALSE,
  "verifiedAt" TIMESTAMPTZ,
  CONSTRAINT "client_organization_members_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "client_organizations"("id") ON DELETE CASCADE
);

CREATE INDEX "client_organization_members_supabaseUserId_idx"
  ON "client_organization_members"("supabaseUserId");

CREATE TABLE "client_organization_request_links" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "requestId" TEXT NOT NULL UNIQUE,
  CONSTRAINT "client_organization_request_links_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "client_organizations"("id") ON DELETE CASCADE,
  CONSTRAINT "client_organization_request_links_requestId_fkey"
    FOREIGN KEY ("requestId") REFERENCES "implementation_requests"("id") ON DELETE CASCADE
);

CREATE INDEX "client_organization_request_links_organizationId_idx"
  ON "client_organization_request_links"("organizationId");

