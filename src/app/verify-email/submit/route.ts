import { NextResponse } from "next/server";
import { resolveVerifyEmailSubmissionUrl } from "@/lib/actions/account";

export const maxDuration = 60;

/** HTTP POST fallback for OTP verification — real 303 redirect (progressive enhancement). */
export async function POST(request: Request) {
  const formData = await request.formData();
  const path = await resolveVerifyEmailSubmissionUrl(formData);
  return NextResponse.redirect(new URL(path, request.url), 303);
}
