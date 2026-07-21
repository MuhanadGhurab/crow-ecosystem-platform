import type { z } from "zod";
import { ProviderMockResponse } from "@ghuravia/contracts/schemas";
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
export const emailDeliveryMock = (o: MockOutcome) =>
  deterministicMock("email-delivery", o, "mock-email");
export const observabilityMock = (o: MockOutcome) =>
  deterministicMock("observability", o, "mock-observability");
