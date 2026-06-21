import { createHash } from "node:crypto";

const FINGERPRINT_NAMESPACE = "supabase-auth";

/**
 * Server-only secret for opaque proof identity fingerprints.
 * Set in gitignored operator env and Vercel Preview (never commit the value).
 */
export function requireC3ProofIdentityFingerprintSecret(): string {
  const secret = process.env.C3_PROOF_IDENTITY_FINGERPRINT_SECRET?.trim();
  if (!secret || secret.length < 8) {
    throw new Error(
      "C3_PROOF_IDENTITY_FINGERPRINT_SECRET is required for proof identity fingerprints"
    );
  }
  return secret;
}

/** Deterministic opaque fingerprint for a Supabase Auth user — never reversible. */
export function computeC3ProofIdentityFingerprint(supabaseUserId: string): string {
  const secret = requireC3ProofIdentityFingerprintSecret();
  const material = `${FINGERPRINT_NAMESPACE}:${supabaseUserId}:${secret}`;
  return createHash("sha256").update(material).digest("hex").slice(0, 16);
}
