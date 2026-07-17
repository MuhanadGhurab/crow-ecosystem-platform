# FTGP 1H.4a — Private Certification Browser-Proof Tooling Repair

**Phase:** FTGP.1H.4a  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `READY — PRIVATE CERTIFICATION BROWSER-PROOF TOOLING REPAIRED; OPERATOR-ASSISTED OWNER JOURNEY MAY BE REATTEMPTED`

---

## 1. Defect A — bypass secret presence vs active use

**Root cause:** `execute-ftgp-client-owner-browser-proof.ts` rejected certification runs when `VERCEL_AUTOMATION_BYPASS_SECRET` existed in the shared gitignored `.env.staging.runtime`, even though certification mode never attaches bypass headers to browser requests. `loadHostedOperatorEnv()` always re-injects the secret after process startup.

**Repair:** `scripts/lib/ftgp-owner-browser-proof-bypass.ts` distinguishes:

| Condition | Certification behavior |
|-----------|------------------------|
| Secret absent | allowed |
| Secret present, unused | allowed |
| Bypass browser context | denied |
| Bypass header / query / cookie active | denied |

Preview automation bypass tooling is unchanged when `FTGP_CERTIFICATION_BASE_URL` is unset.

---

## 2. Defect B — Vercel SSO 302 not handled

**Root cause:** `ensureVercelProtectedAccess()` waited only on HTTP `401`/`403`. The private certification host returns `302` to Vercel SSO. Playwright followed the redirect and the script searched for the Crow Google button on the Vercel page.

**Repair:** `scripts/lib/ftgp-vercel-sso-state-machine.ts` + updated `cloud-1h-vercel-protected-playwright.ts`:

```text
OPEN_PROTECTED_CERTIFICATION_URL
→ classify page (Crow login / Vercel SSO / unauthorized host)
→ if Vercel SSO: WAITING_FOR_VERCEL_OPERATOR_AUTH (180s)
→ operator completes Vercel Authentication
→ return to exact protected certification host
→ CROW_LOGIN_READY or CROW_APPLICATION_READY
→ later Google OAuth + legal-aware wait (unchanged)
```

Denied return hosts include public alias, live Production, old Preview pattern, and localhost.

---

## 3. Operator instructions

When Vercel SSO wait begins, the executor prints:

```text
Complete Vercel Authentication in the opened browser.
After Crow /login appears, continue with the Candidate 07 owner Google account.
Do not use PLATFORM_ADMIN, IMPLEMENTER, or the retained C3 requester.
```

No secrets, emails, or tokens are logged.

---

## 4. Tests and tooling dry run

```bash
npm run ftgp-client-owner-browser-proof:tooling-test
```

Covers bypass classification, SSO state machine, certification target validation, and executor pre-OAuth policy (no browser OAuth, no artifact, no hosted writes).

---

## 5. What was not done

- No Google OAuth execution  
- No legal acceptance  
- No owner-proof artifact  
- No Discovery answer  
- No hosted business mutations  
- PR #10 remains draft; live Production unchanged  

---

## 6. Next authorization

Re-run FTGP.1H.4:

```bash
C3_PREVIEW_HEADED=true npm run ftgp-client-owner-browser-proof:execute
```

Operator completes Vercel SSO, then Candidate 07 owner Google sign-in, then verify + client-answer dry run.
