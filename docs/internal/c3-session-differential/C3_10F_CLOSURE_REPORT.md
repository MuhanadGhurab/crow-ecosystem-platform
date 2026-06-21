# C3.10F — Final C3 Closure & C3.11 Entry Gate

**Date:** 2026-06-18  
**Branch:** `feat/c3-account-registration-email-verification` (PR #9, unmerged)  
**Decision:** `FAILED — FRESH GENERATION-2 JOURNEY DEFECT` (operator prerequisites; proof window not opened)

---

## 1. Repair preservation (§1)

| Check | Result |
| --- | --- |
| Primary login: `submitSignInFormAction` → Supabase server client → redirect → `/account` (or C3 landing) | **CONFIRMED** — `sign-in-form.tsx` uses Server Action |
| `GET /auth/signout` → 405 | **PASS** (live Preview probe) |
| Sign-out POST-only via `SignOutButton` | **CONFIRMED** |
| No `<Link href="/auth/signout">` in `src/` | **CONFIRMED** |
| No GET route mutates session | **CONFIRMED** (`signout` GET returns 405) |
| No custom auth cookie / localStorage / weakened cookie options | **CONFIRMED** (C3.10E repair retained) |

---

## 2. Gated Preview baseline (§2)

| Item | Value |
| --- | --- |
| Immutable Preview URL | `https://crow-ecosystem-platform-quj033sxa-muhanadghurabs-projects.vercel.app` |
| Deployment ID | `dpl_AFRHXELyesBQiALBjNtNb6vBBv5P` |
| Supabase project ref | `wbwnsndcxrgyqwppurms` |
| Database fingerprint | `0355c17692e2a90d` |
| `OPERATOR_ENV` | **OK** (`validate-operator-hosted-env.ts`) |

**Flags (gated lockdown):**

```
ACCOUNT_REGISTRATION_ENABLED=false
C3_AUTH_CANARY_ENABLED=false
C3_REGISTRATION_DIAGNOSTICS=false
C3_SESSION_DIAGNOSTICS=false
CROW_PHONE_VERIFICATION_REQUIRED=false
CROW_ONBOARDING_GENERATION_REQUIRED=1
```

Production unchanged. PR #9 unmerged. Proof window for C3.10F **not opened** (blocked on operator env).

---

## 3–8. Manual browser & fresh generation-2 journey

| # | Item | Result |
| --- | --- | --- |
| 1 | Manual Chrome/Edge certification | **NOT RECORDED** — `C3_MANUAL_BROWSER_SESSION_CERTIFIED` unset in `.env.staging` |
| 2 | `EMAIL_VERIFICATION_CODE_SECRET_PRESENT` | **false** |
| 3 | Proof-window Preview URL / deployment ID | **N/A** — proof window not opened |
| 4 | Fresh registration (gen-2) | **NOT RUN** |
| 5 | Legal = 3 | **NOT RUN** |
| 6 | Email delivery | **NOT RUN** |
| 7 | Email OTP | **NOT RUN** |
| 8 | Supabase confirmation | **NOT RUN** |
| 9 | PlatformAccount activation | **NOT RUN** |
| 10 | Generation 2 | **NOT RUN** |
| 11–18 | Session lifecycle checklist | **PARTIAL** — automation only (see below) |
| 19 | Authorization (disposable account) | **NOT RUN** |
| 20 | Inactive-membership regression | **NOT RUN** |
| 21 | Phone challenge count | **NOT RUN** |
| 22 | SMS call count | **NOT RUN** |

**Automation partial session results (gated Preview, controlled ACTIVE user):**

| Signal | Result |
| --- | --- |
| Path B1 Server Action + hard reload | **PASS** |
| `GET_SIGN_OUT_STATUS` | **405** |
| `c3-preview-session:verify` (full flow incl. POST sign-out) | **FAIL** — controlled user lands on `/client`; `/account/profile` → `/login?error=config` (`#displayName` timeout). Harness may need account-portal test identity alignment. |
| Path B2 `/login/submit` browser form | **FAIL** (expected) — primary form no longer POSTs to compatibility route |
| Path C fresh signup | **BLOCKED** — missing `EMAIL_VERIFICATION_CODE_SECRET` |

---

## 9–10. Authorization & `/login/submit` (§9–10)

**Authorization regression:** Not executed (no disposable gen-2 identity).

**`/login/submit` audit:**

| Property | Status |
| --- | --- |
| Public login form targets it | **No** — Server Action is primary |
| GET authenticates | **No** — POST-only route |
| Prefetch trigger | **No** — not linked from UI |
| API session probe | **PASS** — `c3-preview-session:verify` isolated POST probe |
| Classification | **`COMPATIBILITY_NON_PRIMARY`** |

**Callers:** `scripts/verify-c3-preview-session.ts` (API probe), `scripts/verify-c3-preview-browser-session.ts` (Path B2), `scripts/verify-c3-auth-canary-differential.ts`, `scripts/lib/c3-preview-browser-session-diagnostics.ts`, `scripts/lib/c3-preview-session-trace.ts`, `src/lib/supabase/route-handler.test.ts`, `src/lib/account/c3-dual-channel-onboarding.test.ts`, route implementation `src/app/login/submit/route.ts`. **Zero production UI callers.** Documented for later removal when compatibility probes retire.

---

## 11. Verification suite (§11)

| Command | Result |
| --- | --- |
| `c3-preview-browser-session:verify` | **FAIL** — manual cert unset; Path B2 timeout; Path C blocked |
| `c3-preview-session:verify` | **FAIL** — profile step (account portal vs client landing) |
| `c3-preview-session:differential` | **NOT RUN** |
| `c3-preview-controlled:e2e` | **NOT RUN** — proof window + OTP secret |
| `c3-email-only-onboarding:verify` | **PASS** |
| `c3-auth-canary:verify` | **FAIL** — script reads `.env.staging` only; bypass secret present in merged runtime file |
| `c3-account:verify` | **PASS** |
| `c3-auth-convergence:verify` | **PASS** |
| `c2-database-isolation:verify` | **PASS** |
| `typecheck` | **PASS** |
| `lint` | **PASS** |
| `build` | **PASS** (migration-free; local DB unreachable warnings during SSG only) |

---

## 12–13. Cleanup & proof-window close

**Disposable identity cleanup:** N/A (no proof-window run).  
**Proof window restored:** Already at gated lockdown flags on `quj033sxa` deploy.

---

## 14–15. Operator actions required before C3.11

1. In gitignored `.env.staging`:
   - Set `C3_MANUAL_BROWSER_SESSION_CERTIFIED=true` or `false` after manual Chrome/Edge flow (`/login` → `/account` → reloads → `SignOutButton` → re-login).
   - Add `EMAIL_VERIFICATION_CODE_SECRET` (≥16 chars). Report only `EMAIL_VERIFICATION_CODE_SECRET_PRESENT=true`.
   - Ensure `VERCEL_AUTOMATION_BYPASS_SECRET` is in `.env.staging` (not only runtime merge) for `c3-auth-canary:verify`.
2. Open proof window: `npm run c3-preview-proof-flags:enable -- --deploy` with gen-2 flags.
3. Run `npm run c3-preview-controlled:e2e` (uses POST sign-out helper after C3.10F tooling fix).
4. Run full §11 suite; cleanup disposable data; `npm run c3-preview-proof-flags:disable -- --deploy`.
5. Re-run closure with recorded manual cert + Path C PASS.

---

## 35. C3.11 entry decision

**`FAILED — FRESH GENERATION-2 JOURNEY DEFECT`**

C3.11 is **not authorized**. Secondary blockers: manual browser certification not recorded; full verification suite incomplete.

---

## Evidence paths

- `docs/internal/c3-session-differential/C3_10E_SESSION_REPAIR_REPORT.md`
- `docs/internal/c3-session-differential/C3_10E_COOKIE_WRITER_INVENTORY.md`
- `docs/internal/c3-browser-session-certification/C3_10D_BROWSER_SESSION_REPORT.json`
- `docs/internal/c3-session-differential/C3_10F_CLOSURE_REPORT.md` (this file)

## Tooling changes (C3.10F)

- `scripts/lib/c3-preview-post-sign-out.ts` — POST `/auth/signout` for Playwright harnesses (GET is 405).
- Updated: `verify-c3-preview-session.ts`, `verify-c3-preview-session-differential.ts`, `run-c3-preview-controlled-e2e.ts`.
