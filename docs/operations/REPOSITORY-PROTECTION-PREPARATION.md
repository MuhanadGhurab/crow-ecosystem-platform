# Repository Protection Preparation — GHURAVIA

| Field | Value |
|-------|-------|
| **Document** | Recommended repository protections |
| **Gate** | GHV.REPOSITORY-TRANSITION.1A |
| **Status** | LOCAL DOCUMENTATION ONLY — not applied remotely in this gate |

## Do not change remotely in this gate

GitHub branch protection settings, Vercel project settings, and Production/Preview environment variables were **not** modified during GHV.REPOSITORY-TRANSITION.1A.

## Recommended future rules

| Rule | Intent |
|------|--------|
| Protected default branch (`main`) | No direct pushes; PR-only changes |
| No direct Production deployment from feature branches | Production only via authorized procedure |
| Pull-request review gate | Human review before merge |
| Required validation checks | CI must pass before merge (once CI is redefined for GHURAVIA) |
| Migration approval gate | No hosted migrations without controlled workflow + confirmation |
| No committed secrets | `.env*` and credentials remain gitignored |
| No force pushes | Preserve history integrity |
| Clean working tree requirement | Gate reports require clean status |
| Final Gate Report requirement | Each gate ends with a written verdict |

## Legacy workflow risk (CyberCrow)

The CyberCrow archive still contains workflows that could build or migrate the old application if restored or reintroduced:

| Archived path | Risk |
|---------------|------|
| `.github/workflows/ci.yml` | Installs dependencies and runs production build on PRs to `main` |
| `.github/workflows/database-migrate.yml` | `workflow_dispatch` controlled migration against preview/production |
| `vercel.json` | Next.js build with Prisma generate |

**Action on `feat/ghuravia-foundation`:** those workflows and `vercel.json` were **removed** from this branch so a premature push does not revive old CI/migrate/deploy paths.

They remain recoverable from `cybercrow-final-snapshot-20260720`.

## Push policy for this gate

- Archive tag may be pushed (done after verification).
- `feat/ghuravia-foundation` must **not** be pushed during this gate (avoids automatic Vercel Preview deployment before review).
