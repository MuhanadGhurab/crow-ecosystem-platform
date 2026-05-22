# Crow Ecosystem Platform

Multi-tenant adaptive enterprise operating platform reshaped from the legacy `archive/HTML_proc/` static prototype.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (CyberCrow brand tokens) |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Validation | Zod |

**Build status & route matrix:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)  
**What to build next:** [`ROADMAP.md`](ROADMAP.md)

## Application areas (7)

1. **Public Request Portal** — `(public)/` → `/`, `/modules`, `/pricing`, `/request`, etc.
2. **Crow Admin Console** — `admin/`
3. **Discovery Workspace** — `discovery/[requestId]/`
4. **Enterprise Blueprint Builder** — `blueprints/[blueprintId]/`
5. **CEM Tenant Workspace** — `[tenant]/`
6. **CyberCrow Security Console** — `[tenant]/cybercrow/`
7. **SAREA Experience Studio** — `sarea/`

## Database groups (8)

Defined in `prisma/schema.prisma`:

1. Request tables
2. Discovery tables
3. Blueprint tables
4. Tenant / CEM tables
5. CyberCrow tables
6. SAREA tables
7. Subscription tables
8. Integration tables

## Setup

```bash
cp .env.example .env
# DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_* , SUPABASE_SERVICE_ROLE_KEY
npm install
npx prisma generate
npx prisma db push
npm run auth:bootstrap
npm run dev
```

See [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) and [`PHASE2_AUTH.md`](PHASE2_AUTH.md).

## Legacy prototype

`archive/HTML_proc/` is preserved for reference (design tokens, seed JSON, demo flows).

## Golden rule

Discovery understands. Blueprint defines. CEM runs. CyberCrow protects. SAREA adapts.
