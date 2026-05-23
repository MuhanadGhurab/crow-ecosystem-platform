# GitHub setup — CYBERCROW / Crow Ecosystem

Use this guide when **Git** and **GitHub CLI** are installed and on your PATH. This machine’s agent shell did not have `git` or `gh` available; run these steps locally in PowerShell or Git Bash.

## Prerequisites

1. Install [Git for Windows](https://git-scm.com/download/win) — enable “Git from the command line”.
2. Install [GitHub CLI](https://cli.github.com/) then authenticate:

```powershell
gh auth login
```

Choose: GitHub.com → HTTPS → login via browser.

## Security checklist (before first push)

- [ ] `.env` is **not** tracked (listed in `.gitignore`).
- [ ] Never commit: `.env`, `.env*.local`, service role keys, `credentials.json`.
- [ ] If you ever committed secrets: rotate keys in Supabase/dashboard, then use `git filter-repo` or GitHub secret scanning remediation — do not only delete the file in a new commit.

```powershell
cd D:\CYBERCROW
git init
git branch -M main
git status
```

Confirm `.env` does **not** appear under “Changes to be committed” or untracked files you plan to add. If it does, run `git rm --cached .env` and fix `.gitignore`.

## Create private repository and push

Suggested repo name (matches `package.json`): **`crow-ecosystem-platform`**  
Alternatives: `cybercrow`, `crow-ecosystem`

```powershell
cd D:\CYBERCROW
git add .
git status   # review: no .env, no node_modules
git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "Initial commit: Crow Ecosystem platform (Next.js, Prisma, docs)"

gh repo create crow-ecosystem-platform --private --source=. --remote=origin --push
```

If the repo already exists on GitHub:

```powershell
git remote add origin https://github.com/YOUR_USER/crow-ecosystem-platform.git
git push -u origin main
```

## Description (for `gh repo edit` or GitHub UI)

> Multi-tenant adaptive enterprise platform — Discovery → Blueprint → CEM, CyberCrow, and SAREA. Next.js 15, Prisma, Supabase. MEEM Global is the lighthouse customer demo.

```powershell
gh repo edit --description "SecDevOps · governed AI · multi-tenant platform (Crow Ecosystem). Next.js 15, Prisma, PostgreSQL, Microsoft Entra."
```

## CI

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

| Job | What it runs |
|-----|----------------|
| `verify` | `audit:src`, `typecheck`, `build` |
| `postgres-smoke` | Postgres 16 → `db:migrate:deploy` → `smoke:phase1` (live DB, no mocks) |

Push to `main` triggers both jobs. See [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md) for local mirror commands.

## Recommended next (Cloud phase)

| GitHub secret | Purpose |
|---------------|---------|
| `DATABASE_URL` | Production/staging Postgres |
| `DIRECT_URL` | Prisma direct connection |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only (never in client) |

Use **Environments** (staging/production) and branch protection on `main` before enabling auto-deploy.

## Branch strategy (suggested)

- `main` — stable; protected; merge via PR
- `develop` or feature branches — `feature/*`, `fix/*`
- Tags for lighthouse demos: `demo/meem-*` optional

## If push is rejected

- Large files: check `node_modules` and `.next` are ignored.
- Auth: `gh auth status` and `git remote -v`.
- Never use `git push --force` on `main` without explicit need.
