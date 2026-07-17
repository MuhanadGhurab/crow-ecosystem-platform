# PR #10 Safe Resolution Plan

| Field | Value |
|-------|-------|
| **Title** | Safe path for PR #10 conflicts and FTGP breadth |
| **Status** | CANONICAL plan — CROW.PR10.REBASE.1 |
| **Date** | 2026-07-18 |
| **Audit** | [`PR10-CONFLICT-AUDIT.md`](PR10-CONFLICT-AUDIT.md) |
| **Milestone** | [`../milestones/CROW-PR10-REBASE-1.md`](../milestones/CROW-PR10-REBASE-1.md) |
| **Issue (future)** | Propose **CROW.PR10.1** — Resolve or split broad FTGP PR safely (do not create unless owner asks) |

**This plan does not authorize conflict resolution, rebase, merge, or Production promotion.**

---

## Recommended strategy

**Keep PR #10 as DRAFT archive (Option D) and split work into smaller owner-authorized PRs (Option B).**

Do not merge PR #10 as a single PR into `main`.

---

## Phases

### Phase R10-0 — Preserve current branch

| Step | Status |
|------|--------|
| Ensure `feat/first-tenant-golden-path` pushed | Done @ `73dda5d` (pre-audit tip) |
| Record HEAD / content baselines | `73dda5d` · Discovery plan `9162839` |
| Do not lose FTGP work | Branch remains source of truth |
| Optional annotated tag | Owner may tag later (e.g. `ftgp-archive-73dda5d`) — not required now |

### Phase R10-1 — Conflict inventory

| Step | Status |
|------|--------|
| Exact conflict files | Done — 2 files (see audit) |
| Classification + risk | Done |
| Simulated merge aborted | Done |

### Phase R10-2 — Extract safe slices (future, owner-authorized)

Suggested slice order (each = separate PR or local milestone):

1. **Governance / crow docs** already on feat (if not on main) — low risk
2. **Request + ProCrow local-first** product deltas vs main — medium; no migrations
3. **Discovery field architecture + MVP plans** — docs only; already baselined on feat
4. **Public** — **skip**; already on `main` via PR #14
5. **Tests / scripts** that are non-hosted — medium
6. **Exclude** cloud migration apply tooling from early slices

### Phase R10-3 — Runtime readiness review (before any runtime PR)

- Auth / route protection
- Discovery runtime vs plan
- Tenant / Blueprint / Model Forge
- Explicit non-goals until GAP-004

### Phase R10-4 — GAP-004 decision

- No migrations / hosted writes until Preview DB isolation
- Controlled-migration scripts stay feature-branch-only until authorized

### Phase R10-5 — PR strategy

| Action | Guidance |
|--------|----------|
| PR #10 | Remain OPEN DRAFT; comment with audit; do not mark ready |
| Smaller PRs | Only with explicit owner authorization |
| Close PR #10 | Optional after slices land and owner accepts archive role |
| Rebase full PR #10 | Discouraged; prefer cherry-pick / new branch from slices |

---

## If owner later authorizes a conflict-clearing rebase (not now)

1. Work on a **new** branch from feat tip.
2. Merge or rebase onto `main` **only** to clear the 2 conflicts.
3. Manually merge `route-protection.ts` and `routes.ts` per audit.
4. **Still do not merge** the resulting mega-PR to `main`.
5. Use the conflict-cleared tip only as a cleaner archive or cherry-pick source.

---

## Owner decisions required

1. Accept Option D+B (keep draft archive + split) vs A/C/E variants
2. Whether to create Issue **CROW.PR10.1** for tracking
3. Whether to tag `73dda5d` as FTGP archive
4. First slice to extract (docs vs request/procrow vs wait for Discovery build)
5. GAP-004 / GAP-015 priority vs Discovery MVP build
6. Never authorize Instant Promote / unguarded `main` merge of FTGP monolith

---

## Explicit non-goals of this plan document

- Resolving conflicts now
- Merging PR #10
- Pushing `main`
- Production deploy
- Migrations / hosted writes
- Discovery product implementation
