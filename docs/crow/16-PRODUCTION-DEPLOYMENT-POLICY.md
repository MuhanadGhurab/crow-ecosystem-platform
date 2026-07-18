# Crow Production Deployment Policy

| Field | Value |
|-------|-------|
| **Title** | Production Deployment Policy |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.PROD-POLICY.1 |
| **Last reviewed** | 2026-07-18 (CROW.GAP015.ACCEPT.1 — GAP-015 Mitigated) |
| **Related** | [`10-IMPLEMENTATION-BOUNDARIES.md`](10-IMPLEMENTATION-BOUNDARIES.md), [`11-DEVELOPMENT-OPERATING-MODEL.md`](11-DEVELOPMENT-OPERATING-MODEL.md), [`GAP-LEDGER.md`](GAP-LEDGER.md) (GAP-004, GAP-012, GAP-015) |
| **Evidence** | [`milestones/CROW-GAP015-ACCEPT-1.md`](milestones/CROW-GAP015-ACCEPT-1.md), [`gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md`](gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md), [`gaps/GAP-015-PRODUCTION-DEPLOY-GUARD.md`](gaps/GAP-015-PRODUCTION-DEPLOY-GUARD.md) |

## Purpose

Prevent accidental Production changes while preserving a clean, owner-authorized release path now that `main` contains the accepted public experience.

## Verified deployment facts (baseline)

| Item | Value |
|------|-------|
| Public Production URL | https://crow-ecosystem-platform.vercel.app |
| Live domain deployment (verified) | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| Accepted main-aligned Production artifact | `dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS` (`main` @ `e8cb812`) — **not Instant-Promoted** |
| `main` buildCommand | `db:generate` + `build` only — **no** `db:migrate:deploy` |

### Observed Vercel Git behavior

1. **Merges/pushes to `main` create Production-target deployments** (`target=production`, `source=git`). Observed for PR #11 and PR #14.
2. **Creating a Production-target deployment does not always reassign the public domain.** After PR #14, `crow-ecosystem-platform.vercel.app` continued serving `dpl_QeDhnxz…` while `dpl_8xT92…` became READY and received team/git-main aliases.
3. Therefore Crow distinguishes:
   - **Production-target artifact** — Vercel deployment marked `production`
   - **Live Production** — what the public domain currently serves

Agents must not assume “Production-target READY” equals “live public domain updated.”

## 1. Production release authority

Only the **owner** may authorize:

- Merges to `main` while Production auto-deploy from `main` is enabled
- Instant Promote / domain alias assignment to a new deployment
- Manual Production deploys
- Changes to Vercel Production Git settings (production branch, auto-deploy on/off, ignored build step)
- Hosted migrations and hosted business-data writes

A Cursor report, CI green status, or Preview smoke is **not** owner acceptance.

## 2. What counts as Production authorization

Explicit written owner authorization that names at least:

- Target action (merge `main` / Instant Promote / settings change / hotfix)
- Deployment ID or commit SHA when promoting
- Whether migrations or hosted writes are included (**default: none**)
- Whether the public domain may change

## 3. Does merging `main` count as Production authorization?

**Interim rule (while Vercel may auto-create Production-target deploys from `main`):**

**Yes — treat every merge to `main` as a potential Production event.**

Therefore:

- Merges to `main` require **owner authorization before merge**
- Docs-only merges still create Production-target artifacts (observed with ENGINEERING.1) and still need owner awareness
- Authorization to merge `main` is **not** automatic authorization to Instant Promote or re-pin the public domain

**Preferred future rule (Option B — settings change, owner-authorized separately):**

If Production auto-deploy from `main` is disabled or gated, merges to `main` may proceed under normal PR governance without counting as live Production domain changes — but Instant Promote remains separately authorized.

## 4. Required gates before merging to `main`

Before any merge into `main`:

