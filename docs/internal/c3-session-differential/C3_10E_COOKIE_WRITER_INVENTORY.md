# C3.10E — Supabase Auth Cookie Writer Inventory

**Date:** 2026-06-20  
**Branch:** `feat/c3-account-registration-email-verification`  
**Rule:** No cookie values appear in this document.

## Summary

| Classification | Count | Primary files |
| --- | ---: | --- |
| LOGIN_SET | 3 | `server.ts`, `route-handler.ts`, `middleware.ts` (via Supabase `setAll`) |
| TOKEN_REFRESH | 1 | `middleware.ts` |
| REQUEST_COOKIE_SYNC | 3 | `server.ts`, `route-handler.ts`, `middleware.ts` |
| RESPONSE_COOKIE_SYNC | 2 | `route-handler.ts`, `middleware.ts` |
| SIGN_OUT_DELETE | 3 | `auth/signout/route.ts`, `actions/auth.ts`, `auth-canary/actions.ts` |
| STALE_COOKIE_DELETE | 3 | `route-handler.ts` (orphan/strip), `auth/callback/route.ts` (OAuth next cookie) |
| ERROR_CLEANUP | 1 | `auth/callback/route.ts` (`signOut` on OAuth errors) |
| TEST_ONLY | 1 | `route-handler.test.ts` |
| UNKNOWN | 1 | `supabase/client.ts` (browser `createBrowserClient`) |

---

## Writers and classifiers

### `src/lib/supabase/server.ts` — `createClient()`

| Field | Value |
| --- | --- |
| Classification | LOGIN_SET, TOKEN_REFRESH, REQUEST_COOKIE_SYNC |
| Mechanism | `createServerClient` → `cookies().set` via `setAll` |
| Used by | Server Actions (`submitSignInFormAction`, canary), RSC session reads |
| Deletes cookies | Only via Supabase `signOut` / invalid session refresh |
| Custom defaults | None (C3.10E removed speculative `cookieOptions`) |

### `src/lib/supabase/middleware.ts` — `updateSession()`

| Field | Value |
| --- | --- |
| Classification | TOKEN_REFRESH, RESPONSE_COOKIE_SYNC |
| Mechanism | `createServerClient` → `setAll` → `response.cookies.set` |
| Deletes cookies | Supabase may emit empty-value cookies on invalid refresh; redirects now copy refreshed cookies |
| Custom defaults | Path/SameSite/Secure merge only when Supabase omits them |
| Cache | `Cache-Control: private, no-store` when session cookies mutate |

### `src/lib/supabase/route-handler.ts`

| Function | Classification |
| --- | --- |
| `createRouteHandlerCookieAdapter` / `createSupabaseRouteHandlerClient` | LOGIN_SET, RESPONSE_COOKIE_SYNC |
| `stripSupabaseAuthCookiesFromRequest` | REQUEST_COOKIE_SYNC (request-only; no Set-Cookie) |
| `expireOrphanedSupabaseAuthCookies` | STALE_COOKIE_DELETE (`maxAge: 0` on orphan chunk names) |
| `clearStaleSupabaseAuthCookies` (deprecated) | STALE_COOKIE_DELETE |

### `src/app/login/submit/route.ts`

| Field | Value |
| --- | --- |
| Classification | LOGIN_SET (compatibility POST handler) |
| Flow | Redirect response → `createSupabaseRouteHandlerClient` → `resolveSignInSubmissionUrl` → optional orphan expiry |
| Primary login | **No** — form uses Server Action after C3.10E repair |

### `src/lib/actions/auth.ts`

| Function | Classification |
| --- | --- |
| `submitSignInFormAction` / `resolveSignInSubmissionUrl` | LOGIN_SET (via `server.ts` client) |
| `signOut` | SIGN_OUT_DELETE |

### `src/app/auth-canary/actions.ts`

| Function | Classification |
| --- | --- |
| `signInCanary` | LOGIN_SET (Server Action, proven canary baseline) |
| `signOutCanary` | SIGN_OUT_DELETE |

### `src/app/auth/signout/route.ts`

| Classification | SIGN_OUT_DELETE |
| Mechanism | Route handler `createClient` + `supabase.auth.signOut()` |

### `src/app/auth/callback/route.ts`

| Classification | ERROR_CLEANUP, STALE_COOKIE_DELETE |
| Mechanism | OAuth error paths call `signOut`; clears OAuth `next` cookie with `maxAge: 0` |
| Crow authorization | Separate from Supabase session clearing on OAuth failure only |

### `src/lib/supabase/client.ts`

| Classification | UNKNOWN (browser storage; not document cookie path for C3 login) |
| Note | No custom cookie options; not used for password login durability proof |

### Non-auth cookies

| File | Cookie | Classification |
| --- | --- | --- |
| `src/app/api/sarea/preview/route.ts` | SAREA preview | TEST_ONLY / feature flag |
| `src/app/auth/google/route.ts`, `entra/route.ts` | OAuth `next` path | LOGIN_SET (non-Supabase) |

---

## Authorization coupling audit (C3.10E §10)

| Gate | Clears Supabase session? |
| --- | --- |
| Middleware `redirectToLogin(..., forbidden)` | **No** — preserves session cookies on redirect (C3.10E fix) |
| `requireActivePlatformAccount` inactive account | **No** — redirects to verify-email; no `signOut` |
| Platform/tenant forbidden | **No** — middleware redirect copies session cookies |
| OAuth callback errors | **Yes** — explicit `signOut` (expected) |
| Explicit `/auth/signout` | **Yes** — expected |

---

## Chunk handling (C3.10E §7)

- `@supabase/ssr` emits base name `sb-<project-ref>-auth-token` plus optional `.0`, `.1`, … suffixes.
- All adapters use `getAll()` / `setAll()` (no single-cookie reads).
- `expireOrphanedSupabaseAuthCookies` only deletes names present on the **request** but absent from the active login set.
- `copySupabaseResponseCookies` copies **all** response cookies including chunk suffixes on redirects.
