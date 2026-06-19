import { type NextRequest, NextResponse } from "next/server";
import { resolveSignInSubmissionUrl } from "@/lib/actions/auth";
import { emitC3SessionDiagnostic } from "@/lib/account/c3-session-diagnostics";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

export const maxDuration = 60;

/** HTTP POST sign-in — 303 redirect with Supabase session cookies on the response. */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const requestOrigin = new URL(request.url);

  const stagingResponse = NextResponse.next({ request });
  const { supabase, cookieAudit } = createSupabaseRouteHandlerClient(
    request,
    stagingResponse
  );

  const path = await resolveSignInSubmissionUrl(formData, supabase);
  const destination = new URL(path, request.url);

  const response = NextResponse.redirect(destination, { status: 303 });
  for (const cookieHeader of stagingResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookieHeader);
  }
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
