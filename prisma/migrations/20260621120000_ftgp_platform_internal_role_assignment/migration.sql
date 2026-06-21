-- FTGP.0B — database-backed ProCrow internal role assignments
-- Classification: SHARED_DATABASE_MIGRATION | SECURITY_AUTHORITY_MODEL | CONTROLLED_APPLY_REQUIRED | PRODUCTION_COMPATIBILITY_REVIEW_REQUIRED
-- Rollback: DROP partial unique index, DROP table, DROP enums (only when no rows depend on them)

-- CreateEnum
CREATE TYPE "PlatformInternalRole" AS ENUM ('PLATFORM_ADMIN', 'IMPLEMENTER', 'SALES', 'AUDITOR_READONLY');

-- CreateEnum
CREATE TYPE "PlatformInternalRoleAssignmentStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- AlterEnum
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'platform_internal_role_granted';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'platform_internal_role_revoked';

-- CreateTable
CREATE TABLE "platform_internal_role_assignments" (
    "id" TEXT NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "role" "PlatformInternalRole" NOT NULL,
    "status" "PlatformInternalRoleAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "grantReason" TEXT NOT NULL,
    "grantCorrelationId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedByPlatformAccountId" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedByPlatformAccountId" TEXT,
    "revokeReason" TEXT,
    "revokeCorrelationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_internal_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "platform_internal_role_assignments_platformAccountId_status_idx" ON "platform_internal_role_assignments"("platformAccountId", "status");

-- CreateIndex
CREATE INDEX "platform_internal_role_assignments_role_status_idx" ON "platform_internal_role_assignments"("role", "status");

-- CreateIndex
CREATE INDEX "platform_internal_role_assignments_grantCorrelationId_idx" ON "platform_internal_role_assignments"("grantCorrelationId");

-- Partial unique index: at most one ACTIVE assignment per account + role
CREATE UNIQUE INDEX "platform_internal_role_assignments_one_active_per_role"
ON "platform_internal_role_assignments" ("platformAccountId", "role")
WHERE "status" = 'ACTIVE';

-- AddForeignKey
ALTER TABLE "platform_internal_role_assignments" ADD CONSTRAINT "platform_internal_role_assignments_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_internal_role_assignments" ADD CONSTRAINT "platform_internal_role_assignments_grantedByPlatformAccountId_fkey" FOREIGN KEY ("grantedByPlatformAccountId") REFERENCES "platform_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_internal_role_assignments" ADD CONSTRAINT "platform_internal_role_assignments_revokedByPlatformAccountId_fkey" FOREIGN KEY ("revokedByPlatformAccountId") REFERENCES "platform_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CLOUD.1B — fail-closed PostgREST exposure (server-only via Prisma/direct Postgres)
ALTER TABLE "platform_internal_role_assignments" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "platform_internal_role_assignments" FROM anon, authenticated;
