/** Dept ownership chips derived from implementation request data (not static defaults). */

import { getSareaPackageKey, type DiscoveryAnswerRow } from "@/lib/discovery-answers";

export type RequestDeptContext = {
  hasSecurity: boolean;
  hasModules: boolean;
  /** SAREA experience — relevant during discovery / blueprint / live tenant */
  showSarea: boolean;
};

const SAREA_ACTIVE_STATUSES = new Set([
  "UNDER_DISCOVERY",
  "BLUEPRINT_BUILD",
  "TENANT_PROVISIONING",
  "SECURITY_INIT",
  "SAREA_INIT",
  "GO_LIVE",
  "READY_FOR_GO_LIVE",
  "TENANT_LIVE",
]);

export function getRequestDeptContext(input: {
  status: string;
  securityPackageCount?: number;
  moduleCount?: number;
  /** True when discovery `experience.sareaPackageKey` is set */
  hasSareaPackage?: boolean;
}): RequestDeptContext {
  const hasSecurity = (input.securityPackageCount ?? 0) > 0;
  const hasModules = (input.moduleCount ?? 0) > 0;
  const showSarea =
    Boolean(input.hasSareaPackage) || SAREA_ACTIVE_STATUSES.has(input.status);

  return { hasSecurity, hasModules, showSarea };
}

export function getRequestDeptContextFromRow(row: {
  status: string;
  requestedSecurityPkgs?: { length: number };
  requestedModules?: { length: number };
  discoveryProfile?: { answers: DiscoveryAnswerRow[] } | null;
}): RequestDeptContext {
  const hasSareaPackage = Boolean(
    row.discoveryProfile?.answers && getSareaPackageKey(row.discoveryProfile.answers)
  );
  return getRequestDeptContext({
    status: row.status,
    securityPackageCount: row.requestedSecurityPkgs?.length ?? 0,
    moduleCount: row.requestedModules?.length ?? 0,
    hasSareaPackage,
  });
}