| Gate | Requirement |
|------|-------------|
| Owner authorization | Explicit, scoped to this merge |
| CI | `verify`, `production-gate`, `postgres-smoke` (as configured) SUCCESS |
| Diff safety | No unauthorized Prisma/migration/auth/runtime/domain changes |
| Build safety | `vercel.json` must not reintroduce `db:migrate:deploy` while GAP-004 is open |
| Preview | Preview smoke when UI/runtime behavior changes |
| PR #10 | Must **not** be the merge vehicle until FTGP readiness review authorizes it |
| Record | Milestone or acceptance note with SHA, PR number, and authorization |

## 5. Required gates before Production alias / Instant Promote

Before assigning or promoting the **public domain** to a new deployment:

| Gate | Requirement |
|------|-------------|
| Owner Instant Promote authorization | Explicit; names deployment ID |
| Deployment READY | Target deployment READY and inspected |
| Production smoke | Public routes 200; gated routes redirect to login; accepted public markers present |
| Safety | No migrations applied by promote; no hosted business writes |
| Rollback candidate | Prior live deployment ID recorded and still READY/rollback-capable |
| Acceptance record | Written in `docs/crow/milestones/` |

**Current hold:** Instant Promote of `dpl_8xT92…` is **not** authorized (owner decision in CROW.PROD-POLICY.1 / RECON.5 follow-up).

## 6. Migration rules while GAP-004 is open

GAP-004 (Preview/Production database isolation) remains **open / blocked**.

While open:

- **Forbidden:** `db:migrate:deploy` (or equivalent) in Production/Preview build commands
- **Forbidden:** Hosted migrations outside controlled-migration workflow
- **Allowed:** `db:generate` (client generation only) in build
- Any hosted schema change requires explicit owner authorization and controlled-migration workflow

## 7. Hosted-data write rules

Release automation and agents must **not**:

- Seed, mutate, or delete hosted business data
- Run hosted write scripts as part of deploy
- Treat Preview/Production shared DB as a sandbox

## 8. Rollback rules

| Trigger | Action |
|---------|--------|
| Live Production smoke fails after promote | Instant Rollback to last known-good deployment ID |
| Auto Production-target artifact is wrong but domain unchanged | Do **not** Instant Promote; leave domain on current pin; record decision |
| Unauthorized live domain change detected | Stop; report; Instant Rollback if owner authorizes |

Always record: failed deployment ID, rollback target ID, smoke evidence, owner authorization.

## 9. Vercel auto-deploy handling

### Audit status (CROW.GAP015.1 — 2026-07-18)

