# PR #10 Conflict Audit

| Field | Value |
|-------|-------|
| **Title** | PR #10 conflict inventory (simulated merge) |
| **Status** | CANONICAL audit — CROW.PR10.REBASE.1 |
| **Date** | 2026-07-18 |
| **Authority** | Owner decision — analysis only |
| **Branch audited** | `origin/feat/first-tenant-golden-path` @ `73dda5d` |
| **Target** | `origin/main` @ `e8cb812` |
| **Merge-base** | `a5620c3` (`docs(release): record R2 production stabilization`) |
| **Method** | Temporary local branch `audit/pr10-conflict-sim`; `git merge origin/main --no-commit`; abort; delete branch |
| **Real feat branch** | Untouched (no rebase, no conflict resolution) |
| **Plan** | [`PR10-SAFE-RESOLUTION-PLAN.md`](PR10-SAFE-RESOLUTION-PLAN.md) |
| **Milestone** | [`../milestones/CROW-PR10-REBASE-1.md`](../milestones/CROW-PR10-REBASE-1.md) |

---

## 1. PR #10 state

| Field | Value |
|-------|-------|
| **URL** | https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/10 |
| **Title** | FTGP foundation: authoritative roles, protected Preview, and request lifecycle readiness |
| **Source** | `feat/first-tenant-golden-path` |
| **Target** | `main` |
| **Draft** | Yes |
| **State** | OPEN |
| **Mergeable** | CONFLICTING |
| **mergeStateStatus** | DIRTY |
| **Commits ahead of main** | **407** |
| **Changed files** | **1324** |
| **Additions / deletions** | ~120,734 / ~2,000 |
| **Checks (sampled)** | Vercel Preview: pass · Vercel Preview Comments: pass |

**Not ready for merge.** Remains DRAFT by policy.

---

## 2. Main divergence (what main has that affects PR #10)

Commits on `main` not in feat (`origin/feat..origin/main`):

| SHA | Summary | Effect on PR #10 |
|-----|---------|------------------|
| `18237d1` | ENGINEERING.1 secure SDLC evidence pack (#11) | Adds `docs/secure-sdlc/*` + `docs/README.public.md` — **auto-merges** cleanly |
| `e8cb812` | Public experience reconciliation onto main (PR #14) | Public routes/components/tests landed on `main`; feat already carries parallel public work from earlier FTGP — **two tiny content conflicts** in shared helpers |

### Already aligned / non-conflicting

| Area | Note |
|------|------|
| `vercel.json` | Identical on both tips — no `db:migrate:deploy` in buildCommand |
| Public site on feat | Feat already contains accepted public experience lineage; PR #14 put a recon slice on `main` |
| Production live pin | Still `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` — unrelated to this conflict surface |

### Auto-merged cleanly in simulation (not conflicts)

- `docs/secure-sdlc/*` (from main)
- `docs/README.public.md` (from main)
- `package.json` (main’s public test scripts + feat’s large FTGP script set)

---

## 3. Exact conflict file list

Simulated: merge `origin/main` into temp copy of `origin/feat/first-tenant-golden-path`.

| # | File | Conflict type |
|---|------|---------------|
| 1 | `src/lib/auth/route-protection.ts` | Content |
| 2 | `src/lib/routes.ts` | Content |

**Only these two files are unmerged.** No schema, migration, vercel.json, or Prisma conflicts in this simulation.

---

## 4. Classification and risk

| File | Class | Risk | Why |
|------|-------|------|-----|
| `src/lib/auth/route-protection.ts` | **F** Auth/authorization (+ **A** public path comment) | **High** | Route classification / public browse prefixes — wrong merge could weaken gates |
| `src/lib/routes.ts` | **A** Public/client route map (+ **E** request paths) | **Medium** | Client request route helpers; feat has richer confirmation path |

### Conflict substance (verified)

**`route-protection.ts`** — main adds only a documentation comment above `PUBLIC_PREFIXES`; feat lacks that comment. Logic otherwise shares the same `PUBLIC_PATH_PREFIXES` delegation pattern.

**`routes.ts`** — feat defines:

- `requestNew`
- `requestConfirmation`

main defines:

- `requestNew` (with recon comment)
- (no `requestConfirmation`)

**Recommendation for a future resolve (not executed):** Manually merge — keep feat’s `requestConfirmation`; optionally keep main’s comment; keep feat route-protection logic and accept main’s comment.

---

## 5. Resolution recommendation by file

| File | Recommendation |
|------|----------------|
| `src/lib/auth/route-protection.ts` | **Manually merge** — prefer feat behavior; take main comment |
| `src/lib/routes.ts` | **Keep feature version** (preserve `requestConfirmation`) + optional main comment |
| Auto-merged `package.json` / SDLC docs | **Keep both** (already clean in simulation) |
| Public UI duplicated across histories | **Do not re-land via PR #10** — public already on `main` via PR #14; treat feat public as historical source, not merge vehicle |
| Schema / migrations / hosted scripts in PR #10 body | **Requires GAP-004** before any merge path that deploys them |
| Broad runtime/domain (tenant, blueprint, model-forge, etc.) | **Split into separate PRs** / **Exclude from single merge** |

---

## 6. PR #10 safety assessment

| Factor | Assessment |
|--------|------------|
| Breadth | **Unsafe as one PR** — 407 commits, 1324 files |
| Conflict surface | **Small** — 2 files; easy to clear technically |
| Runtime/domain | High — FTGP includes authority, discovery, blueprint, tenant studio, model-forge, cloud migration tooling |
| Migrations/schema | **Critical path** present in history — blocked by GAP-004 for hosted apply |
| Auth | High sensitivity — even comment-only conflict sits in route-protection |
| Request/ProCrow/Discovery | Valuable local-first work already baselined on feat — extract via slices, don’t rely on monolith merge |
| Public after PR #14 | Public accepted on `main`; merging PR #10 risks re-churning public |
| Production policy | GAP-015 open; Option C interim — merging broad PR to `main` would create Production-target artifacts |
| GAP-004 | Blocks hosted certify / migrations |
| Can PR #10 ever be safely merged as one PR? | **No** — conflict fix ≠ merge safety |

---

## 7. Recommended path

**Option D + Option B (hybrid):**

1. **Keep PR #10 OPEN DRAFT** as archive / source-of-truth reference for FTGP history.
2. **Do not merge** PR #10 as a monolith.
3. **Extract smaller owner-authorized PRs** from feat (docs, request/procrow already local-first, discovery docs, later discovery build, runtime only after GAP-004).
4. **Option E** (rebase later) only after GAP-004 / deploy policy decisions — and only for a reduced tip or replacement PRs, not to force-merge the full 1324-file PR.

**Reject Option A** (resolve and keep broad FTGP PR) for Production-adjacent `main`.
**Option C** (close PR #10) is optional later after slices land — not required now.

---

## 8. Holds confirmed this audit

- No conflict resolution on real branch
- No rebase of `feat/first-tenant-golden-path`
- No merge commit
- No Production deploy · no `main` push · no PR #10 merge
- No migrations · no hosted writes · no Discovery product implementation

---

## Related

- [`PR10-SAFE-RESOLUTION-PLAN.md`](PR10-SAFE-RESOLUTION-PLAN.md)
- Public recon: [`../milestones/CROW-PUBLIC-RECON-5.md`](../milestones/CROW-PUBLIC-RECON-5.md)
- GAP-004 / GAP-015 / GAP-017 / GAP-018
