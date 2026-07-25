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

export async function GET(req: Request) {
  try {
    assertLocalRuntime();
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);
    const { db } = getDb();
    const svc = new LivingMissionService(db);
    const runId = new URL(req.url).searchParams.get("runId");
    if (runId) {
      try {
        const resource = await svc.getRun(runId, session.accountId);
        if (!resource) return jsonError("NOT_FOUND", "Run not found", 404);
        return NextResponse.json({ resource });
      } catch (e) {
        if (e instanceof Error && e.name === "UNAUTHORIZED") {
          return jsonError("FORBIDDEN", "Not run owner", 403);
        }
        throw e;
      }
    }
    // Session.accountId equals activation_aggregates.id (receipt FK + ownership).
    const active = await svc.listPreferredActive(session.accountId);
    return NextResponse.json({ resource: active });
  } catch (e) {
    return mapServiceError(e);
  }
}
