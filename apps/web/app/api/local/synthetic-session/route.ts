import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  assertLocalRuntime,
  encodeSession,
  sessionCookieName,
  getSessionSecret,
} from "../../../../lib/session";
import { ActivationCommandService } from "@ghuravia/data";
import { mapServiceError, jsonError } from "../../../../lib/http";
import { getDb } from "../../../../lib/server/db";

export async function POST() {
  try {
    assertLocalRuntime();
    const accountId = randomUUID();
    const contactRef = `synthetic:${accountId.slice(0, 8)}`;
    const { db } = getDb();
    const svc = new ActivationCommandService(db);
    await svc.claimSyntheticAccount({
      aggregateId: accountId,
      contactRef,
      actorRef: contactRef,
      idempotencyKey: `claim:${accountId}`,
    });
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
