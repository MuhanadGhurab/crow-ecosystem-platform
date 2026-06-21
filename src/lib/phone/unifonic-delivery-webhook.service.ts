import type { PhoneVerificationChallenge } from "@prisma/client";

export type UnifonicDeliveryWebhookPayload = {
  messageReference: string;
  status: "delivered" | "rejected" | "expired" | "unknown";
  receivedAt: Date;
  rawEventId?: string;
};

export type DeliveryWebhookProcessResult =
  | { handled: true; duplicate: boolean; recordedStatus: string }
  | { handled: false; reason: "unknown_reference" | "invalid_signature" | "replay" | "disabled" };

const processedEventIds = new Set<string>();

/** In-memory idempotency for tests; production uses DB dedupe table in a later phase. */
export function resetDeliveryWebhookIdempotencyForTests(): void {
  processedEventIds.clear();
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function verifyUnifonicWebhookSecret(
  provided: string | null | undefined,
  expected: string | undefined
): boolean {
  if (!expected?.trim()) return false;
  if (!provided?.trim()) return false;
  return timingSafeEqual(provided.trim(), expected.trim());
}

/**
 * Transport-only delivery receipt — never activates accounts or consumes OTP challenges.
 */
export async function processUnifonicDeliveryWebhook(
  payload: UnifonicDeliveryWebhookPayload,
  deps: {
    findChallengeByProviderReference: (
      messageReference: string
    ) => Promise<Pick<PhoneVerificationChallenge, "id" | "deliveryStatus"> | null>;
    recordTransportEvidence: (input: {
      challengeId: string;
      status: string;
      providerEventId?: string;
    }) => Promise<void>;
    webhookEnabled: boolean;
    signatureValid: boolean;
  }
): Promise<DeliveryWebhookProcessResult> {
  if (!deps.webhookEnabled) {
    return { handled: false, reason: "disabled" };
  }

  if (!deps.signatureValid) {
    return { handled: false, reason: "invalid_signature" };
  }

  const dedupeKey = payload.rawEventId ?? `${payload.messageReference}:${payload.status}`;
  if (processedEventIds.has(dedupeKey)) {
    return { handled: true, duplicate: true, recordedStatus: payload.status };
  }

  const challenge = await deps.findChallengeByProviderReference(payload.messageReference);
  if (!challenge) {
    return { handled: false, reason: "unknown_reference" };
  }

  await deps.recordTransportEvidence({
    challengeId: challenge.id,
    status: payload.status,
    providerEventId: payload.rawEventId,
  });

  processedEventIds.add(dedupeKey);

  return { handled: true, duplicate: false, recordedStatus: payload.status };
}
