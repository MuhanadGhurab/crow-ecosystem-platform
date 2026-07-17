# FTGP.1H.4B — Manual Candidate 07 Client-Owner Acceptance

**Phase:** FTGP.1H.4B-MANUAL  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Repository HEAD:** `0daa58c` (documentation); certification runtime `db513fd`  
**Verdict:** `READY — CANDIDATE 07 ENVIRONMENT VERIFIED; READY FOR MANUAL CLIENT-OWNER ACCEPTANCE TEST`

---

## Certification environment

| Field | Value |
|-------|-------|
| Vercel project | `crow-ftgp-certification` |
| Deployment ID | `dpl_7h8nuh4eixnP4znDHtixTy5MCSCM` |
| Deployed commit | `db513fda8820e1a08e8fa5288aad12246cc1abfd` |
| Protected host | `crow-ftgp-certification-3tbzcy61o-muhanadghurabs-projects.vercel.app` |
| Origin fingerprint | `91841eaa6a500db8` |
| Public alias | `crow-ftgp-certification.vercel.app` → **404** on Crow routes |
| Database fingerprint | `0355c17692e2a90d` |
| Redeploy required | **No** (`0daa58c` is documentation-only) |

---

## Candidate 07 identity (fingerprints only)

| Field | Value |
|-------|-------|
| Label | `FTGP-REQUEST-CANDIDATE-07` |
| Request fingerprint | `9439dd8cc806696e` |
| Owner fingerprint | `876863fe8c15c5c3` |
| DiscoveryProfile fingerprint | `383de76e7e784e22` |
| Request status | `UNDER_DISCOVERY` |
| DiscoveryProfile status | `IN_PROGRESS` |
| `completedAt` | `null` |
| System markers | 2 |
| CLIENT_PROVIDED answers | 0 |
| Blueprints | 0 |

### Owner designation (read-only verify)

| Check | Result |
|-------|--------|
| Designation mode | `EXPLICIT_IMMUTABLE_PLATFORM_ACCOUNT_ID` |
| Google provider identity | Verified |
| PlatformAccount status | `ACTIVE` |
| Mandatory legal acceptance | **CURRENT** |
| Active internal roles | **0** |
| Request ownership count | **1** |
| Collision with ProCrow owner-admin | **false** |
| Collision with IMPLEMENTER | **false** |
| Collision with tenant membership | **false** |

**Do not use** the ProCrow owner-admin Gmail (`832287cbd374fb83` account) for this test.

---

## Canonical client routes (deployed on certification runtime)

| Purpose | Exact route | Implemented | Expected owner behavior |
|---------|-------------|------------:|------------------------|
| Account home (C3 post-login) | `/account` | Yes | Landing after Google auth for requester accounts |
| Account requests hub | `/account/requests` | Yes (hub; links to intake) | Navigate to requests; may continue to Client Portal |
| **Client Portal home** | `/client` | Yes | Dashboard with linked requests and next actions |
| **Request list** | `/client/requests` | Yes | Candidate 07 visible when ownership resolves |
| **Candidate 07 detail** | `/client/requests/{requestId}` | Yes | Status `UNDER_DISCOVERY`, lifecycle strip |
| **Client Discovery wizard** | `/client/requests/{requestId}/discovery` | Yes | Client-facing discovery stages; no implementer notes |
| Client proposals | `/client/proposals` | Yes | Lifecycle view when applicable |
| Legacy portal | `/portal`, `/portal/requests` | Yes (legacy) | **Not canonical** — prefer `/client` |
| ProCrow admin | `/admin/*` | Yes | **Must not appear** for Candidate 07 owner |

`{requestId}` is the hosted Candidate 07 implementation request (fingerprint `9439dd8cc806696e`). Owner should open it from the linked request list rather than typing an ID.

---

## Authority model (static)

```text
Google identity → PlatformAccount → request ownership → scoped client routes
```

| Rule | Enforcement |
|------|-------------|
| Owner sees Candidate 07 only | `clientCanAccessRequestAuthoritative` / ownership |
| Unrelated requests denied | Scoped list + authoritative access checks |
| Internal implementer notes hidden | `implementer_discovery` section excluded from client completion |
| No PLATFORM_ADMIN / IMPLEMENTER | Zero internal role assignments on owner account |
| No tenant membership auto-grant | Eligibility verifier + onboarding guards |
| No Gmail / operator-file / metadata authority | `ftgp-authority-boundaries:test` |

---

## Legal gate (Candidate 07 owner)

| State | Result |
|-------|--------|
| Mandatory legal acceptance | **CURRENT** |
| Expected if missing/expired | Redirect to `/register/legal` |
| Expected when current | Normal post-login → `/account` |
| Legal bypass | **false** |

---

## Supabase OAuth redirects

Protected hostname **unchanged** since PROCROW.ADMIN.2C deployment.

Required callback URLs (must remain in Supabase Dashboard):

```text
https://crow-ftgp-certification-3tbzcy61o-muhanadghurabs-projects.vercel.app/auth/callback
https://crow-ftgp-certification-3tbzcy61o-muhanadghurabs-projects.vercel.app/auth/resolving
```

```text
SUPABASE_REDIRECT_UPDATE_REQUIRED=false
SUPABASE_REDIRECT_RUNTIME_PROOF=PENDING_MANUAL_LOGIN
```

Do **not** use the public alias for OAuth. ProCrow owner manual acceptance on this host already exercised Google OAuth successfully.

---

## Manual starting URL

```text
https://crow-ftgp-certification-3tbzcy61o-muhanadghurabs-projects.vercel.app/login
```

---

## Manual acceptance checklist (owner only)

1. Open the private URL in a normal browser.
2. Complete Vercel SSO.
3. Select **Continue with Google**.
4. Use the **Candidate 07 owner** Google account (not ProCrow owner-admin).
5. Complete legal acceptance only if Crow requires it.
6. Record the first Crow URL after login (expect `/account`).
7. Open `/account` and confirm account home loads.
8. Open `/client` or `/client/requests` and confirm Candidate 07 is visible.
9. Open Candidate 07 request detail (`/client/requests/...`).
10. Confirm request status is **UNDER_DISCOVERY**.
11. Open `/client/requests/.../discovery`.
12. Confirm client-facing Discovery content is visible.
13. Confirm internal IMPLEMENTER notes are **not** visible.
14. Confirm unrelated requests are **not** visible.
15. Confirm no Platform Admin navigation or badge appears.
16. Confirm no tenant-administration controls appear.
17. **Do not** enter or submit a Discovery answer.
18. Report every route, redirect, denial, missing element, or error.

### Not in scope for this test

```text
/admin/users          NOT IMPLEMENTED
/admin/roles          NOT IMPLEMENTED
Discovery answer save NOT AUTHORIZED in this task
Browser-proof artifact NOT REQUIRED for manual acceptance recording
```

---

## ProCrow milestone separation

ProCrow owner-admin certification (**PROCROW.ADMIN.2C PASSED**) is complete and uses a **different** PlatformAccount (`832287cbd374fb83`). Candidate 07 client-owner proof is a separate identity track.

---

## Next step after owner reports

1. Record owner manual results in follow-on task (FTGP.1H.4B acceptance closure or client-answer dry-run authorization).
2. Do **not** run `ftgp-client-owner-browser-proof:execute` unless explicitly authorized.
3. PR #10 remains draft; Production unchanged.

---

## Automated execution policy

| Check | Status |
|-------|--------|
| Cursor browser launched | **false** |
| Playwright executed | **false** |
| Owner authentication executed | **false** |
| Discovery writes | **false** |
| Authority writes | **false** |
