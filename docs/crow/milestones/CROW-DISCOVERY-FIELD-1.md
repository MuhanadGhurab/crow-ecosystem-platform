# CROW.DISCOVERY.FIELD.1 — Enterprise Discovery Field Architecture and Adaptive Intake Model

| Field | Value |
|-------|-------|
| **Status** | Complete — architecture and adaptive intake model prepared (docs-only) |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Prior** | CROW.PROCROW.1A @ `e8f1160` |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Owner direction applied

Design Crow’s adaptive enterprise discovery field system **before** Discovery UI implementation — so Crow can serve many organization types without a tiny fixed form or a mega-form.

## What was audited

| Area | Finding |
|------|---------|
| Request brief | Journey + org context + field/purpose/scale present; still thin vs enterprise Discovery |
| Public journeys | Marketing narratives only |
| Operator + client Discovery | Dual paths; sparse wired fields; FTGP catalog richer than UI |
| Catalogs | ~100 business fields, purposes, sector templates exist |
| Blueprint mapping | Advisory only — no enforced field→section matrix |

## Deliverables

| Doc | Content |
|-----|---------|
| [`discovery/DISCOVERY-FIELD-ARCHITECTURE.md`](../discovery/DISCOVERY-FIELD-ARCHITECTURE.md) | 10 layers, principles, persistence strategy |
| [`discovery/DISCOVERY-FIELD-TAXONOMY.md`](../discovery/DISCOVERY-FIELD-TAXONOMY.md) | Categories, example fields, MVP/Later/Deferred |
| [`discovery/DISCOVERY-QUESTION-MODEL.md`](../discovery/DISCOVERY-QUESTION-MODEL.md) | Field types + question metadata schema |
| [`discovery/DISCOVERY-ADAPTIVE-INTAKE-MODEL.md`](../discovery/DISCOVERY-ADAPTIVE-INTAKE-MODEL.md) | Stages 1–7, outputs, ProCrow review, tests plan |
| [`discovery/DISCOVERY-MVP-PLAN.md`](../discovery/DISCOVERY-MVP-PLAN.md) | Seed plan pointing to CROW.DISCOVERY.1 |

## Explicitly not done

- Discovery UI implementation  
- Migrations / DB enums  
- Hosted writes / Production deploy / main push / PR #10 merge  
- Auth changes · tenant · Blueprint · payment · CroAI  

## GAP updates

| Gap | Status |
|-----|--------|
| GAP-004 | Open / blocked |
| GAP-015 | Open |
| GAP-016 | Mitigated (local + origin-baselined) |
| GAP-017 | Open — Discovery field architecture prepared; dual-path consolidation + MVP build pending |

## Owner decisions still required

1. Approve MVP field groups for CROW.DISCOVERY.1  
2. Confirm one logical question catalog across client + operator  
3. Confirm evidence MVP = text/URL references only  
4. Confirm industry packs after general MVP  
5. No schema migration until GAP-004  

## Recommended next

**CROW.DISCOVERY.1** — Discovery + Operating Model MVP design/build plan using this architecture.

## Final verdict

**READY — DISCOVERY FIELD ARCHITECTURE AND ADAPTIVE INTAKE MODEL PREPARED**