| Finding | Status |
|---------|--------|
| `main` → Production-target auto-create | **Confirmed** (historical #11 / #14) |
| Feature branches → Preview | **Confirmed** (FTGP pushes) |
| Live domain auto-reassign on every Production-target | **Not always** — live still `dpl_QeDhnxz…` |
| GitHub `main` branch protection | **Absent** |
| Ignored Build Step | **Not configured** |
| Vercel settings changed this audit | **No** |

Full evidence: [`gaps/GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md`](gaps/GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md) · plan: [`gaps/GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md`](gaps/GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md).

### Interim operating mode — **GAP-015 Mitigated; intentional Production only via accepted procedure**

- Ignored Build Step is **configured** (CROW.GAP015.3)
- Guard script is **on `main`** @ `f97a835` (PR #25 / CROW.GAP015.5)
- Unauthorized Production for `f97a835` was **skipped** (`BLOCK_UNAUTHORIZED_PRODUCTION_BUILD`, exit 0)
- GitHub `main` protection is **configured** (CROW.GAP015.6)
- Authorized Production deploy operator procedure is **owner-accepted** (CROW.GAP015.ACCEPT.1)
- Live domain remains `dpl_QeDhnxz…` (no Instant Promote)
- Do not Instant Promote unless separately authorized
- Verify live domain after every `main` merge (`?dpl=` / deployment ID)
- Do not merge DB-affecting / hosted-persistence / Blueprint-generation work to `main` while GAP-004 isolation is unproven (GAP-004A fail-closed applies on unsafe Preview only)

### Option E progress (CROW.GAP015.ACCEPT.1)

| Layer | Status |
|-------|--------|
| Guard script + tests | **On `main`** |
| Vercel Ignored Build Step | **Configured** |
| Unauthorized Production skip | **Proven** |
| GitHub `main` protection | **Applied** |
| Authorized deploy procedure | **Owner accepted** |
| GAP-015 | **Mitigated** |

**When** authorizing a Production build, follow [`gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md`](gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md):

- Owner phrase `OWNER AUTHORIZES CROW.PRODUCTION.DEPLOY — Deploy commit <SHA>…`
- Temporary env: `CROW_PRODUCTION_DEPLOY_AUTHORIZED=true` + SHA match + non-empty reason
- Clear env after window
- Instant Promote remains a **separate** authorization

### Recommended control mode (Option E) — **GAP-015 Mitigated**

1. **Option D (repo)** — Production deploy guard — **done**
2. Wire Ignored Build Step — **done** (CROW.GAP015.3)
3. Bring guard to `main` — **done** (CROW.GAP015.5 / PR #25)
4. **Option C** — GitHub `main` protection — **done** (CROW.GAP015.6)
5. Document + accept authorized deploy procedure — **done** (CROW.GAP015.7 / ACCEPT.1)
6. **Option B** — optional additional disable/gate of automatic Production deploys

### Other options

| Option | Role |
|--------|------|
| A — Process only | Still useful for Instant Promote and intentional deploy windows |
| B — Vercel settings gate | Optional complementary settings layer |
| C — GitHub branch protection | **Applied** (GAP015.6) |
| D — Ignored build / deploy guard | **Configured** and **proven** on `main` |
| E — Combined | **Live** — GAP-015 Mitigated |

**GAP-015 is Mitigated.** Actual Production deploy still requires `CROW.PRODUCTION.DEPLOY`. Dashboard `buildCommand` migrate residual is tracked separately.

## 10. PR #10 handling

PR #10 (`feat/first-tenant-golden-path`) remains:

- OPEN · DRAFT · **must not merge** until separate FTGP readiness review and owner merge authorization
- Not a Production release vehicle by default
- Docs commits on the FTGP branch do not authorize Production promote

## 11. Emergency hotfix process

1. Owner authorizes hotfix scope (minimal diff)
2. Prefer fix on a short-lived branch → PR → Preview smoke → owner merge authorization to `main`
3. If live domain must change, require separate Instant Promote authorization and rollback ID
4. No migrations / hosted writes unless owner explicitly includes them
5. Record hotfix milestone note within 24 hours

## 12. Owner acceptance record requirements

Every Production-affecting action must leave durable evidence under `docs/crow/`:

- Authorization statement
- Commit SHA / deployment ID
- Before/after live domain deployment ID
- Smoke results
- Migration/hosted-write attestation (usually “none”)
- GAP-004 / GAP-012 status impact

## Related documents

- [`milestones/CROW-PROD-POLICY-1.md`](milestones/CROW-PROD-POLICY-1.md)
- [`milestones/CROW-GAP015-1.md`](milestones/CROW-GAP015-1.md)
- [`milestones/CROW-GAP015-3.md`](milestones/CROW-GAP015-3.md)
- [`gaps/GAP-015-VERCEL-GUARD-SETUP-CHECKLIST.md`](gaps/GAP-015-VERCEL-GUARD-SETUP-CHECKLIST.md)
- [`gaps/GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md`](gaps/GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md)
- [`gaps/GAP-015-PRODUCTION-DEPLOY-GUARD.md`](gaps/GAP-015-PRODUCTION-DEPLOY-GUARD.md)
- [`gaps/GAP-015-VERCEL-GUARD-SETUP-CHECKLIST.md`](gaps/GAP-015-VERCEL-GUARD-SETUP-CHECKLIST.md)
- [`gaps/GAP-015-GITHUB-PROTECTION-CHECKLIST.md`](gaps/GAP-015-GITHUB-PROTECTION-CHECKLIST.md)
- [`milestones/CROW-PUBLIC-RECON-5.md`](milestones/CROW-PUBLIC-RECON-5.md)
- [`CURRENT-STATE.md`](CURRENT-STATE.md)
- [`GAP-LEDGER.md`](GAP-LEDGER.md)
