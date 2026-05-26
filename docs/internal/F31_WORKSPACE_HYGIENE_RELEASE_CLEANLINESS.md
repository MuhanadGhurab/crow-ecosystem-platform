# F31 — Workspace hygiene & release cleanliness

**Date:** 26 May 2026  
**Phase type:** Hygiene / audit only — no product features, no paid infra  
**Audience:** Internal delivery / engineering  
**Status:** **PASSED WITH WARNINGS**

**F31 does not:** commit straggler code automatically, create a git tag, run migrations/seeds, activate payments, or delete `.env` files.

---

## Executive summary

| Question | Answer |
|----------|--------|
| Is `origin/main` at F30? | **Yes** — `f6fcc40` (`docs(release): add F30 portfolio release checkpoint`) |
| Does validation baseline pass on current tree? | **Yes** — including optional `simulate:vercel-build:staging` |
| Is working tree clean? | **No** — 21 modified + 57 untracked paths (see audit) |
| Are forbidden files staged? | **No** — nothing staged |
| Safe to tag `v0.30.0-portfolio` on `main`? | **Yes** — tag points at committed F30; local dirt does not block tagging `HEAD` on main |
| Recommended next hygiene action? | Scoped commits for F20/F21/F13 stragglers **or** stash; untrack `tsconfig.tsbuildinfo`; extend `.gitignore` |

---

## Part 1 — Git workspace audit

**Branch:** `main` · **Tracking:** `origin/main` (in sync at audit time)  
**Staged:** none

### Modified (21 paths)

| File | Classification | Recommended action |
|------|------------------|-------------------|
| `docs/internal/CYBERCROW_COMPLETION.md` | E — straggler (F21 doc drift) | Commit in scoped `docs(cybercrow): …` **after approval** |
| `docs/internal/PRODUCTION_READINESS.md` | E — straggler | Commit with doc batch **after approval** |
| `docs/internal/SAREA_COMPLETION.md` | E — straggler (F20 doc drift) | Commit with F20 doc bundle **after approval** |
| `prisma/seed-meem.ts` | E — future / seed touch | Do not commit without explicit seed/migration approval |
| `scripts/verify-organic-request-e2e.ts` | A or E — F8/F11 verify | Commit if organic E2E closure is intentional **after approval** |
| `src/app/api/sarea/preview/route.ts` | E — F20 SAREA | Scoped F20 product commit **after approval** |
| `src/app/sarea/navigation/page.tsx` | E — F20 SAREA | Same |
| `src/app/sarea/preview/page.tsx` | E — F20 SAREA | Same |
| `src/app/sarea/role-mapping/page.tsx` | E — F20 SAREA | Same |
| `src/app/sarea/widgets/page.tsx` | E — F20 SAREA | Same |
| `src/components/studio/sarea/sarea-role-map-assign.tsx` | E — F20 SAREA | Same |
| `src/components/tenant/cybercrow/cybercrow-connection-panel.tsx` | E — F21 CyberCrow | Scoped F21 commit **after approval** |
| `src/components/tenant/cybercrow/cybercrow-mock-console.tsx` | E — F21 (deleted) | Include in F21 commit (removal) **after approval** |
| `src/lib/actions/sarea.ts` | E — F20 SAREA | F20 bundle **after approval** |
| `src/lib/db.ts` | E — minor | Review diff; bundle with related phase **after approval** |
| `src/lib/mock/pipeline.ts` | E — F28 mock | F28 straggler or discard if duplicate **after approval** |
| `src/lib/org-intelligence/sector-template-data.ts` | E — F25 discovery | F25 straggler **after approval** |
| `src/lib/sarea/preview-cookie.ts` | E — F20 SAREA | F20 bundle **after approval** |
| `src/lib/services/commercial.service.ts` | E — minor | Review diff **after approval** |
| `src/lib/services/pipeline.service.ts` | E — pipeline | Review diff **after approval** |
| `src/lib/services/sarea-runtime.service.ts` | E — F20 SAREA | F20 bundle **after approval** |
| `tsconfig.tsbuildinfo` | D — generated | Revert local change; **untrack** from git (see forbidden check) |

### Untracked (grouped)

