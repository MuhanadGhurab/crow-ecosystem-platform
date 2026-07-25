import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LivingMissionService } from "@ghuravia/data";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../../../../lib/session";
import { mapServiceError, jsonError } from "../../../../../../lib/http";
import { getDb } from "../../../../../../lib/server/db";

type Cmd =
  | "start"
  | "select-choice"
  | "complete-debrief"
  | "start-echo"
  | "dismiss-suggestion"
  | "override-route";

export async function POST(
  request: Request,
  context: { params: Promise<{ command: string }> },
) {
  try {
    assertLocalRuntime();
    const { command } = await context.params;
    const cmd = command as Cmd;
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey) {
      return jsonError("VALIDATION_ERROR", "Idempotency-Key required", 400);
    }
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);
    const body = (await request.json().catch(() => ({}))) as {
      runId?: string;
      nodeId?: string;
      choiceId?: string;
      expectedVersion?: number;
      reflection?: string;
      interestHint?: "OPERATE" | "BUILD" | "UNSURE";
      forkNodeId?: string;
      routeId?: string;
      correlationId?: string;
    };
    const { db } = getDb();
    const svc = new LivingMissionService(db);
    // Session.accountId equals activation_aggregates.id (receipt FK + ownership).
    const learnerRef = session.accountId;

    switch (cmd) {
      case "start": {
        const out = await svc.startCanonical({
          learnerRef,
          idempotencyKey,
          correlationId: body.correlationId,
        });
        return NextResponse.json(out);
      }
      case "select-choice": {
        if (
          !body.runId ||
          !body.nodeId ||
          !body.choiceId ||
          typeof body.expectedVersion !== "number"
        ) {
          return jsonError(
            "VALIDATION_ERROR",
            "run/node/choice/version required",
            400,
          );
        }
        const out = await svc.selectChoice({
          runId: body.runId,
          learnerRef,
          nodeId: body.nodeId,
          choiceId: body.choiceId,
          expectedVersion: body.expectedVersion,
          idempotencyKey,
          correlationId: body.correlationId,
        });
        return NextResponse.json(out);
      }
      case "complete-debrief": {
        if (!body.runId || typeof body.expectedVersion !== "number") {
          return jsonError(
            "VALIDATION_ERROR",
            "runId/expectedVersion required",
            400,
          );
        }
        const out = await svc.completeDebrief({
          runId: body.runId,
          learnerRef,
          expectedVersion: body.expectedVersion,
          reflection: body.reflection,
          interestHint: body.interestHint,
          idempotencyKey,
          correlationId: body.correlationId,
        });
        return NextResponse.json(out);
      }
      case "start-echo": {
        if (!body.runId || !body.forkNodeId) {
          return jsonError(
            "VALIDATION_ERROR",
            "runId/forkNodeId required",
            400,
          );
        }
        const out = await svc.startEcho({
          canonicalRunId: body.runId,
          learnerRef,
          forkNodeId: body.forkNodeId,
          idempotencyKey,
          correlationId: body.correlationId,
        });
        return NextResponse.json(out);
      }
      case "dismiss-suggestion": {
        if (!body.runId || typeof body.expectedVersion !== "number") {
          return jsonError(
            "VALIDATION_ERROR",
            "runId/expectedVersion required",
            400,
          );
        }
        const resource = await svc.dismissSuggestion({
          runId: body.runId,
          learnerRef,
          expectedVersion: body.expectedVersion,
          idempotencyKey,
        });
        return NextResponse.json({ resource, idempotencyResult: "applied" });
      }
      case "override-route": {
        if (!body.runId || !body.routeId) {
          return jsonError("VALIDATION_ERROR", "runId/routeId required", 400);
        }
        const resource = await svc.overrideRoute({
          runId: body.runId,
          learnerRef,
          routeId: body.routeId,
          idempotencyKey,
        });
        return NextResponse.json({ resource, idempotencyResult: "applied" });
      }
      default:
        return jsonError("VALIDATION_ERROR", "Unknown command", 400);
    }
  } catch (e) {
    return mapServiceError(e);
  }
}
