/**
 * C3.3 — Provider-only Resend delivery test (no OTP, no account creation).
 * Run: npm run c3-resend:provider-test
 */
import { redactEmailAddress } from "../src/lib/email/email-redaction";
import { resolveVerificationFromAddress } from "../src/lib/email/email-provider-config";

async function main() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    resolveVerificationFromAddress() ?? "Crow Ecosystem <onboarding@resend.dev>";
  const to =
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.PIPELINE_NOTIFY_EMAIL_OVERRIDE?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();

  if (!apiKey) {
    console.error("\n✗ RESEND_API_KEY is not set\n");
    process.exit(1);
  }

  if (!to) {
    console.error(
      "\n✗ Set C3_PROVIDER_TEST_EMAIL (or NOTIFICATION_TEST_EMAIL) for the provider test\n"
    );
    process.exit(1);
  }

  const subject = "Crow C3 — hosted email provider check";
  const text = [
    "This is a provider-only delivery test for C3 hosted email.",
    "It does not contain a verification code and did not create an account.",
    "",
    "— Crow Ecosystem",
  ].join("\n");

  console.log("\n=== C3 Resend provider test ===\n");
  console.log(`From: ${from}`);
  console.log(`To:   ${redactEmailAddress(to)}`);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  const bodyText = await response.text();
  let messageId: string | undefined;
  try {
    const parsed = JSON.parse(bodyText) as { id?: string };
    messageId = parsed.id;
  } catch {
    /* non-json */
  }

  if (!response.ok) {
    console.error(`\n✗ Delivery rejected (HTTP ${response.status})`);
    console.error("  Safe operator note: provider returned a non-success status.");
    process.exit(1);
  }

  console.log("\n✓ Delivery accepted by Resend");
  console.log(`  Recipient: ${redactEmailAddress(to)}`);
  console.log(`  Provider message reference: ${messageId ?? "(accepted, id pending)"}`);
  console.log("  No OTP or account was created.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
