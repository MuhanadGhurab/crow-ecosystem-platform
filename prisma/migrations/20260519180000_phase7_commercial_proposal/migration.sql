-- Phase 7.5: Commercial proposal on blueprint
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'CLIENT_APPROVED', 'DECLINED');

ALTER TABLE "enterprise_blueprints"
  ADD COLUMN "proposalStatus" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "proposalToken" TEXT,
  ADD COLUMN "proposalSentAt" TIMESTAMP(3),
  ADD COLUMN "clientApprovedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "enterprise_blueprints_proposalToken_key" ON "enterprise_blueprints"("proposalToken");
