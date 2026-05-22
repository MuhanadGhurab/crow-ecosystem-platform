import type { ImplementationRequestStatus } from "@/lib/types/platform";

const WRITABLE_REQUEST_STATUSES: ImplementationRequestStatus[] = [
  "UNDER_DISCOVERY",
  "BLUEPRINT_BUILD",
];

/** Platform staff may edit discovery answers while the request is in discovery or blueprint build. */
export function canEditDiscovery(requestStatus: ImplementationRequestStatus): boolean {
  return WRITABLE_REQUEST_STATUSES.includes(requestStatus);
}

/** Completed / provisioned requests — discovery workspace is read-only but still navigable. */
export function isDiscoveryReadOnly(requestStatus: ImplementationRequestStatus): boolean {
  return !canEditDiscovery(requestStatus);
}
