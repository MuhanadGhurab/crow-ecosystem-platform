# Crow Ecosystem — project snapshot

High-level view of the **active Next.js platform** and the legacy static prototype.

## What this repo is

| Tree | Role |
|------|------|
| **`src/`** | Production app — Next.js 15, Prisma, Supabase Auth, server actions |
| **`prisma/`** | PostgreSQL schema (Supabase) |
| **`HTML_proc/`** | Legacy static MVP — design tokens, demo flows, localStorage only |

The platform implements the full **request → discovery → blueprint → tenant** pipeline with real persistence. See [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) for route-level detail.

## Delivery phases (summary)

| Phase | Delivered |
|-------|-----------|
| **1** | Implementation pipeline, discovery forms, blueprint provision |
| **2** | Supabase login, middleware session refresh, role guards |
| **3** | Admin tenant/blueprint/discovery hubs, tenant dashboard polish |
| **4** | CEM seed from discovery, memberships, users/roles/depts/workflows UI |
| **5** | SAREA studio overview/profiles (started); HR/CRM/invites planned |

## Tech stack (active app)

- **Next.js 15** — App Router, React Server Components
- **TypeScript** + **Tailwind CSS**
- **Prisma** → Supabase PostgreSQL (pooler + direct URL)
- **Supabase Auth** — `app_metadata` roles (`crow_role`, `tenant_slugs`)
- **Zod** — request API validation

## What works end-to-end

1. Submit implementation request (`/request`)
2. Platform admin reviews and starts discovery
3. Implementer completes discovery → enterprise blueprint
4. Approve blueprint and provision tenant (CyberCrow + SAREA + CEM seed)
5. Grant tenant users via admin or CLI
6. Tenant admin opens `/{slug}/dashboard` and CEM pages

## What is still shell / placeholder

~48 routes use `PagePlaceholder` — including most ERP modules (HR, CRM, …), CyberCrow sub-consoles, SAREA editor sub-pages, several admin nav items, and optional discovery steps. Full list: [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md).

## Operations notes

- Dev on Windows may need `node --use-system-ca` (already in `package.json` scripts).
- Schema changes today: `npx prisma db push`; production should adopt migrations (roadmap).
- Never commit `.env`; rotate keys if exposed.

## Next work

Prioritized backlog: [`ROADMAP.md`](ROADMAP.md).

## Legacy HTML prototype

`HTML_proc/` phases (browser-only):

1. ERP request wizard + local estimate  
2. Demo dashboards and audit UI (localStorage)  
3. Demo login and front-end role picker  

No server, no database, no real auth — preserved for UX reference only.
