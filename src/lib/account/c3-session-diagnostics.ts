import "server-only";

export type C3SessionDiagnosticStage =
  | "SIGNIN_SESSION_RETURNED"
  | "SIGNIN_SET_COOKIE_COUNT"
  | "SIGNIN_SET_COOKIE_NAMES"
  | "SIGNIN_REDIRECT_HOST_MATCH"
  | "SIGNIN_RESPONSE_RETURNED"
  | "NEXT_REQUEST_AUTH_COOKIE_COUNT"
  | "NEXT_REQUEST_IDENTITY_VALIDATED"
  | "MIDDLEWARE_AUTH_COOKIE_NAMES_RECEIVED"
  | "MIDDLEWARE_USER_VALIDATED"
  | "MIDDLEWARE_SESSION_REFRESHED"
  | "MIDDLEWARE_SET_COOKIE_NAMES"
  | "MIDDLEWARE_RESPONSE_ROUTE";

export function isC3SessionDiagnosticsEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" && process.env.C3_SESSION_DIAGNOSTICS === "true"
  );
}

/** Safe Preview session-proof API (`/api/c3/session-proof`). */
export function isC3SessionProofEnabled(): boolean {
  return isC3SessionDiagnosticsEnabled();
}

/** Safe session marker — cookie names and counts only; never values or tokens. */
export function emitC3SessionDiagnostic(
  stage: C3SessionDiagnosticStage,
  payload: Record<string, string | number | boolean | string[]>
): void {
  if (!isC3SessionDiagnosticsEnabled()) return;

  console.info(
    "[c3-session]",
    JSON.stringify({
      c3_session: true,
      stage,
      ...payload,
    })
  );
}
