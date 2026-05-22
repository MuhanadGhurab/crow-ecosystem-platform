/** Dept ownership chips derived from implementation request data (not static defaults). */

export type RequestDeptContext = {
  hasSecurity: boolean;
  hasModules: boolean;
  /** SAREA experience — relevant during discovery / blueprint / live tenant */
  showSarea: boolean;
};

const SAREA_ACTIVE_STATUSES = new Set([
  "UNDER_DISCOVERY",
  "BLUEPRINT_BUILD",
  "READY_FOR_GO_LIVE",
  "TENANT_LIVE",
]);

export function getRequestDeptContext(input: {
  status: string;
  securityPackageCount?: number;
  moduleCount?: number;
}): RequestDeptContext {
  const hasSecurity = (input.securityPackageCount ?? 0) > 0;
  const hasModules = (input.moduleCount ?? 0) > 0;
  const showSarea = SAREA_ACTIVE_STATUSES.has(input.status);

  return { hasSecurity, hasModules, showSarea };
}

export function getRequestDeptContextFromRow(row: {
  status: string;
  requestedSecurityPkgs?: { length: number };
  requestedModules?: { length: number };
}): RequestDeptContext {
  return getRequestDeptContext({
    status: row.status,
    securityPackageCount: row.requestedSecurityPkgs?.length ?? 0,
    moduleCount: row.requestedModules?.length ?? 0,
  });
}
