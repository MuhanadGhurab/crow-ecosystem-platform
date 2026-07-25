import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LivingMissionService } from "@ghuravia/data";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../../lib/session";
import { mapServiceError, jsonError } from "../../../../lib/http";
import { getDb } from "../../../../lib/server/db";

export async function GET() {
  try {
    assertLocalRuntime();
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);
    const { db } = getDb();
    const svc = new LivingMissionService(db);
    // Session.accountId equals activation_aggregates.id (receipt FK + ownership).
    const active = await svc.listActiveCanonical(session.accountId);
    return NextResponse.json({ resource: active });
  } catch (e) {
    return mapServiceError(e);
  }
}
