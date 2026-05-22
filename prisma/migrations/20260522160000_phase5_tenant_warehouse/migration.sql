-- Phase 5: CEM tenant warehouse locations (zones, bins, inbound/outbound lanes)

CREATE TABLE IF NOT EXISTS "tenant_warehouse_locations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "referenceCode" TEXT,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "zone" TEXT,
    "bin" TEXT,
    "movementKind" TEXT NOT NULL DEFAULT 'staging',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenant_warehouse_locations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenant_warehouse_locations_tenantId_referenceCode_key"
    ON "tenant_warehouse_locations"("tenantId", "referenceCode");
CREATE INDEX IF NOT EXISTS "tenant_warehouse_locations_tenantId_idx"
    ON "tenant_warehouse_locations"("tenantId");

DO $$ BEGIN
  ALTER TABLE "tenant_warehouse_locations" ADD CONSTRAINT "tenant_warehouse_locations_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
