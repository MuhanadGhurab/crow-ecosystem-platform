# Microsoft ms-identity-node sample (reference only)

Upstream: [Azure-Samples/ms-identity-node](https://github.com/Azure-Samples/ms-identity-node) — Express + **@azure/msal-node** (confidential client, PKCE, Express session).

**Crow Ecosystem does not run this server.** Auth is **Supabase Azure provider** → see [`docs/ENTRA_SSO.md`](../../docs/ENTRA_SSO.md) and [`src/lib/auth/msal-config.ts`](../../src/lib/auth/msal-config.ts) for mapped settings.

## What to copy from the sample

| Sample (`App/.env.dev`) | Crow / Supabase |
|-------------------------|-----------------|
| `CLIENT_ID` | Supabase Dashboard → Authentication → Azure → Client ID |
| `CLIENT_SECRET` | Same (Dashboard only — never commit) |
| `TENANT_ID` | `NEXT_PUBLIC_AZURE_TENANT_ID` in `.env` |
| `CLOUD_INSTANCE` + `TENANT_ID` | Authority: `https://login.microsoftonline.com/{tenant}` |
| `REDIRECT_URI` = `http://localhost:3000/auth/redirect` | **Not used** — register `https://<PROJECT_REF>.supabase.co/auth/v1/callback` in Azure |
| OIDC scopes (MSAL default) | `openid profile email` via `azureOAuthOptions()` |
| `POST_LOGOUT_REDIRECT_URI` | `NEXT_PUBLIC_SITE_URL` or app origin |

## Run the sample standalone (optional)

```bash
cd archive/ms-identity-node-main/App
cp .env.dev .env.dev.local   # fill CLIENT_ID, TENANT_ID, CLIENT_SECRET
npm install
npm start
# → http://localhost:3000 (conflicts with Next dev — use another port if needed)
```
