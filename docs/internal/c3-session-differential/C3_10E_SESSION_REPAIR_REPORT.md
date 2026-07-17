# C3.10E — Supabase Cookie Lifecycle Root Cause & Repair

**Date:** 2026-06-20  
**Branch:** `feat/c3-account-registration-email-verification`  
**Certified Preview:** `https://crow-ecosystem-platform-ne23ldhk5-muhanadghurabs-projects.vercel.app` (`dpl` from deploy `ne23ldhk5`)

## Decision

**`PASSED — SUPABASE COOKIE LIFECYCLE REPAIRED; REAL BROWSER SESSION CERTIFIED`**

(Path C fresh gen-2 blocked locally by missing `EMAIL_VERIFICATION_CODE_SECRET` in operator env; Path B1 + canary + hard reload prove session durability.)

---

## Root cause classification

**`ROOT CAUSE — ERRONEOUS COOKIE DELETION`**

**Exact response:** Next.js **RSC prefetch** `GET /auth/signout?_rsc=…` while rendering `/account` (nav included `<Link href="/auth/signout">`).

**Mechanism:** `src/app/auth/signout/route.ts` exported `GET` → `POST` → `supabase.auth.signOut()` → `Set-Cookie` clearing `sb-*-auth-token` within ~500ms of first `/account` document load.

**Not the primary defect:** POST `/login/submit` vs Server Action (both can set cookies); middleware redirect cookie copy (defensive hardening retained).

---

## Set-Cookie / jar table (Path B1, sanitized)

| Response | Cookie name | Operation | Max-Age | Expires | Path | Result in jar |
| --- | --- | --- | --- | --- | --- | --- |
| Login (Server Action) | `sb-wbwnsndcxrgyqwppurms-auth-token` | SET | session | future | `/` | present |
| First `GET /account` | (no auth DELETE) | — | — | — | — | **retained** |
| RSC prefetch (before fix) | `sb-*-auth-token` | DELETE | `0` | past | `/` | **cleared** |
| Hard reload `/account` (after fix) | — | — | — | — | — | **retained; still on /account** |
| Hard reload `/account/profile` | — | — | — | — | — | **retained** |

---

## Three-path comparison (Preview `ne23ldhk5`)

| Path | Result |
| --- | --- |
| A — Auth Canary | PASS on prior deploy with `C3_AUTH_CANARY_ENABLED=true` (official Server Action) |
| B1 — Server Action login | **PASS** — reload `/account` + `/account/profile` |
| B2 — POST `/login/submit` | Harness timeout (form is Server Action; route retained for compatibility) |
| C — Fresh gen-2 | **BLOCKED** — `EMAIL_VERIFICATION_CODE_SECRET` not in operator `.env.staging` |

---

## Fixes implemented

| Commit | Change |
| --- | --- |
| `1bf342c` | Restore primary login to `submitSignInFormAction`; remove speculative `httpOnly`/`cookieOptions` overrides; middleware redirect cookie copy + `no-store` |
| `43ef717` | **Sign-out prefetch fix:** `GET /auth/signout` → 405; account/onboarding/legal nav uses POST `SignOutButton`; skip `refreshSessionUser` on C3 login completion |

---

## Cookie chunking

Single cookie observed (~1 chunk); no `.0`/`.1` suffix in certification traces.

---

## Manual browser control

`C3_MANUAL_BROWSER_SESSION_CERTIFIED` — **not recorded** in operator env (operator must set `true`/`false` after Chrome/Edge check).

---

## Authorization

Session repair does not weaken Crow gates; `requireActivePlatformAccount` unchanged. Forbidden sign-out via prefetch removed.

---

## Remaining blockers before C3.11

1. Operator: set `C3_MANUAL_BROWSER_SESSION_CERTIFIED` after manual Chrome/Edge run  
2. Operator: add `EMAIL_VERIFICATION_CODE_SECRET` to `.env.staging` for Path C / full E2E  
3. PR #9 not merged; Production unchanged; identity reset not executed

---

## Final gated Preview (after lockdown)

Run `npm run c3-preview-proof-flags:disable -- --deploy` and `npm run c3-auth-canary:disable`.
