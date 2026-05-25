# API security notes (RC1 + F1)

Internal hardening tracker for Next.js App Router routes under `src/app/api/`. No OpenAPI spec; middleware + per-route auth apply.

## Public routes (`isPublicApiPath`)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | None |
| POST | `/api/implementation-requests` | None (guarded intake pipeline) |
| POST | `/api/billing/webhook` | Stripe `stripe-signature` in handler |

## Session routes (`isHandlerAuthorizedApiPath`)

Middleware requires Supabase session; **route handler** enforces tenant/platform rules.

| Method | Path | Handler auth |
|--------|------|----------------|
| POST | `/api/billing/checkout` | `authorizeCheckout()` — platform staff or `tenant_admin` for own tenant |

All other `/api/*` routes require platform staff in middleware (`canAccessPlatformPath`).

## SEC-004 / SEC-006 — Public intake abuse (F1)

`POST /api/implementation-requests` is intentionally public (lead form).

**Implemented**

| Control | Notes |
|---------|--------|
| Zod schema | Enums for modules/packages/plan; max string lengths; max array sizes |
| `Content-Length` cap | 256 KiB → `413` |
| Honeypot | `companyWebsite` field → `400` if filled |
| Rate limit | In-memory 5 req / IP / 10 min → `429` (per instance) |
| Turnstile | **Optional** when `TURNSTILE_ENABLED=true` + keys set |
| Error bodies | Production: generic 400/503; no stack traces in JSON |
| Shared guard | API route + server action fallback use `runPublicIntakeGuards()` |

**Recommended (operations, not code)**

- [ ] Vercel Firewall rate limit on `POST /api/implementation-requests`
- [ ] Enable Turnstile in production (`TURNSTILE_ENABLED=true`)

**Planned (not implemented)**

- [ ] Shared Redis/Upstash rate limit for multi-instance Vercel
- [ ] Per-email domain throttling

See `PUBLIC_INTAKE_PROTECTION.md` and `PRODUCTION_READINESS.md`.

## SEC-005 — Health endpoint

| Environment | Behavior |
|-------------|----------|
| `NODE_ENV !== production` | Full JSON (`auth`, `migrationsApplied`, `siteUrl`, Stripe flags, …) |
| `NODE_ENV === production` | Reduced: `ok`, `db`, `deployReady` only |
| Override | `HEALTH_DETAIL=verbose` → full; `HEALTH_DETAIL=minimal` → reduced |

Staging smoke: use Preview env or set `HEALTH_DETAIL=verbose` on Vercel if full detail is needed in production-like envs.

## Stripe enablement checklist

Before turning on live Stripe webhooks:

1. Confirm `POST /api/billing/webhook` is in `isPublicApiPath` (middleware bypass).
2. Set `STRIPE_WEBHOOK_SECRET` in Vercel.
3. Register webhook URL: `https://<site>/api/billing/webhook`.
4. Test with Stripe CLI: invalid signature → `400`; valid event → `200`.

Stripe checkout enforcement and paid gates remain **out of scope** for F1.

## SAREA safe redirect

Existing safe redirect validation for external URLs remains unchanged in F1 (see prior RC1 security work if documented in codebase).

## Related

- `docs/internal/VERCEL_CONNECT.md` — env and pooler URLs
- `docs/internal/PRODUCTION_READINESS.md` — deploy checklist
- `docs/internal/STRIPE_BILLING.md` — if present
