# PROCROW owner-admin manual acceptance

**Current milestone:** PROCROW.ADMIN.2D — acceptance recorded, certification closed  
**Final verdict:** `PROCROW.ADMIN.2C = PASSED`  
**Date closed:** 2026-06-23

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

## Owner manual test result (2026-06-23)

| Field | Reported value |
|-------|----------------|
| Gmail used | `mk***@g***.com` (matches designated owner-admin operator designation) |
| Post-auth URL | `https://crow-ecosystem-platform.vercel.app/client` |
| Visible role badge | **Client** |
| Environment tested | **Live Production** (`crow-ecosystem-platform`) — **not** the private certification host |
| Vercel SSO | Completed (implicit — reached authenticated page) |
| Google OAuth | Completed (implicit — reached authenticated page) |
| `/admin` | **Not reported** |
| `/admin/overview` | **Not reported** |
| Legal gate | **Not reported** |

### Interpretation

This result does **not** prove ProCrow owner-admin access on the deployed certification runtime.

1. **Wrong host.** The handoff starting URL was the protected certification deployment (`crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app`). The owner landed on **live Production** (`crow-ecosystem-platform.vercel.app`), which remains on `main` @ `a5620c39` **without** the feature-branch authoritative role code (`authoritative-crow-auth.ts` is absent on `main`).
2. **Client landing is consistent with Production.** On `main`, post-auth routing still follows legacy `crow_role` metadata and customer paths. The hosted database already grants `PLATFORM_ADMIN` to the designated account (fingerprint `832287cbd374fb83`), but Production runtime does not yet resolve that assignment.
3. **Hosted authority unchanged.** Post-test `procrow-owner-admin:verify` still **PASS** — database role state was not altered by this login attempt.

### Owner retest checklist (certification only)

1. Confirm Supabase redirect URLs for the **certification** host are added (see above).
2. Open **only** `https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/login` (not `crow-ecosystem-platform.vercel.app`).
3. Complete Vercel SSO on the certification deployment.
4. Sign in with Google using the same designated Gmail.
5. Record post-auth URL — **expected on feature runtime:** `/admin/overview` or `/account`, with role badge **Platform Admin** (not Client).
6. Manually visit `/admin/overview` and report result.

**Verdict after attempt 1:** `MANUAL TEST INCONCLUSIVE FOR PROCROW ADMIN — OWNER AUTHENTICATED ON LIVE PRODUCTION AS CLIENT; CERTIFICATION RETEST REQUIRED`

---

## Owner manual test result — certification retest (2026-06-23)

| Field | Reported value |
|-------|----------------|
| Post-auth URL | `https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/access` |
| Environment tested | **Private certification** (`crow-ftgp-certification`) — **correct host** |
| Vercel SSO | Completed (implicit — reached authenticated page) |
| Google OAuth | Completed (implicit — reached authenticated page) |
| Visible role badge | **Not reported** |
| `/admin` / `/admin/overview` | **Not reported yet** |

### Interpretation

This is **expected and positive** on the feature-branch certification runtime.

`/access` is the **workspace gateway** (“Choose your workspace”). Post-auth routing sends users there when more than one portal is available. For **platform staff** (including `PLATFORM_ADMIN`), Crow counts:

1. **ProCrow** — operator console (`/admin/overview`)
2. **Business Portal / CEM** — platform staff are treated as eligible for the business-portal card even without tenant membership

So landing on `/access` does **not** mean auth failed or that you are only a Client. It means the runtime resolved operator-level access and is asking you to pick a workspace.

**Expected next step on the same session:**

1. On `/access`, confirm a **ProCrow** card is visible and available.
2. Click **ProCrow** — should open `/admin/overview`.
3. Alternatively, navigate directly to `/admin/overview` in the address bar.
4. Report: role badge on ProCrow pages, whether `/admin/overview` loads, and any denial/redirect.

**Verdict after attempt 2:** `CERTIFICATION AUTH SUCCEEDED — WORKSPACE GATEWAY REACHED; PROCROW /admin ROUTE PROOF STILL PENDING OWNER CONFIRMATION`

### Attempt 3 — ProCrow `/admin/overview` (owner confirmed)

| Field | Reported value |
|-------|----------------|
| URL tested | `https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/admin/overview` |
| Result | **Loads** |
| Role badge | **Platform Admin** |
| ProCrow console | **Visible** |

**Verdict after attempt 3:** `MANUAL OWNER ACCEPTANCE TEST PASSED — PROCROW PLATFORM ADMIN ACCESS PROVEN ON CERTIFICATION RUNTIME`

| Proof item | Status |
|------------|--------|
| Correct certification host | PASS |
| Google OAuth | PASS |
| Authoritative `PLATFORM_ADMIN` resolution | PASS |
| `/admin/overview` authenticated access | PASS |
| `/access` ProCrow card | FAIL (known bug; fix in repo, not yet redeployed) |
| `/admin/users`, `/admin/roles` | Not implemented on branch |

---

### Attempt 2 follow-up — ProCrow card missing on `/access`

| Field | Reported value |
|-------|----------------|
| ProCrow card on `/access` | **Not available** |

