import { z } from "zod";
import { getClientIpFromHeaders, getClientIpFromRequest } from "@/lib/security/client-ip";
import { logIntakeAbuse } from "@/lib/security/intake-abuse-log";
import {
  createPublicIntakeSchema,
  MAX_IMPLEMENTATION_REQUEST_BYTES,
  publicIntakeServiceUnavailableBody,
  publicIntakeValidationErrorBody,
  splitPublicIntakeBody,
  type PublicIntakePayload,
} from "@/lib/security/public-intake-schema";
import { checkPublicIntakeRateLimit } from "@/lib/security/public-intake-rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type PublicIntakeGuardFailure = {
  status: 400 | 413 | 429 | 503;
  body: { error: string };
  retryAfterSec?: number;
};

export type PublicIntakeGuardSuccess = {
  data: PublicIntakePayload;
};

function assertContentLength(headers: Headers): PublicIntakeGuardFailure | null {
  const contentLength = headers.get("content-length");
  if (!contentLength) return null;
  const bytes = Number.parseInt(contentLength, 10);
  if (!Number.isNaN(bytes) && bytes > MAX_IMPLEMENTATION_REQUEST_BYTES) {
    logIntakeAbuse("payload_too_large", { bytes });
    return { status: 413, body: { error: "Payload too large" } };
  }
  return null;
}

function assertHoneypot(companyWebsite: string | undefined): PublicIntakeGuardFailure | null {
  if (companyWebsite?.trim()) {
    logIntakeAbuse("honeypot_triggered");
    return { status: 400, body: { error: "Invalid request." } };
  }
  return null;
}

async function assertTurnstile(
  token: string | undefined,
  remoteIp: string | null
): Promise<PublicIntakeGuardFailure | null> {
  const result = await verifyTurnstileToken(token, remoteIp);
  if (result.ok) return null;
  return { status: 400, body: { error: "Invalid request." } };
}

function assertRateLimit(remoteIp: string | null): PublicIntakeGuardFailure | null {
  const limit = checkPublicIntakeRateLimit(remoteIp);
  if (limit.allowed) return null;
  return {
    status: 429,
    body: { error: "Too many requests. Please try again later." },
    retryAfterSec: limit.retryAfterSec,
  };
}

function parsePayload(payload: unknown): PublicIntakeGuardSuccess | PublicIntakeGuardFailure {
  const parsed = createPublicIntakeSchema.safeParse(payload);
  if (!parsed.success) {
    logIntakeAbuse("validation_failed");
    const body = publicIntakeValidationErrorBody(parsed.error);
    return {
      status: 400,
      body: { error: typeof body.error === "string" ? body.error : "Invalid request." },
    };
  }
  return { data: parsed.data };
}

/**
 * Shared guards for POST /api/implementation-requests and server-action fallback.
 */
export async function runPublicIntakeGuards(options: {
  request?: Request;
  headers?: Headers;
  body: unknown;
}): Promise<PublicIntakeGuardSuccess | PublicIntakeGuardFailure> {
  const headers = options.request?.headers ?? options.headers ?? new Headers();
  const remoteIp = options.request
    ? getClientIpFromRequest(options.request)
    : getClientIpFromHeaders(headers);

  const tooLarge = assertContentLength(headers);
  if (tooLarge) return tooLarge;

  const rate = assertRateLimit(remoteIp);
  if (rate) return rate;

  const { meta, payload } = splitPublicIntakeBody(options.body);

  const honeypot = assertHoneypot(meta.companyWebsite);
  if (honeypot) return honeypot;

  const turnstile = await assertTurnstile(meta.turnstileToken, remoteIp);
  if (turnstile) return turnstile;

  return parsePayload(payload);
}

export function zodErrorToGuardFailure(err: z.ZodError): PublicIntakeGuardFailure {
  const body = publicIntakeValidationErrorBody(err);
  return {
    status: 400,
    body: { error: typeof body.error === "string" ? body.error : "Invalid request." },
  };
}

export function unexpectedIntakeFailure(): PublicIntakeGuardFailure {
  return { status: 503, body: publicIntakeServiceUnavailableBody() };
}
