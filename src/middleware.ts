import type { NextRequest } from "next/server";
import { applyFtgpCertificationHostGate } from "@/lib/ftgp/ftgp-certification-host-gate";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const hostGate = applyFtgpCertificationHostGate(request);
  if (hostGate) return hostGate;
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
