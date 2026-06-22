import type { PrismaClient } from "@prisma/client";

export type Cloud1hDatabaseBaseline = {
  implementationRequests: number;
  tenantMemberships: number;
  platformAccounts: number;
  clientOrganizationMembers: number;
  platformProviderIdentities: number;
  internalRoleAssignments: number;
  internalRoleGrantAuditEvents: number;
  internalRoleRevokeAuditEvents: number;
  legalAcceptances: number;
  migrationApplied: number;
  migrationFailed: number;
  migrationPending: number;
};

export async function captureCloud1hDatabaseBaseline(
  prisma: PrismaClient
): Promise<Cloud1hDatabaseBaseline> {
  const [
    implementationRequests,
    tenantMemberships,
    platformAccounts,
    clientOrganizationMembers,
    platformProviderIdentities,
    internalRoleAssignments,
    internalRoleGrantAuditEvents,
    internalRoleRevokeAuditEvents,
    legalAcceptances,
    migrationRows,
  ] = await Promise.all([
    prisma.implementationRequest.count(),
    prisma.tenantMembership.count(),
    prisma.platformAccount.count(),
    prisma.clientOrganizationMember.count(),
    prisma.platformProviderIdentity.count(),
    prisma.platformInternalRoleAssignment.count({
      where: { status: "ACTIVE" },
    }),
    prisma.platformAccountAuditEvent.count({
      where: { eventType: "platform_internal_role_granted" },
    }),
    prisma.platformAccountAuditEvent.count({
      where: { eventType: "platform_internal_role_revoked" },
    }),
    prisma.accountLegalAcceptance.count(),
    prisma.$queryRaw<Array<{ finished_at: Date | null }>>`
      SELECT finished_at FROM "_prisma_migrations"
    `,
  ]);

  const migrationApplied = migrationRows.filter((r) => r.finished_at !== null).length;
  const migrationFailed = migrationRows.filter((r) => r.finished_at === null).length;
  const migrationPending = 0;

  return {
    implementationRequests,
    tenantMemberships,
    platformAccounts,
    clientOrganizationMembers,
    platformProviderIdentities,
    internalRoleAssignments,
    internalRoleGrantAuditEvents,
    internalRoleRevokeAuditEvents,
    legalAcceptances,
    migrationApplied,
    migrationFailed,
    migrationPending,
  };
}

export const CLOUD_1H_BASELINE_EXPECTED = {
  implementationRequests: 7,
  tenantMemberships: 3,
  platformAccounts: 11,
  clientOrganizationMembers: 0,
  platformProviderIdentities: 4,
  internalRoleAssignments: 0,
} as const;

export function assertCloud1hBaselineUnchanged(
  baseline: Cloud1hDatabaseBaseline,
  label: string
): void {
  const checks: Array<[keyof typeof CLOUD_1H_BASELINE_EXPECTED, number]> = [
    ["implementationRequests", baseline.implementationRequests],
    ["tenantMemberships", baseline.tenantMemberships],
    ["platformAccounts", baseline.platformAccounts],
    ["clientOrganizationMembers", baseline.clientOrganizationMembers],
    ["platformProviderIdentities", baseline.platformProviderIdentities],
    ["internalRoleAssignments", baseline.internalRoleAssignments],
  ];
  for (const [key, actual] of checks) {
    const expected = CLOUD_1H_BASELINE_EXPECTED[key];
    if (actual !== expected) {
      throw new Error(`${label}: ${key} expected ${expected}, got ${actual}`);
    }
  }
}

export function printCloud1hBaseline(baseline: Cloud1hDatabaseBaseline, label: string): void {
  console.log(`\n=== ${label} ===\n`);
  console.log(`  implementation_requests=${baseline.implementationRequests}`);
  console.log(`  tenant_memberships=${baseline.tenantMemberships}`);
  console.log(`  platform_accounts=${baseline.platformAccounts}`);
  console.log(`  client_organization_members=${baseline.clientOrganizationMembers}`);
  console.log(`  platform_provider_identities=${baseline.platformProviderIdentities}`);
  console.log(`  internal_role_assignments=${baseline.internalRoleAssignments}`);
  console.log(`  internal_role_grant_audit_events=${baseline.internalRoleGrantAuditEvents}`);
  console.log(`  legal_acceptances=${baseline.legalAcceptances}`);
  console.log(`  migrations_applied=${baseline.migrationApplied}`);
  console.log(`  migrations_failed=${baseline.migrationFailed}`);
}
