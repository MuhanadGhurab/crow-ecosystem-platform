# CROW.PM.2 — GitHub Projects, Labels, and Seed Backlog Setup

| Field | Value |
|-------|-------|
| **Status** | Complete — GitHub planning system created; no product/code/deploy changes |
| **Date** | 2026-07-18 |
| **Docs branch** | `feat/first-tenant-golden-path` |
| **Project** | [Crow Ecosystem Delivery OS](https://github.com/users/MuhanadGhurab/projects/2) (private · #2) |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |

## Purpose

Execute the CROW.PM.1 / CROW.PM.1A project-management design: labels, Phase milestones, GitHub Project board, and a controlled seed backlog.

## Constraints honored

- No product code changes
- No Production deploy
- No PR #10 merge/modify
- No `main` push
- No migrations / hosted writes
- No Vercel settings changes
- No feature branches for product work
- No Request/Discovery/Blueprint/CEM/runtime implementation

## Pre-setup verification

| Item | Result |
|------|--------|
| Path | `D:/CYBERCROW` |
| Branch / HEAD | `feat/first-tenant-golden-path` @ `4236d6a` (before docs commit) |
| `gh auth` | `MuhanadGhurab` · scopes include `repo`, `project` |
| Labels before | Default GitHub labels only |
| Milestones before | None |
| Projects before | Portfolio project #1 only (unrelated) |
| Open Issues before | None |
| Open PRs | #10 DRAFT, #2 DRAFT |
| Production | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| `main` | `e8cb812` |

## Labels created/updated

Crow taxonomy labels created with `--force` (39 Crow labels + defaults retained):

- Type: `type:feature|bug|docs|security|infra|ux|research|governance`
- Stream: `stream:public|client|discovery|blueprint|procrow|cem|cybercrow|sarea|croai|commercial|portfolio`
- Delivery: `delivery:adaptive|predictive|iterative|kanban|spike`
- Priority: `priority:p0|p1|p2|p3`
- Status: `status:ready|blocked|needs-owner|certification|accepted`
- Risk: `risk:security|data|auth|migration|production|privacy`

## Milestones created

GitHub milestones #1–#13 (ASCII hyphen titles for API safety):

1. Phase 0 - Stabilize Production and Main  
2. Phase 1 - Project Management System  
3. Phase 2 - Request and Client Intake MVP  
4. Phase 3 - Discovery and Operating Model MVP  
5. Phase 4 - Enterprise Blueprint MVP  
6. Phase 5 - ProCrow Control Tower MVP  
7. Phase 6 - CEM Enterprise Manager MVP  
8. Phase 7 - CyberCrow Trust and Governance MVP  
9. Phase 8 - Commercial and Subscription Layer  
10. Phase 9 - SAREA Experience Layer  
11. Phase 10 - CroAI Advisory Layer  
12. Phase 11 - Integrations and Saudi Enterprise Services  
13. Phase 12 - Portfolio and Case Study Packaging  

No due dates set (no fake commitments).

## GitHub Project

| Field | Value |
|-------|-------|
| Name | Crow Ecosystem Delivery OS |
| URL | https://github.com/users/MuhanadGhurab/projects/2 |
| Visibility | Private |
| Linked repo | `MuhanadGhurab/crow-ecosystem-platform` |
| Custom fields | Stream, Delivery Model, Phase, Priority, Risk Level, Owner Decision Required, Acceptance State, Evidence Link, Production Impact, Migration Impact, Hosted Data Impact |

### Views limitation

`gh project` has **no view-create command**. Suggested views must be created manually in the Project UI:

- Roadmap by Phase  
- Adaptive Sprint Board  
- Predictive Gate Checklist  
- Risk and Blockers  
- Portfolio Proof  
- Production Readiness  
- Owner Decisions  

## Seed Issues (#15–#24)

| # | Title | URL |
|---|-------|-----|
| 15 | CROW.PUBLIC.RECON — Decide whether to disable/gate main Production auto-deploys | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15 |
| 16 | GAP-004 — Provision isolated Preview database | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16 |
| 17 | CROW.REQUEST.1 — Client Request Intake MVP audit and delivery plan | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/17 |
| 18 | CROW.DISCOVERY.1 — Discovery and Operating Model MVP design | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18 |
| 19 | CROW.PROCROW.1 — ProCrow qualification and review queue MVP | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/19 |
| 20 | CROW.CEM.1 — Enterprise Manager runtime MVP architecture | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/20 |
| 21 | CROW.BLUEPRINT.1 — Enterprise Blueprint MVP design | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/21 |
| 22 | CROW.CYBERCROW.1 — Trust, audit, and tenant isolation evidence MVP | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/22 |
| 23 | CROW.COMMERCIAL.1 — Provider-neutral commercial/payment model audit | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/23 |
| 24 | CROW.PORTFOLIO.1 — Public proof and case-study packaging plan | https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/24 |

All seed Issues added to Project #2. Bodies include purpose, current state, delivery model, priority, risks, dependencies, acceptance criteria, protected boundaries, docs links, and owner-decision notes. Planning-only — no implementation started.

## GAP status

| Gap | Status |
|-----|--------|
| GAP-004 | Open / blocked (#16 tracks) |
| GAP-012 | Mitigated |
| GAP-013 | Mitigated — labels/Project/Issues created; views residual |
| GAP-015 | Open (#15 tracks) |

## Owner decisions required

1. Create suggested Project views in UI  
2. Decide Option B vs Option C for Production auto-deploy (#15)  
3. Authorize Preview DB provisioning (#16) when ready  
4. Approve which seed plan Issues may enter implementation next  

## Recommended next

Owner triage of #15/#16 · create Project views · then CROW.REQUEST.1 planning work (#17) or CROW.PROD-POLICY.2 settings if authorized.

## Final verdict

**READY — GITHUB PROJECT MANAGEMENT SYSTEM CREATED AND SEED BACKLOG BASELINED**
