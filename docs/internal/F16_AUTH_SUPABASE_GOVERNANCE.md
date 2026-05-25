# F16 — Auth & Supabase governance

**Audience:** Operators configuring Supabase, Entra, and Vercel for production  
**No tenant IDs, user IDs, or secret values** in this document.

---

## Supabase project alignment

Each deployed environment (staging vs production) should use a **consistent triple**:

1. `DATABASE_URL` / `DIRECT_URL` → that project's pooler
2. `NEXT_PUBLIC_SUPABASE_URL` + anon/publishable key → that project's Auth API
3. Supabase Dashboard **Authentication → URL configuration** → that project's Site URL

Mixing staging DB with production Auth (or vice versa) causes sessions that do not match data.

---

## Site URL and redirect URLs

**Dashboard:** Authentication → URL configuration

| Setting | Production value | Notes |
|---------|------------------|-------|
| **Site URL** | Same as `NEXT_PUBLIC_SITE_URL` | e.g. `https://app.example.com` — not localhost |
| **Redirect URLs** | `https://<prod-host>/auth/callback` | Required for OAuth code exchange |
| **Redirect URLs (dev)** | `http://localhost:3000/auth/callback` | Development only — optional in same project if team uses one Supabase project for dev |

**Application callback route:** `src/app/auth/callback/route.ts` exchanges code for session cookie and uses `resolvePostLoginDestination` + `safeRedirectPath` for `next` parameter.

---

## Microsoft Entra ID (Azure SSO)

| Item | Correct | Incorrect |
|------|---------|-----------|
| Azure App Registration redirect URI | `https://<project-ref>.supabase.co/auth/v1/callback` | Vercel `/auth/callback` only |
| Azure redirect for production | Production Supabase project ref | `localhost` |
| User sign-in flow | User → Supabase OAuth → app `/auth/callback` | Direct to Vercel without Supabase |

Env flags:

- `AZURE_SSO_ENABLED=true` when Entra provider is configured in Supabase
- `NEXT_PUBLIC_AZURE_TENANT_ID` — public tenant GUID (not a secret, but environment-specific)

Guide: [`help/entra-sso`](../../src/app/help/entra-sso) (in-app) and internal Entra setup docs if present.

---

## Database pooler strategy

| URL | Port | Query | Use |
|-----|------|-------|-----|
| `DATABASE_URL` | **6543** | `?pgbouncer=true` | Runtime Prisma / Next.js serverless |
| `DIRECT_URL` | **5432** | no `pgbouncer` | `prisma migrate deploy`, migrations |

Use **pooler host** (`aws-*-*.pooler.supabase.com`), not `db.<ref>.supabase.co`, on Vercel.

Password characters like `@` must be **URL-encoded** (`%40`) in connection strings.

---

## Service role key

| Rule | Detail |
|------|--------|
| Storage | Vercel **Production** env only (server) |
| Never | `NEXT_PUBLIC_*`, client components, public docs, screenshots |
| Used for | Admin bootstrap scripts, server-side user linking, privileged operations |
| Rotation | [`SECRET_ROTATION.md`](SECRET_ROTATION.md) |

---

## Application auth behavior (regression baseline)

Verified in F15.6; unchanged in F16.

| Scenario | Expected behavior |
|----------|-------------------|
| Unauthenticated `GET /admin/overview` | Redirect to `/login?next=...` |
| Unauthenticated `GET /admin/requests` | Redirect to login |
| Unauthenticated `GET /{tenant}/dashboard` | Redirect to login |
| Platform Admin after login | Lands on `/admin/overview` (or safe `next`) |
| Client role `GET /portal/requests` | Portal works |
| Platform staff `GET /portal` without `?preview=client` | Redirect to `/admin/overview` |
| `AUTH_DISABLED=true` in `NODE_ENV=production` | **Throws at startup** (`assertAuthNotDisabledInProduction`) |
| Public paths (`/`, `/request`, …) | No session required |

Middleware: `src/lib/supabase/middleware.ts`  
Route rules: `src/lib/auth/route-protection.ts`

---

## Pre-production auth checklist

- [ ] `AUTH_DISABLED` unset or `false` on Vercel Production
- [ ] `USE_MOCK_DATA` unset or `false` on Vercel Production
- [ ] `NEXT_PUBLIC_SITE_URL` matches production hostname
- [ ] Supabase Site URL matches `NEXT_PUBLIC_SITE_URL`
- [ ] `/auth/callback` in Supabase redirect allow list
- [ ] Entra redirect URI points to Supabase callback URL
- [ ] Test login: platform admin → `/admin/overview`
- [ ] Test login: client (if used) → portal, not trapped
- [ ] Test logout: `/auth/signout` clears session

---

## Related

- [`F16_HEALTH_SMOKE_CHECKLIST.md`](F16_HEALTH_SMOKE_CHECKLIST.md) — Auth section
- [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md)
- [`API_SECURITY.md`](API_SECURITY.md)
