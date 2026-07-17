import { createHmac } from "crypto";
import {
  generateOtpCode,
  hashOtpCode,
  verifyOtpCode,
} from "./otp-code";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

process.env.EMAIL_VERIFICATION_CODE_SECRET =
  process.env.EMAIL_VERIFICATION_CODE_SECRET ?? "test-secret-min-16-chars";

const challengeId = "challenge-abc-123";
const code = "042819";

const hash = hashOtpCode(code, challengeId);
assert(hash.length === 64, "hash is sha256 hex");
assert(verifyOtpCode(code, challengeId, hash), "verify accepts correct code");
assert(!verifyOtpCode("000000", challengeId, hash), "verify rejects wrong code");
assert(
  !verifyOtpCode(code, "other-challenge", hash),
  "verify rejects wrong challengeId"
);

const expected = createHmac("sha256", process.env.EMAIL_VERIFICATION_CODE_SECRET!)
  .update(`${challengeId}:${code}`)
  .digest("hex");
assert(hash === expected, "hash uses challengeId:code HMAC");

const otp = generateOtpCode();
assert(/^\d{6}$/.test(otp), "generateOtpCode returns 6 digits");

let threw = false;
const prev = process.env.EMAIL_VERIFICATION_CODE_SECRET;
delete process.env.EMAIL_VERIFICATION_CODE_SECRET;
try {
  hashOtpCode("123456", challengeId);
} catch {
  threw = true;
}
process.env.EMAIL_VERIFICATION_CODE_SECRET = prev;
assert(threw, "hashOtpCode throws when secret missing");

console.log("account/otp-code: OK");