| Path / group | Classification | Recommended action |
|--------------|----------------|-------------------|
| `.agents/**` (42 files) | F — forbidden / local tooling | Leave uncommitted; add to `.gitignore` |
| `skills-lock.json` | F — forbidden | Leave uncommitted; add to `.gitignore` |
| `docs/internal/F13_DEMO_REHEARSAL_NOTES.md` | A — F13 doc (milestone says passed) | Commit scoped docs **after approval** |
| `docs/internal/F20_SAREA_ADVANCED_CONTROLS.md` | A — F20 doc (milestone says passed) | Commit with F20 code **after approval** |
| `docs/internal/F5_CYBERCROW_SAREA_VALIDATION.md` | B — historical internal | Keep or commit if still referenced **after approval** |
| `docs/internal/F5_DEPLOYMENT_CHECKPOINT.md` | B — historical internal | Same |
| `docs/internal/assets/screenshots/admin-request-detail.png` | A — F13 internal asset | Commit if needed for internal docs **after approval** |
| `docs/public/assets/screenshots/*.png` (12 files) | A — F13/F22 public | Commit for portfolio README **after approval** |
| `scripts/f2-env-status.mjs` | E — dev utility | Future phase or commit with scripts index **after approval** |
| `scripts/f2-smoke-payload.json` | B — local smoke payload | Do not commit if contains env-specific IDs |
| `scripts/warn-prisma-locked.mjs` | E — DX helper | Optional F29/F32 commit **after approval** |
| `src/components/studio/sarea/sarea-preview-impact-panel.tsx` | E — F20 SAREA | F20 bundle **after approval** |
| `src/lib/services/sarea-studio-audit.service.ts` | E — F14/F20 SAREA | F20 bundle **after approval** |

**Counts:** 21 modified · 57 untracked (per `git ls-files --others --exclude-standard`)

---

## Part 2 — Forbidden file check

| Pattern | Present locally | Tracked in git | Staged | Recommended action |
|---------|-----------------|--------------|--------|-------------------|
| `.env*` (secrets) | Only `.env.example`, `.env.production.example` (templates) | Examples only — OK | No | Keep templates; never commit real `.env` / `.env.staging` / `.env.local` |
| `tsconfig.tsbuildinfo` | Yes (modified) | **Yes — historical track** | No | Revert working copy; `git rm --cached tsconfig.tsbuildinfo`; add to `.gitignore` |
| `.agents/` | Yes (untracked) | No | No | Add `.agents/` to `.gitignore`; never commit |
| `skills-lock.json` | Yes (untracked) | No | No | Add to `.gitignore`; never commit |

**Note:** Build loads `.env` when present locally (Next.js message during `npm run build`) — that is expected for dev; ensure no secrets are committed.

---

## Part 3 — Completed-phase straggler check

Milestones mark these phases **passed**, but related files were **not** fully committed at F30:

| Phase | Evidence on disk | On `main` at F30? | Recommendation |
|-------|------------------|-------------------|----------------|
| **F20 SAREA** | Modified SAREA pages/services + untracked `F20_SAREA_ADVANCED_CONTROLS.md`, `sarea-preview-impact-panel.tsx`, `sarea-studio-audit.service.ts` | Partial — code drift | **Scoped commit** `feat(sarea): F20 advanced controls straggler` after review |
| **F21 CyberCrow** | `cybercrow-mock-console.tsx` deleted; connection panel + completion doc edits | Partial | **Scoped commit** after review |
| **F13 / F22 portfolio** | 12 public PNGs + internal screenshot untracked | Partial — F30 added release notes only | **Scoped commit** `docs: add portfolio screenshots` after review |
| **F28 mock** | `src/lib/mock/pipeline.ts` modified | Unclear | Diff review — commit if intentional mock alignment |
| **F25 discovery** | `sector-template-data.ts` modified | Unclear | Diff review — commit with F25 label or revert |
| **F8/F11 organic E2E** | `verify-organic-request-e2e.ts` expanded | Unclear | Commit if F11 closure doc alignment intended |

**F23–F30 release docs:** Committed on `main` via `f6fcc40` and prior F29 commit — **no straggler** for F30 itself.

---

## Part 4 — Validation baseline (26 May 2026)

| Command | Result |
|---------|--------|
| `npm run mock:verify` | **PASS** (28 checks) |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** (Next.js 15.5.18, 50 routes) |
| `npm run public:mirror-manifest` | **PASS** |
| `npm run simulate:vercel-build:staging` | **PASS** (no Windows Prisma EPERM on this run) |

