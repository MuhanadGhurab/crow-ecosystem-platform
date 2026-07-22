import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  assertLocalRuntime,
  decodeSession,
  getSessionSecret,
  sessionCookieName,
} from "../../../../lib/session";
import { jsonError, mapServiceError } from "../../../../lib/http";
import {
  bumpAggregateVersion,
  expireActiveChallenges,
  getEmailProviderMode,
  resetEmailProviderMode,
  setEmailProviderMode,
} from "../../../../lib/server/test-controls";
import type { MockOutcome } from "@ghuravia/provider-mocks";

const MODES: MockOutcome[] = ["success", "failure", "timeout", "duplicate"];

async function requireTestSession(): Promise<{ accountId: string }> {
  assertLocalRuntime();
  const jar = await cookies();
  const raw = jar.get(sessionCookieName())?.value;
  if (!raw) {
    const err = new Error("UNAUTHORIZED");
    err.name = "UNAUTHORIZED";
    throw err;
  }
  const session = decodeSession(raw, getSessionSecret());
  if (!session) {
    const err = new Error("UNAUTHORIZED");
    err.name = "UNAUTHORIZED";
    throw err;
  }
  return { accountId: session.accountId };
}

export async function GET() {
  try {
    assertLocalRuntime();
    return NextResponse.json({
      emailProviderMode: getEmailProviderMode(),
      testingOnly: true,
    });
  } catch (e) {
    return mapServiceError(e);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireTestSession();
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      mode?: string;
    };
    switch (body.action) {
      case "provider-mode": {
        if (!body.mode || !MODES.includes(body.mode as MockOutcome)) {
          return jsonError("VALIDATION_ERROR", "Invalid mode", 400);
        }
        setEmailProviderMode(body.mode as MockOutcome);
        return NextResponse.json({
          emailProviderMode: getEmailProviderMode(),
        });
      }
      case "provider-mode-reset": {
        resetEmailProviderMode();
        return NextResponse.json({
          emailProviderMode: getEmailProviderMode(),
        });
      }
      case "challenge-expire": {
        const n = await expireActiveChallenges(session.accountId);
        return NextResponse.json({ expired: n });
      }
      case "aggregate-version-bump": {
        const version = await bumpAggregateVersion(session.accountId);
        return NextResponse.json({ version });
      }
      case "session-expire": {
        const jar = await cookies();
        jar.set(sessionCookieName(), "", {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        });
        return NextResponse.json({ expired: true });
      }
      default:
        return jsonError("VALIDATION_ERROR", "Unknown action", 400);
    }
  } catch (e) {
    return mapServiceError(e);
  }
}
