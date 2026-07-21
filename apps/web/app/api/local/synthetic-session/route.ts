import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  assertLocalRuntime,
  encodeSession,
  sessionCookieName,
  getSessionSecret,
} from "../../../../lib/session";
import { createDb, ActivationCommandService } from "@ghuravia/data";
import { mapServiceError, jsonError } from "../../../../lib/http";

export async function POST() {
  try {
    const config = assertLocalRuntime();
    const accountId = randomUUID();
    const contactRef = `synthetic:${accountId.slice(0, 8)}`;
    const { db, sql } = createDb(config.GHURAVIA_DATABASE_URL);
    try {
      const svc = new ActivationCommandService(db);
      await svc.claimSyntheticAccount({
        aggregateId: accountId,
        contactRef,
        actorRef: contactRef,
        idempotencyKey: `claim:${accountId}`,
      });
    } finally {
      await sql.end({ timeout: 5 });
    }
    const token = encodeSession(
      { accountId, contactRef, issuedAt: Date.now() },
      getSessionSecret(),
    );
    const res = NextResponse.json({
      accountId,
      contactRef,
      localOnly: true,
    });
    res.cookies.set(sessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
    });
    return res;
  } catch (e) {
    if (e instanceof Error && e.message.includes("LOCAL_RUNTIME_ONLY")) {
      return jsonError("LOCAL_RUNTIME_ONLY", e.message, 403);
    }
    return mapServiceError(e);
  }
}

export async function GET() {
  const jar = await cookies();
  if (!jar.get(sessionCookieName())) {
    return jsonError("UNAUTHORIZED", "No synthetic session", 401);
  }
  return NextResponse.json({ hasSession: true, localOnly: true });
}
