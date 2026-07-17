# CROW.REQUEST.1 — Client Request Intake MVP Audit and Delivery Plan

| Field | Value |
|-------|-------|
| **Status** | Complete — audit + plan only; no product implementation |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` @ `6ca6bc2` |
| **Issue** | [#17](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/17) |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Purpose

Audit current Client Request Intake against the Crow lifecycle and produce a hybrid delivery plan for the safest MVP — **without** implementing product code.

## Constraints honored

- No product code changes
- No Production deploy / Instant Promote
- No PR #10 merge or modification
- No `main` push
- No migrations / hosted business-data writes
- No auth or authorization behavior changes
- No Request persistence changes
- No tenant runtime changes

## Deliverables

| Artifact | Path |
|----------|------|
| Audit | [`docs/crow/request/REQUEST-INTAKE-AUDIT.md`](../request/REQUEST-INTAKE-AUDIT.md) |
| MVP plan | [`docs/crow/request/REQUEST-INTAKE-MVP-PLAN.md`](../request/REQUEST-INTAKE-MVP-PLAN.md) |
| This milestone | `docs/crow/milestones/CROW-REQUEST-1.md` |

## Audit summary

| Area | Finding |
|------|---------|
| Routes | Public `/request` + journey pages exist; authenticated wizard at `/client/requests/new`; legacy public submit disabled |
| Data model | `ImplementationRequest` + brief JSON; org context kinds present; JourneyKind not on brief (GAP-008) |
| Auth/verification | C3 legal + email strong; phone **deferred by default** vs constitution |
| Lifecycle | Browse → C3 → wizard → `PENDING_REVIEW`; client-side draft only |
| ProCrow handoff | Admin queue + derived operator queue; Discovery start from `PENDING_REVIEW` |
| Unsafe | Hosted writes/migrations while GAP-004 open |

## Recommended MVP

Close JourneyKind persistence, verification policy alignment, qualification UX clarity, and authority tests — building on existing wizard — **stop before** Discovery/tenant/payment/Blueprint.

Phases: **R0 safety → R1 model design → R2 UX → R3 gates → R4 queue → R5 Discovery handoff**.

## Delivery model

Hybrid: predictive (schema/auth/legal/audit/hosted safety) · adaptive (form/queue UX) · iterative (screens) · kanban (bugs).

## GAP status at completion

| Gap | Status |
|-----|--------|
| GAP-004 | Open / blocked — Issue #16 |
| GAP-008 | Open — addressed in plan Phase R1/R2 |
| GAP-012 | Mitigated |
| GAP-015 | Open — Issue #15 |
| GAP-013 | Mitigated (PM system) |

## Issue #17

Updated with audit summary, phases, doc links, and owner decisions. Left **OPEN** (planning complete; implementation not started).

## Owner decisions required

See plan § Owner decisions (phone policy, GAP-004 sequencing, status vocabulary, drafts, authorize CROW.REQUEST.2, PR #10 hold).

## Recommended next

Owner accepts plan → **CROW.REQUEST.2** (local-first implementation) **or** Preview DB isolation (#16) first if required.

## Final verdict

**READY — CLIENT REQUEST INTAKE MVP AUDIT AND DELIVERY PLAN PREPARED**
