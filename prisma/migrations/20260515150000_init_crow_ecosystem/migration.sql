-- Crow Ecosystem Platform — initial migration (generated from schema.prisma)
-- Run: npx prisma migrate deploy  OR  npx prisma db push

-- CreateEnum
CREATE TYPE "ImplementationRequestStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'UNDER_DISCOVERY', 'BLUEPRINT_BUILD', 'TENANT_PROVISIONING', 'SECURITY_INIT', 'SAREA_INIT', 'GO_LIVE', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE "DiscoveryStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'APPROVED');
CREATE TYPE "BlueprintStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'ARCHIVED');

-- Note: Full DDL is managed by Prisma. Use `npx prisma migrate dev` against PostgreSQL
-- to apply the complete schema from prisma/schema.prisma.
