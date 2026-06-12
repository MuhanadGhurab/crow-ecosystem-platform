-- M4C — Tenant membership invite acceptance (additive; TenantMembership unchanged).

CREATE TYPE "TenantMembershipInviteStatus" AS ENUM ('pending', 'accepted', 'revoked', 'expired');

CREATE TABLE "tenant_membership_invites" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "status" "TenantMembershipInviteStatus" NOT NULL DEFAULT 'pending',
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "invitedByUserId" TEXT NOT NULL,
  "acceptedByUserId" TEXT,
  "acceptedAt" TIMESTAMPTZ,
  "revokedAt" TIMESTAMPTZ,
  "revokedByUserId" TEXT,
  "operatorNote" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "tenant_membership_invites_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tenant_membership_invites_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "tenant_membership_invites_tokenHash_key" ON "tenant_membership_invites"("tokenHash");
CREATE INDEX "tenant_membership_invites_tenantId_idx" ON "tenant_membership_invites"("tenantId");
CREATE INDEX "tenant_membership_invites_email_idx" ON "tenant_membership_invites"("email");
CREATE INDEX "tenant_membership_invites_status_idx" ON "tenant_membership_invites"("status");
CREATE INDEX "tenant_membership_invites_expiresAt_idx" ON "tenant_membership_invites"("expiresAt");
