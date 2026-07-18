# Laptop Setup Checklist (Portable Alpha)

| Field | Value |
|-------|-------|
| **Title** | First-time laptop / new-device Crow Alpha setup |
| **Status** | CANONICAL checklist |
| **Authority** | CROW.DEVFLOW.PORTABLE.1 |
| **Date** | 2026-07-18 |
| **Related** | [`PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md`](PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md) · [`CURSOR-MULTI-DEVICE-GUIDE.md`](CURSOR-MULTI-DEVICE-GUIDE.md) |

## Prerequisites

- [ ] Git installed
- [ ] Node **24.x** installed (`node -v` → v24…)
- [ ] npm available (`npm -v`)
- [ ] Cursor installed
- [ ] GitHub access to `MuhanadGhurab/crow-ecosystem-platform`

## Clone and branch

- [ ] `git clone https://github.com/MuhanadGhurab/crow-ecosystem-platform.git`
- [ ] `cd crow-ecosystem-platform` (any path — not tied to `D:/CYBERCROW`)
- [ ] `git checkout feat/first-tenant-golden-path`
- [ ] `git pull --ff-only`
- [ ] Confirm: `git status` clean (or only expected local files)

## Dependencies

- [ ] `npm ci` (preferred) or `npm install`
- [ ] Prisma client generates via `postinstall` (no hosted migrate)

## Environment (per device)

- [ ] Copy `.env.alpha.example` → `.env.local` **or** `.env.local.example` → `.env.local`
- [ ] Set placeholders only (no real Production secrets)
- [ ] Confirm present:
  - `CROW_RUNTIME_MODE=alpha_development`
  - `CROW_DATA_CLASSIFICATION=demo_only`
- [ ] Confirm **not** set:
  - `CROW_ALLOW_REAL_CUSTOMER_DATA=true`
  - `CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE=1`
  - `CROW_RUNTIME_MODE=commercial_production`
- [ ] Never `git add .env.local`

## Verify

- [ ] `npm run crow-dev:doctor`
- [ ] `npm run crow-dev:bootstrap-check`
- [ ] `npm run crow-runtime-mode:test`
- [ ] Optional: `npm run typecheck`

## Run

- [ ] `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Confirm Alpha banner: demo/test data only · Not production

## Cursor

- [ ] Open **repo root** in Cursor (folder containing `AGENTS.md`)
- [ ] Allow indexing
- [ ] Read `AGENTS.md` + `docs/crow/START-HERE.md`
- [ ] See [`CURSOR-MULTI-DEVICE-GUIDE.md`](CURSOR-MULTI-DEVICE-GUIDE.md)

## Before leaving this machine

- [ ] Commit focused work **or** `git stash`
- [ ] `git push -u origin HEAD` (feature branch only)
- [ ] Do **not** leave uncommitted edits if you will continue on another device today

## Still blocked

Production deploy · `main` push · PR #10 merge · Blueprint generation · payment · tenant go-live · unauthorized migrations · real customer data
