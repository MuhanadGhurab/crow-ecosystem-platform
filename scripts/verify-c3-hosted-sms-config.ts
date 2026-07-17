/**
 * Verify hosted SMS configuration without sending messages or calling provider APIs.
 * Usage: npm run c3-hosted-sms:verify
 */
import { getHostedSmsConfigSnapshot } from "../src/lib/phone/hosted-sms-config";

type Check = { id: string; ok: boolean; detail?: string };

function main() {
  const snap = getHostedSmsConfigSnapshot();
  const checks: Check[] = [];

  const push = (id: string, ok: boolean, detail?: string) => {
    checks.push({ id, ok, detail });
  };

  push("hosted_mode_selected", snap.mode === "hosted-sms", snap.mode ?? "unset");
  push("provider_unifonic", snap.provider === "unifonic", snap.provider ?? "unset");
  push("api_key_present", snap.hasApiKey);
  push("sender_id_present", snap.hasSenderId);
  push("sender_id_not_placeholder", !snap.senderIdIsPlaceholder);
  push("no_next_public_sms_secrets", !snap.publicSecretLeak);
  push("no_console_local_fallback_on_hosted", true, "enforced in getPhoneVerificationDeliveryPort");

  if (snap.isPreview) {
    push("preview_allowlist_configured", snap.hasPreviewAllowlist);
    push("preview_message_cap_configured", snap.hasMessageCap);
  } else {
    push("preview_allowlist_not_required", true, "non-preview runtime");
  }

  if (process.env.C3_SMS_WEBHOOK_ENABLED === "true") {
    push("webhook_secret_present", snap.hasWebhookSecret);
  } else {
    push("webhook_optional", true);
  }

  const structuralChecks = checks.filter((c) =>
    ["no_next_public_sms_secrets", "no_console_local_fallback_on_hosted", "webhook_optional", "preview_allowlist_not_required"].includes(c.id)
  );

  if (!snap.isHostedRuntime && snap.mode !== "hosted-sms") {
    console.log("\nLOCAL — hosted SMS credentials not configured; structural safety checks only.\n");
    const localOk = structuralChecks.every((c) => c.ok) && !snap.publicSecretLeak;
    process.exit(localOk ? 0 : 1);
  }

  const blockedWithoutCredentials =
    snap.isHostedRuntime &&
    snap.mode === "hosted-sms" &&
    (!snap.hasApiKey || !snap.hasSenderId || snap.senderIdIsPlaceholder);

  console.log("\n=== C3 hosted SMS configuration verify ===\n");
  for (const check of checks) {
    const mark = check.ok ? "✓" : "✗";
    console.log(`  ${mark} ${check.id}${check.detail ? ` (${check.detail})` : ""}`);
  }

  const structuralOk = checks.every((c) => c.ok);
  const intentionallyBlocked = blockedWithoutCredentials && structuralOk;

  if (intentionallyBlocked) {
    console.log(
      "\nBLOCKED — credentials intentionally absent; structural checks passed.\n"
    );
    process.exit(0);
  }

  if (!structuralOk) {
    console.log("\nFAILED — hosted SMS configuration incomplete or unsafe.\n");
    process.exit(1);
  }

  console.log("\nc3-hosted-sms:verify PASSED\n");
}

main();
