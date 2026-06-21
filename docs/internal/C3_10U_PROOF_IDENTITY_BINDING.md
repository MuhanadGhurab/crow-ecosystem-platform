# C3.10U — Preview proof identity binding

## Purpose

When `C3_PROOF_DIAGNOSTICS=true` on Vercel Preview, authenticated operators can bind the browser Google session to the CLI verifier via a shared opaque fingerprint.

## Endpoint

`GET /api/c3/proof-identity` (Preview only, session required)

Returns sanitized fields only — no email, raw Auth UUID, tokens, or PlatformAccount ids.

## Fingerprint

Browser and CLI both use `computeC3ProofIdentityFingerprint()` keyed by `C3_PROOF_IDENTITY_FINGERPRINT_SECRET` (gitignored; sync to Preview via proof flags script).

## Operator proof

1. Use Vercel Dashboard Share link (deployment `dpl_3SYXKVF92h7Me5LRJ8fcGySyBdhv`) in fresh Incognito
2. Complete Google OAuth with the designated ordinary proof account
3. At `/auth/resolving`, compare panel fingerprint to `npm run c3-google-proof-identity:verify`
4. Set certification flags only after all checkpoints pass

## Verification

```bash
npm run c3-proof-identity-binding:verify
npm run c3-google-proof-identity:verify
```
