import assert from "node:assert/strict";
import { ResendEmailDeliveryAdapter } from "./resend-email-delivery.adapter";

const originalFetch = globalThis.fetch;

async function withMockFetch(
  impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  fn: () => Promise<void>
) {
  globalThis.fetch = impl as typeof fetch;
  try {
    await fn();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function main() {
  await withMockFetch(
    async (_url, init) => {
      const headers = init?.headers as Record<string, string>;
      assert.match(headers.Authorization, /^Bearer re_test$/);
      const body = JSON.parse(String(init?.body)) as { subject: string; text: string };
      assert.equal(body.subject, "Test");
      assert.ok(!body.text.includes("re_test"));
      return new Response(JSON.stringify({ id: "msg_123" }), { status: 200 });
    },
    async () => {
      const adapter = new ResendEmailDeliveryAdapter({
        apiKey: "re_test",
        fromAddress: "Crow <onboarding@resend.dev>",
      });
      const result = await adapter.send({
        to: "user@example.com",
        subject: "Test",
        text: "hello",
        html: "<p>hello</p>",
      });
      assert.equal(result.channel, "resend");
      assert.equal(result.status, "sent");
      assert.equal(result.providerMessageId, "msg_123");
    }
  );

  await withMockFetch(
    async () => new Response("forbidden", { status: 403 }),
    async () => {
      const adapter = new ResendEmailDeliveryAdapter({
        apiKey: "re_test",
        fromAddress: "Crow <onboarding@resend.dev>",
      });
      const result = await adapter.send({
        to: "user@example.com",
        subject: "Test",
        text: "hello",
      });
      assert.equal(result.status, "failed");
      assert.ok(result.error);
      assert.ok(!result.error.includes("forbidden"));
    }
  );

  console.log("resend-email-delivery.adapter.test.ts PASSED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
