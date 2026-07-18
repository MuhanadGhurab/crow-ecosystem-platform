# GAP-015 — Authorized Production Deploy Operator Procedure

| Field | Value |
|-------|-------|
| **Status** | Prepared — **awaiting owner acceptance** |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP015-7.md`](../milestones/CROW-GAP015-7.md) |
| **Evidence template** | [`GAP-015-PRODUCTION-DEPLOY-EVIDENCE-TEMPLATE.md`](GAP-015-PRODUCTION-DEPLOY-EVIDENCE-TEMPLATE.md) |
| **Guard** | [`GAP-015-PRODUCTION-DEPLOY-GUARD.md`](GAP-015-PRODUCTION-DEPLOY-GUARD.md) |
| **Policy** | [`../16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

## Purpose

Define the **only** intentional path to allow a Production-target build under the SHA-bound Vercel Ignored Build Step guard. This document is an operator procedure. It does **not** authorize any deploy by itself.

**Current baseline (do not assume changed):**

| Item | Value |
|------|-------|
| `main` | Protected @ `f97a835` |
| Live Production | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| Ignored Build Step | `node scripts/safety/vercel-production-deploy-guard.mjs` |
| PR #10 | Archive / reference only — never merge as monolith |

---

## 1. Authorization model

A Production deployment is authorized **only** when **all** of the following are true:

1. Explicit owner authorization phrase (below)
2. Exact target commit SHA named in the phrase
3. Non-empty deployment reason
4. Allowed scope confirmed (what may change)
5. Prohibited work confirmed absent from the commit (or separately authorized)
6. GAP-004 / GAP-004A status reviewed and understood
7. Blueprint generation confirmed blocked unless separately authorized

### Required owner phrase template

```text
OWNER AUTHORIZES CROW.PRODUCTION.DEPLOY — Deploy commit <SHA> to Production for <reason>. This authorization applies only to commit <SHA>. It does not authorize migrations, hosted writes outside the approved scope, Blueprint generation, tenant provisioning, payment, CroAI, PR #10 merge, or Instant Promote unless explicitly stated.
```

Replace `<SHA>` with the full 40-character commit SHA (or the exact short SHA that will equal `VERCEL_GIT_COMMIT_SHA` for that build — prefer full SHA). Replace `<reason>` with a short owner reason.

A Cursor report, green CI, or Preview smoke is **not** authorization.

### Concepts that must stay separate

| Action | Requires |
|--------|----------|
| Merge to `main` | Owner merge authorization (GitHub protection + PR) |
| Production-target **build** allowed by guard | `CROW.PRODUCTION.DEPLOY` phrase + SHA-bound env window |
| Live domain / Instant Promote | **Separate** Instant Promote phrase |
| Migrations / hosted writes | **Separate** explicit authorization |

---

## 2. Pre-deploy checklist

Complete before setting authorization env vars:

| # | Check | Pass? |
|---|--------|-------|
| 1 | Target SHA exists on `main` (`git merge-base --is-ancestor <SHA> origin/main` or equivalent) | ☐ |
| 2 | GitHub `main` protection still configured; PR required; required checks `verify`, `production-gate`, `postgres-smoke` | ☐ |
| 3 | Vercel Ignored Build Step still `node scripts/safety/vercel-production-deploy-guard.mjs` | ☐ |
| 4 | Guard script present on target SHA (`scripts/safety/vercel-production-deploy-guard.mjs`) | ☐ |
| 5 | Diff for target SHA reviewed: no unauthorized migrations, auth/tenant, payment, CroAI, Discovery hosted persistence, Blueprint generation | ☐ |
| 6 | GAP-004 status reviewed (open/blocked); GAP-004A accepted fail-closed understood | ☐ |
| 7 | Blueprint generation remains blocked unless separately authorized | ☐ |
| 8 | PR #10 remains untouched (no ready/merge) | ☐ |
| 9 | Current live deployment ID recorded (baseline rollback target) | ☐ |
| 10 | Production rollback target identified (= current live `dpl_…` unless owner names another) | ☐ |
| 11 | Migrations: **none** unless separately authorized | ☐ |
| 12 | Hosted writes: **none** unless separately authorized | ☐ |
| 13 | Owner phrase posted with exact SHA + reason | ☐ |

---

## 3. Production authorization env handling

These are **temporary** Vercel Production environment controls for the Ignored Build Step guard. They are **not** application secrets for runtime business logic.

| Variable | Requirement |
|----------|-------------|
| `CROW_PRODUCTION_DEPLOY_AUTHORIZED` | Must be truthy: `true` / `1` / `yes` |
| `CROW_PRODUCTION_DEPLOY_SHA` | Must **exactly** equal `VERCEL_GIT_COMMIT_SHA` for the build |
| `CROW_PRODUCTION_DEPLOY_REASON` | Non-empty owner reason string |

### Rules

1. Set **only** after the owner phrase is recorded and the pre-deploy checklist passes.
2. Scope env to **Production** (not Preview) unless the operator intentionally documents otherwise.
3. Set SHA to the **exact** authorized commit.
4. **Never** leave `CROW_PRODUCTION_DEPLOY_AUTHORIZED=true` permanently.
5. After success **or** abort: remove/reset all three variables (or set authorized to false/empty and clear SHA/reason).
6. Do **not** paste secrets, tokens, or raw env dumps into docs, Issues, or PR comments.
7. Dry-run (documentation example only — do **not** execute without owner deploy auth):

```text
# Conceptual only — not an authorized run
# Set in Vercel Production env for deploy window:
#   CROW_PRODUCTION_DEPLOY_AUTHORIZED=true
#   CROW_PRODUCTION_DEPLOY_SHA=<exact-sha>
#   CROW_PRODUCTION_DEPLOY_REASON=<reason>
# After build: clear/reset the three variables
```

