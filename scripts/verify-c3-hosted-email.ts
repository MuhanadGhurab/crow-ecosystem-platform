/**
 * C3.3 — Hosted email provider safety verifier.
 * Run: npm run c3-hosted-email:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== C3 hosted email provider ===\n");

  const required = [
    "src/lib/email/email-delivery.port.ts",
    "src/lib/email/email-provider-config.ts",
    "src/lib/email/email-provider-selection.ts",
    "src/lib/email/email-delivery-error.ts",
    "src/lib/email/email-redaction.ts",
    "src/lib/email/resend-email-delivery.adapter.ts",
    "src/lib/email/templates/crow-verification-email.ts",
    "src/lib/email/get-email-delivery-port.ts",
    "scripts/test-c3-resend-provider-delivery.ts",
  ];

  for (const f of required) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const portFile = fileText("src/lib/email/get-email-delivery-port.ts");
  check(
    portFile.includes("ResendEmailDeliveryAdapter") &&
      portFile.includes("resolveEmailDeliveryProvider"),
    "get-email-delivery-port wires Resend via provider selection",
    "get-email-delivery-port must select Resend for hosted environments"
  );
  check(
    !portFile.includes("new InMemoryEmailDeliveryAdapter()") ||
      portFile.includes('provider === "in-memory"'),
    "In-memory adapter is explicit, not hosted fallback",
    "Remove implicit in-memory fallback for hosted paths"
  );

  const selection = fileText("src/lib/email/email-provider-selection.ts");
  check(
    selection.includes('EMAIL_PROVIDER must be resend') || selection.includes("HOSTED_EMAIL_PROVIDER"),
    "Hosted environments require EMAIL_PROVIDER=resend",
    "email-provider-selection must fail closed without resend"
  );
  check(
    selection.includes("assertHostedEmailProviderConfigured"),
    "Hosted configuration assertion exported",
    "Add assertHostedEmailProviderConfigured"
  );

  const resend = fileText("src/lib/email/resend-email-delivery.adapter.ts");
  check(
    resend.includes("EmailDeliveryPort") && resend.includes("redactEmailAddress"),
    "Resend adapter implements canonical port with redacted logs",
    "Resend adapter must implement EmailDeliveryPort and redact logs"
  );
  check(
    !resend.includes("console.log") && resend.includes("summarizeProviderHttpFailure"),
    "Resend adapter sanitizes provider failures",
    "Resend adapter must not log raw provider errors"
  );

  const template = fileText("src/lib/email/templates/crow-verification-email.ts");
  check(
    template.includes("Crow Ecosystem") && template.includes("Do not share"),
    "Verification template includes Crow identity and safety guidance",
    "crow-verification-email template must include brand + safety copy"
  );
  check(
    !template.includes("tracking") && !template.includes("pixel"),
    "Verification template has no tracking pixels",
    "Verification template must not include tracking"
  );

  const verifySvc = fileText("src/lib/account/email-verification.service.ts");
  check(
    verifySvc.includes("buildCrowVerificationEmail"),
    "Email verification uses Crow template builder",
    "email-verification.service must use crow-verification-email template"
  );
  check(
    verifySvc.includes('reason: "delivery_failed"') &&
      verifySvc.includes('status: "revoked"'),
    "Failed delivery revokes challenge instead of succeeding",
    "email-verification.service must revoke challenge on delivery failure"
  );
  check(
    verifySvc.includes("delivery_failed") && verifySvc.includes("verification_failed"),
    "Delivery failure recorded as verification_failed audit with reason",
    "Record delivery_failed reason on verification_failed audit event"
  );

  const otp = fileText("src/lib/account/otp-code.ts");
  check(
    !verifySvc.includes("console.") && !otp.includes("console.log"),
    "OTP service avoids console logging",
    "Do not console.log OTP paths"
  );

  const schema = fileText("prisma/schema.prisma");
  const challengeModel = schema.slice(schema.indexOf("model EmailVerificationChallenge"));
  check(
    !challengeModel.includes("code ") && challengeModel.includes("codeHash"),
    "OTP stored as hash only",
    "EmailVerificationChallenge must store codeHash, not raw code"
  );

  const pkg = fileText("package.json");
  check(pkg.includes('"c3-hosted-email:verify"'), "package.json defines c3-hosted-email:verify", "Add npm script");

  console.log(passed ? "\nc3-hosted-email:verify PASSED\n" : "\nc3-hosted-email:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
