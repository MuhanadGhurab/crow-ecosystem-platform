/** CROW.REQUEST.2 — legacy ERP intake is retired in favor of the canonical service request wizard. */

export const LEGACY_IMPLEMENTATION_REQUEST_INTAKE_DISABLED = true as const;

export const LEGACY_IMPLEMENTATION_REQUEST_INTAKE_MESSAGE =
  "The legacy request form is no longer available. Sign in and start a service request at /client/requests/new.";

export function assertLegacyImplementationRequestIntakeDisabled(): void {
  if (LEGACY_IMPLEMENTATION_REQUEST_INTAKE_DISABLED) {
    throw new Error(LEGACY_IMPLEMENTATION_REQUEST_INTAKE_MESSAGE);
  }
}
