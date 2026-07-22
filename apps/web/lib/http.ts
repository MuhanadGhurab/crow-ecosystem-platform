import { NextResponse } from "next/server";
import type { ErrorCategory } from "@ghuravia/contracts/schemas";

export function jsonError(
  category: ErrorCategory,
  message: string,
  status: number,
  correlationId?: string,
) {
  return NextResponse.json({ category, message, correlationId }, { status });
}

function extractCorrelationId(e: unknown): string | undefined {
  let current: unknown = e;
  for (let i = 0; i < 5 && current; i += 1) {
    if (
      current instanceof Error &&
      "correlationId" in current &&
      typeof (current as { correlationId?: unknown }).correlationId === "string"
    ) {
      return (current as { correlationId: string }).correlationId;
    }
    current =
      current instanceof Error && "cause" in current
        ? (current as { cause?: unknown }).cause
        : undefined;
  }
  return undefined;
}

export function mapServiceError(e: unknown, correlationId?: string) {
  const name = e instanceof Error ? e.name : "";
  const message = e instanceof Error ? e.message : "INTERNAL_ERROR";
  const corr = correlationId ?? extractCorrelationId(e);
  switch (name) {
    case "UNAUTHORIZED":
      return jsonError("UNAUTHORIZED", message, 401, corr);
    case "FORBIDDEN":
      return jsonError("FORBIDDEN", message, 403, corr);
    case "NOT_FOUND":
      return jsonError("NOT_FOUND", message, 404, corr);
    case "CONFLICT":
      return jsonError("CONFLICT", message, 409, corr);
    case "IDEMPOTENCY_CONFLICT":
      return jsonError("IDEMPOTENCY_CONFLICT", message, 409, corr);
    case "INVALID_TRANSITION":
      return jsonError("INVALID_TRANSITION", message, 409, corr);
    case "CHALLENGE_EXPIRED":
      return jsonError("CHALLENGE_EXPIRED", message, 410, corr);
    case "VALIDATION_ERROR":
      return jsonError("VALIDATION_ERROR", message, 400, corr);
    case "LOCAL_RUNTIME_ONLY":
      return jsonError("LOCAL_RUNTIME_ONLY", message, 403, corr);
    default:
      return jsonError("INTERNAL_ERROR", "Internal error", 500, corr);
  }
}
