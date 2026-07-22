import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { OnboardingCommandService } from "@ghuravia/data";
import type { OnboardingCommand } from "@ghuravia/contracts/schemas";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../../../lib/session";
import { mapServiceError, jsonError } from "../../../../../lib/http";
import { getDb } from "../../../../../lib/server/db";
import { getIdempotencyEvidence } from "../../../../../lib/server/test-evidence";

type Cmd =
  | "begin-guided"
  | "begin-quick-start"
  | "save-crow-basics"
  | "select-habitat"
  | "select-character"
  | "save-personalization-review"
  | "save-origin-draft"
  | "mark-origin-review-later"
  | "complete-origin"
  | "ack-nest-intro";

const map: Record<Cmd, OnboardingCommand["type"]> = {
  "begin-guided": "BEGIN_GUIDED_PERSONALIZATION",
  "begin-quick-start": "BEGIN_QUICK_START",
  "save-crow-basics": "SAVE_CROW_BASICS",
  "select-habitat": "SELECT_HABITAT",
  "select-character": "SELECT_CHARACTER",
  "save-personalization-review": "SAVE_PERSONALIZATION_REVIEW",
  "save-origin-draft": "SAVE_ORIGIN_DRAFT",
  "mark-origin-review-later": "MARK_ORIGIN_REVIEW_LATER",
  "complete-origin": "COMPLETE_ORIGIN",
  "ack-nest-intro": "ACK_NEST_INTRO_HANDOFF",
};

export async function POST(
  request: Request,
  context: { params: Promise<{ command: string }> },
) {
  try {
    assertLocalRuntime();
    const { command: commandPath } = await context.params;
    const cmd = commandPath as Cmd;
    if (!(cmd in map)) {
      return jsonError("VALIDATION_ERROR", "Unknown command", 400);
    }
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey) {
      return jsonError("VALIDATION_ERROR", "Idempotency-Key required", 400);
    }
    const body = (await request.json().catch(() => ({}))) as {
      expectedVersion?: number;
      correlationId?: string;
      personalizationCatalogueVersion?: string;
      originCatalogueVersion?: string;
      crowOptionId?: string;
      colorOptionId?: string;
      styleOptionId?: string;
      habitatOptionId?: string;
      characterOptionId?: string;
      accessoryOptionId?: string;
      contrastOverrideAcknowledged?: boolean;
      privacyPreviewAcknowledged?: boolean;
      originRegionOption?: string;
      originExperienceOption?: string;
      originGoalsOptions?: string[];
      reason?: string;
    };
    if (typeof body.expectedVersion !== "number") {
      return jsonError("VALIDATION_ERROR", "expectedVersion required", 400);
    }
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (!raw) return jsonError("UNAUTHORIZED", "No session", 401);
    const session = decodeSession(raw, getSessionSecret());
    if (!session) return jsonError("UNAUTHORIZED", "Invalid session", 401);

    const { db } = getDb();
    const svc = new OnboardingCommandService(db);
    const command: OnboardingCommand = {
      type: map[cmd],
      idempotencyKey,
      actorRef: session.contactRef,
      authority: "self",
      personalizationCatalogueVersion: body.personalizationCatalogueVersion,
      originCatalogueVersion: body.originCatalogueVersion,
      crowOptionId: body.crowOptionId,
      colorOptionId: body.colorOptionId,
      styleOptionId: body.styleOptionId,
      habitatOptionId: body.habitatOptionId,
      characterOptionId: body.characterOptionId,
      accessoryOptionId: body.accessoryOptionId,
      contrastOverrideAcknowledged: body.contrastOverrideAcknowledged,
      privacyPreviewAcknowledged: body.privacyPreviewAcknowledged,
      originRegionOption: body.originRegionOption,
      originExperienceOption: body.originExperienceOption,
      originGoalsOptions: body.originGoalsOptions,
      reason: body.reason,
    };
    const outcome = await svc.execute({
      aggregateId: session.accountId,
      command,
      expectedVersion: body.expectedVersion,
      correlationId: body.correlationId,
    });
    return NextResponse.json({
      correlationId: outcome.correlationId,
      aggregateVersion: outcome.aggregateVersion,
      state: outcome.state,
      idempotencyResult: outcome.idempotencyResult,
      resource: outcome.resource,
    });
  } catch (e) {
    if (
      e instanceof Error &&
      e.name === "IDEMPOTENCY_CONFLICT" &&
      !extractAttachedCorrelation(e)
    ) {
      try {
        const key = request.headers.get("Idempotency-Key");
        const jar = await cookies();
        const raw = jar.get(sessionCookieName())?.value;
        const session = raw ? decodeSession(raw, getSessionSecret()) : null;
        if (key && session) {
          const evidence = await getIdempotencyEvidence({
            aggregateId: session.accountId,
            contactRef: session.contactRef,
            idempotencyKey: key,
          });
          const corr = evidence.receipts[0]?.correlationId;
          if (corr) {
            return jsonError("IDEMPOTENCY_CONFLICT", e.message, 409, corr);
          }
        }
      } catch {
        /* fall through to generic mapper */
      }
    }
    return mapServiceError(e);
  }
}

function extractAttachedCorrelation(e: Error): string | undefined {
  if (
    "correlationId" in e &&
    typeof (e as { correlationId?: unknown }).correlationId === "string"
  ) {
    return (e as { correlationId: string }).correlationId;
  }
  return undefined;
}
