import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { buildOtpSmsBody } from "@/lib/phone/otp-sms-templates";
import { mapUnifonicHttpStatus, unifonicRecipientFromE164 } from "@/lib/phone/unifonic-response-mapper";

assert.equal(unifonicRecipientFromE164("+966501234567"), "966501234567");

const en = buildOtpSmsBody({ code: "123456", minutes: 10, locale: "en" });
assert(en.includes("123456"), "english template includes code");
assert(!en.includes("http"), "no links in OTP template");

const ar = buildOtpSmsBody({ code: "654321", minutes: 10, locale: "ar" });
assert(ar.includes("654321"), "arabic template includes code");

assert.equal(mapUnifonicHttpStatus(429).category, "RATE_LIMITED");
assert.equal(mapUnifonicHttpStatus(480).category, "SENDER_NOT_APPROVED");

const unifonicSource = readFileSync(
  join(process.cwd(), "src/lib/phone/unifonic-sms-delivery.adapter.ts"),
  "utf8"
);
assert(!unifonicSource.includes("console.log"), "no console logging in unifonic adapter");
assert(!/console\.(log|info|debug)\(.*Authorization/i.test(unifonicSource), "no auth logging");
assert(!/headers:\s*\{[^}]*Authorization/i.test(unifonicSource), "no Authorization header");

console.log("unifonic-sms-redaction: passed");
