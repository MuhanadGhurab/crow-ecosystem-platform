import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  processUnifonicDeliveryWebhook,
  resetDeliveryWebhookIdempotencyForTests,
  verifyUnifonicWebhookSecret,
} from "@/lib/phone/unifonic-delivery-webhook.service";

async function main() {
  resetDeliveryWebhookIdempotencyForTests();

  const calls: { challengeId: string; status: string }[] = [];

  const result1 = await processUnifonicDeliveryWebhook(
    {
      messageReference: "msg-001",
      status: "delivered",
      receivedAt: new Date(),
      rawEventId: "evt-1",
    },
    {
      webhookEnabled: true,
      signatureValid: true,
      findChallengeByProviderReference: async () => ({
        id: "ch_1",
        deliveryStatus: "sent",
      }),
      recordTransportEvidence: async (input) => {
        calls.push({ challengeId: input.challengeId, status: input.status });
      },
    }
  );

  assert.equal(result1.handled, true);
  assert.equal(result1.duplicate, false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.status, "delivered");

  const duplicate = await processUnifonicDeliveryWebhook(
    {
      messageReference: "msg-001",
      status: "delivered",
      receivedAt: new Date(),
      rawEventId: "evt-1",
    },
    {
      webhookEnabled: true,
      signatureValid: true,
      findChallengeByProviderReference: async () => ({
        id: "ch_1",
        deliveryStatus: "sent",
      }),
      recordTransportEvidence: async () => {
        throw new Error("must not record duplicate");
      },
    }
  );

  assert.equal(duplicate.handled, true);
  assert.equal(duplicate.duplicate, true);
  assert.equal(calls.length, 1, "duplicate events are idempotent");

  const unknown = await processUnifonicDeliveryWebhook(
    {
      messageReference: "missing",
      status: "delivered",
      receivedAt: new Date(),
    },
    {
      webhookEnabled: true,
      signatureValid: true,
      findChallengeByProviderReference: async () => null,
      recordTransportEvidence: async () => {},
    }
  );

  assert.equal(unknown.handled, false);
  assert.equal(unknown.reason, "unknown_reference");

  assert.equal(verifyUnifonicWebhookSecret("secret-value", "secret-value"), true);
  assert.equal(verifyUnifonicWebhookSecret("wrong", "secret-value"), false);

  const activationSource = readFileSync(
    "src/lib/phone/unifonic-delivery-webhook.service.ts",
    "utf8"
  );
  assert(!activationSource.includes("activatePlatformAccount"), "webhook must not activate accounts");
  assert(!activationSource.includes("phoneVerifiedAt"), "webhook must not verify phone");

  console.log("unifonic-delivery-webhook: passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
