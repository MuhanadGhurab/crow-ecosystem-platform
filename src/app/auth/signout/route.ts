import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/login`, { status: 303 });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

/** RSC/link prefetch must not clear the Supabase session (C3.10E). */
export function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
