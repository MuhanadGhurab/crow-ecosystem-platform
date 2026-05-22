-- Phase 5: CEM tenant sales opportunities (quotes, orders, B2B deals)

CREATE TABLE IF NOT EXISTS "tenant_sales_opportunities" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "crmAccountId" TEXT,
    "referenceCode" TEXT,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'opportunity',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "customerName" TEXT,
    "amountSar" INTEGER,
    "workflowName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenant_sales_opportunities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenant_sales_opportunities_tenantId_referenceCode_key"
    ON "tenant_sales_opportunities"("tenantId", "referenceCode");
CREATE INDEX IF NOT EXISTS "tenant_sales_opportunities_tenantId_idx"
    ON "tenant_sales_opportunities"("tenantId");

DO $$ BEGIN
  ALTER TABLE "tenant_sales_opportunities" ADD CONSTRAINT "tenant_sales_opportunities_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "tenant_sales_opportunities" ADD CONSTRAINT "tenant_sales_opportunities_crmAccountId_fkey"
    FOREIGN KEY ("crmAccountId") REFERENCES "crm_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
