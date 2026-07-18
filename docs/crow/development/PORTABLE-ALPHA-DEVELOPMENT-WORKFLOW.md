# Portable Alpha Development Workflow

| Field | Value |
|-------|-------|
| **Title** | Crow Portable Multi-Device Alpha Development Workflow |
| **Status** | CANONICAL workflow |
| **Authority** | Owner decision — CROW.DEVFLOW.PORTABLE.1 |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-DEVFLOW-PORTABLE-1.md`](../milestones/CROW-DEVFLOW-PORTABLE-1.md) |
| **Related** | [`LAPTOP-SETUP-CHECKLIST.md`](LAPTOP-SETUP-CHECKLIST.md) · [`CURSOR-MULTI-DEVICE-GUIDE.md`](CURSOR-MULTI-DEVICE-GUIDE.md) · [`CROW-ALPHA-DEVELOPMENT-MODE.md`](CROW-ALPHA-DEVELOPMENT-MODE.md) |

## Portable development model

| Principle | Meaning |
|-----------|---------|
| **GitHub is source of truth** | Branch state lives on `origin` — not on `D:/CYBERCROW` or any single PC |
| **Local machines are disposable** | Desktop, laptop, or any trusted workstation can continue from latest pull |
| **Cursor is portable** | Open the cloned repo root on any machine |
| **Vercel Preview is shared review** | Push feature branch → Preview URL for owner/friends |
| **Supabase is demo/dev sandbox only** | No real customer / payment / sensitive production data |
| **`main` stays protected** | No agent push to `main` |
| **PR #10 stays archive** | OPEN · DRAFT · CONFLICTING · reference only — never merge as monolith |

Development does **not** depend on one absolute path. Clone anywhere; work from repo root.

## Multi-device workflow

### First-time laptop (or any new machine)

1. Install **Git**
2. Install **Node 24.x** (see `package.json` `engines`)
3. Use **npm** (repo standard; no pnpm required)
4. Install **Cursor**
5. Clone: `git clone https://github.com/MuhanadGhurab/crow-ecosystem-platform.git`
6. `cd crow-ecosystem-platform`
7. `git checkout feat/first-tenant-golden-path`
8. `git pull --ff-only`
9. `npm ci` (or `npm install` if lockfile sync issues)
10. Copy env template: `cp .env.alpha.example .env.local` (or `.env.local.example` for full local Docker auth sandbox)
11. Fill placeholders only — **never commit** `.env.local`
12. `npm run crow-dev:doctor`
13. `npm run crow-dev:bootstrap-check`
14. Optional: `npm run typecheck` · `npm run crow-runtime-mode:test`
15. `npm run dev`
16. Open the folder in Cursor (repo root)

See [`LAPTOP-SETUP-CHECKLIST.md`](LAPTOP-SETUP-CHECKLIST.md).

### Daily workflow (any machine)

```
git status
git fetch origin
git checkout feat/first-tenant-golden-path
git pull --ff-only
npm ci   # if package-lock or node_modules drift
# edit via Cursor
# run targeted tests
git add … && git commit …
git push -u origin HEAD
# review Vercel Preview
```

**Never** leave uncommitted work on machine A and start editing the same branch on machine B.

## Device switching rules

| Rule | Detail |
|------|--------|
| Push or stash before leaving | Always leave a recoverable remote or stash state |
| Pull before starting | `git pull --ff-only` after fetch |
| One dirty tree at a time | No parallel uncommitted edits on the same branch across devices |
| Unsure → device branch | `dev/muhanad-laptop/<topic>` or `dev/muhanad-pc/<topic>` |
| Merge back | Controlled PR / slice rules — not PR #10 monolith |

## Environment / secrets policy

| Item | Rule |
|------|------|
| `.env.local` | Per-device · gitignored · never committed |
| Templates | `.env.alpha.example` · `.env.local.example` — placeholders only |
| Vercel env | Stays in Vercel dashboard |
| Supabase keys | Never paste into docs, issues, or prompts |
| Local data | Demo/dev only |
| Forbidden | Real customer data · payment secrets for live charges · production-only secrets casually copied |

Alpha flags (recommended in `.env.local`):

```
CROW_RUNTIME_MODE=alpha_development
CROW_DATA_CLASSIFICATION=demo_only
```

## Vercel Preview review

1. Push feature branch
2. Vercel creates/updates Preview
3. Share Preview link with friends/testers
4. Testers use **demo/test data only** (see alpha banner)
5. Feedback → next milestone
6. Preview is **not** commercial Production

## Supabase demo sandbox

- Current shared project = **demo/dev sandbox** under Alpha Mode
- No real customer / sensitive / payment data
- No production-safe hosted persistence claim (GAP-004 future gate)
- Migrations only with explicit owner authorization
- Controlled demo-backend writes = future **DEVFLOW.3**

## Safety boundaries (always blocked)

- Real customer data · commercial Production claim
- Production deploy without `CROW.PRODUCTION.DEPLOY`
- Push `main` · merge PR #10
- Official Blueprint generation · `completeDiscovery`
- Payment · CroAI production actions · tenant go-live
- Unauthorized migrations · secrets in repo

## Local safety scripts

| Script | Command |
|--------|---------|
| Doctor | `npm run crow-dev:doctor` |
| Bootstrap check | `npm run crow-dev:bootstrap-check` |
| Unit tests | `npm run crow-dev:portable:test` |

Scripts never print secrets, never connect to hosted DB, never migrate, never write hosted data.
