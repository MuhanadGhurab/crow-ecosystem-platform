-- C3.10I — password recovery audit events
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'password_recovery_requested';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'password_recovery_succeeded';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'password_recovery_failed';
