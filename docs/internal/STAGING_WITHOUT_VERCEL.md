# Staging without Vercel (workaround)

Use this when Vercel deploy fails or is blocked. **Same Supabase staging DB** and auth as P2 — only the app runs on your machine (optionally via a public tunnel).

---

## Quick start (recommended on Node 24)

```powershell
cd D:\CYBERCROW
npm run staging:host:build
```

Opens **http://localhost:3000** — production `next start` against staging Supabase.

- Login: **http://localhost:3000/login**
- MEEM: **http://localhost:3000/meem-global/dashboard**
- Health: **http://localhost:3000/api/health** → `deployReady: true`

> **Note:** `npm run staging:dev` can fail on **Node 24** (Next.js middleware edge eval). Use **`staging:host:build`** instead.

---

## Dev mode (Node 22 only, optional)

If you use **nvm** / **nvm-windows** with Node 22:

```powershell
npm run staging:dev
```

---

## Share a public URL (Omar / remote browser)

**Terminal 1:**

```powershell
npm run staging:host:build
```

(Or `npm run staging:host` if already built.)

**Terminal 2:**

```powershell
npm run staging:tunnel
```

Copy the **https://…** URL from the tunnel output.

### Supabase Auth (required for tunnel)

Project **wbwnsndcxrgyqwppurms** → **Authentication → URL configuration**:

| Field | Value |
|-------|--------|
| Site URL | `https://<your-tunnel-host>` |
| Redirect URLs | `https://<your-tunnel-host>/auth/callback` |

Email/password login works after allowlist update. Entra SSO also needs Azure redirect to Supabase callback (unchanged).

---

## Commands

| Script | Purpose |
|--------|---------|
| `npm run staging:dev` | Fast dev server + `.env.staging` |
| `npm run staging:host:build` | Full build + `next start` |
| `npm run staging:host` | `next start` (needs build) |
| `npm run staging:tunnel` | Public HTTPS to localhost:3000 |
| `npm run staging:ready` | DB + env preflight |

---

## vs Vercel

| | Vercel | This workaround |
|--|--------|-----------------|
| App host | Vercel edge | Your PC |
| Database | Supabase (same) | Supabase (same) |
| Auth | Supabase (same) | Supabase (same) |
| Uptime | 24/7 | While your machine + tunnel run |
| Primary prod later | — | **Azure** ([`AZURE_DEPLOY.md`](AZURE_DEPLOY.md)) |

---

*When Vercel works again, paste `.env.staging` into Vercel and redeploy — no DB re-seed needed.*
