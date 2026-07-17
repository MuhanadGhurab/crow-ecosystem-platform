import { NextResponse } from "next/server";
import {
  buildC3ProofIdentitySnapshot,
  isC3ProofDiagnosticsEnabled,
} from "@/lib/account/c3-proof-identity-diagnostics";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Preview-only authenticated proof identity diagnostic.
 * Enabled when C3_PROOF_DIAGNOSTICS=true on Vercel Preview.
 */
export async function GET() {
  if (!isC3ProofDiagnosticsEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await buildC3ProofIdentitySnapshot(user);

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
