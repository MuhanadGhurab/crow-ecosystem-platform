# FTGP 1H.2 — Private Vercel Certification Environment

**Phase:** FTGP.1H.2  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `READY WITH GAPS — PRIVATE CERTIFICATION ENVIRONMENT DEPLOYED; SPECIFIED OAUTH OR LEGAL PROOF REMAINS`

---

## 1. Why Preview automation bypass was insufficient

The FTGP.1H Preview proof path used `VERCEL_AUTOMATION_BYPASS_SECRET` to reach `/login` without Vercel Authentication. That outer gate is not the normal customer journey. The headed Playwright flow also waited only for `/account`, so owners routed through `/register/legal` timed out before proof completed.

```text
PREVIOUS_PREVIEW_PROOF_ATTEMPT_CLOSED=true
PREVIEW_BYPASS_ACCEPTED_AS_FINAL_OWNER_PROOF=false
```

---

## 2. Selected certification topology

```text
CERTIFICATION_TOPOLOGY=SEPARATE_VERCEL_PROJECT
LIVE_PRODUCTION_REPLACEMENT_REQUIRED=false
```

| Item | Value |
|------|-------|
| Vercel project | `crow-ftgp-certification` |
| Classification | Private production-like certification (not live Production) |
| Source branch (local deploy) | `feat/first-tenant-golden-path` |
| Live Production project | `crow-ecosystem-platform` (unchanged, `main`) |
| Shared Supabase | `wbwnsndcxrgyqwppurms` (fingerprint `0355c17692e2a90d`) |

---

## 3. Private access model

Vercel SSO protection applies to **production deployment URLs** (`crow-ftgp-certification-<hash>-muhanadghurabs-projects.vercel.app`). Anonymous requests receive `302` to Vercel SSO.

The stable alias `crow-ftgp-certification.vercel.app` remains world-reachable on the current Vercel plan (same pattern as `crow-ecosystem-platform.vercel.app`). Advanced Deployment Protection is not enabled on the team, so password protection is unavailable.

**Authoritative proof target:** the SSO-protected deployment URL recorded in gitignored `.env.ftgp-certification.operator` as `FTGP_CERTIFICATION_BASE_URL`. Refresh after each production deploy:

```bash
npm run ftgp-certification-deployment:mint
```

---

## 4. Normal authentication journey (certification)

```text
Vercel SSO (protected deployment URL)
→ Crow /login
→ Continue with Google
→ /auth/callback → /auth/resolving
→ /register/legal when mandatory acceptance incomplete
→ /account
```

Repository updates:

- `scripts/lib/ftgp-owner-proof-post-auth-wait.ts` — waits for legal gate completion before `/account`
- `scripts/execute-ftgp-client-owner-browser-proof.ts` — certification mode rejects automation bypass; targets `FTGP_CERTIFICATION_BASE_URL`

---

## 5. Supabase redirect configuration

**Status:** `MANUAL_ACTION_REQUIRED`

Add to Supabase Dashboard → Authentication → URL configuration (do not remove Production URLs):

```text
https://<protected-certification-host>/auth/callback
https://<protected-certification-host>/auth/resolving
```

Use the host from `npm run ftgp-certification-deployment:mint` output. Google OAuth uses Supabase as the sole redirect recipient; Google Cloud authorized redirect URI remains `https://wbwnsndcxrgyqwppurms.supabase.co/auth/v1/callback`.

---

## 6. Environment variables

Sync to certification Vercel Production:

```bash
npm run ftgp-certification-vercel-env:sync
npm run ftgp-certification-deployment:mint
npx vercel deploy --prod --yes
```

Certification overrides:

- `GOOGLE_SSO_ENABLED=true`
- `NEXT_PUBLIC_SITE_URL=<protected deployment origin>`
- `APP_ENVIRONMENT=certification`
- No `VERCEL_AUTOMATION_BYPASS_SECRET` on certification project

Verify:

```bash
npm run ftgp-certification-environment:verify
```

---

## 7. Owner browser proof (certification target)

```bash
C3_PREVIEW_HEADED=true npm run ftgp-client-owner-browser-proof:execute
npm run ftgp-client-owner-browser-proof:verify
npm run ftgp-discovery-client-answer:dry-run
```

**Current state:** artifact absent — operator must complete Google OAuth and any required legal acceptance in the headed browser against the protected certification URL.

---

## 8. Hosted state preservation

No FTGP business mutations authorized. Candidate 07 remains `UNDER_DISCOVERY` with zero `CLIENT_PROVIDED` answers.

---

## 9. Production preservation

| Check | Result |
|-------|--------|
| PR #10 | OPEN, DRAFT, UNMERGED |
| `main` HEAD | `a5620c39f589dc4e4873ada46e07abec573cc154` |
| Live Production FTGP code | false |
| Certification replaces Production | false |

---

## 10. Next authorization

1. Add Supabase redirect URLs for the current protected certification host.  
2. Operator completes owner proof execute on certification deployment.  
3. Re-run verify + client-answer dry-run.  
4. Authorize first Discovery answer only after proof PASS.
