# C3.10C — Email-only hosted Preview proof report

**Date:** 2026-06-20  
**Branch:** `feat/c3-account-registration-email-verification` (PR #9, not merged)  
**Decision:** `FAILED — EMAIL ACTIVATION OR SESSION DEFECT`

---

## Executive summary

The controlled generation-2 email-only registration journey **completed through PlatformAccount ACTIVE**, legal=3, Crow email OTP via Resend, and Supabase email confirmation on protected branch Preview. **Post-activation browser session durability failed**: Supabase auth cookies are stored after form sign-in and authenticate `page.request` calls, but **document navigations (hard reload / `goto`) send no auth cookie** and redirect to `/login`. This matches the open C3.7C session differential defect on Vercel Deployment Protection Preview.

Phone verification remained dormant (0 phone challenges, 0 SMS calls). Google OAuth was not exercised. Production unchanged. Proof window closed; registration disabled; generation gate restored to 1.

---

## 1. Hosted baseline (pre-proof)

| Check | Result |
| --- | --- |
| Supabase project | `wbwnsndcxrgyqwppurms` |
| Database fingerprint | `0355c17692e2a90d` |
| Pending migrations | 0 |
| Active failed migrations | 0 |
| C3 / C3.8 tables | Present |
| RLS | Enabled |
| Direct `anon` / `authenticated` grants | None |
| Production | Unchanged |

---

## 2. Proof window (enabled)

| Field | Value |
| --- | --- |
| Preview URL | `https://crow-ecosystem-platform-4khsipu08-muhanadghurabs-projects.vercel.app` |
| Deployment ID | `dpl_9JonVE2uoFHiXXKwFMhrmRX6Gj95` |
| Registration enabled (UTC) | `2026-06-20T06:17:08.261Z` |
| `ACCOUNT_REGISTRATION_ENABLED` | `true` |
| `CROW_PHONE_VERIFICATION_REQUIRED` | `false` |
| `CROW_ONBOARDING_GENERATION_REQUIRED` | `2` |
| Diagnostics / Auth Canary | All `false` |
| Deployment Protection | Active (Vercel bypass via CLI for automation) |

Initial proof deployment: `dpl_6deHNmH5pZmLC8ApRzQAyaAV7irN` on `crow-ecosystem-platform-jmj3qp5s7-…`.

---

## 3. Email/password registration journey

| Step | Result |
| --- | --- |
| `/signup` → details → legal review | PASS |
| Legal acceptance (Terms, Privacy, AUP) | PASS — legal=3 |
| PlatformAccount pending | PASS — `PENDING_EMAIL_VERIFICATION`, gen=2 |
| Crow email OTP (Resend) | PASS |
| Invalid OTP | PASS — rejected |
| Valid OTP → Supabase confirmed | PASS |
| PlatformAccount ACTIVE | PASS |
| Activation statement | `legal=3 + verified email + generation 2 + phone policy disabled = ACTIVE` |
| Post-OTP login → `/account` (first navigation) | PASS |
| Hard reload `/account` | **FAIL** → `/login` |
| `/account/profile`, sign-out, re-sign-in | Not reached (blocked by session defect) |

Pre-OTP aggregate state verified: one pending challenge (HMAC hash only), zero phone challenges, zero roles/memberships.

Post-OTP: `emailVerificationSource=CROW_EMAIL_OTP`, phone unverified, zero phone challenges.

---

## 4. Session durability defect (root cause summary)

Documented in `docs/internal/c3-session-differential/SESSION_DIFFERENTIAL_REPORT.md`.

- After `POST /login/submit`, Playwright jar contains `sb-*-auth-token` (~2662 chars).
- `page.request.get('/account/profile')` returns **200** (cookies sent on fetch).
- `page.reload()` / `page.goto('/account')`: **Cookie header length 0** on document GET; auth cookie dropped from jar; redirect to `/login`.
- Attempted mitigations during C3.10C (form POST `/login/submit`, `setSession` after sign-in, `httpOnly` defaults) did **not** resolve document-navigation cookie attachment on Preview.

---

## 5. Authorization & security (partial)

| Check | Result |
| --- | --- |
| Inactive-membership regression | PASS — membership alone cannot authorize |
| Portal denials (admin, procrow, business, portal, client) | Not fully exercised (session blocked) |
| OTP replay on ACTIVE account | Safe redirect to login |
| Phone challenges / SMS | 0 / 0 |
| Google OAuth | **DEFERRED — PROVIDER CONFIGURATION NOT ENABLED** |

---

## 6. Evidence pack (sanitized)

Screenshots: `docs/internal/screenshots/c3-preview-email-only-proof/`

| File | Scene |
| --- | --- |
| `01-signup.png` | Signup |
| `02-legal-review.png` | Legal review |
| `03-legal-accepted.png` | Legal acceptance |
| `04-verify-email-otp-entry.png` | Email OTP entry (OTP redacted in UI) |
| `14-invalid-otp.png` | Invalid OTP rejection |
| `05-activation-success-login.png` | Post-activation login redirect |
| `15-replayed-otp.png` | Replayed OTP / active account |
| `06-verified-login-banner.png` | Verified-login banner |
| `07-account.png` | `/account` (first landing only) |

Missing (session blocked): reload, profile, portal denials, sign-out, second sign-in, hosted email screenshot.

---

## 7. Verification suite

| Script | Result |
| --- | --- |
| `c3-email-only-onboarding:verify` | PASS |
| `c3-preview-session:verify` | **FAIL** — reload → login |
| `c3-preview-controlled:e2e` | **FAIL** — reload → login (activation path PASS) |
| `c3-dual-channel:verify` | PASS |
| `c3-account:verify` | PASS |
| `c3-auth-convergence:verify` | PASS |
| `c2-database-isolation:verify` | PASS |
| `typecheck` | PASS |
| `lint` | PASS |
| `build` | PASS |
| `c3-dual-channel:hosted-live-verify` | Not run (requires live SMS; phone deferred) |

---

## 8. Proof window closed

| Field | Value |
| --- | --- |
| Final Preview URL | `https://crow-ecosystem-platform-ef49di5za-muhanadghurabs-projects.vercel.app` |
| Final deployment ID | `dpl_By9E361dFrvot2j5YM1f66HWhDnW` |
| `ACCOUNT_REGISTRATION_ENABLED` | `false` |
| `CROW_ONBOARDING_GENERATION_REQUIRED` | `1` (restored) |
| `CROW_PHONE_VERIFICATION_REQUIRED` | `false` |
| Diagnostics / Auth Canary | `false` |
| Gated state | `GATED_STATE=OK` |
| Disposable test identity | Removed (cleanup verified) |
| Legacy 13 identities | Untouched |
| Production | Unchanged |

---

## 9. Remaining blockers

1. **Preview session persistence** — document navigation must send Supabase auth cookies after password sign-in (C3.7C differential).
2. **Google OAuth** — provider configuration not enabled (deferred).
3. **Legacy identity reset** — requires separate authorization after session fix.

---

## 10. Final decision

**`FAILED — EMAIL ACTIVATION OR SESSION DEFECT`**

Email-only generation-2 activation is proven on hosted Preview; session durability after explicit password sign-in is not. Do not merge PR #9 or promote to Production until session persistence passes on protected Preview with `ACCOUNT_REGISTRATION_ENABLED=true`.
