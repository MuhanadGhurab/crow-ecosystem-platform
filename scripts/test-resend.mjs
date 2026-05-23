/**
 * Verify RESEND_API_KEY and optional delivery override.
 * Usage: npm run test:resend
 */
import { config } from "dotenv";

config();

const apiKey = process.env.RESEND_API_KEY?.trim();
const from =
  process.env.NOTIFICATION_FROM_EMAIL?.trim() ??
  "Crow Ecosystem <onboarding@resend.dev>";
const to =
  process.env.PIPELINE_NOTIFY_EMAIL_OVERRIDE?.trim() ||
  process.env.NOTIFICATION_TEST_EMAIL?.trim() ||
  process.env.PLATFORM_ADMIN_EMAIL?.trim() ||
  process.env.PLATFORM_NOTIFY_EMAIL?.trim();

if (!apiKey) {
  console.error("\n✗ RESEND_API_KEY is not set in .env");
  console.error("  See docs/internal/RESEND_SETUP.md\n");
  process.exit(1);
}

if (!to) {
  console.error("\n✗ Set a deliverable inbox for the test, e.g.:");
  console.error("  PIPELINE_NOTIFY_EMAIL_OVERRIDE=you@company.com");
  console.error("  (or NOTIFICATION_TEST_EMAIL / PLATFORM_ADMIN_EMAIL)");
  console.error("  See docs/internal/RESEND_SETUP.md\n");
  process.exit(1);
}

console.log("\n=== Resend test ===\n");
console.log(`From: ${from}`);
console.log(`To:   ${to}`);
if (process.env.PIPELINE_NOTIFY_EMAIL_OVERRIDE?.trim()) {
  console.log("(PIPELINE_NOTIFY_EMAIL_OVERRIDE is set for all pipeline sends)\n");
}

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: "Crow Ecosystem — Resend test",
    text: "If you received this, RESEND_API_KEY is configured correctly.\n\n— npm run test:resend",
  }),
});

const text = await res.text();
if (!res.ok) {
  console.error(`✗ Resend HTTP ${res.status}`);
  console.error(text.slice(0, 500));
  console.error("\n  Common fix: verify the recipient in Resend dashboard (free tier).\n");
  process.exit(1);
}

console.log("✓ Resend API key accepted — test email queued.");
console.log("  Check inbox (and spam). Re-run pipeline or smoke:phase1 for MEEM notifications.\n");
