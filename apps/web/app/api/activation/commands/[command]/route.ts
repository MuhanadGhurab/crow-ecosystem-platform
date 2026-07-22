import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ActivationCommandService } from "@ghuravia/data";
import { deliverVerificationEmail } from "@ghuravia/provider-mocks";
import type { ActivationCommand } from "@ghuravia/contracts/schemas";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
  assertLocalRuntime,
} from "../../../../../lib/session";
import { mapServiceError, jsonError } from "../../../../../lib/http";
import { getEmailProviderMode } from "../../../../../lib/server/test-controls";
import { getDb } from "../../../../../lib/server/db";

type Cmd =
  | "request-email"
  | "confirm-email"
  | "accept-terms"
  | "accept-risk"
  | "activate"
  | "recover"
  | "resend";

const map: Record<Cmd, ActivationCommand["type"]> = {
  "request-email": "REQUEST_EMAIL_VERIFICATION",
  "confirm-email": "CONFIRM_EMAIL_VERIFICATION",
  "accept-terms": "ACCEPT_TERMS",
  "accept-risk": "ACCEPT_ACCOUNT_RISK",
  activate: "ACTIVATE",
  recover: "BEGIN_ACTIVATION_RECOVERY",
  resend: "REQUEST_REPLACEMENT_VERIFICATION",
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
      termsVersion?: string;
      riskDisclosureVersion?: string;
      token?: string;
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
    const svc = new ActivationCommandService(db);
    const command: ActivationCommand = {
      type: map[cmd],
      idempotencyKey,
      actorRef: session.contactRef,
      authority: "self",
      termsVersion: body.termsVersion,
      riskDisclosureVersion: body.riskDisclosureVersion,
      token: body.token,
    };
    const outcome = await svc.execute({
      aggregateId: session.accountId,
      command,
      expectedVersion: body.expectedVersion,
      correlationId: body.correlationId,
    });
    if (
      outcome.issuedToken &&
      outcome.contactRef &&
      (cmd === "request-email" || cmd === "resend")
    ) {
      const delivery = deliverVerificationEmail({
        contactRef: outcome.contactRef,
        token: outcome.issuedToken,
        correlationId: outcome.correlationId,
        outcome: getEmailProviderMode(),
      });
      if (delivery.outcome === "failure" || delivery.outcome === "timeout") {
        return jsonError(
          "PROVIDER_UNAVAILABLE",
          "Email provider mock unavailable",
          503,
          outcome.correlationId,
        );
      }
    }
    return NextResponse.json({
      correlationId: outcome.correlationId,
      aggregateVersion: outcome.aggregateVersion,
      state: outcome.state,
      idempotencyResult: outcome.idempotencyResult,
      resource: outcome.resource,
    });
  } catch (e) {
    return mapServiceError(e);
  }
}
