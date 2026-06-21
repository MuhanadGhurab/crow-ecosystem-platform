# C3.7D — Official Supabase SSR Baseline Audit

**Date:** 2026-06-19

## Package versions

| Package | Version |
| --- | --- |
| `next` | ^15.3.0 |
| `@supabase/ssr` | ^0.10.3 |
| `@supabase/supabase-js` | ^2.106.0 |

No package upgrades applied for C3.7D.

## Official quickstart comparison

| Requirement | Crow implementation | Match |
| --- | --- | --- |
| Browser client `createBrowserClient` | `src/lib/supabase/client.ts` | Yes |
| Server client `createServerClient` + `cookies()` | `src/lib/supabase/server.ts` | Yes |
| Middleware session refresh | `src/middleware.ts` → `updateSession` | Partial — public paths skip refresh unless canary branch |
| Request + response cookie propagation in middleware | `setAll` updates request + `NextResponse` | Yes |
| No Auth Helpers | None found | Yes |
| Dynamic authenticated pages | Account/canary use `force-dynamic` | Yes |
| Password sign-in via Server Action | **Canary only** (`auth-canary/actions.ts`); production login uses Route Handler | Canary tests official path |

## Deviations (custom login path — frozen)

| Item | Custom `/login/submit` |
| --- | --- |
| Mechanism | Route Handler 303 redirect |
| Cookie adapter | `createSupabaseRouteHandlerClient` |
| Post sign-in `setSession()` | Present |
| Stale cookie strip / orphan expiry | Present |
| Not in official quickstart | Yes |

## Proxy / middleware

Crow uses `src/middleware.ts` (Next.js middleware), not a separate `proxy.ts`. Canary subroutes receive Supabase session refresh without Crow RBAC redirect (C3.7D branch only).

## Canary surface

- Routes: `/auth-canary`, `/auth-canary/landing`, `/auth-canary/secondary`
- Gate: `VERCEL_ENV=preview` && `C3_AUTH_CANARY_ENABLED=true`
- Production: 404 via `notFound()`
