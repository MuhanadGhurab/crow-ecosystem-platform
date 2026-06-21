import {
  computeC3ProofIdentityFingerprint,
  requireC3ProofIdentityFingerprintSecret,
} from "./c3-proof-identity-fingerprint";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

process.env.C3_PROOF_IDENTITY_FINGERPRINT_SECRET = "test-proof-secret-32chars-min";

const userA = "00000000-0000-4000-8000-000000000001";
const userB = "00000000-0000-4000-8000-000000000002";

const fpA1 = computeC3ProofIdentityFingerprint(userA);
const fpA2 = computeC3ProofIdentityFingerprint(userA);
const fpB = computeC3ProofIdentityFingerprint(userB);

assert(fpA1 === fpA2, "fingerprint is deterministic");
assert(fpA1 !== fpB, "different users produce different fingerprints");
assert(fpA1.length === 16, "fingerprint is 16 hex chars");
assert(!fpA1.includes(userA), "fingerprint must not contain raw user id");
assert(requireC3ProofIdentityFingerprintSecret() === "test-proof-secret-32chars-min", "secret reader");

delete process.env.C3_PROOF_IDENTITY_FINGERPRINT_SECRET;
let threw = false;
try {
  computeC3ProofIdentityFingerprint(userA);
} catch {
  threw = true;
}
assert(threw, "missing secret throws");

console.log("PASS — c3 proof identity fingerprint unit checks\n");
