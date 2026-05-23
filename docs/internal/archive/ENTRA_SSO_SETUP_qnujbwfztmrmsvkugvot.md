# Entra SSO setup — your Supabase project

**Project ref:** `qnujbwfztmrmsvkugvot`  
**Supabase URL:** `https://qnujbwfztmrmsvkugvot.supabase.co`

Use this checklist once; then test at `http://localhost:3000/login`.

---

## Values to copy everywhere

| Name | Value |
|------|--------|
| **Supabase OAuth callback (Azure redirect URI)** | `https://qnujbwfztmrmsvkugvot.supabase.co/auth/v1/callback` |
| **App callback (Supabase allow list)** | `http://localhost:3000/auth/callback` |
| **Site URL (dev)** | `http://localhost:3000` |

If `npm run dev` uses another port (e.g. 3002), add that port too:
`http://localhost:3002/auth/callback`

---

## Part A — Microsoft Entra ID (Azure Portal)

1. Open [Azure Portal → App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
2. **New registration**
   - Name: `Crow Ecosystem`
   - Supported account types: **Accounts in this organizational directory only** (single tenant) — or choose multitenant if you need personal Microsoft accounts.
   - Redirect URI: **Web** → paste exactly:
     ```
     https://qnujbwfztmrmsvkugvot.supabase.co/auth/v1/callback
     ```
3. **Register**.
4. On the app **Overview**, copy and save:
   - **Application (client) ID** → for Supabase “Client ID”
   - **Directory (tenant) ID** → for `.env` as `NEXT_PUBLIC_AZURE_TENANT_ID`
5. **Certificates & secrets** → **New client secret** → copy the **Value** immediately (not Secret ID) → for Supabase “Secret”.
6. (Recommended) **Manifest** → ensure `optionalClaims` includes `xms_edov` for email verification — see [Supabase Azure guide](https://supabase.com/docs/guides/auth/social-login/auth-azure).

---

## Part B — Supabase Dashboard

Open these links while logged into the project that matches `.env`:

1. **Azure provider**  
   https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/auth/providers  
   - Find **Azure** (or **Microsoft**)
   - **Enable**
   - **Client ID:** `a5859c3e-7a3a-4dd6-8bec-f819db969d81`
   - **Client Secret:** paste the **Value** from Azure → Certificates & secrets (never commit this)
   - **Azure Tenant URL** (if shown):  
     `https://login.microsoftonline.com/a86ccc90-b70b-4996-b592-9fd479eed94a`

2. **URL configuration**  
   https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/auth/url-configuration  
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs** — add (one per line):
     ```
     http://localhost:3000/auth/callback
     ```
   - Add production URLs later when you deploy.

3. **Email provider** (optional fallback)  
   Same providers page → keep **Email** enabled if you still use `npm run auth:bootstrap` passwords.

4. **Save** all changes.

---

## Part C — Local `.env` (already partially done)

Confirm these lines exist:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qnujbwfztmrmsvkugvot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
AZURE_SSO_ENABLED=true
NEXT_PUBLIC_AZURE_TENANT_ID=a86ccc90-b70b-4996-b592-9fd479eed94a
```

Uncomment and set `NEXT_PUBLIC_AZURE_TENANT_ID` after Part A step 4.

Restart the dev server:

```powershell
cd d:\CYBERCROW
npm run dev
```

---

## Part D — Test sign-in

1. Open http://localhost:3000/login  
2. You should see **Sign in with Microsoft (Entra ID)**.  
3. Click it → Microsoft login → redirect back to the app.

### If you see `no_role` (Microsoft signed in, no Crow role)

After the first Entra login, assign metadata with either script (from project root):

```bash
# Platform staff (admin console)
PLATFORM_ADMIN_EMAIL=your-microsoft-email@example.com npm run auth:bootstrap

# Or explicit role
USER_EMAIL=your-microsoft-email@example.com CROW_ROLE=platform_admin npm run auth:grant-role
```

List users: `npx tsx --env-file=.env scripts/list-auth-users.ts`

### If you see `no_role` (manual Dashboard)

Microsoft sign-in worked, but Crow metadata is missing. In Supabase:

https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/auth/users  

Select the user → **App Metadata** (not User Metadata):

```json
{
  "crow_role": "platform_admin",
  "tenant_slugs": []
}
```

Or run `npm run auth:bootstrap` for email/password admin first.

### Common errors

| Symptom | Fix |
|---------|-----|
| `redirect_uri_mismatch` | Azure redirect URI must be exactly the Supabase callback URL (Part A). |
| `auth_callback` | Add `http://localhost:3000/auth/callback` to Supabase Redirect URLs. |
| Button missing | `AZURE_SSO_ENABLED=true` and restart `npm run dev`. |
| `entra_not_configured` | Same as above. |

---

## Quick link summary

| Step | URL |
|------|-----|
| Azure apps | https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade |
| Supabase Azure provider | https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/auth/providers |
| Supabase redirect URLs | https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/auth/url-configuration |
| Supabase users (metadata) | https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/auth/users |
