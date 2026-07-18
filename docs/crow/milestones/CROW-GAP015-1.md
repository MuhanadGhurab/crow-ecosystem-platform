# CROW.GAP015.1 — Production Auto-Deploy Settings Audit and Safe Control Plan

| Field | Value |
|-------|-------|
| **Status** | Complete — audit + plan only |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Start HEAD** | `4eafb26` |
| **Audit** | [`../gaps/GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md`](../gaps/GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md) |
| **Plan** | [`../gaps/GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md`](../gaps/GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) — kept OPEN |
| **main** | `e8cb812` (unchanged) |
| **Production live** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · untouched |

## Purpose

Audit current Production auto-deploy behavior and prepare a safe control plan so Crow does not accidentally deploy Production from `main` merges or unsafe branches — **without** changing Vercel settings or deploying Production.

## Scope

### In scope

- Read-only Vercel / GitHub evidence
- Audit document
- Control-plan options A–E + recommendation
- Policy / ledger / START-HERE / CURRENT-STATE / roadmap updates
- Issue #15 comment (keep OPEN)
- Docs-only commits on FTGP branch

### Out of scope

- Changing Vercel settings
- Production deploy / Instant Promote
- Push `main` / merge PR #10
- Migrations / hosted writes
- Env var changes
- Implementing Option B/C/D/E

## Constraints honored

| Constraint | Result |
|------------|--------|
| No Vercel settings change | Yes |
| No Production deploy | Yes |
| No `main` push | Yes |
| No PR #10 merge/conflict resolve | Yes |
| No migrations / hosted writes | Yes |
| No Discovery hosted / Blueprint enablement | Yes |
| No env changes | Yes |

## Key findings (summary)

1. Feature-branch Git events create **Preview** deployments (`target: null`).
2. Historical `main` merges create **Production-target** deployments; live public domain may remain on older pin.
3. Live Production remains `dpl_QeDhnxz…`.
4. GitHub `main` has **no** branch protection and **no** rulesets.
5. CI exists but is **not** required on `main`.
6. No Ignored Build Step configured.
7. Docs (Option C interim) match behavior; Option B settings still pending.

## Recommendation

**Option E — combined** (branch protection + Vercel Production auto-deploy gate + deploy guard + owner phrases). Do **not** implement in this milestone.

Interim: continue Option A/C process control until owner authorizes implementation steps.

## GAP impact

| Gap | After CROW.GAP015.1 |
|-----|---------------------|
| GAP-015 | **Open** — audit/plan prepared; settings/controls **not** applied |
| GAP-004 | Open / blocked |
| GAP-004A | Accepted standing mitigation |
| GAP-012 | Mitigated (policy); settings residual still GAP-015 |
| GAP-017 | Unchanged (Discovery local-first; hosted held) |

## Owner decisions still required

1. Authorize Option E implementation sequence (or choose B-only / C-only / keep A-only)?
2. Authorize Vercel Option B settings change?
3. Authorize GitHub `main` protection?
4. Authorize Option D guard design/implement?
5. Instant Promote `dpl_8xT92…` remains a **separate** decision (currently not authorized)

## Recommended next milestone

**CROW.GAP015.2 / CROW.PROD-POLICY.2** — owner-authorized application of Option B (and/or C) per plan — **or** continue FTGP/Discovery local-first under existing holds if owner defers settings.

## Final verdict

**READY — GAP-015 PRODUCTION AUTO-DEPLOY AUDIT AND CONTROL PLAN PREPARED**
