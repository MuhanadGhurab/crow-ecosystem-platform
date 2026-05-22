-- Phase 5: CEM tenant inventory items (stock, warehouses)

CREATE TABLE IF NOT EXISTS "tenant_inventory_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "referenceCode" TEXT,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "qtyOnHand" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenant_inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenant_inventory_items_tenantId_referenceCode_key"
    ON "tenant_inventory_items"("tenantId", "referenceCode");
CREATE INDEX IF NOT EXISTS "tenant_inventory_items_tenantId_idx"
    ON "tenant_inventory_items"("tenantId");

DO $$ BEGIN
  ALTER TABLE "tenant_inventory_items" ADD CONSTRAINT "tenant_inventory_items_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
