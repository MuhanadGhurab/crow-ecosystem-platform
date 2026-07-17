import { NextResponse } from "next/server";
import { resolveRegistrationLegalSubmissionUrl } from "@/lib/actions/account-legal";

export const maxDuration = 60;

/** HTTP POST fallback for legal registration — real 303 redirect (progressive enhancement). */
export async function POST(request: Request) {
  const formData = await request.formData();
  const path = await resolveRegistrationLegalSubmissionUrl(formData);
  return NextResponse.redirect(new URL(path, request.url), 303);
}
