# Phase 2 — Authentication

**Status:** Done · **Snapshot:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)

Supabase Auth protects platform and tenant workspaces. Prisma continues to use `DATABASE_URL` (server-side); roles live in Supabase **`app_metadata`** (never `user_metadata` for authorization).

## Environment

Add to `.env` (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server-only — bootstrap script and future admin APIs
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Get URL and **anon** (or publishable) key from [Supabase Dashboard → Project Settings → API](https://supabase.com/dashboard/project/_/settings/api).

Optional local bypass (never in production):

```env
AUTH_DISABLED=true
```

## Supabase Dashboard

1. **Authentication → Providers → Email** — enable Email provider.
2. **Authentication → URL configuration** — add site URL `http://localhost:3000` and redirect `http://localhost:3000/auth/callback`.
3. Disable public sign-ups if you only issue accounts via admin (recommended for B2B).

### Microsoft Entra ID (optional)

See **[`ENTRA_SSO.md`](ENTRA_SSO.md)** — enable Azure provider, set `AZURE_SSO_ENABLED=true`, assign `app_metadata` after first login.

## Roles (`app_metadata`)

| `crow_role`       | Access |
|-------------------|--------|
| `platform_admin`  | `/admin`, `/discovery`, `/blueprints`, `/sarea`, all tenants |
| `implementer`     | Same as platform admin (discovery implementers) |
| `tenant_admin`    | Tenant slugs in `tenant_slugs` only |
| `tenant_user`     | Tenant slugs in `tenant_slugs` only |

Example metadata (set via Dashboard → Users → user → **App Metadata**, or bootstrap script):

```json
{
  "crow_role": "platform_admin",
  "tenant_slugs": []
}
```

Tenant user example:

```json
{
  "crow_role": "tenant_admin",
  "tenant_slugs": ["acme-corp"]
}
```

## Bootstrap first platform admin

```powershell
cd d:\CYBERCROW
$env:PLATFORM_ADMIN_EMAIL="admin@yourorg.com"
$env:PLATFORM_ADMIN_PASSWORD="choose-a-strong-password"
npm run auth:bootstrap
```

Then sign in at [/login](http://localhost:3000/login).

## Route protection

| Area | Auth |
|------|------|
| `/`, `/request`, `/modules`, `/pricing`, `/security` | Public |
| `POST /api/implementation-requests` | Public (request form) |
| `GET /api/implementation-requests` | Platform staff |
| `/admin`, `/discovery`, `/blueprints`, `/sarea` | `platform_admin` or `implementer` |
| `/{tenant-slug}/*` | Platform staff **or** slug in `tenant_slugs` |

Middleware refreshes the session cookie; layouts call `requirePlatformStaff()` / `requireTenantAccess()` as a second layer.

## Smoke test

1. Without signing in, open `/admin/overview` → redirect to `/login`.
2. Bootstrap admin, sign in → admin loads.
3. Complete Phase 1 flow (see [PHASE1_PIPELINE.md](./PHASE1_PIPELINE.md)).
4. Open `/{tenant-slug}/dashboard` as platform admin → allowed.
5. Create a tenant user with `tenant_slugs: ["that-slug"]` → same URL works; other tenants → forbidden.

## Files

| Purpose | Path |
|---------|------|
| Roles | `src/lib/auth/roles.ts` |
| Route rules | `src/lib/auth/route-protection.ts` |
| Server guards | `src/lib/auth/session.ts` |
| Middleware | `src/lib/supabase/middleware.ts`, `src/middleware.ts` |
| Login UI | `src/app/login/page.tsx` |
| Bootstrap | `scripts/bootstrap-platform-admin.ts` |
