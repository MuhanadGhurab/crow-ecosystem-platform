# API security notes (RC1)

Internal hardening tracker for Next.js App Router routes under `src/app/api/`. No OpenAPI spec; middleware + per-route auth apply.

## Public routes (`isPublicApiPath`)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | None |
| POST | `/api/implementation-requests` | None (Zod validation) |
| POST | `/api/billing/webhook` | Stripe `stripe-signature` in handler |

## Session routes (`isHandlerAuthorizedApiPath`)

Middleware requires Supabase session; **route handler** enforces tenant/platform rules.

| Method | Path | Handler auth |
|--------|------|----------------|
| POST | `/api/billing/checkout` | `authorizeCheckout()` — platform staff or `tenant_admin` for own tenant |

All other `/api/*` routes require platform staff in middleware (`canAccessPlatformPath`).

## SEC-004 / SEC-006 — Public intake abuse

`POST /api/implementation-requests` is intentionally public (lead form).

**Current controls**

- Zod schema (enums, email, min lengths)
- `Content-Length` cap: 256 KiB → `413`
- Generic error bodies on 500/503 (no stack traces in responses)

**Planned (not implemented)**

- [ ] Vercel Firewall / WAF rate limits on `/api/implementation-requests`
- [ ] Cloudflare Turnstile or similar on `/request` form
- [ ] Edge rate limiting (per IP / per email)

## SEC-005 — Health endpoint

| Environment | Behavior |
|-------------|----------|
| `NODE_ENV !== production` | Full JSON (`auth`, `migrationsApplied`, `siteUrl`, Stripe flags, …) |
| `NODE_ENV === production` | Reduced: `ok`, `db`, `deployReady` only |
| Override | `HEALTH_DETAIL=verbose` → full; `HEALTH_DETAIL=minimal` → reduced |

Staging smoke: use Preview or set `HEALTH_DETAIL=verbose` on Vercel if full detail is needed in production-like envs.

## Stripe enablement checklist

Before turning on live Stripe webhooks:

1. Confirm `POST /api/billing/webhook` is in `isPublicApiPath` (middleware bypass).
2. Set `STRIPE_WEBHOOK_SECRET` in Vercel.
3. Register webhook URL: `https://<site>/api/billing/webhook`.
4. Test with Stripe CLI: invalid signature → `400`; valid event → `200`.

## Related

- `docs/internal/VERCEL_CONNECT.md` — env and pooler URLs
- `docs/internal/STRIPE_BILLING.md` — if present
