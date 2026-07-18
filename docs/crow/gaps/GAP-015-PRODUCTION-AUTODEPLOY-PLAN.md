# GAP-015 — Production Auto-Deploy Control Plan

| Field | Value |
|-------|-------|
| **Status** | Option E largely live — Ignored Build Step + guard on `main` + GitHub protection (GAP015.3–6); authorized deploy procedure pending |
| **Date** | 2026-07-18 |
| **Audit** | [`GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md`](GAP-015-PRODUCTION-AUTODEPLOY-AUDIT.md) |
| **Guard** | [`GAP-015-PRODUCTION-DEPLOY-GUARD.md`](GAP-015-PRODUCTION-DEPLOY-GUARD.md) |
| **Milestone** | [`../milestones/CROW-GAP015-6.md`](../milestones/CROW-GAP015-6.md) |
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
| Process | Retain owner phrases for Instant Promote and intentional Production windows |
| GitHub | **Option C applied** (CROW.GAP015.6) — require PR + `verify` / `production-gate` / `postgres-smoke` |
| Vercel | Optional Option B when owner confirms |
| Guard | Ignored Build Step + script **on `main`**; unauthorized skip **proven** (GAP015.3–5) |
| Authority | Explicit owner phrase for any Production-target, Instant Promote, or settings change |

| Aspect | Detail |
|--------|--------|
| Cost | No paid Vercel features required for the core path |
| Pros | Defense in depth; addresses both Git movement and Vercel auto-create |
| Cons | Multi-step; needs sequenced owner-authorized milestones |
| Implement now? | Guard + Ignored Build Step + guard-on-main + GitHub protection **done**; authorized deploy procedure pending |

## Recommendation

**Recommend Option E (combined) — largely live.**

Rationale:

1. Audit showed Production-target auto-create from `main` and unprotected `main` (addressed).
2. Option B alone is ideal for Vercel but needs owner UI confirmation and does not fix unprotected merges.
3. Option C alone does not stop Vercel after a legitimate or mistaken `main` change — deploy guard covers that.
4. Option D alone is easy to get wrong without Preview regression tests — **guard package certified and Ignored Build Step wired**.
5. Combined E is the safest **no-cost** path: protect `main` → wire deploy guard → keep owner authorization phrases.

**Remaining GAP-015 work:** formal authorized Production deploy operator procedure (CROW.GAP015.7).

## Owner authorization phrases (for later use)

Suggested explicit phrases:

- `AUTHORIZE: Formal Production deploy procedure (GAP-015.7)`
- `AUTHORIZE: Vercel Production auto-deploy settings change (GAP-015 Option B)`
- `AUTHORIZE: Instant Promote <deployment-id>` (separate from GAP-015)

## Implementation sequence

| Step | Milestone | Action | Status |
|------|-----------|--------|--------|
| 0 | CROW.GAP015.1 | Audit + plan | **Done** |
| 1 | CROW.GAP015.2 | Guard script + tests + Vercel/GitHub checklists | **Done** |
| 2 | CROW.GAP015.3 | Apply Vercel Ignored Build Step | **Done** |
| 3 | CROW.GAP015.4–5 | Bring guard script to `main`; prove unauthorized Production skip | **Done** |
| 4 | CROW.GAP015.6 | Enable GitHub `main` protection + required checks | **Done** |
| 5 | CROW.GAP015.7 | Formal authorized Production deploy procedure | Pending owner auth |
| 6 | Optional | Option B disable auto Production if still needed after guard | Pending owner auth |
| 7 | Acceptance | Update GAP-015 → Mitigated when procedure accepted; Instant Promote remains separate | Pending |

Owner may still authorize Option B separately; **do not** Instant Promote `dpl_8xT92…` as part of GAP-015 mitigation.

## Interim operating rules (active until fully mitigated)

1. No merge to `main` without owner acceptance of Production-target risk
2. No Instant Promote / public domain move without separate owner auth
3. No DB-affecting / hosted-persistence / Blueprint-generation merges to `main`
4. PR #10 stays archive/reference only
5. Verify live domain ID after any future authorized `main` merge
6. Ignored Build Step is configured; **effective Production skip requires the guard script on the deployed commit** (present on FTGP; **absent on current `main`**)
7. After script is on `main` (or fail-closed wrapper): unauthorized Production builds should be skipped; authorized builds require exact SHA + reason + flag, then clear auth vars

## Success criteria (when later configured)

| Criterion | Pass |
|-----------|------|
| Unauthorized Production build skipped by Ignored Build Step | Yes |
| Preview still builds for feature branches | Yes |
| Live domain unchanged unless Instant Promote authorized | Yes |
| Branch protection blocks direct push / requires checks | Yes |
| Docs and Issue #15 updated to Mitigated | Yes |
| GAP-004 / GAP-004A holds unchanged | Yes |

## Explicit non-claims

This plan does **not** claim:

- GAP-004 isolation is proven
- Live Production was updated
- Guard script is present on `main` (residual open)
- GitHub branch protection is already applied
- Owner acceptance of Instant Promote
- GAP-015 is fully mitigated
