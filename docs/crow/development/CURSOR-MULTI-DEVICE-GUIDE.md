# Cursor Multi-Device Guide

| Field | Value |
|-------|-------|
| **Title** | Using Cursor on desktop, laptop, or any trusted machine |
| **Status** | CANONICAL guide |
| **Authority** | CROW.DEVFLOW.PORTABLE.1 |
| **Date** | 2026-07-18 |
| **Related** | [`PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md`](PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md) · [`LAPTOP-SETUP-CHECKLIST.md`](LAPTOP-SETUP-CHECKLIST.md) |

## Open Crow in Cursor on a new machine

1. Complete [`LAPTOP-SETUP-CHECKLIST.md`](LAPTOP-SETUP-CHECKLIST.md) (clone, Node 24, `.env.local`, doctor)
2. In Cursor: **File → Open Folder** → select the **repository root** (contains `AGENTS.md`, `package.json`)
3. Allow workspace indexing
4. Confirm Agent/Chat can see `.cursor/rules` and `AGENTS.md`

Path may be `~/code/crow-ecosystem-platform`, `D:\CYBERCROW`, or any other folder. **GitHub branch state matters — not the drive letter.**

## What Cursor should read first

1. `AGENTS.md`
2. `.cursor/rules/crow-governance.mdc`
3. `docs/crow/START-HERE.md`
4. `docs/crow/CURRENT-STATE.md`
5. Active milestone under `docs/crow/milestones/`

## How to work with ChatGPT / milestone prompts

1. Paste the owner milestone prompt into Cursor
2. Confirm branch = `feat/first-tenant-golden-path` (or authorized device branch)
3. Confirm HEAD matches expected SHA when the prompt names one
4. Let Cursor implement **in scope only**
5. Run required tests before push
6. Push **feature branch only**

## Hard stops for Cursor / agents

| Forbidden | Why |
|-----------|-----|
| Push `main` | Protected · Production event risk |
| Merge PR #10 | Archive / reference only |
| Run hosted migrations | Needs explicit owner phrase |
| Write hosted business data | Alpha / authority gate |
| Deploy Production | Needs `CROW.PRODUCTION.DEPLOY` |
| Commit `.env.local` / secrets | Secrets policy |
| Enable Blueprint complete / payment / tenant go-live | Separate authorization |

## Before switching devices

```
git status
# commit or stash
git push -u origin HEAD
```

On the next machine:

```
git fetch origin
git checkout feat/first-tenant-golden-path
git pull --ff-only
npm run crow-dev:doctor
```

## If two devices conflict

1. Stop editing on both
2. Prefer the machine with the pushed commits
3. On the other: `git stash` or commit to `dev/muhanad-laptop/<topic>`
4. Reconcile via pull/rebase only with care — prefer small commits
5. Never resolve by merging PR #10

## Review after Cursor work

1. Push feature branch
2. Open Vercel Preview
3. Confirm Alpha banner visible
4. Friends/testers: demo data only
5. Next milestone from feedback
