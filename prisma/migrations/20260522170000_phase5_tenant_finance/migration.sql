-- Phase 5: CEM tenant finance entries (AR/AP invoices and payments)

CREATE TABLE IF NOT EXISTS "tenant_finance_entries" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "referenceCode" TEXT,
    "title" TEXT NOT NULL,
    "entryType" TEXT NOT NULL DEFAULT 'invoice',
    "direction" TEXT NOT NULL DEFAULT 'ar',
    "status" TEXT NOT NULL DEFAULT 'open',
    "amountSar" INTEGER,
    "customerName" TEXT,
    "linkedReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenant_finance_entries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenant_finance_entries_tenantId_referenceCode_key"
    ON "tenant_finance_entries"("tenantId", "referenceCode");
CREATE INDEX IF NOT EXISTS "tenant_finance_entries_tenantId_idx"
    ON "tenant_finance_entries"("tenantId");

DO $$ BEGIN
  ALTER TABLE "tenant_finance_entries" ADD CONSTRAINT "tenant_finance_entries_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
