# PR #10 Archive and Slice Rule

| Field | Value |
|-------|-------|
| **Title** | FTGP PR #10 archive status and future slice extraction rules |
| **Status** | CANONICAL — **owner accepted** CROW.PR10.2 |
| **Authority** | Explicit owner decision 2026-07-18 |
| **Date** | 2026-07-18 |
| **PR** | [#10](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/10) |
| **Audit** | [`PR10-CONFLICT-AUDIT.md`](PR10-CONFLICT-AUDIT.md) |
| **Prior plan** | [`PR10-SAFE-RESOLUTION-PLAN.md`](PR10-SAFE-RESOLUTION-PLAN.md) |
| **Milestone** | [`../milestones/CROW-PR10-2.md`](../milestones/CROW-PR10-2.md) |

---

## Owner decision (accepted)

**ACCEPTED — Option D + B**

- PR #10 remains a **draft archive / reference**.
- PR #10 will **not** be merged as a single PR.
- Do **not** resolve PR #10 conflicts merely to enable a monolith merge.
- Future work ships as **smaller owner-authorized PRs** (slices).
- Discovery build does **not** depend on merging PR #10.
- Public/main reconciliation is already handled separately (PR #14 / RECON series).

---

## 1. PR #10 status

| Rule | Requirement |
|------|-------------|
| Role | Draft **archive / reference** for FTGP history on `feat/first-tenant-golden-path` |
| Merge vehicle | **Forbidden** — not a path to `main` or Production |
| Ready for review | Must stay **DRAFT**; do not mark ready for monolith merge |
| Conflicts | Leave unresolved unless a **slice extraction** explicitly needs a conflict-cleared working copy on a **new** branch |
| Production | No direct Production use; no Instant Promote of PR #10 tip |
| Close | Optional later after slices land and owner accepts archive-only role — **not required now** |

---

## 2. Slice rules

Every new PR extracted from FTGP or continuing related work must:

1. Be **small and scoped** (one domain / one milestone intent where possible).
2. Identify **source**: cherry-pick / port from PR #10 (`feat/first-tenant-golden-path`) **or** new work.
3. List **protected boundaries** (payment ≠ authority, SAREA ≠ permission, CroAI advisory, request ≠ tenant, no unauthorized migrations, etc.).
4. Pass **relevant tests** for that slice (record commands in the PR / milestone).
5. Include **documentation evidence** (milestone note and/or CURRENT-STATE / GAP updates).
6. **Exclude** unrelated runtime, schema, auth, migration, or hosted-write changes.
7. Require **explicit owner authorization** before opening against `main` while Production auto-target behavior exists (GAP-015 / Option C interim).
8. Treat runtime / schema / auth / hosted-data slices as needing **separate predictive readiness gates** (not bundled with docs or local-first UX).

### Slice PR checklist (DoR)

- [ ] Scope sentence (in / out)
- [ ] Source commits or “new work” statement
- [ ] Protected boundaries listed
- [ ] Test plan named
- [ ] Docs path named
- [ ] No migrations unless owner-approved for that PR
- [ ] No hosted business writes unless owner-approved
- [ ] No Production deploy in the same PR unless separately authorized

---

## 3. Slice categories

| Category | Examples | Typical risk |
|----------|----------|--------------|
| Public / docs / governance | Crow docs, policy, roadmap | Low |
| Request / ProCrow local-first | Qualification UX, status mapping already on feat | Medium |
| Discovery docs | Field architecture, MVP plans | Low |
| Discovery local-first implementation | D0–D2 build under Issue #18 | Medium |
| Tests | Authority / catalog / route tests without hosted writes | Low–Medium |
| Runtime / schema (later) | Tenant, Blueprint generate, model-forge, migrations | High–Critical |
| GAP-004 infrastructure | Preview DB isolation | Critical (ops) |
| GAP-015 production policy/settings | Vercel auto-deploy gate | High (ops) |

**Skip as a PR #10 extract:** Public product UI already on `main` via PR #14.

---

## 4. Merge rules

| Gate | Rule |
|------|------|
| `main` merge | Owner authorization required while auto Production-target deploy behavior exists |
| Production promotion | Separate from merge; Instant Promote only with explicit owner authorization |
| Migrations | Separate owner approval; prefer GAP-004 resolved first for hosted |
| Hosted business writes | Separate owner approval; never incidental to a docs or local-first slice |
| PR #10 monolith | Never merge |

---

## 5. First recommended slices

| Order | Slice | Notes |
|-------|-------|-------|
| 1 | **Discovery MVP D0–D2** local-first implementation | Uses plans on feat; **does not** merge PR #10 |
| 2 | **GAP-004** Preview DB isolation | Blocks hosted certify / migrations |
| 3 | **GAP-015** Vercel auto-deploy settings gate | Independent ops |
| 4 | Later **Blueprint boundary quarantine** | Stop Discovery Complete from implying Blueprint success |

Optional later: request/ProCrow deltas vs `main` if still missing on `main`; governance docs sync.

---

## GAP-018 tracking

Tracked in [`GAP-LEDGER.md`](../GAP-LEDGER.md) as **GAP-018**. No dedicated GitHub Issue yet — recommend creating one later (e.g. “CROW.PR10.1 — Execute FTGP split slices”) when owner wants board tracking. Do not create unless asked.

---

## Related

- Conflict inventory: [`PR10-CONFLICT-AUDIT.md`](PR10-CONFLICT-AUDIT.md)
- Pre-acceptance plan: [`PR10-SAFE-RESOLUTION-PLAN.md`](PR10-SAFE-RESOLUTION-PLAN.md)
- Deployment policy: [`../16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md)
