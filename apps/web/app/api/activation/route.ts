import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ActivationCommandService } from "@ghuravia/data";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../lib/session";
import { mapServiceError, jsonError } from "../../../lib/http";
import { getDb } from "../../../lib/server/db";

export async function GET() {
  try {
    assertLocalRuntime();
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);
    const { db } = getDb();
    const svc = new ActivationCommandService(db);
    const resource = await svc.get(session.accountId);
    if (!resource) return jsonError("NOT_FOUND", "Activation not found", 404);
    return NextResponse.json(resource);
  } catch (e) {
    return mapServiceError(e);
  }
}
