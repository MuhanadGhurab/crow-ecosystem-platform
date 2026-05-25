-- Phase D: Organizational Intelligence — sector templates + discovery recommendations

CREATE TYPE "OrgIntelligenceStatus" AS ENUM ('RECOMMENDED', 'CUSTOMIZED', 'ACCEPTED');

CREATE TABLE "sector_templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "maturityLevel" TEXT DEFAULT 'growth',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "configJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sector_templates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sector_templates_key_key" ON "sector_templates"("key");

CREATE TABLE "discovery_org_intelligence" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "sectorTemplateKey" TEXT NOT NULL,
    "status" "OrgIntelligenceStatus" NOT NULL DEFAULT 'RECOMMENDED',
    "recommendationsJson" JSONB NOT NULL,
    "customizationsJson" JSONB,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discovery_org_intelligence_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "discovery_org_intelligence_profileId_key" ON "discovery_org_intelligence"("profileId");
CREATE INDEX "discovery_org_intelligence_sectorTemplateKey_idx" ON "discovery_org_intelligence"("sectorTemplateKey");

ALTER TABLE "discovery_org_intelligence" ADD CONSTRAINT "discovery_org_intelligence_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "discovery_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
