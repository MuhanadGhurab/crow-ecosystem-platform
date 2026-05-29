import { NextResponse } from "next/server";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled, isSupabaseAuthConfigured } from "@/lib/supabase/env";
import {
  runPublicIntakeGuards,
  unexpectedIntakeFailure,
} from "@/lib/security/public-intake-guard";
import { createImplementationRequest, listImplementationRequests } from "@/lib/services/implementation-request.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const guard = await runPublicIntakeGuards({ request, body });
    if ("status" in guard) {
      const headers: HeadersInit = {};
      if (guard.retryAfterSec) {
        headers["Retry-After"] = String(guard.retryAfterSec);
      }
      return NextResponse.json(guard.body, { status: guard.status, headers });
    }

    if (!isAuthDisabled() && isSupabaseAuthConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) {
        return NextResponse.json(
          { error: "Sign in required to submit an enterprise request." },
          { status: 401 }
        );
      }
      const created = await createImplementationRequest(guard.data, { submittedByUserId: user.id });
      return NextResponse.json(
        { id: created.id, referenceCode: created.referenceCode, status: created.status },
        { status: 201 }
      );
    }

    const created = await createImplementationRequest(guard.data, { submittedByUserId: undefined });
    return NextResponse.json(
      { id: created.id, referenceCode: created.referenceCode, status: created.status },
      { status: 201 }
    );
  } catch (err) {
    console.error("[implementation-requests POST]", err);
    const failure = unexpectedIntakeFailure();
    return NextResponse.json(failure.body, { status: failure.status });
  }
}

export async function GET() {
  if (!isAuthDisabled()) {
    if (!isSupabaseAuthConfigured()) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { role } = getCrowAuth(user);
    if (!user || !isPlatformStaff(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const requests = await listImplementationRequests();
    return NextResponse.json(requests);
  } catch (err) {
    console.error("[implementation-requests GET]", err);
    const failure = unexpectedIntakeFailure();
    return NextResponse.json(failure.body, { status: failure.status });
  }
}
