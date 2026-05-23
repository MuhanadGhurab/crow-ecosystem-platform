# Microsoft Entra ID (Azure) SSO

**Status:** Implemented (Supabase Auth Azure provider)  
**Related:** [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) · [`archive/ms-identity-node-main/README-CYBERCROW.md`](../archive/ms-identity-node-main/README-CYBERCROW.md)

Crow Ecosystem uses **Supabase Auth** with the **Azure** OAuth provider for Entra ID / Microsoft 365 sign-in. Email/password remains available as a fallback.

The repo includes Microsoft's **ms-identity-node** sample under `archive/ms-identity-node-main` for reference only. Crow does **not** use direct MSAL routes in production; values from that sample are mapped in `src/lib/auth/msal-config.ts`.

---

## Critical redirect URIs (two different URLs)

| Where | URI | Purpose |
|-------|-----|---------|
| **Azure App Registration** → Web redirect | `https://<PROJECT_REF>.supabase.co/auth/v1/callback` | Microsoft returns the auth code to **Supabase** |
| **Supabase Dashboard** → Redirect URLs | `http://localhost:3000/auth/callback` (and production URL) | Supabase returns the user to **your Next.js app** |

Do **not** register `http://localhost:3000/auth/callback` in Azure when using Supabase (that is the sample's MSAL-only pattern). Do **not** register the sample's `http://localhost:3000/auth/redirect` unless you run the archived Express app.

Derive the Azure URI from env:

```ts
// src/lib/auth/msal-config.ts
getSupabaseAzureRedirectUri(process.env.NEXT_PUBLIC_SUPABASE_URL)
// → https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

---

## App behavior

| Piece | Location |
|-------|----------|
| Login button | `/login` — **Sign in with Microsoft (Entra ID)** when enabled |
| OAuth start (link) | `GET /auth/entra?next=/path` — sets short-lived `crow_oauth_next` cookie |
| Callback | `/auth/callback` — exchanges code, reads `crow_oauth_next`, checks `crow_role` |
| Config reference | `src/lib/auth/msal-config.ts`, `src/lib/auth/entra-sso.ts` |
| Tenant settings | Entra sign-in link when `AZURE_SSO_ENABLED` |

Post-login path (`next`) is stored in a cookie before OAuth so `redirectTo` stays exactly `/auth/callback` (matches Supabase allow list; query strings on `redirectTo` often cause `auth_callback` failures).

Users without `app_metadata.crow_role` are signed out and shown `no_role` on login. Assign roles via Dashboard or:

```bash
PLATFORM_ADMIN_EMAIL=you@org.com npm run auth:bootstrap
USER_EMAIL=you@org.com CROW_ROLE=platform_admin npm run auth:grant-role
```

---

## 1. Azure App Registration (aligned with ms-identity-node sample)

1. [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** → **New registration**
2. Name: `Crow Ecosystem` (or your product name)
3. Supported account types: **Single tenant** (recommended) — sample uses `TENANT_ID` = directory ID; multitenant can use `organizations` in the sample only
4. Redirect URI — **Web** — paste **Supabase** callback only:

   ```
   https://<PROJECT_REF>.supabase.co/auth/v1/callback
   ```

5. After create, note:
   - **Application (client) ID** → Supabase Azure provider **Client ID**
   - **Directory (tenant) ID** → `NEXT_PUBLIC_AZURE_TENANT_ID`

6. **Certificates & secrets** → **New client secret** → copy **Value** → Supabase Azure **Secret** (never commit)

7. **API permissions** — delegated: `openid`, `email`, `profile` (same OIDC set as MSAL sample)

8. (Recommended) **Manifest** → optional claim `xms_edov` for email verification — [Supabase Azure guide](https://supabase.com/docs/guides/auth/social-login/auth-azure)

**Authority** (single tenant): `https://login.microsoftonline.com/<NEXT_PUBLIC_AZURE_TENANT_ID>`

---

## 2. Supabase Dashboard

1. **Authentication** → **Providers** → **Azure** → Enable
2. Paste **Application (client) ID** and **Secret** from Azure
3. **Azure Tenant URL** (if shown): `https://login.microsoftonline.com/<tenant-id>`
4. **Authentication** → **URL configuration**:
   - Site URL: `http://localhost:3000` (dev)
   - Redirect URLs (exact, one per line):

     ```
     http://localhost:3000/auth/callback
     ```

   If dev uses another port, add `http://localhost:3002/auth/callback` too.

5. Keep **Email** provider enabled for password fallback.

---

## 3. Environment (`.env`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Enable Microsoft button + /auth/entra
AZURE_SSO_ENABLED=true

# Directory (tenant) ID from Azure Overview (sample TENANT_ID)
NEXT_PUBLIC_AZURE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Optional — emails / logout (sample POST_LOGOUT_REDIRECT_URI)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Sample `App/.env.dev` | Crow `.env` / Dashboard |
|-----------------------|-------------------------|
| `CLIENT_ID` | Supabase Azure provider |
| `CLIENT_SECRET` | Supabase Azure provider |
| `TENANT_ID` | `NEXT_PUBLIC_AZURE_TENANT_ID` |
| `CLOUD_INSTANCE` | Fixed `https://login.microsoftonline.com` in code |
| `REDIRECT_URI` (localhost `/auth/redirect`) | Use Supabase `/auth/v1/callback` in Azure instead |
| `EXPRESS_SESSION_SECRET` | Not used (Supabase session cookies) |

Restart `npm run dev` after changing env.

---

## 4. Assign Crow roles after first Entra login

Entra users appear in Supabase Auth on first sign-in. Set **app metadata**:

```json
{
  "crow_role": "tenant_admin",
  "tenant_slugs": ["your-tenant-slug"]
}
```

Dashboard → Authentication → Users → App Metadata, or `npm run auth:grant-role`.

---

## 5. Verify

1. `AZURE_SSO_ENABLED=true` and real `NEXT_PUBLIC_AZURE_TENANT_ID`
2. `/login` — Microsoft button visible
3. Sign in → Microsoft → back to app (not `?error=auth_callback`)
4. If `no_role`, run `auth:grant-role` for that email

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Button hidden | `AZURE_SSO_ENABLED=true` + `NEXT_PUBLIC_AZURE_TENANT_ID` |
| `entra_not_configured` | Same |
| `entra_start_failed` | Supabase URL/keys; enable Azure provider |
| `auth_callback` | Azure redirect = `https://<ref>.supabase.co/auth/v1/callback`; Supabase allow list = `http://localhost:3000/auth/callback` **without** extra query on that URL |
| `redirect_uri_mismatch` | Azure URI must be Supabase callback, not app `/auth/callback` |
| `no_role` | Set `crow_role` in app_metadata |
| Wrong tenant | Set `NEXT_PUBLIC_AZURE_TENANT_ID` to directory ID |

Project-specific checklist (example ref): [`archive/ENTRA_SSO_SETUP_qnujbwfztmrmsvkugvot.md`](archive/ENTRA_SSO_SETUP_qnujbwfztmrmsvkugvot.md).

---

## Hybrid / MSAL path

| Path | When |
|------|------|
| **A (default)** | Supabase Azure provider — production and hybrid local DB |
| **B (archive only)** | Run `archive/ms-identity-node-main/App` to experiment with raw MSAL — separate port, no Crow session |

Do not add `@azure/msal-node` to the Next app unless you intentionally replace Supabase Auth.

---

## Security notes

- Roles from **`app_metadata` only** — never `user_metadata`.
- Enforce MFA in Entra (Conditional Access) for production.

---

## Production (M7) — Entra checklist

When moving from local hybrid to Vercel + Supabase prod ([`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md)):

| Step | Action |
|------|--------|
| 1 | Azure app registration — add redirect `https://<PROJECT_REF>.supabase.co/auth/v1/callback` (unchanged) |
| 2 | Supabase → Authentication → URL configuration — add `https://<your-domain>/auth/callback` |
| 3 | Set `NEXT_PUBLIC_SITE_URL=https://<your-domain>` on Vercel |
| 4 | Set `AZURE_SSO_ENABLED=true` and `NEXT_PUBLIC_AZURE_TENANT_ID` on Vercel |
| 5 | Smoke: `/login` → Microsoft → lands on `/admin/overview` or `next` path |

Do **not** copy `http://localhost:3000/auth/callback` as the only allow-list entry in production.