---

## 4. Deploy execution paths

### Option A — Git-triggered Production deploy from `main` (after env authorization)

1. Ensure authorized SHA is on `main`.
2. Set temporary Production auth env vars (Section 3).
3. Trigger Production-target build for that SHA (e.g. empty commit is **discouraged**; prefer redeploy of exact SHA or merge that already lands the SHA).
4. Confirm guard logs `ALLOW_AUTHORIZED_PRODUCTION_BUILD` (exit 1) for that SHA.
5. Clear env vars after build completes or fails.

### Option B — Vercel manual deploy / redeploy of exact `main` SHA

1. Same env window as Option A.
2. Use Vercel UI/CLI to redeploy the exact authorized SHA to Production target if available.
3. Verify guard decision and clear env vars.

### Option C — Instant Promote (separate authorization)

Instant Promote / public domain reassignment is **never** implied by `CROW.PRODUCTION.DEPLOY`.

Required separate phrase pattern:

```text
OWNER AUTHORIZES CROW.PRODUCTION.INSTANT_PROMOTE — Promote deployment <dpl_...> to the public Production domain for <reason>. This does not authorize migrations, hosted writes, Blueprint generation, or PR #10 merge unless explicitly stated.
```

**`dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS` remains not authorized** unless the owner names it explicitly in an Instant Promote phrase.

---

## 5. Post-deploy verification

| # | Check | Pass? |
|---|--------|-------|
| 1 | Deployment completed successfully (or intentionally skipped — document which) | ☐ |
| 2 | If Instant Promote was **not** authorized: live domain still previous `dpl_…` | ☐ |
| 3 | If Instant Promote **was** authorized: live domain equals expected new `dpl_…` | ☐ |
| 4 | Deployed commit SHA matches authorized SHA | ☐ |
| 5 | No unexpected migrations | ☐ |
| 6 | No hosted writes beyond authorized scope | ☐ |
| 7 | No unauthorized Production env drift (auth trio cleared) | ☐ |
| 8 | App smoke checks pass (health / critical routes as scoped) | ☐ |
| 9 | Public routes still pass access policy expectations | ☐ |
| 10 | Auth/client routes not accidentally opened beyond policy | ☐ |
| 11 | Preview DB-disabled / GAP-004A fail-closed still understood for Preview | ☐ |
| 12 | Production auth env vars removed/reset | ☐ |
| 13 | Rollback target preserved and recorded | ☐ |

Fill [`GAP-015-PRODUCTION-DEPLOY-EVIDENCE-TEMPLATE.md`](GAP-015-PRODUCTION-DEPLOY-EVIDENCE-TEMPLATE.md).

---

## 6. Abort / rollback procedure

### Abort immediately when

- Owner phrase SHA ≠ intended SHA
- Guard would allow the wrong commit (`sha_match` wrong)
- Vercel attempts unauthorized Production build (should skip — if it builds, abort investigation)
- Auth env vars wrong, missing, or left permanent
- Build unexpectedly runs migrations
- Live domain changes without Instant Promote authorization
- Smoke / public access checks fail after promote

### Abort steps

1. Stop further promote / alias changes.
2. Clear Production auth env trio.
3. Record failed deployment ID and logs (redacted).
4. Keep live domain on last known good `dpl_…` unless owner authorizes otherwise.

### Rollback evidence (domain only)

| Field | Value |
|-------|-------|
| Previous live deployment ID | |
| Failed / unwanted deployment ID | |
| Owner rollback authorization | Required before Instant Promote to previous |

Suggested rollback phrase:

```text
OWNER AUTHORIZES CROW.PRODUCTION.ROLLBACK — Instant Promote deployment <previous-dpl> to the public Production domain to restore service after <reason>. Database rollback is not authorized unless separately stated.
```

**No database rollback** unless separately planned and authorized.

---

## 7. Forbidden actions

Unless **separately and explicitly** authorized:

- Merge PR #10 (or treat it as a release vehicle)
- Run hosted migrations
- Hosted Discovery persistence
- Blueprint generation
- Tenant provisioning
- Membership / role creation
- Payment processing / CroAI runtime enablement
- Dump secrets or full env to Issues/docs
- Production deploy from a feature branch (FTGP) without separate owner authorization and SHA-bound guard window
- Leave `CROW_PRODUCTION_DEPLOY_AUTHORIZED=true` after the window
- Instant Promote without Option C phrase

---

## 8. Evidence

Use [`GAP-015-PRODUCTION-DEPLOY-EVIDENCE-TEMPLATE.md`](GAP-015-PRODUCTION-DEPLOY-EVIDENCE-TEMPLATE.md) for every authorized attempt (success or abort).

---

## 9. GAP-015 completion criteria

GAP-015 may be marked **Mitigated** only when **all** are true:

| Criterion | Status as of CROW.GAP015.7 |
|-----------|----------------------------|
| Guard configured (Ignored Build Step) | Done |
| Guard exists on `main` | Done |
| Unauthorized Production skip proven | Done |
| GitHub `main` protection configured | Done |
| Authorized deploy procedure documented | **Done (this doc)** |
| Owner **accepts** this procedure | **Pending** |

Do **not** close Issue #15 or mark GAP-015 Mitigated until owner acceptance is recorded.

### Suggested owner acceptance phrase

```text
OWNER ACCEPTS CROW.GAP015.7 — Authorized Production deploy operator procedure accepted as the sole intentional Production build path under the SHA-bound guard.
```
