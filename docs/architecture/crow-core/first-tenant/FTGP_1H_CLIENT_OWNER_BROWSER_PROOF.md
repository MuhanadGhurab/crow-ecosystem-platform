# FTGP 1H — Client Owner Browser Proof

**Phase:** FTGP.1H  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `BLOCKED — LEGITIMATE CLIENT OWNER SESSION UNAVAILABLE` (see FTGP.1H.2 for certification environment)

> **FTGP.1H.2 update:** Preview automation bypass is no longer the authoritative proof target. Use the private certification deployment documented in `FTGP_1H_2_PRIVATE_VERCEL_CERTIFICATION_ENVIRONMENT.md`.

---

## 1. Scope

Authenticated browser proof for Candidate 07 owner fingerprint `876863fe8c15c5c3`. Read-only UI verification only — no Discovery answers, observations, completion, or lifecycle mutations.

---

## 2. Fingerprints

| Field | Value |
|-------|-------|
| Request | `FTGP-REQUEST-CANDIDATE-07` / `9439dd8cc806696e` |
| Owner | `876863fe8c15c5c3` |
| DiscoveryProfile | `383de76e7e784e22` |
| Request status | `UNDER_DISCOVERY` |
| Profile status | `IN_PROGRESS` |

---

## 3. Authentication method

Protected certification deployment via Vercel Authentication on the SSO-protected production deployment URL (`FTGP_CERTIFICATION_BASE_URL` in `.env.ftgp-certification.operator`). Crow session via **Continue with Google** on `/login` — owner account uses Google provider (`authProvider=google`).

Preview automation bypass is **not** accepted as final owner proof (FTGP.1H.2).

```text
CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=UNAVAILABLE
OWNER_PROOF_ENVIRONMENT=PRIVATE_VERCEL_CERTIFICATION
```

Execute against certification (operator completes Vercel SSO, Google OAuth, and legal gate when required):

```bash
C3_PREVIEW_HEADED=true npm run ftgp-client-owner-browser-proof:execute
```

---

## 4. Proof gate (artifact-backed)

Manual `FTGP_OWNER_BROWSER_PROOF=verified` alone is **rejected**. Verifier requires:

1. Gitignored `.ftgp-client-owner-browser-proof.local.json` with integrity hash  
2. Matching operator env `FTGP_OWNER_BROWSER_PROOF=verified` written by execute script  
3. Freshness window (7 days)  
4. Owner fingerprint / request fingerprint match  
5. Owner has zero active internal roles  

```bash
npm run ftgp-client-owner-browser-proof:verify
```

---

## 5. Expected proof checks (when execute completes)

| Check | Expected |
|-------|----------|
| Post-auth landing | `/account` |
| Own-request access | PASS |
| Discovery stage access | PASS |
| Unrelated request access | DENIED |
| Internal notes / admin | DENIED |
| Lifecycle / platform discovery | DENIED |
| Client answer save | false |
| Discovery completion | false |

---

## 6. Client answer readiness (after proof PASS)

```bash
npm run ftgp-discovery-client-answer:dry-run
```

Proves `planDiscoveryAnswerWrite()` is technically eligible with `ownerBrowserProofVerified=true` while `CLIENT_ANSWER_CAPTURE_AUTHORIZED=false`.

---

## 7. Identity classification reconciliation

```text
IDENTITY_WARNING_CLASSIFICATION=EXPECTED_CLASSIFICATION_NEEDS_ROLE_AWARE_UPDATE
RETAINED_REQUESTER_FIXTURE_RESOLUTION=PASS
PRIVILEGED_IDENTITY_CLASSIFICATION=PASS
AUTHORITY_BOUNDARY_WEAKENED=false
```

**Cause:** Retained C3 proof requester carries metadata `crow_role=client`. This is non-authoritative per C3 role-neutrality; classifiers incorrectly treated it as `ACTIVE_PRIVILEGED_IDENTITY`.

**Fix:** `src/lib/auth/metadata-crow-role.ts` — `client` is metadata-neutral; only `admin` / `platform_admin` / `implementer` / `staff` are privileged metadata. Updated `c3-proof-requester-resolution.ts`, `verify-cloud-1g-preview-protection.ts`, `verify-cloud-1h-protected-authenticated-session.ts`, `verify-c3-preserved-disposable-requester.ts`.

---

## 8. Hosted state

No business mutations authorized or executed in FTGP.1H preparation. Pre-proof baseline unchanged.

---

## 9. Next authorization

1. Operator completes `ftgp-client-owner-browser-proof:execute` with headed Chrome as the FTGP owner Google account.  
2. Re-run `ftgp-client-owner-browser-proof:verify` and `ftgp-discovery-client-answer:dry-run`.  
3. Authorize first client answer via `.ftgp-discovery-client-answer-manifest` only after proof PASS.

PR #10 remains draft. Production unchanged.
