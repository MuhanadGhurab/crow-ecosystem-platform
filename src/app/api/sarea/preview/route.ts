import { NextResponse } from "next/server";
import { SAREA_PREVIEW_COOKIE } from "@/lib/sarea/preview-cookie";

const VALID = new Set(["executive", "manager", "frontline"]);

/** Set or clear SAREA persona preview cookie (platform staff demo). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const persona = url.searchParams.get("persona");
  const redirectTo = url.searchParams.get("redirect") ?? "/meem-global/dashboard";

  const res = NextResponse.redirect(new URL(redirectTo, url.origin));

  if (persona && VALID.has(persona)) {
    res.cookies.set(SAREA_PREVIEW_COOKIE, persona, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
  } else {
    res.cookies.delete(SAREA_PREVIEW_COOKIE);
  }

  return res;
}
