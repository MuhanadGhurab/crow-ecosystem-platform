# CROW.PUBLIC.PROD-PREFLIGHT — Production Deployment Readiness Check

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.PROD-PREFLIGHT |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Preflight complete — **Production not authorized** |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior** | CROW.PUBLIC.10 — owner acceptance recorded |

## Purpose

Prepare the repository for a future **CROW.PUBLIC.PROD** deployment. This milestone performs cleanup, verification, and documentation only — **no Production deploy**, no merge, no `main` push, no migrations, no hosted writes.

## Accepted Production candidate

| Item | Value |
|------|-------|
| Milestone | **CROW.PUBLIC.9** |
| Visual deploy commit | `c51a60e` |
| Acceptance record | CROW.PUBLIC.10 (`e349449`) |
| Certification URL | https://crow-ftgp-certification-iipjrwhxd-muhanadghurabs-projects.vercel.app/ |

## Repository preflight (2026-07-07)

| Check | Result |
|-------|--------|
| Branch | `feat/first-tenant-golden-path` |
| HEAD | `fbc6bcb` — preflight docs committed |
| Working tree | **Clean** after restoring unrelated `.gitignore` local edit |
| PR #10 | OPEN, DRAFT, unmerged |
| `main` | `a5620c3` — legacy public; unchanged |
| Production | Not deployed |

## .gitignore decision

Local working tree had `+.env*` appended at file end. **Restored** to `HEAD`:

- Repository already ignores `.env`, `.env*.local`, `.env.production`, `.env.vercel`, and many operator-specific env files (lines 23–98).
- Catch-all `.env*` is redundant, overly broad, and unrelated to public Production promotion.
- **Not committed** as part of preflight.

## Stash review (not dropped — owner discretion)

| Stash | Contents | Recommendation |
|-------|----------|----------------|
| `stash@{0}` | `.env*` + superseded `CROW-PUBLIC-8.md` cert URL (`lxcqlugsm`) | **PRESERVE or DROP** — cert URL superseded by PUBLIC-9/10 (`iipjrwhxd`); no unique PROD info |
| `stash@{1}` | `.env*` only | **DROP when ready** — duplicate of restored local edit |
| `stash@{2}` | `.env*` only | **DROP when ready** — duplicate of `stash@{1}` |

Stashes were **not** applied or dropped during preflight.

## Public route readiness

Verified via `src/lib/public/routes.ts`, `public-access-policy.ts`, route architecture tests, and app route files:

| Route | Status |
|-------|--------|
| `/` | Present — `PublicHomepage` |
| `/how-crow-works` | Present |
| `/new-organization` | Present |
| `/transform-existing` | Present |
| `/enterprise-blueprint` | Present |
| `/platform` | Present |
| `/platform/cem` | Present |
| `/platform/cybercrow` | Present |
| `/platform/sarea` | Present |
| `/platform/procrow` | Present |
| `/security` | Present |
| `/industries` | Present |
| `/pricing` | Present |
| `/start` | Present |
| `/request` | Present |
| `/login` | Present |
| `/signup` | Present |

## Legacy redirects

Verified in `publicLegacyRedirects` and redirect page files:

| Legacy | Target |
|--------|--------|
| `/architecture` | `/how-crow-works` |
| `/modules` | `/platform/cem` |
| `/services` | `/how-crow-works` |
| `/clients` | `/industries` |
| `/loyalty-programs` | `/how-crow-works` |
| `/experience/architects-map` | `/how-crow-works` |
| `/experience/architects-map/article` | `/how-crow-works` |

## Production deployment plan confirmation

Per [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md):

| Requirement | Status |
|-------------|--------|
| Source commit ≥ `c51a60e` on feature branch | Ready on branch |
| No migrations during promotion | Confirmed boundary |
| No hosted business writes | Confirmed boundary |
| No domain behavior changes | Confirmed boundary |
| Rollback plan documented | Present in PROD plan |
| Post-deploy smoke checklist | Present in PROD plan |
| Owner authorization phrase required | `AUTHORIZE CROW.PUBLIC.PROD — deploy accepted public experience to Production` |

**Branch strategy:** Promote from `feat/first-tenant-golden-path` at `c51a60e` or later HEAD with no domain drift; PR #10 merge is a **separate** owner decision.

## GAP-004 (unchanged)

Preview/Production database isolation remains **BLOCKED** (shared Postgres fingerprint). Public UI promotion:

- Must **not** run migrations
- Must **not** write hosted business data
- Does **not** resolve GAP-004

## Tests (preflight gate)

```bash
git diff --check
npm run typecheck
npm run lint
npm run build
npm run public-access-policy:test
npm run public-route-architecture:test
npm run public-v2-preview-readiness:test
```

All required gates: **PASS** at preflight time.

## Next milestone

**CROW.PUBLIC.PROD** — only after explicit owner authorization phrase recorded in milestone evidence.
