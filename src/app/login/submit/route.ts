import { NextResponse, type NextRequest } from "next/server";
import { resolveSignInSubmissionUrl } from "@/lib/actions/auth";
import {
  createSupabaseRouteHandlerClient,
  mergeSupabaseCookies,
} from "@/lib/supabase/route-handler";

export const maxDuration = 60;

/** HTTP POST sign-in — real 303 redirect with Supabase session cookies on the response. */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const { supabase, cookieResponse } = createSupabaseRouteHandlerClient(request);
  const path = await resolveSignInSubmissionUrl(formData, supabase);
  const redirect = NextResponse.redirect(new URL(path, request.url), 303);
  return mergeSupabaseCookies(redirect, cookieResponse);
}
