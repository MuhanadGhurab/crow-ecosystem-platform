# CROW.DISCOVERY.1 — Discovery and Operating Model MVP Audit, Design, and Build Plan

| Field | Value |
|-------|-------|
| **Status** | Complete — audit + build plan prepared (no product code) |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Prior** | CROW.DISCOVERY.FIELD.1A @ `1f580aa` (closeout) · architecture @ `e90fcda` |
| **Starting HEAD** | `1f580aa` |
| **Final HEAD** | `9162839` |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Owner decisions applied

1. Begin CROW.DISCOVERY.1 as **audit, design, and build plan only**
2. Do not implement Discovery product code yet
3. No Production deploy · no `main` push · no PR #10 merge
4. No migrations · no hosted business writes · no seed hosted data
5. No tenant membership · platform roles · tenant provision · Blueprint · CroAI · payment
6. No auth/authorization behavior changes · no schema · no DB enums

## Deliverables

| Doc | Path |
|-----|------|
| Audit | [`discovery/DISCOVERY-AUDIT.md`](../discovery/DISCOVERY-AUDIT.md) |
| Discovery MVP plan | [`discovery/DISCOVERY-MVP-PLAN.md`](../discovery/DISCOVERY-MVP-PLAN.md) |
| Operating Model plan | [`discovery/OPERATING-MODEL-MVP-PLAN.md`](../discovery/OPERATING-MODEL-MVP-PLAN.md) |
| Field architecture (prior) | [`discovery/DISCOVERY-FIELD-ARCHITECTURE.md`](../discovery/DISCOVERY-FIELD-ARCHITECTURE.md) |

## Audit findings (compressed)

1. **Three Discovery surfaces** — operator `/discovery/*`, client wizard, client enterprise design — share `DiscoveryProfile` with fragmented keys
2. **Handoff gated** — `qualified_for_discovery` + `adminStartDiscovery` / FTGP transition
3. **FTGP catalog** richer than wired UI; adaptive stages 1–7 mostly design-only
4. **Blueprint Complete** still creates DRAFT blueprint — must stay out of Discovery MVP success
5. **Client may create profile before UNDER_DISCOVERY** — lifecycle risk, not authority grant
6. **GAP-017** open — architecture ready; MVP build pending

## Phases (plan)

| Phase | Name |
|-------|------|
| D0 | Discovery safety baseline |
| D1 | Discovery data model design (no migration yet) |
| D2 | Discovery workspace UX |
| D3 | Adaptive field implementation |
| D4 | Operating Model capture |
| D5 | ProCrow review (ready for modeling) |
| D6 | Blueprint handoff boundary (no auto-build) |

## Constraints honored

- UNAUTHORIZED_MIGRATION_COUNT=0
- HOSTED_BUSINESS_WRITE_COUNT=0
- No Production / main / PR #10 changes
- Issue #18 updated, **not closed**

## GAP status

| Gap | Status |
|-----|--------|
| GAP-004 | Open / blocked |
| GAP-015 | Open |
| GAP-017 | Open — audit+plan complete; build pending |

## Recommended next

Owner approves plan → local-first **build** phases D0–D2 (or named CROW.DISCOVERY.1B) under Issue #18 · or triage GAP-004 / GAP-015.

## Final verdict

**READY — DISCOVERY AND OPERATING MODEL MVP AUDIT AND BUILD PLAN PREPARED**
