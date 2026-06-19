import { type NextRequest, NextResponse } from "next/server";
import { resolveSignInSubmissionUrl } from "@/lib/actions/auth";
import { emitC3SessionDiagnostic } from "@/lib/account/c3-session-diagnostics";
import { createSupabaseRouteHandlerClient, clearStaleSupabaseAuthCookies } from "@/lib/supabase/route-handler";

export const maxDuration = 60;

/** HTTP POST sign-in — one 303 redirect with Supabase session cookies on the same response. */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const requestOrigin = new URL(request.url);

  const response = NextResponse.redirect(new URL("/account", request.url), {
    status: 303,
  });

  const clearedCookieNames = clearStaleSupabaseAuthCookies(request, response);
  const { supabase, cookieAudit } = createSupabaseRouteHandlerClient(
    request,
    response
  );

  const path = await resolveSignInSubmissionUrl(formData, supabase);
  const destination = new URL(path, request.url);

  response.headers.set(
    "Location",
    `${destination.pathname}${destination.search}`
  );
  response.headers.set("Cache-Control", "private, no-store");

  const cookieNames = cookieAudit.getSetCookieNames();
  const signInSucceeded = !path.startsWith("/login?");

  emitC3SessionDiagnostic("SIGNIN_SESSION_RETURNED", {
    outcome: signInSucceeded,
  });
  emitC3SessionDiagnostic("SIGNIN_SET_COOKIE_COUNT", {
    count: cookieNames.length,
  });
  emitC3SessionDiagnostic("SIGNIN_SET_COOKIE_NAMES", {
    cookieNames,
    clearedStaleCookieNames: clearedCookieNames,
  });
  emitC3SessionDiagnostic("SIGNIN_REDIRECT_HOST_MATCH", {
    requestHost: requestOrigin.host,
    destinationHost: destination.host,
    match: requestOrigin.host === destination.host,
  });
  emitC3SessionDiagnostic("SIGNIN_RESPONSE_RETURNED", {
    status: 303,
    locationPath: `${destination.pathname}${destination.search}`,
  });

  return response;
}
