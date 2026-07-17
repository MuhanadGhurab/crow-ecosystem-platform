# Crow GitHub Projects Setup Plan

| Field | Value |
|-------|-------|
| **Title** | GitHub Projects Setup Plan |
| **Status** | CANONICAL · **EXECUTED in CROW.PM.2** |
| **Authority** | Owner direction — CROW.PM.1; executed under CROW.PM.2 |
| **Last reviewed** | 2026-07-18 (CROW.PM.2) |
| **Related** | [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](12-PROJECT-MANAGEMENT-OPERATING-MODEL.md), [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md), [`milestones/CROW-PM-2.md`](milestones/CROW-PM-2.md) |

## Execution record (CROW.PM.2)

| Item | Actual |
|------|--------|
| Project name | **Crow Ecosystem Delivery OS** (owner preferred name; plan had suggested “Crow Delivery Control”) |
| Project URL | https://github.com/users/MuhanadGhurab/projects/2 |
| Visibility | Private |
| Linked repo | `MuhanadGhurab/crow-ecosystem-platform` |
| Labels | Crow taxonomy created (see CROW.PM.2) |
| Milestones | Phase 0–12 created (ASCII hyphen titles) |
| Seed Issues | #15–#24 |
| Custom fields | Stream, Delivery Model, Phase, Priority, Risk Level, Owner Decision Required, Acceptance State, Evidence Link, Production Impact, Migration Impact, Hosted Data Impact |
| Views | **Not created via CLI** — `gh project` has no view-create; create manually in UI |

## Suggested views (create in UI)

| View | Purpose | Primary columns / layout |
|------|---------|---------------------------|
| **Roadmap by Phase** | Phase 0–12 sequencing | Group by Phase field |
| **Adaptive Sprint Board** | 2-week adaptive delivery | Todo → In Progress → Certify → Done |
| **Predictive Gate Checklist** | Stage-gate packages | Gate Not Started → In Gate → Blocked → Gate Passed |
| **Risk and Blockers** | GAP-004, GAP-015, auth, migration | Filter Risk Level ≥ High or status:blocked |
| **Portfolio Proof** | Stream O packaging | Kanban: Idea → Draft → Review → Published |
| **Production Readiness** | Deploy safety | Checklist against Production Impact / Migration Impact |
| **Owner Decisions** | Items needing owner | Filter Owner Decision Required = Yes |

## Board workflow rules

1. **No card enters Adaptive Sprint** without Definition of Ready.
2. **Predictive items** never skip Gate Checklist view.
3. **Production Impact ≠ None** requires Owner Decision or separate PROD milestone.
4. **Migration Impact ≠ None** requires controlled-migration workflow reference.
5. **status:accepted** only after owner review of evidence — Cursor report ≠ acceptance.
6. **PR #10** remains a special tracked risk item — not a casual merge card.

## Related documents

- [`milestones/CROW-PM-2.md`](milestones/CROW-PM-2.md)
- [`milestones/CROW-PM-1.md`](milestones/CROW-PM-1.md)
- [`13-PRODUCT-ROADMAP.md`](13-PRODUCT-ROADMAP.md)
- [`16-PRODUCTION-DEPLOYMENT-POLICY.md`](16-PRODUCTION-DEPLOYMENT-POLICY.md)
