# Crow GitHub Projects Setup Plan

| Field | Value |
|-------|-------|
| **Title** | GitHub Projects Setup Plan |
| **Status** | CANONICAL · **NOT EXECUTED** |
| **Authority** | Owner direction — CROW.PM.1; execution requires CROW.PM.2 |
| **Last reviewed** | 2026-07-17 (CROW.PM.1) |
| **Related** | [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](12-PROJECT-MANAGEMENT-OPERATING-MODEL.md), [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md) |

## Constraints

This document is a **design only**.

Until the owner explicitly authorizes **CROW.PM.2**:

- Do **not** create GitHub Projects
- Do **not** create or rename labels
- Do **not** create milestones on GitHub
- Do **not** create or close Issues as backlog population
- Do **not** change repository visibility

## Recommended project

| Field | Recommendation |
|-------|----------------|
| **Name** | Crow Delivery Control |
| **Owner** | `MuhanadGhurab` (user) or `crow-ecosystem-platform` repo |
| **Visibility** | Private if sensitive planning; Public only if demo-safe |
| **Linked repo** | `MuhanadGhurab/crow-ecosystem-platform` (primary) |
| **Optional linked** | Portfolio repos for Stream O only — never private source repos |

## Suggested views

| View | Purpose | Primary columns / layout |
|------|---------|---------------------------|
| **Roadmap by Phase** | Phase 0–12 sequencing | Group by Phase field |
| **Adaptive Sprint Board** | 2-week adaptive delivery | Todo → In Progress → Certify → Done |
| **Predictive Gate Checklist** | Stage-gate packages | Gate Not Started → In Gate → Blocked → Gate Passed |
| **Risk and Blockers** | GAP-004, GAP-012, auth, migration | Filter Risk Level ≥ High or status:blocked |
| **Portfolio Proof** | Stream O packaging | Kanban: Idea → Draft → Review → Published |
| **Production Readiness** | Deploy safety | Checklist against Production Impact / Migration Impact |
| **Owner Decisions** | Items needing owner | Filter Owner Decision Required = Yes |

## Suggested custom fields

| Field | Type | Notes |
|-------|------|-------|
| Stream | Single select | A–O or short names matching labels |
| Delivery Model | Single select | adaptive / predictive / iterative / kanban / spike |
| Phase | Number or single select | 0–12 |
| Priority | Single select | P0–P3 |
| Risk Level | Single select | Low / Medium / High / Critical |
| Owner Decision Required | Yes/No | Blocks Ready if Yes and unanswered |
| Acceptance State | Single select | Draft / Ready / Certifying / Accepted / Rejected |
| Evidence Link | URL / text | Milestone doc, certification URL, commit |
| Production Impact | Single select | None / UI-only / Behavior / Auth / Data |
| Migration Impact | Single select | None / Local-only / Hosted-requires-auth |
| Hosted Data Impact | Single select | None / Read / Write-requires-auth |

## Suggested GitHub milestones (document only)

Create only after CROW.PM.2:

| Milestone | Maps to |
|-----------|---------|
| `CROW.PUBLIC.RECON` | Phase 0 reconciliation execution |
| `CROW.PM.2` | Projects/labels bootstrap |
| `CROW.REQUEST.1` | Phase 2 |
| `CROW.DISCOVERY.1` | Phase 3 |
| `CROW.PROCROW.1` | Phase 5 early |
| `CROW.CEM.1` | Phase 6 |
| `CROW.GAP004` | Infra isolation |
| `CROW.BLUEPRINT.1` | Phase 4 |

## Board workflow rules

1. **No card enters Adaptive Sprint** without Definition of Ready.
2. **Predictive items** never skip Gate Checklist view.
3. **Production Impact ≠ None** requires Owner Decision or separate PROD milestone.
4. **Migration Impact ≠ None** requires controlled-migration workflow reference.
5. **status:accepted** only after owner review of evidence — Cursor report ≠ acceptance.
6. **PR #10** remains a special tracked risk item — not a casual merge card.

## Seed backlog (proposal only — do not create Issues yet)

| Title | Stream | Delivery | Priority |
|-------|--------|----------|----------|
| Public-only main reconciliation execution | public | predictive | P0 |
| Approve and apply GitHub labels/Projects | governance | predictive | P0 |
| Client Request Intake MVP plan | client | adaptive | P1 |
| Discovery + Operating Model MVP design | discovery | adaptive | P1 |
| ProCrow qualification queue MVP | procrow | adaptive | P1 |
| CEM runtime MVP architecture | cem | adaptive | P1 |
| GAP-004 Preview DB isolation | infra | predictive | P0 |
| Portfolio proof packaging Kanban | portfolio | kanban | P2 |

## Owner authorization checklist for CROW.PM.2

- [ ] Approve project name and visibility
- [ ] Approve label set in [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md)
- [ ] Approve custom fields above
- [ ] Approve which seed Issues may be created
- [ ] Confirm private repos remain unpublished
- [ ] Confirm no Production/migration side effects from board setup

## Related documents

- [`milestones/CROW-PM-1.md`](milestones/CROW-PM-1.md)
- [`13-PRODUCT-ROADMAP.md`](13-PRODUCT-ROADMAP.md)
