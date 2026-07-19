/**
 * CROW.DEVFLOW.5 — Guarded demo feedback persistence (PlatformNotification).
 *
 * Migration-free. Distinct eventType. Excluded from default ProCrow notification inbox.
 * Does not create Request / Discovery / Blueprint / tenant / payment records.
 */

import {
  DEMO_FEEDBACK_EVENT_TYPE,
  DEMO_FEEDBACK_RECIPIENT_EMAIL,
  type DemoFeedbackPayload,
  type DemoFeedbackSubmitResult,
} from "@/lib/demo-feedback/demo-feedback-contract";
import { validateDemoFeedbackInput } from "@/lib/demo-feedback/demo-feedback-validate";
import {
  evaluateAlphaDemoWriteGuard,
  AlphaDemoWriteBlockedError,
  type AlphaDemoWriteGuardContext,
  type AlphaDemoWriteMarkers,
} from "@/lib/runtime/alpha-demo-write-guard";
import type { Prisma } from "@prisma/client";

function buildSubject(payload: DemoFeedbackPayload): string {
  return `[DEMO] ${payload.feedbackType} — ${payload.pageOrArea}`.slice(0, 200);
}

function buildBody(payload: DemoFeedbackPayload): string {
  const lines = [
    "Crow Alpha Demo Feedback (not production)",
    "",
    payload.message,
    "",
    `Type: ${payload.feedbackType}`,
    `Reviewer type: ${payload.reviewerType}`,
    `Page/area: ${payload.pageOrArea}`,
    `Source: ${payload.sourceEnvironment}`,
  ];
  if (payload.reviewerName) lines.push(`Name: ${payload.reviewerName}`);
  if (payload.severity) lines.push(`Severity: ${payload.severity}`);
  if (payload.contact) lines.push(`Contact (optional/demo): ${payload.contact}`);
  if (payload.previewUrl) lines.push(`Preview URL: ${payload.previewUrl}`);
  lines.push(
    "",
    "Markers: isDemo=true · dataClassification=demo_only · runtimeMode=alpha_development · notProduction=true",
    "This record must not be treated as a client Request or Discovery session.",
  );
  return lines.join("\n");
}

function buildMetadata(
  payload: DemoFeedbackPayload,
  markers: AlphaDemoWriteMarkers,
): Prisma.InputJsonValue {
  return {
    ...markers,
    isDemo: true,
    dataClassification: "demo_only",
    runtimeMode: "alpha_development",
    notProduction: true,
    clientFeedback: false,
    advisory: true,
    demoFeedback: true,
    reviewerType: payload.reviewerType,
    feedbackType: payload.feedbackType,
    pageOrArea: payload.pageOrArea,
    severity: payload.severity ?? null,
    reviewerName: payload.reviewerName ?? null,
    contact: payload.contact ?? null,
    previewUrl: payload.previewUrl ?? null,
    createdAt: new Date().toISOString(),
  };
}

export type DemoFeedbackPreflight =
  | DemoFeedbackSubmitResult
  | {
      ok: true;
      payload: DemoFeedbackPayload;
      markers: AlphaDemoWriteMarkers;
    };

/**
 * Pure preflight — validation + DEVFLOW.4 write guard. No DB / no server-only import.
 */
export function evaluateDemoFeedbackSubmit(
  raw: Record<string, unknown>,
  guardContext: AlphaDemoWriteGuardContext = {},
): DemoFeedbackPreflight {
  const validated = validateDemoFeedbackInput(raw);
  if (!validated.ok) {
    return {
      ok: false,
      code: validated.code,
      message: validated.message,
    };
  }

  const decision = evaluateAlphaDemoWriteGuard(
    "demo_feedback_save",
    validated.markers,
    guardContext,
  );
  if (!decision.allowed) {
    return {
      ok: false,
      code: "alpha_demo_write_blocked",
      message:
        "Demo feedback hosted write is blocked. Alpha demo backend mode must be enabled with required flags.",
    };
  }

  return {
    ok: true,
    payload: validated.payload,
    markers: validated.markers,
  };
}

/**
 * Submit demo feedback. Hosted write only when alpha demo backend + write guard allow.
 */
export async function submitDemoFeedback(
  raw: Record<string, unknown>,
  guardContext: AlphaDemoWriteGuardContext = {},
): Promise<DemoFeedbackSubmitResult> {
  const preflight = evaluateDemoFeedbackSubmit(raw, guardContext);
  if (!preflight.ok) {
    return preflight;
  }
  if (!("payload" in preflight)) {
    return {
      ok: false,
      code: "uncertain_fail_closed",
      message: "Demo feedback preflight failed closed.",
    };
  }

  const { payload, markers } = preflight;

  try {
    const { withAlphaDemoAllowlistedPrismaWrite } = await import(
      "@/lib/runtime/alpha-demo-db-access"
    );
    const id = await withAlphaDemoAllowlistedPrismaWrite(
      "demo_feedback_save",
      markers,
      guardContext,
      async (client) => {
        const row = await client.platformNotification.create({
          data: {
            eventType: DEMO_FEEDBACK_EVENT_TYPE,
            recipientEmail: DEMO_FEEDBACK_RECIPIENT_EMAIL,
            subject: buildSubject(payload),
            body: buildBody(payload),
            status: "logged",
            deliveryStatus: "logged",
            inboxStatus: "open",
            severity: payload.severity ?? "low",
            metadata: buildMetadata(payload, markers),
          },
          select: { id: true },
        });
        return row.id;
      },
    );

    return {
      ok: true,
      id,
      message: "Demo feedback saved. Thank you — this is demo/test data only.",
    };
  } catch (err) {
    if (err instanceof AlphaDemoWriteBlockedError) {
      return {
        ok: false,
        code: "alpha_demo_write_blocked",
        message:
          "Demo feedback hosted write is blocked. Alpha demo backend mode must be enabled with required flags.",
      };
    }
    console.error("[demo-feedback] persist failed (redacted)");
    return {
      ok: false,
      code: "persist_failed",
      message: "Could not save demo feedback. Try again later.",
    };
  }
}

/** True when submit path would use PlatformNotification (for tests / docs). */
export function demoFeedbackUsesPlatformNotificationPath(): boolean {
  return true;
}
