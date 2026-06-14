export type TenantScope = {
  tenantId: string | null;
  isPlatformStaff: boolean;
};

export function assertTenantMatch(
  scope: TenantScope,
  resourceTenantId: string | null | undefined,
  context: string
): void {
  if (scope.isPlatformStaff) return;
  if (!scope.tenantId || !resourceTenantId) {
    throw new Error(`${context}: tenant ownership required`);
  }
  if (scope.tenantId !== resourceTenantId) {
    throw new Error(`${context}: cross-tenant access denied`);
  }
}

export function tenantWhereClause(scope: TenantScope): { tenantId: string } | undefined {
  if (scope.isPlatformStaff) return undefined;
  if (!scope.tenantId) {
    throw new Error("Tenant context required for non-platform access");
  }
  return { tenantId: scope.tenantId };
}
