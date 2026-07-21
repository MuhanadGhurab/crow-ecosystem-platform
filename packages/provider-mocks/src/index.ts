import type { z } from "zod";
import {
  ProviderMockResponse,
  MockMailboxMessage,
} from "@ghuravia/contracts/schemas";

export type MockOutcome = z.infer<typeof ProviderMockResponse>["outcome"];

export function deterministicMock(
  provider: string,
  outcome: MockOutcome,
  correlationId: string,
): z.infer<typeof ProviderMockResponse> {
  return ProviderMockResponse.parse({ provider, outcome, correlationId });
}

export const identityMock = (o: MockOutcome) =>
  deterministicMock("identity", o, "mock-identity");

export const observabilityMock = (o: MockOutcome) =>
  deterministicMock("observability", o, "mock-observability");

/** In-memory local/test mailbox — never used for Production. */
const mailbox = new Map<string, z.infer<typeof MockMailboxMessage>[]>();

export function emailDeliveryMock(
  outcome: MockOutcome,
  correlationId = "mock-email",
): z.infer<typeof ProviderMockResponse> {
  return deterministicMock("email-delivery", outcome, correlationId);
}

export function deliverVerificationEmail(input: {
  contactRef: string;
  token: string;
  correlationId: string;
  outcome?: MockOutcome;
}): z.infer<typeof ProviderMockResponse> {
  const outcome = input.outcome ?? "success";
  if (outcome === "failure" || outcome === "timeout") {
    return emailDeliveryMock(outcome, input.correlationId);
  }
  const msg = MockMailboxMessage.parse({
    messageId: `msg_${input.correlationId}`,
    purpose: "EMAIL_VERIFICATION",
    contactRef: input.contactRef,
    correlationId: input.correlationId,
    createdAt: new Date().toISOString(),
    token: input.token,
  });
  const list = mailbox.get(input.contactRef) ?? [];
  list.push(msg);
  mailbox.set(input.contactRef, list);
  return emailDeliveryMock(
    outcome === "duplicate" ? "duplicate" : "success",
    input.correlationId,
  );
}

export function readMockMailbox(
  contactRef: string,
): z.infer<typeof MockMailboxMessage>[] {
  return [...(mailbox.get(contactRef) ?? [])];
}

export function clearMockMailbox(contactRef?: string): void {
  if (contactRef) mailbox.delete(contactRef);
  else mailbox.clear();
}

/**
 * Delivery success must never mark email verified.
 * Callers must confirm via challenge consumption.
 */
export function deliveryDoesNotVerify(): true {
  return true;
}
