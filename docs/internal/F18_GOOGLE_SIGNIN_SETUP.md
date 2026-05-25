# F18 — Google Sign-In setup & auth flow audit

**Phase:** F18 — Google Sign-In integration & auth UX polish  
**Date:** 25 May 2026  
**Audience:** Internal engineering / operators  

**Rules:** No real client IDs or secrets in this doc. Credentials live in Supabase Dashboard and Google Cloud Console only.

---

## Part 1 — Auth flow audit (before implementation)

### Routes and entry points

| Surface | Path / file | Role |
|---------|-------------|------|
| Login UI | `/login` — `src/app/login/page.tsx` | Email/password + optional Microsoft + Google buttons |
| OAuth callback | `/auth/callback` — `src/app/auth/callback/route.ts` | **Shared** for all Supabase OAuth providers (Azure, Google, magic link) |
| Entra start (server) | `/auth/entra` — `src/app/auth/entra/route.ts` | GET redirect to Supabase `provider: "azure"` |
| Google start (server) | `/auth/google` — `src/app/auth/google/route.ts` | GET redirect to Supabase `provider: "google"` |
| Entra start (client) | `SignInWithEntra` — `signInWithOAuth({ provider: "azure" })` | Same flow as server route; sets next cookie |
| Google start (client) | `SignInWithGoogle` — `signInWithOAuth({ provider: "google" })` | Same pattern as Entra |
| Email/password | `signIn` server action — `src/lib/actions/auth.ts` | Unchanged |

### How `next` / redirect is preserved

1. Client OAuth buttons call `setOAuthNextCookie(nextPath)` (`crow_oauth_next` cookie).
2. Server routes `/auth/entra` and `/auth/google` set the same cookie from `?next=` query param.
3. `/auth/callback` reads cookie + `?next=` via `resolveOAuthNextPath`.
4. After session exchange, `resolvePostLoginDestination(user, explicitNext)` applies role-based routing.

**Google reuses:** `buildAuthCallbackUrl`, `oauthNextCookieOptions`, `/auth/callback`, post-login resolver — no Google-specific callback fork.

### How roles are read

- `crow_role` is read from **Supabase `app_metadata` only** (`src/lib/auth/roles.ts`).
- OAuth providers do **not** auto-assign `platform_admin`.
- Platform operators must be granted `crow_role` manually (Supabase Dashboard or admin tooling).

### Users without `crow_role`

In `/auth/callback` after successful OAuth:

1. If email matches linked implementation requests → temporary `client` metadata for redirect to portal (existing behavior).
2. Otherwise → `signOut()` + redirect to `/login?error=no_role`.
3. **Google users follow the same path** — no bypass.

### What is provider-specific

| Concern | Entra (Azure) | Google |
|---------|---------------|--------|
| Supabase provider id | `azure` | `google` |
| App feature flag | `AZURE_SSO_ENABLED=true` | `GOOGLE_SSO_ENABLED=true` |
| Public tenant hint | `NEXT_PUBLIC_AZURE_TENANT_ID` | None (credentials in Supabase only) |
| OAuth scopes | Azure defaults via `azureOAuthOptions` | `openid email profile` |
| Google Cloud console | N/A | OAuth client + redirect URI |
| Login errors | `entra_*` query keys | `google_*` query keys |

### Middleware / route protection

Unchanged in F18. Google sign-in does not weaken middleware or admin guards.

---

## Part 2 — Supabase configuration

1. **Authentication → Providers → Google:** Enable Google.
2. Paste **Google Client ID** and **Client Secret** from Google Cloud (not in app `.env`).
3. **Authentication → URL configuration:**
   - **Site URL:** production/staging app origin (HTTPS in production).
   - **Redirect URLs:** must include  
     `https://<your-host>/auth/callback`  
     (and local dev URL if needed, e.g. `http://localhost:3000/auth/callback`).
4. **Supabase OAuth callback** (for Google Cloud authorized redirect URI):  
   `https://<PROJECT_REF>.supabase.co/auth/v1/callback`  
   Replace `<PROJECT_REF>` with your Supabase project reference.

---

## Part 3 — Google Cloud configuration

1. Create an **OAuth 2.0 Client ID** (Web application).
2. **Authorized redirect URIs:** add exactly:  
   `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
3. **OAuth consent screen:** configure for internal or external users as appropriate.
4. **Scopes:** minimal — `openid`, `email`, `profile` (app requests via Supabase).
5. **Do not** commit Client Secret to the repo or public docs.

---

## Part 4 — Application configuration

| Variable | Where | Purpose |
|----------|-------|---------|
| `GOOGLE_SSO_ENABLED` | Vercel / `.env` | `true` shows Google button; credentials still in Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | App | Required for any auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or publishable key | App | Required for client OAuth |

**Not required in app env:** Google Client ID / Secret (Supabase only).

### Enable Google button locally

```env
GOOGLE_SSO_ENABLED=true
```

Restart dev server after changing env.

### Code map (F18)

| File | Purpose |
|------|---------|
| `src/lib/auth/google-sso.ts` | `isGoogleSsoEnabled`, `googleOAuthOptions` |
| `src/lib/auth/oauth-next-cookie.client.ts` | Shared next-path cookie for OAuth buttons |
| `src/app/auth/google/route.ts` | Server-side Google OAuth start |
| `src/components/portal/auth/sign-in-with-google.tsx` | Login button |
| `src/app/login/page.tsx` | Polished login card + error messages |
| `src/components/portal/auth/sign-in-form.tsx` | Provider section + email form |

---

## Part 5 — Role safety checklist

- [ ] New Google users have **no** `app_metadata.crow_role` until an admin assigns one.
- [ ] Google users without role see `no_role` message (not admin).
- [ ] Users with `crow_role: platform_admin` still land on `/admin/overview` when appropriate.
- [ ] Microsoft and email/password flows unchanged.

---

## Part 6 — Related docs

- Entra: `docs/internal/ENTRA_SSO.md` (if present) / `docs/help/entra-sso`
- F17 planning: [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md)
- Validation: [`F18_AUTH_VALIDATION_CHECKLIST.md`](F18_AUTH_VALIDATION_CHECKLIST.md)

---

## Deferred (not F18)

- Apple Sign-In  
- SCIM / Entra group sync  
- Magic link (unless already enabled and tested separately)  
- Paid auth add-ons  
- Live payments (Mada, Tabby, Tamara, Stripe enforcement)
