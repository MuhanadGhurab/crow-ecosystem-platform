import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createDb, ActivationCommandService } from "@ghuravia/data";
import { loadConfig } from "@ghuravia/config";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../lib/session";
import { mapServiceError, jsonError } from "../../../lib/http";

export async function GET() {
  try {
    assertLocalRuntime();
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);
    const config = loadConfig();
    const { db, sql } = createDb(config.GHURAVIA_DATABASE_URL);
    try {
      const svc = new ActivationCommandService(db);
      const resource = await svc.get(session.accountId);
      if (!resource) return jsonError("NOT_FOUND", "Activation not found", 404);
      return NextResponse.json(resource);
    } finally {
      await sql.end({ timeout: 5 });
    }
  } catch (e) {
    return mapServiceError(e);
  }
}
