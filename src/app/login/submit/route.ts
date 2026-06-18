import { NextResponse } from "next/server";
import { resolveSignInSubmissionUrl } from "@/lib/actions/auth";

export const maxDuration = 60;

/** HTTP POST sign-in — real 303 redirect so session cookies persist (progressive enhancement). */
export async function POST(request: Request) {
  const formData = await request.formData();
  const path = await resolveSignInSubmissionUrl(formData);
  return NextResponse.redirect(new URL(path, request.url), 303);
}
