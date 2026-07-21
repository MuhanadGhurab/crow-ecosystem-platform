import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readMockMailbox } from "@ghuravia/provider-mocks";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../../lib/session";
import { jsonError, mapServiceError } from "../../../../lib/http";

/** Local/test only — never Production-capable. */
export async function GET() {
  try {
    assertLocalRuntime();
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);
    return NextResponse.json({
      localOnly: true,
      messages: readMockMailbox(session.contactRef),
    });
  } catch (e) {
    return mapServiceError(e);
  }
}
