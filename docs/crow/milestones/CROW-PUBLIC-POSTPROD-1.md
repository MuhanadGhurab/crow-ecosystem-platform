# CROW.PUBLIC.POSTPROD.1 — Live Production Owner Review & Main Reconciliation Plan

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.POSTPROD.1 |
| **Status** | Complete — documentation and planning only |
| **Date** | 2026-07-07 |
| **Branch** | `feat/first-tenant-golden-path` |
| **HEAD** | `c4a54d9` |

## Owner decision

> **LIVE PRODUCTION PUBLIC EXPERIENCE REVIEWED**

Owner manually reviewed the live Production deployment of the accepted Crow public experience (CROW.PUBLIC.9) on 2026-07-07.

**Constraints for this milestone:** No PR #10 merge, no `main` push, no Production redeploy, no migrations, no hosted business writes, no domain behavior changes.

## Production record

| Item | Value |
|------|-------|
| Production URL | https://crow-ecosystem-platform.vercel.app |
| Deployment ID | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| Rollback deployment ID | `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` (`main` @ `a5620c3`, legacy public) |
| Accepted candidate | CROW.PUBLIC.9 (`c51a60e` visual) |
| Deployed from | `feat/first-tenant-golden-path` @ `33e48f5` |
| Documentation HEAD | `c4a54d9` |
| PR #10 | OPEN, DRAFT, unmerged |
| `main` | `a5620c3` — unchanged |

## Live verification (2026-07-07)

### Production liveness

| Check | Result |
|-------|--------|
| `vercel inspect` → `crow-ecosystem-platform.vercel.app` | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`, `READY` |
| Homepage HTTP | **200** |

### Public route smoke (17 routes)

All canonical public browse routes returned **HTTP 200**:

`/`, `/how-crow-works`, `/new-organization`, `/transform-existing`, `/enterprise-blueprint`, `/platform`, `/platform/cem`, `/platform/cybercrow`, `/platform/sarea`, `/platform/procrow`, `/security`, `/industries`, `/pricing`, `/start`, `/request`, `/login`, `/signup`

### Visual acceptance markers (homepage)

| Marker | Present |
|--------|---------|
| `pv2-signature-hero` | Yes |
| `pv2-btn-journey` (amber Build New) | Yes |
| `pv2-btn-transform` (purple Transform) | Yes |
| `data-pv2-locked-design` | Yes |
| "Build a New Organization" copy | Yes |
| Legacy Architect's Map hero | No |

### Gated route smoke

| Route | Result |
|-------|--------|
| `/client/requests` | **307** → `/login?next=%2Fclient%2Frequests` |
| `/admin/overview` | **307** → `/login?next=%2Fadmin%2Foverview` |
| `/discovery/test` | **307** → `/login?next=%2Fdiscovery%2Ftest` |

### Known limitation (unchanged)

Legacy paths (`/architecture`, `/modules`, etc.) return **HTTP 200** at source URL — no HTTP 307. Documented in CROW.PUBLIC.PROD; not a Production regression.

### Hosted / migration delta since PROD deploy

| Delta | Value |
|-------|-------|
| Migrations | **None** |
| Hosted business writes | **None** |

## Repository gates (POSTPROD.1)

| Gate | Result |
|------|--------|
| `git diff --check` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run public-access-policy:test` | PASS |
| `npm run public-route-architecture:test` | PASS |
| `npm run public-v2-preview-readiness:test` | PASS |

---

## Main reconciliation plan

### 1. Current state

| Layer | State |
|-------|-------|
| **Production** | Serves accepted public UI from feature-branch deploy (`33e48f5` / `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`) |
| **`main`** | Legacy public surface @ `a5620c3`; `vercel.json` still includes `db:migrate:deploy` in build |
| **PR #10** | OPEN, DRAFT, MERGEABLE — `feat/first-tenant-golden-path` → `main` |
| **Branch delta** | **384 commits**, ~1,276 files vs `main` — FTGP foundation + public experience + ops tooling |
| **GAP-004** | Open — shared Preview/Production Postgres fingerprint |

Production is **not** running `main`. A default Git-connected Production deploy from `main` would **revert** the public site to legacy UI and re-enable migrate-on-build.

