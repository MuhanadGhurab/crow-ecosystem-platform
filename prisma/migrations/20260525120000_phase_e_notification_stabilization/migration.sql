-- Phase E: Platform notification stabilization (status split, severity, dedupe, updatedAt)

ALTER TABLE "platform_notifications" ADD COLUMN IF NOT EXISTS "deliveryStatus" TEXT NOT NULL DEFAULT 'logged';
ALTER TABLE "platform_notifications" ADD COLUMN IF NOT EXISTS "inboxStatus" TEXT NOT NULL DEFAULT 'open';
ALTER TABLE "platform_notifications" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "platform_notifications" ADD COLUMN IF NOT EXISTS "severity" TEXT;
ALTER TABLE "platform_notifications" ADD COLUMN IF NOT EXISTS "dedupeKey" TEXT;

-- Backfill deliveryStatus from legacy status
UPDATE "platform_notifications"
SET "deliveryStatus" = "status"
WHERE "status" IN ('logged', 'sent', 'skipped', 'failed');

UPDATE "platform_notifications"
SET "deliveryStatus" = 'logged'
WHERE "status" IN ('reviewed', 'dismissed');

-- Backfill inboxStatus (triage terminal states only)
UPDATE "platform_notifications"
SET "inboxStatus" = "status"
WHERE "status" IN ('reviewed', 'dismissed');

-- Severity backfill (matches severityForNotification rules)
UPDATE "platform_notifications"
SET "severity" = 'high'
WHERE "severity" IS NULL
  AND (
    "status" = 'failed'
    OR "deliveryStatus" = 'failed'
    OR "eventType" IN (
      'subscription_missing',
      'plan_mismatch_detected',
      'tenant_over_recommended_limit'
    )
  );

UPDATE "platform_notifications"
SET "severity" = 'medium'
WHERE "severity" IS NULL
  AND (
    "eventType" IN (
      'upgrade_recommended',
      'enterprise_capability_detected',
      'tenant_near_plan_limit'
    )
    OR COALESCE(("metadata"->>'advisory')::boolean, false) = true
  );

UPDATE "platform_notifications"
SET "severity" = 'low'
WHERE "severity" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "platform_notifications_dedupeKey_key" ON "platform_notifications"("dedupeKey");
CREATE INDEX IF NOT EXISTS "platform_notifications_inboxStatus_createdAt_idx" ON "platform_notifications"("inboxStatus", "createdAt");
CREATE INDEX IF NOT EXISTS "platform_notifications_deliveryStatus_idx" ON "platform_notifications"("deliveryStatus");
