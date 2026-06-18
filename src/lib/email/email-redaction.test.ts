import assert from "node:assert/strict";
import {
  containsSixDigitOtp,
  redactEmailAddress,
  redactOperationalMessage,
} from "./email-redaction";

assert.equal(redactEmailAddress("alice@example.com"), "a***@example.com");
assert.equal(redactEmailAddress("a@b.co"), "a***@b.co");

const redacted = redactOperationalMessage(
  "Bearer re_abc123 sent code 123456 to user@corp.test"
);
assert(!containsSixDigitOtp(redacted));
assert(!redacted.includes("re_abc123"));
assert(redacted.includes("[redacted-code]"));
assert(redacted.includes("u***@corp.test"));

console.log("email-redaction.test.ts PASSED");
