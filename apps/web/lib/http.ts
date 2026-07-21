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

export function mapServiceError(e: unknown, correlationId?: string) {
  const name = e instanceof Error ? e.name : "";
  const message = e instanceof Error ? e.message : "INTERNAL_ERROR";
  switch (name) {
    case "UNAUTHORIZED":
      return jsonError("UNAUTHORIZED", message, 401, correlationId);
    case "FORBIDDEN":
      return jsonError("FORBIDDEN", message, 403, correlationId);
    case "NOT_FOUND":
      return jsonError("NOT_FOUND", message, 404, correlationId);
    case "CONFLICT":
      return jsonError("CONFLICT", message, 409, correlationId);
    case "IDEMPOTENCY_CONFLICT":
      return jsonError("IDEMPOTENCY_CONFLICT", message, 409, correlationId);
    case "INVALID_TRANSITION":
      return jsonError("INVALID_TRANSITION", message, 409, correlationId);
    case "CHALLENGE_EXPIRED":
      return jsonError("CHALLENGE_EXPIRED", message, 410, correlationId);
    case "VALIDATION_ERROR":
      return jsonError("VALIDATION_ERROR", message, 400, correlationId);
    case "LOCAL_RUNTIME_ONLY":
      return jsonError("LOCAL_RUNTIME_ONLY", message, 403, correlationId);
    default:
      return jsonError("INTERNAL_ERROR", "Internal error", 500, correlationId);
  }
}
