# C3.7C Session Differential — Evidence Report

**Date:** 2026-06-19  
**Branch:** `feat/c3-account-registration-email-verification`  
**Canonical Preview (proof window):** `https://crow-ecosystem-platform-424gnh1t8-muhanadghurabs-projects.vercel.app`  
**Decision:** `FAILED — FRESH-ACCOUNT SESSION PERSISTENCE DEFECT`

## Methodology

Two isolated Playwright `BrowserContext`s (no shared storage, no `page.request` login):

| Context | Journey |
| --- | --- |
| A — Controlled | fresh context → form POST `/login/submit` → `/account` → hard reload → protected subroute |
| B — Fresh | signup → legal → OTP → close context → **new** context → form POST → `/account` → reload → `/account/profile` |

Sanitized capture via `scripts/lib/c3-preview-session-trace.ts` and `/api/c3/session-proof` (booleans only).

## Differential signals (controlled vs fresh)

| Signal | Controlled user | Fresh user |
| --- | --- | --- |
| Sign-in session returned (303) | true | not reached (controlled failed first) |
| Set-Cookie count (POST) | 1 | — |
| Cookie names | `sb-<project>-auth-token` | — |
| Cookie chunks | 0 | — |
| Secure/SameSite/Path | Secure; SameSite=lax; Path=/ | — |
| Redirect host | same-origin `/account` | — |
| First GET sends cookie | intermittent / false in CDP traces | — |
| Server auth after first nav | **false** (cookie present) | — |
| Hard reload sends cookie | jar shows name; CDP Cookie len 0 | — |
| Server auth after reload | **false** | — |
| Final route after reload | `/login` | — |

## Root cause (proven)

1. **API vs browser divergence on the same route handler**
   - `APIRequestContext` POST `/login/submit`: Set-Cookie ~2780 bytes; `/api/c3/session-proof` → `authenticated: true`.
   - Browser form POST: jar contains `sb-*-auth-token` (~2658 chars) but `/api/c3/session-proof` → `authenticated: false` while `sessionCookiePresent: true`.
   - Cookie value hashes differ per request (expected for new sessions) but **browser-stored value fails `getUser()`**.

2. **Document navigation does not attach the auth cookie**
   - CDP `Network.requestWillBeSent` for GET `/account`: `Cookie` header length **0** even when `Network.getAllCookies` lists the auth cookie.
   - Valid API session injected into browser context: `page.request` proof passes **before** `goto /account`; after document `goto`, jar is cleared and proof fails.

3. **Middleware/server clears invalid session on first protected GET**
   - Within ~500ms of browser sign-in, `sessionCookiePresent` drops from true → false (cookie stripped by response Set-Cookie).

4. **False positives when `ACCOUNT_REGISTRATION_ENABLED=false`**
   - Middleware does not C3-gate `/account`; reload can appear to pass without a durable session.
   - `/account/profile` still fails via `requireActivePlatformAccount()` → `/login?error=config`.

## Cookie chunking

- Installed `@supabase/ssr` uses single-cookie sessions (~2658 chars; below `MAX_CHUNK_SIZE` 3180).
- No `.0`/`.1` chunk suffixes observed in Preview traces.

## Cookie collisions

- `stripSupabaseAuthCookiesFromRequest()` added to strip stale request cookies **before** sign-in (no pre-emptive `Max-Age=0` on response).
- `expireOrphanedSupabaseAuthCookies()` runs **after** successful sign-in to expire orphan chunk names only.
- Pre-sign-in `clearStaleSupabaseAuthCookies()` removed from login route to avoid Set-Cookie ordering races.

## Corrective changes landed (not sufficient)

| Commit | Change |
| --- | --- |
| `1a78186` | `setSession` after `signInWithPassword`; aligned `cookieOptions` |
| `93d1639` | Post-sign-in orphan chunk expiry |
| `262daff` | Request-only stale cookie strip before sign-in |

## E2E runner isolation

- `run-c3-preview-controlled-e2e.ts` closes registration context before fresh-context login.
- Differential script mirrors Context B pattern.
- Host drift guard via `assertPreviewHost`.

## Remaining work

- Determine why browser-stored Supabase cookie fails JWT validation despite server `getUser()` succeeding during the same POST handler.
- Investigate Chromium/Playwright document navigation not emitting stored auth cookies on Vercel Preview (CDP-confirmed).
- Re-run full proof suite only after differential passes with `ACCOUNT_REGISTRATION_ENABLED=true`.
