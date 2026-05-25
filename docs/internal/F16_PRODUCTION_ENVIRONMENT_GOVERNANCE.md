# F16 — Production environment governance

**Date:** 25 May 2026  
**Phase:** F16 — Production Launch Readiness & Environment Governance  
**Audience:** Operators, release owners, engineering  
**Rule:** No secret values in this document.

---

## Part 1 — Environment audit (current model)

Crow Ecosystem uses **one application codebase** with **environment-specific configuration** — not separate repos per environment.

| Layer | Local dev | Staging (Vercel Preview / `.env.staging`) | Production (Vercel Production) |
|-------|-----------|------------------------------------------|--------------------------------|
| **App host** | `http://localhost:3000` | Vercel preview URL or `staging:host` tunnel | Canonical production domain |
| **Postgres** | Often localhost **or** Supabase pooler (team choice) | Supabase pooler (6543/5432) | **Separate** Supabase project recommended vs staging |
| **Supabase Auth** | Same or staging project keys | Staging Supabase project | Production Supabase project |
| **Auth provider** | Supabase + optional Entra | Entra via Supabase OAuth | Entra via Supabase OAuth |
| **Mock / auth bypass** | `AUTH_DISABLED` / `USE_MOCK_DATA` allowed | Must be **false** for RC1-style validation | Must be **false** (enforced in code) |
| **Turnstile** | Usually off locally | Optional; recommended before public prod | **Recommended** `TURNSTILE_ENABLED=true` |
| **Resend** | Optional; override inbox common | `PIPELINE_NOTIFY_EMAIL_OVERRIDE` typical | Production from-domain + ops inbox |
| **Stripe** | Optional test keys | Test mode optional | Live keys **future** (no enforcement in app) |

### Separation principles

1. **Never** point production `DATABASE_URL` at staging Supabase (or localhost).
2. **`NEXT_PUBLIC_SITE_URL`** must match the deployed hostname for OAuth and email links.
3. **Supabase Dashboard Site URL** must match `NEXT_PUBLIC_SITE_URL` (not localhost in prod).
4. **Azure redirect URI** is always `https://<project-ref>.supabase.co/auth/v1/callback` — not Vercel `/auth/callback` alone.
5. **Vercel** does not read `.env.staging` from git — all production values live in **Vercel → Environment Variables**.

### Validation scripts (no secrets printed)

| Script | Typical env file | Purpose |
|--------|------------------|---------|
| `npm run env:check` | `.env` | Host hints, hybrid DB warning, Resend/Turnstile presence |
| `npm run validate:vercel-env` | `.env.staging` | Pre-deploy URL shape, pooler, auth flags |
| `npm run deploy:check` | `.env` | M7 deploy readiness |
| `npm run deploy:check:staging` | `.env.staging` | Staging deploy readiness |
| `npm run gate:production-auth` | — | Blocks `AUTH_DISABLED` in production builds |
| `npm run f2:env-status` | `.env.staging` | F2 production-control flags summary |

Templates: `.env.example` (local/UI-only comments), `.env.production.example` (staging/prod shape).

---

## Part 2 — Environment variable matrix

Legend: **R** = required for production go-live · **O** = optional · **F** = future / billing not enforced · **S** = server-only secret · **P** = safe in browser (`NEXT_PUBLIC_*`)

