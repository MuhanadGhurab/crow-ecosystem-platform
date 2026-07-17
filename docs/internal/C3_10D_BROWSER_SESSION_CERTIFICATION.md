# C3.10D — Real browser session certification report

**Date:** 2026-06-20  
**Branch:** `feat/c3-account-registration-email-verification` (PR #9, not merged)  
**Decision:** `FAILED — CROW BROWSER SESSION DEFECT`  
**Auth application code:** frozen (no cookie/login/middleware changes in this pass)

---

## Executive summary

Automation bypass via `VERCEL_AUTOMATION_BYPASS_SECRET` (project Protection Bypass for Automation) was configured and verified. Native Playwright **document navigation** (form POST `/login/submit`, fresh `BrowserContext`, no `page.request` login) reproduces the same defect as C3.10C: **first `/account` succeeds, hard reload drops the Supabase auth cookie from the jar and redirects to `/login`.**

This rules out the prior hypothesis that the failure was **only** due to `vercel curl` / `_vercel_jwt` E2E context. The defect persists with header-based automation bypass.

Path C (fresh gen-2 registration → login → reload) was **not executed** because `EMAIL_VERIFICATION_CODE_SECRET` is not present in operator `.env.staging` (Vercel does not export it via `env pull`).

**Legacy identity reset was not executed.** Production unchanged.

---

## 1. Manual browser control test

| Outcome | Value |
|--------|--------|
| Recorded | **No** — operator must set `C3_MANUAL_BROWSER_SESSION_CERTIFIED=true\|false` after Chrome/Edge test via Vercel team access |
| Required flow | login → `/account` → hard reload → `/account/profile` → hard reload → sign out → sign in again |

Until the manual boolean is recorded, the decision matrix cannot distinguish harness-only vs real browser defects with full confidence.

---

## 2. Automation bypass configuration

| Check | Result |
|-------|--------|
| `VERCEL_AUTOMATION_BYPASS_SECRET` resolved | **Yes** (operator runtime env; not committed) |
| Headers | `x-vercel-protection-bypass`, `x-vercel-set-bypass-cookie: true` |
| Preview reachable without interactive Vercel auth | **PASS** (`/api/health`) |
| Depends on `_vercel_jwt` for automation | **No** (bypass headers sufficient) |

Helper: `npm run c3-preview:runtime-env` → `.env.staging.runtime` (gitignored).

---

## 3. Canonical Preview URLs

| Phase | URL | Deployment |
|-------|-----|------------|
| Proof window (cert run) | `https://crow-ecosystem-platform-rmsk1kph3-muhanadghurabs-projects.vercel.app` | `dpl_5sYkpwmVo73cocQy4M4aSK9uorex` |
| Final gated Preview | `https://crow-ecosystem-platform-fy8r1pvgx-muhanadghurabs-projects.vercel.app` | `dpl_8NG3ft4HEDopF2wZzd5aXpLifi3S` |

Proof flags during cert: registration enabled, gen=2, diagnostics/canary off.  
Final gated state verified via `read-c3-preview-branch-env.ts gated` → **GATED_STATE=OK**.

---

## 4. BrowserContext isolation

| Requirement | Result |
|-------------|--------|
| Fresh context per path | **PASS** |
| No storage state / manual cookies | **PASS** |
| No `page.request` login | **PASS** |
| Document hard reload | **PASS** |
| Hostname drift guard | **PASS** |

---

## 5. Three-path comparison (proof deployment)

| Path | Description | Result |
|------|-------------|--------|
| **A** | Official Auth Canary | **Skipped** — `C3_AUTH_CANARY_ENABLED=false` (307, no canary form) |
| **B** | Existing active user, real `/login/submit` | **FAIL** — reload → `/login` |
| **C** | Fresh gen-2 registration → new context login | **Blocked** — missing operator `EMAIL_VERIFICATION_CODE_SECRET` |

---

## 6. Path B — Chromium cookie diagnostics (sanitized)

| Request | Supabase cookie stored (end state) | Applicable to URL | Sent on request | Blocked reason |
|---------|:---:|:---:|:---:|:---|
| POST `/login/submit` | false | false | false | — |
| First GET `/account` | false | false | **true** | — |
| Hard reload `/account` | false | false | false → then login | — |
| GET `/account/profile` | false | false | **false** | — |
| Hard reload profile | — | — | — | redirected to `/login` |

**Interpretation:** Supabase auth cookie is **sent on the first** `/account` document GET after form login, then **not sent** on subsequent document navigations/reload; jar no longer holds an applicable auth cookie at end of flow. No blocked-reason codes from CDP (cookie absent from jar rather than SameSite-blocked on send).

Full table: `docs/internal/c3-browser-session-certification/C3_10D_BROWSER_SESSION_REPORT.json`

---

## 7. Root-cause classification

**`FAILED — CROW BROWSER SESSION DEFECT`**

With automation bypass proven, the failure is **not** classified as E2E-only / `_vercel_jwt` context. Application auth code remains frozen pending:

1. Operator manual browser boolean (`C3_MANUAL_BROWSER_SESSION_CERTIFIED`)
2. Path A with canary temporarily enabled (compare Server Action vs route handler)
3. Path C with operator OTP secret (fresh gen-2 user parity)

If manual browser **passes** while automation **fails**, reclassify to **`CONDITIONAL PASS — MANUAL BROWSER HEALTHY; AUTOMATION HARNESS REQUIRES REPAIR`**.

---

## 8. Changes in this pass (harness only — no auth app changes)

| Area | Change |
|------|--------|
| Automation bypass | `scripts/lib/c3-preview-automation-bypass.ts` |
| Document session proof + CDP table | `scripts/lib/c3-preview-browser-session-diagnostics.ts` |
| Playwright context helper | `scripts/lib/c3-preview-playwright-context.ts` |
| Runtime env builder | `scripts/lib/c3-preview-runtime-env.ts` |
| Session fixture (Path B when no OTP secret) | `scripts/lib/c3-preview-session-fixture.ts` |
| C3.10D cert runner | `scripts/verify-c3-preview-browser-session.ts` |
| Session/differential/E2E/canary scripts | Use bypass secret; split `ISOLATED_API_SESSION` |
| npm scripts | `c3-preview-browser-session:verify`, `c3-preview:runtime-env` |
| `.env.local.example` | Document `VERCEL_AUTOMATION_BYPASS_SECRET` |

---

## 9. Verification suite (this pass)

| Command | Result |
|---------|--------|
| `npm run c3-preview-browser-session:verify` | **FAIL** (Path B reload) |
| `npm run c3-preview-session:verify` | Not re-run (same expected failure) |
| `npm run c3-preview-session:differential` | Not re-run (OTP secret blocker) |
| `npm run c3-preview-controlled:e2e` | Not re-run (OTP secret blocker) |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |

---

## 10. Operator actions required

1. Add `VERCEL_AUTOMATION_BYPASS_SECRET` to `.env.staging` (or rely on `c3-preview:runtime-env` resolution via authenticated Vercel CLI).
2. Add `EMAIL_VERIFICATION_CODE_SECRET` to `.env.staging` for Path C / full email-only E2E.
3. Record manual browser test: `C3_MANUAL_BROWSER_SESSION_CERTIFIED=true|false`.
4. Optional: enable canary for Path A — `npm run c3-auth-canary:enable` + redeploy, then re-run browser cert.

---

## 11. Gate closure confirmations

| Item | Status |
|------|--------|
| Legacy identity reset | **Not executed** |
| Production | **Unchanged** |
| Final `CROW_ONBOARDING_GENERATION_REQUIRED` | **1** |
| Final `ACCOUNT_REGISTRATION_ENABLED` | **false** |
| Phone / SMS | **0** (not exercised) |
| Disposable proof identity cleanup | Run `C3_CLEANUP_EMAIL=<fixture-email> npm run c3-preview-controlled:cleanup` if fixture user remains |

---

## 12. Final decision

**`FAILED — CROW BROWSER SESSION DEFECT`**

Do not authorize legacy identity reset. Session durability must pass on protected Preview with `BROWSER_DOCUMENT_SESSION` proof before C3.10 gates reopen.