**Not run (per F31 scope):** migrations, seeds, payment webhooks, production env changes.

---

## Part 5 — Cleanup action plan (no destructive actions taken)

### Immediate (safe, no product change)

1. **Revert** local-only change: `git restore tsconfig.tsbuildinfo` (or leave dirty but never stage).
2. **Untrack** buildinfo (one-time, after approval): `git rm --cached tsconfig.tsbuildinfo`.
3. **Apply** minimal `.gitignore` patch (see Part 6).
4. **Confirm** `git diff --cached` empty before any future commit.

### After user approval (scoped commits — not `git add .`)

| Bundle | Suggested scope | Suggested message |
|--------|-----------------|-------------------|
| F31 hygiene docs only | `F31_*.md`, `PROJECT_STATUS.md`, `MILESTONES.md` | `docs(hygiene): add F31 workspace cleanliness audit` |
| F20 straggler | SAREA src + `F20_SAREA_ADVANCED_CONTROLS.md` + `SAREA_COMPLETION.md` | `feat(sarea): commit F20 advanced controls stragglers` |
| F21 straggler | CyberCrow src + `CYBERCROW_COMPLETION.md` | `feat(cybercrow): commit F21 depth stragglers` |
| Portfolio screenshots | `docs/public/assets/screenshots/*` + optional F13 doc | `docs: add public portfolio screenshots` |

### Do not commit without explicit approval

- `prisma/seed-meem.ts`
- `scripts/f2-smoke-payload.json` (may contain staging IDs)
- `.agents/`, `skills-lock.json`
- Any `.env*` except tracked examples

---

## Part 6 — `.gitignore` review

**Already protected:** `.env`, `.env*.local`, `.env.staging`, `.env.production`, `.env.vercel`, `node_modules/`, `.next/`, `out/`, `.vercel/`, `*.log`, `prisma/*.db`

**Gaps (recommend minimal patch):**

```gitignore
# TypeScript incremental build cache (do not track)
tsconfig.tsbuildinfo

# Cursor / agent local state (forbidden in repo policy)
.agents/
skills-lock.json
```

**Optional:** `dist/` if team uses `tsc` emit to `dist/` — not required today (`out/` covers Next export).

Do **not** delete `.env` files on disk.

---

## Part 7 — Release tag readiness

| Criterion | Status |
|-----------|--------|
| `origin/main` contains F30 (`f6fcc40`) | **Yes** |
| Validation baseline on current tree | **Pass** |
| Forbidden files staged | **No** |
| Public/internal boundary | **Clean** — mirror excludes `docs/internal/` |
| Working tree clean | **No** — accepted for tag **if** tag is applied to committed `main` only |

### Tag recommendation (document only — not executed)

```bash
git fetch origin
git tag -a v0.30.0-portfolio f6fcc40 -m "F30 final portfolio release"
git push origin v0.30.0-portfolio
```

Alternative name: `portfolio-f30`

**When to tag:** After you confirm F30 narrative is final; local uncommitted work does not need to be merged first **unless** you want screenshots/code stragglers in the tagged commit.

---

## Part 8 — Final recommendation

1. **Accept F31** as hygiene complete with warnings: tree classified, validation green, no accidental staging.
2. **Tag `v0.30.0-portfolio`** on `f6fcc40` when ready — optional and user-approved only.
3. **Next engineering pass:** Choose one of:
   - **Straggler commit wave** — F20 + F21 + screenshots in 2–3 scoped commits
   - **F32 reliability** — lightweight CI for validation scripts (F30 “next recommended”)
   - **Stash** local product work if pausing before portfolio push

Production launch remains **deferred** per [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md). No paid infrastructure activated in F31.

---

## F31 acceptance

**PASSED WITH WARNINGS**

- Workspace audit complete  
- All paths classified  
- Forbidden files unstaged  
- Stragglers identified (F20/F21/F13/F28/F25)  
- Validation baseline passes  
- Cleanup plan documented  
- `.gitignore` gaps identified (patch proposed, not applied)  
- Tag readiness documented  
- No commit, tag, migrations, seeds, or paid infra in this phase  

**Warnings:** Dirty working tree; `tsconfig.tsbuildinfo` still tracked in history; substantial uncommitted product work from completed-phase labels.