**Root cause (code defect):** Post-auth redirect uses **authoritative** database role resolution (`PlatformInternalRoleAssignment`) and sent the owner to `/access` as platform staff. The `/access` page itself called `buildCrowAccessGatewaySnapshot(getSessionUser())` using **stale Supabase `crow_role` metadata** (still `client` from Candidate 07 ownership). ProCrow cards are intentionally hidden when metadata role is `client`.

**Immediate workaround (current certification deployment, no redeploy):** Open ProCrow directly — admin routes use authoritative guards:

```text
https://crow-ftgp-certification-ek7umjqs9-muhanadghurabs-projects.vercel.app/admin/overview
```

**Fix prepared in repo (requires certification redeploy):**

- `src/app/access/page.tsx` — resolve authoritative Crow auth before building gateway snapshot
- `src/lib/portal/portal-access-lite.ts` — do not count Business Portal for platform staff without tenant slugs (stops false `/access` redirect)

---

## PROCROW.ADMIN.2C — Manual retest handoff (post access-fix deploy)

After the access-gateway fix is deployed, the owner should retest:

**Starting URL:** `https://<final-protected-host>/login`

| Step | Action |
|------|--------|
| 1 | Open private certification URL in a normal browser |
| 2 | Complete Vercel SSO |
| 3 | Continue with Google (designated owner Gmail) |
| 4 | Complete legal acceptance if prompted |
| 5 | Record first post-auth URL (expect `/admin/overview` or `/account`, not only `/access`) |
| 6 | Open `/access` |
| 7 | Confirm **ProCrow** card is visible and available |
| 8 | Confirm card links to `/admin/overview` |
| 9 | Open `/admin/overview` — Platform Admin badge |
| 10 | Do **not** expect `/admin/users` or `/admin/roles` (not implemented) |

**Not in scope:** `/admin/users`, `/admin/roles`

---

## PROCROW.ADMIN.2D — Final manual acceptance (authoritative)

**Manual test date:** 2026-06-23  
**Environment:** Private certification (`crow-ftgp-certification`)  
**Deployment ID:** `dpl_7h8nuh4eixnP4znDHtixTy5MCSCM`  
**Deployed commit:** `db513fda8820e1a08e8fa5288aad12246cc1abfd` (`db513fd`)  
**Protected host reference:** `crow-ftgp-certification-3tbzcy61o-…vercel.app`  
**Origin fingerprint:** `91841eaa6a500db8`  
**Account:** Designated ProCrow owner-admin (redacted; fingerprint `832287cbd374fb83`)

Evidence source: **owner manual browser test** (not Cursor, not Playwright).

| Check | Result |
|-------|--------|
| Private Vercel SSO | PASS |
| Google authentication | PASS |
| First post-login route | `/admin/overview` |
| Legal page shown | **No** — current legal acceptance already valid |
| `/access` loaded | **Yes** |
| ProCrow card visible | **Yes** |
| ProCrow card destination | `/admin/overview` |
| `/admin/overview` loaded | **Yes** |
| Platform Admin badge visible | **Yes** |
| Unexpected errors | None reported |

**Manual acceptance result:** `PASS`

### Proven on certification runtime

| Capability | Status |
|------------|--------|
| Personal ProCrow owner-admin authority | **PROVEN** |
| Private ProCrow access | **PROVEN** |
| `/access` ProCrow gateway | **PROVEN** |
| `/admin/overview` | **PROVEN** |
| Database-backed `PLATFORM_ADMIN` resolution | **PROVEN** |
| Legal gate (current-acceptance path) | **PROVEN** |

### Not proven / not implemented

| Item | Status |
|------|--------|
| `/admin/users` | **NOT IMPLEMENTED** |
| `/admin/roles` | **NOT IMPLEMENTED** |
| Full ProCrow control tower | **PLANNED** |
| Tenant provisioning UI | **PLANNED** |
| User-management UI | **PLANNED** |
| Permission-management UI | **PLANNED** |
| CyberCrow posture UI | **PLANNED** |

### Current proven ProCrow surface

```text
/access
/admin/overview
Platform Admin navigation and badge on overview
```

---

## ProCrow admin milestone status

| Phase | Status |
|-------|--------|
| PROCROW.ADMIN.1 | Owner-admin transfer tooling prepared |
| PROCROW.ADMIN.2 | Personal owner account transferred to sole `PLATFORM_ADMIN` |
| PROCROW.ADMIN.2A | Dual-role `PLATFORM_ADMIN` + `IMPLEMENTER` authority reconciled |
| PROCROW.ADMIN.2B | Latest committed runtime deployed for manual test |
| PROCROW.ADMIN.2C | **Manual owner acceptance PASSED** |
| PROCROW.ADMIN.2D | **Acceptance evidence recorded; milestone closed** |

---

## Next project step

**FTGP.1H.4b — Candidate 07 Client Owner Journey**

Important separation:

```text
ProCrow owner-admin identity ≠ Candidate 07 client-owner identity
```

The designated ProCrow owner-admin account **must not** be used as Candidate 07 owner proof. Candidate 07 remains `UNDER_DISCOVERY` with owner internal roles `0`.

Do not execute FTGP.1H.4b in PROCROW.ADMIN tasks. Do not merge PR #10 solely on this acceptance closure.

---