| Variable | R/O/F | S/P | Configure where | Staging vs production | Risk if misconfigured |
|----------|-------|-----|-----------------|----------------------|------------------------|
| `DATABASE_URL` | **R** | S | Vercel + local `.env.staging` | **Different project/ref** per env | Wrong tenant data, data leak, P1001 on Vercel |
| `DIRECT_URL` | **R** | S | Vercel (build/migrate) | Same project as `DATABASE_URL` | Migrate deploy fails; must be session pooler **5432**, no `pgbouncer` |
| `NEXT_PUBLIC_SUPABASE_URL` | **R** | P | Vercel | Per-environment project | Auth broken; must not include `/rest/v1` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **R** | P | Vercel | Per-environment key | Login fails |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **R** (alt) | P | Vercel | Publishable key strategy | Same as anon — use one convention |
| `SUPABASE_SERVICE_ROLE_KEY` | **R** (ops) | S | Vercel only | Per-environment | **Never** expose to client; full DB bypass |
| `NEXT_PUBLIC_SITE_URL` | **R** | P | Vercel | Staging URL vs prod domain | OAuth redirect loops, wrong email links |
| `AUTH_DISABLED` | **R=false** | S | Vercel | Must be false/unset | **Critical:** open admin surfaces |
| `USE_MOCK_DATA` | **R=false** | S | Vercel | Must be false/unset | Fake data in production |
| `NODE_ENV` | **R** | — | Vercel sets `production` | — | Health shape, error verbosity |
| `TURNSTILE_ENABLED` | O (prod rec.) | S | Vercel | Can test off on staging | Bot abuse on `/request` if off |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | O | P | Vercel | Per Turnstile widget | Widget fails if enabled without key |
| `TURNSTILE_SECRET_KEY` | O | S | Vercel | Per widget secret | Intake rejects valid users if wrong |
| `RESEND_API_KEY` | O | S | Vercel | Staging vs prod keys | Notifications `skipped` in DB |
| `NOTIFICATION_FROM_EMAIL` | O | S | Vercel | Verified domain in prod | Resend send failures |
| `PIPELINE_NOTIFY_EMAIL_OVERRIDE` | O | S | Staging **yes**, prod **careful** | Staging routes all mail to one inbox | Prod mail misdelivery if left on |
| `PLATFORM_NOTIFY_EMAIL` | O | S | Vercel | Ops inbox | Platform alerts lost |
| `PLATFORM_ADMIN_EMAIL` | O | S | Vercel | Fallback digest recipient | Digest routing |
| `NOTIFICATION_TEST_EMAIL` | O | S | Dev/staging only | **Do not** use in prod | Test mail to wrong inbox |
| `STRIPE_SECRET_KEY` | F | S | Vercel | Test vs live keys | Billing UI only; no hard gate |
| `STRIPE_WEBHOOK_SECRET` | F | S | Vercel + Stripe dashboard | Per endpoint URL | Forged webhooks if missing |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | F | P | Vercel | Test vs live | Client checkout init only |
| `STRIPE_PRICE_*` | F | S | Vercel | Per Stripe products | Wrong plan mapping |
| `AZURE_SSO_ENABLED` | O | S | Vercel | Same Entra app or separate | SSO button hidden if false |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | O | P | Vercel | Tenant ID for Entra | SSO misconfiguration |
| `HEALTH_DETAIL` | O | S | Vercel | `verbose` on staging preview OK | Prod info leak if `verbose` |
| `GO_LIVE_READINESS_GATE` | O | S | Vercel | Staging experiments | Blueprint gate behavior |
| `GO_LIVE_READINESS_STRICT` | O | S | Vercel | — | Stricter go-live checks |
| `AUTH_DEV_ROLE` / `AUTH_DEV_TENANT_SLUG` | **Never prod** | S | Local only | Dev bypass | Wrong role in prod if set |
| `TENANT_OPS_SEED` | O | S | Staging seeds | **Off** in prod unless approved | Unwanted demo data |
| `VERCEL_URL` | Auto | S | Vercel injects | Preview hostnames | Fallback only; prefer `NEXT_PUBLIC_SITE_URL` |

### Dangerous combinations (no-go)

| Condition | Why |
|-----------|-----|
| `AUTH_DISABLED=true` in production | Middleware bypass; synthetic user |
| `USE_MOCK_DATA=true` in production | Mock tenants and data |
| `DATABASE_URL` → localhost on Vercel | Build/runtime DB failure |
| `DATABASE_URL` without `pgbouncer=true` on port 6543 | Pool exhaustion / Prisma errors |
| `DIRECT_URL` with `pgbouncer=true` | Migrate deploy issues |
| `db.<ref>.supabase.co` direct host | P1001 on serverless |
| Service role key in `NEXT_PUBLIC_*` | Full database compromise |
| `.env` committed or staged in git | Credential leak |

### Public vs secret boundary

- Only variables prefixed `NEXT_PUBLIC_` are embedded in client bundles.
- **Never** prefix: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*` secrets, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, database URLs.

---

## Related documents

| Doc | Topic |
|-----|--------|
| [`F16_DEPLOYMENT_RUNBOOK.md`](F16_DEPLOYMENT_RUNBOOK.md) | Deploy / rollback |
| [`F16_AUTH_SUPABASE_GOVERNANCE.md`](F16_AUTH_SUPABASE_GOVERNANCE.md) | Auth redirects |
| [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md) | Launch gates |
| [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) | F1 checklist (still valid) |
| [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md) | Vercel wiring |
| [`SECRET_ROTATION.md`](SECRET_ROTATION.md) | Incident rotation |
| [`.env.example`](../../.env.example) · [`.env.production.example`](../../.env.production.example) | Templates |

---

## F16 acceptance (this document)

- Environment audit: **documented**
- Production env checklist: **this file, Part 2**
