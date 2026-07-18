# GAP-015 — Production Auto-Deploy Control Plan

| Field | Value |
|-------|-------|
| **Status** | Plan ready — **not implemented** this milestone |
| **Date** | 2026-07-18 |
| **Audit** | [`GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md`](GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md) |
| **Milestone** | [`../milestones/CROW-GAP015-1.md`](../milestones/CROW-GAP015-1.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

## Goal

Stop Crow from accidentally creating Production-target deployments (or confusing them with live Production) when `main` moves or unsafe branches are mishandled — using the safest **no-cost** control path the owner can authorize.

## Non-goals (this plan document)

- Do not apply Vercel settings until a dedicated owner-authorized milestone
- Do not Instant Promote or redeploy live Production
- Do not merge PR #10 or push `main` as part of “mitigation”
- Do not enable hosted Discovery / Blueprint / migrations

## Options

### Option A — Owner process control only

| Aspect | Detail |
|--------|--------|
| Mechanism | Keep automatic Production-target creation; treat every `main` merge as Production-risk (current interim Option C) |
| Cost | None |
| Pros | No tooling change; already documented in `16-PRODUCTION-DEPLOYMENT-POLICY.md` |
| Cons | Highest human-error risk; unprotected `main` amplifies risk |
| Alone? | **Insufficient** as sole long-term control |

### Option B — Vercel settings gate

| Aspect | Detail |
|--------|--------|
| Mechanism | In Vercel project Git settings: disable or restrict automatic Production deployment from `main`; require manual Production deploy / Instant Promote for live changes; keep Preview for non-production branches |
| Cost | Prefer free-tier toggles only — owner confirms in UI |
| Pros | Directly stops auto Production-target from `main` if available |
| Cons | Requires owner UI action; exact control labels vary by Vercel plan |
| Alone? | **Strong preferred settings control** when available |

### Option C — GitHub branch protection + required checks

| Aspect | Detail |
|--------|--------|
| Mechanism | Protect `main`: require PR, required status checks (`verify`, `production-gate`, `postgres-smoke`), dismiss stale reviews; optional CODEOWNERS |
| Cost | Free on public repos (classic branch protection / rulesets) |
| Pros | Reduces unsafe/accidental `main` movement |
| Cons | **Does not stop Vercel** if `main` still changes and auto-deploy remains on |
| Alone? | Necessary hygiene; **not sufficient** alone |

### Option D — Ignored build step / deployment guard

| Aspect | Detail |
|--------|--------|
| Mechanism | Vercel Ignored Build Step and/or repo script: skip Production builds unless an explicit commit marker / env allowlist is present; Preview continues normally |
| Cost | Free if using Ignored Build Step / `ignoreCommand` |
| Pros | Code/process marker fails closed even if `main` moves accidentally |
| Cons | Must be carefully designed so Preview still builds; misconfiguration can block intentional releases or skip needed Previews |
| Alone? | Useful belt; design in a follow-up implement milestone |

### Option E — Combined policy (recommended)

| Layer | Control |
|-------|---------|
| Process | Retain Option A/C interim phrases until settings applied |
| GitHub | Enable Option C branch protection + required CI checks |
| Vercel | Apply Option B when owner confirms free-tier support |
| Guard | Add Option D ignored-build / Production allow-marker as belt-and-suspenders |
| Authority | Explicit owner phrase for any Production-target, Instant Promote, or settings change |

| Aspect | Detail |
|--------|--------|
| Cost | No paid Vercel features required for the core path |
| Pros | Defense in depth; addresses both Git movement and Vercel auto-create |
| Cons | Multi-step; needs sequenced owner-authorized milestones |
| Implement now? | **No** — plan only in CROW.GAP015.1 |

## Recommendation

**Recommend Option E (combined).**

Rationale:

1. Audit shows Production-target auto-create from `main` is real and GitHub `main` is **unprotected**.
2. Option B alone is ideal for Vercel but needs owner UI confirmation and does not fix unprotected merges.
3. Option C alone does not stop Vercel after a legitimate or mistaken `main` change.
4. Option D alone is easy to get wrong without Preview regression tests.
5. Combined E is the safest **no-cost** path: protect `main` → gate/disable Production auto-deploy → add deploy guard → keep owner authorization phrases.

Until Option E is implemented, **Option A interim remains mandatory** (every `main` merge = Production-risk).

## Proposed implementation sequence (future milestones — not this one)

| Step | Milestone (proposed) | Action | Owner auth required |
|------|----------------------|--------|---------------------|
| 1 | CROW.GAP015.2 (or PROD-POLICY.2) | Apply Option B in Vercel UI (disable/gate Production auto-deploy); record screenshots/redacted evidence | Yes — settings |
| 2 | CROW.GAP015.3 | Enable GitHub `main` protection + required checks | Yes — repo rules |
| 3 | CROW.GAP015.4 | Design/implement Option D ignore/guard with Preview still green | Yes — code + settings |
| 4 | Acceptance | Update GAP-015 → Mitigated; keep Instant Promote separate forever | Yes |

Owner may reorder B vs C; **do not** Instant Promote `dpl_8xT92…` as part of GAP-015 mitigation.

## Owner authorization phrases (for later use)

Suggested explicit phrases:

- `AUTHORIZE: Vercel Production auto-deploy settings change (GAP-015 Option B)`
- `AUTHORIZE: GitHub main branch protection (GAP-015 Option C)`
- `AUTHORIZE: Production ignored-build / deploy guard (GAP-015 Option D)`
- `AUTHORIZE: Instant Promote <deployment-id>` (separate from GAP-015)

## Interim operating rules (active until mitigated)

1. No merge to `main` without owner acceptance of Production-target risk
2. No Instant Promote / public domain move without separate owner auth
3. No DB-affecting / hosted-persistence / Blueprint-generation merges to `main`
4. PR #10 stays archive/reference only
5. Verify live domain ID after any future authorized `main` merge

## Success criteria (when later implemented)

| Criterion | Pass |
|-----------|------|
| Push/merge to `main` does **not** auto-create Production-target **or** creates only when allow-marker present | Per chosen Option B/D design |
| Preview still builds for feature branches | Yes |
| Live domain unchanged unless Instant Promote authorized | Yes |
| Branch protection blocks direct push / requires checks | Yes |
| Docs and Issue #15 updated to Mitigated | Yes |
| GAP-004 / GAP-004A holds unchanged | Yes |

## Explicit non-claims

This plan does **not** claim:

- GAP-004 isolation is proven
- Live Production was updated
- Option E is already applied
- Owner acceptance of Instant Promote