### 2. Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **Main deploy reverts public UI** | **High** | Vercel Production alias follows latest `main` deploy unless pinned; `main` lacks CROW.PUBLIC.9 |
| **PR #10 merge bundles FTGP + public** | **High** | 384 commits include authority, migrations inventory, ProCrow, Discovery — not public-only |
| **Migrate on `main` build** | **High** | `main` `vercel.json` runs `db:migrate:deploy`; feature branch removed it (C2.2) |
| **GAP-004 shared DB** | **High** | Any migration or Preview build against shared backend risks Production data |
| **False confidence from live public UI** | **Medium** | Live Production does **not** imply PR #10 is merge-ready |

### 3. Options

#### Option A — Merge PR #10 after full FTGP readiness review

- **Pros:** Single reconciliation path; brings `vercel.json` migrate removal + full FTGP to `main`
- **Cons:** Largest blast radius; ties public UI promotion to FTGP authority/migration posture; GAP-004 still unresolved
- **When:** Only after explicit FTGP merge authorization **and** migration/DB isolation decision

#### Option B — Split public UI into separate production-safe PR

- **Pros:** Isolates public surface reconciliation from FTGP runtime changes
- **Cons:** Requires careful file selection and conflict resolution with `main`
- **When:** Owner wants `main` aligned with Production public UI without FTGP

#### Option C — Keep Production pinned; delay `main` reconciliation

- **Pros:** **Safest immediate posture** — no accidental revert; zero deploy risk now
- **Cons:** `main` diverges from Production; technical debt accumulates
- **When:** Default until owner chooses A, B, or D

#### Option D — Public-only cherry-pick branch from `main`

- **Pros:** Surgical path: cherry-pick CROW.PUBLIC.3–10 / PUBLIC.PROD file set onto `main` base; small reviewable PR
- **Cons:** Cherry-pick conflicts possible; must exclude FTGP-only files; needs explicit public-only scope list
- **When:** Owner wants `main` = Production public UI without merging full PR #10

**Suggested cherry-pick anchor commits (public scope):** from `b90ac88` (PUBLIC.3/4) through `c51a60e` (PUBLIC.9 visual), plus docs — **exclude** FTGP authority/migration commits unless separately authorized.

### 4. Recommendation

**Safest path: Option C now + Option D as the preferred reconciliation track.**

1. **Immediately:** Treat Production as **pinned** to `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`. Do **not** deploy from `main` or merge PR #10 without a new owner authorization milestone.
2. **Reconciliation:** Prefer **Option D** (public-only cherry-pick PR from `main`) over **Option A** (full PR #10 merge). Live public UI success does **not** authorize FTGP merge.
3. **Before any `main` Production deploy:** Ensure `vercel.json` on `main` omits `db:migrate:deploy` (already true on feature branch).
4. **GAP-004:** Resolve or explicitly accept shared-backend risk **before** any migration-touching merge or deploy policy change.

**Do not merge PR #10** solely because Production public UI is live.

### 5. Required owner decisions

| Decision | Options |
|----------|---------|
| **Main reconciliation strategy** | Merge PR #10 (A) · Public-only PR (B/D) · Keep pinned (C) |
| **GAP-004 timing** | Provision isolated Preview DB first · Accept shared risk with controls · Defer |
| **Production deploy policy** | Stay CLI-pinned · Lock Vercel Git production branch · Document rollback owner |
| **FTGP merge** | Separate authorization milestone — not implied by POSTPROD.1 |

### 6. Rollback readiness

If Production regresses after an unauthorized `main` deploy:

```bash
npx vercel alias set crow-ecosystem-platform-mlrlaicp6-muhanadghurabs-projects.vercel.app crow-ecosystem-platform.vercel.app
```

Or alias to URL from `vercel inspect dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` (legacy).

No database rollback required for public UI rollback.

## Related documents

- [`CROW-PUBLIC-PROD.md`](CROW-PUBLIC-PROD.md)
- [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md)
- [`CROW-PUBLIC-10.md`](CROW-PUBLIC-10.md)
- [`CURRENT-STATE.md`](../CURRENT-STATE.md)
- [`GAP-LEDGER.md`](../GAP-LEDGER.md)
