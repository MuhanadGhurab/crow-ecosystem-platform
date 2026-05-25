import { prisma } from "@/lib/db";

const LOW_TRUST_LEVELS = new Set(["low", "untrusted", "unknown", "blocked"]);

export async function listTenantLoginEvents(tenantId: string, limit = 25) {
  return prisma.loginEvent.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listTenantSessionEvents(tenantId: string, limit = 25) {
  return prisma.sessionEvent.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listTenantAccessAttempts(tenantId: string, limit = 25) {
  return prisma.accessAttempt.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listTenantDeviceTrustRecords(tenantId: string, limit = 25) {
  return prisma.deviceTrustRecord.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type CybercrowIdentityTelemetrySummary = {
  loginEventCount: number;
  failedLoginCount: number;
  sessionEventCount: number;
  accessAttemptCount: number;
  deniedAccessCount: number;
  deviceTrustCount: number;
  lowTrustDeviceCount: number;
  hasStoredTelemetry: boolean;
  suspiciousIndicators: string[];
  sources: { table: string; description: string; available: boolean }[];
};

export async function getCybercrowIdentityTelemetrySummary(
  tenantId: string
): Promise<CybercrowIdentityTelemetrySummary> {
  const [
    loginEventCount,
    failedLoginCount,
    sessionEventCount,
    accessAttemptCount,
    deniedAccessCount,
    deviceTrustCount,
    lowTrustDevices,
  ] = await Promise.all([
    prisma.loginEvent.count({ where: { tenantId } }),
    prisma.loginEvent.count({ where: { tenantId, success: false } }),
    prisma.sessionEvent.count({ where: { tenantId } }),
    prisma.accessAttempt.count({ where: { tenantId } }),
    prisma.accessAttempt.count({ where: { tenantId, allowed: false } }),
    prisma.deviceTrustRecord.count({ where: { tenantId } }),
    prisma.deviceTrustRecord.count({
      where: {
        tenantId,
        trustLevel: { in: [...LOW_TRUST_LEVELS] },
      },
    }),
  ]);

  const hasStoredTelemetry =
    loginEventCount + sessionEventCount + accessAttemptCount + deviceTrustCount > 0;

  const suspiciousIndicators: string[] = [];
  if (failedLoginCount > 0) {
    suspiciousIndicators.push(`${failedLoginCount} failed login attempt(s) on record`);
  }
  if (deniedAccessCount > 0) {
    suspiciousIndicators.push(`${deniedAccessCount} denied resource access attempt(s)`);
  }
  if (lowTrustDevices > 0) {
    suspiciousIndicators.push(`${lowTrustDevices} device(s) with low or untrusted posture`);
  }

  const sources = [
    {
      table: "login_events",
      description: "Authentication success/failure with optional IP — written by auth flows when enabled.",
      available: loginEventCount > 0,
    },
    {
      table: "session_events",
      description: "Session lifecycle signals (create, refresh, revoke) — not live Entra inventory.",
      available: sessionEventCount > 0,
    },
    {
      table: "access_attempts",
      description: "Resource access allow/deny decisions from tenant middleware or policy checks.",
      available: accessAttemptCount > 0,
    },
    {
      table: "device_trust_records",
      description: "Device trust posture snapshots — advisory until device agents are connected.",
      available: deviceTrustCount > 0,
    },
    {
      table: "cybercrow_audit_logs",
      description: "Supplemental identity-related audit actions (LOGIN, MFA, SESSION) when present.",
      available: true,
    },
  ];

  return {
    loginEventCount,
    failedLoginCount,
    sessionEventCount,
    accessAttemptCount,
    deniedAccessCount,
    deviceTrustCount,
    lowTrustDeviceCount: lowTrustDevices,
    hasStoredTelemetry,
    suspiciousIndicators,
    sources,
  };
}
