# PROCROW.ADMIN.2B — Manual Owner Acceptance Test Handoff

**Phase:** PROCROW.ADMIN.2B  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Deployed commit:** `9b280081d4e9826173fea6e3d3acb9aad7324fad` (`9b28008`)  
**Verdict:** `READY WITH MANUAL ACTION — DEPLOYMENT READY; SUPABASE REDIRECT URL MUST BE ADDED BEFORE OWNER LOGIN`

---

## Deployment summary

| Field | Value |
|-------|-------|
| Vercel project | `crow-ftgp-certification` |
| Deployment ID | `dpl_FF4kid7aMQz64d3kAbz97MK9bzn4` |
| Protected host | `crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app` |
| Origin fingerprint | `3d8ac9f825bd18d6` |
| Prior certification runtime | `ae7ea26` on `dpl_5qnasiybbipzSiH9keu1TMAqtX1C` |
| Certification mode | `true` |
| Database fingerprint | `0355c17692e2a90d` |
| Live Production | Unchanged (`main` @ `a5620c39`) |

---

## Manual test starting URL

```text
https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/login
```

**Required before login:** Add Supabase Auth redirect URLs (hostname changed since prior certification deployment):

```text
https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/auth/callback
https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/auth/resolving
```

Do **not** use the public alias `crow-ftgp-certification.vercel.app` for OAuth. Preserve existing Production and prior valid redirects.

---

## Public-alias containment (verified without browser)

Anonymous requests to `https://crow-ftgp-certification.vercel.app` return **404** for `/`, `/login`, `/account`, `/admin`, `/admin/users`, `/admin/roles`, and `/auth/callback`. Crow UI is not exposed on the stable alias.

Protected deployment host requires **Vercel SSO** for anonymous requests (302). After Vercel authorization, `/login` returns the Crow login application with Google sign-in entry present.

---

## Authority model (unchanged by deployment)

| Item | Value |
|------|-------|
| Active PLATFORM_ADMIN | 1 — fingerprint `832287cbd374fb83` |
| Active IMPLEMENTER | 1 — fingerprint `832287cbd374fb83` (same PlatformAccount) |
| Total assignment rows | 3 (active 2, revoked 1) |
| Former bootstrap PLATFORM_ADMIN | REVOKED |
| Candidate 07 | UNDER_DISCOVERY — owner internal roles 0 |

Authority source: `PlatformInternalRoleAssignment` (not email allowlist, not `crow_role` metadata, not Vercel identity).

---

## ProCrow routes to test manually

Committed admin surfaces (under `/admin` layout with `requirePlatformConsole`):

| Route | Deployed | Notes |
|-------|----------|-------|
| `/admin` | Redirect | No index page; expect redirect to login or overview after auth |
| `/admin/overview` | Yes | Primary ProCrow command surface |
| `/admin/users` | **No** | Not implemented in current feature branch |
| `/admin/roles` | **No** | Not implemented in current feature branch |

Additional deployed ProCrow routes include `/admin/requests`, `/admin/discovery`, `/admin/tenants`, `/admin/queue`, and others listed in `src/lib/routes.ts`.

---

## Manual acceptance sequence (owner only)

1. Add the two Supabase redirect URLs above if not already present.
2. Open the starting URL in a normal personal Chrome browser.
3. Complete Vercel SSO.
4. On Crow, select **Continue with Google**.
5. Use the designated personal ProCrow owner-admin Gmail.
6. Complete legal acceptance only if Crow requires it.
7. Record the exact page and URL reached after authentication.
8. Manually visit `/admin` and `/admin/overview`.
9. Manually visit `/admin/users` and `/admin/roles` (expect not-found or redirect if unimplemented).
10. Report visible navigation, redirects, denial messages, or errors back to ChatGPT and Cursor.

---

## What the owner should report

- Vercel SSO outcome
- Google OAuth outcome
- Post-auth landing URL and visible role badge
- `/admin` and `/admin/overview` access result
- `/admin/users` and `/admin/roles` behavior (expected: not yet implemented)
- Any legal-gate prompts
- Screenshots or URLs only — no tokens, cookies, or secrets

---

## Automated execution policy

| Check | Status |
|-------|--------|
| Cursor browser launched | **false** |
| Playwright executed | **false** |
| Owner authentication executed | **false** |
| `procrow-owner-admin:browser-proof:execute` | **not run** |
| `ftgp-client-owner-browser-proof:execute` | **not run** |
| Authenticated admin-route proof | **NOT_EXECUTED** |

---

## Next step after owner reports

Feed the owner's manual test results into PROCROW.ADMIN.2C (or follow-on task) for authenticated route proof, gap triage on `/admin/users` and `/admin/roles` if required, and PR #10 merge readiness — without re-running automated browser proof unless explicitly authorized.
