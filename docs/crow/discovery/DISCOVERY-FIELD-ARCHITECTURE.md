# Discovery Field Architecture

| Field | Value |
|-------|-------|
| **Title** | Crow adaptive enterprise discovery field architecture |
| **Status** | CANONICAL design — CROW.DISCOVERY.FIELD.1 |
| **Authority** | Owner direction to prepare field system before Discovery MVP build |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` @ `e8f1160` (start) |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Related** | [`DISCOVERY-FIELD-TAXONOMY.md`](DISCOVERY-FIELD-TAXONOMY.md) · [`DISCOVERY-QUESTION-MODEL.md`](DISCOVERY-QUESTION-MODEL.md) · [`DISCOVERY-ADAPTIVE-INTAKE-MODEL.md`](DISCOVERY-ADAPTIVE-INTAKE-MODEL.md) · [`milestones/CROW-DISCOVERY-FIELD-1.md`](../milestones/CROW-DISCOVERY-FIELD-1.md) |

## Purpose

Prepare Crow to discover **many enterprise shapes** without:

- a tiny fixed 5–6 field form, or
- a giant static mega-form, or
- premature migrations / authority grants.

This document defines the **layered field architecture**. Companion docs define taxonomy, question metadata, and adaptive stages.

## Non-claims (authority safety)

Discovery fields **never**:

- create tenant membership or platform roles
- provision a tenant
- generate or approve an Enterprise Blueprint
- require or create payment / subscription
- grant ProCrow or CyberCrow authority
- activate CroAI autonomous actions

Fields produce **structured intent and evidence candidates** for human ProCrow review.

## Current-state audit (verified)

| Surface | Reality today |
|---------|----------------|
| Request Intake wizard | ~6 steps; brief JSON in `ImplementationRequest.notes`; `journeyKind` + `organizationContext` present |
| Public `/new-organization`, `/transform-existing` | Marketing narratives only — not structured fields |
| Operator `/discovery/*` | Partial shell; free-form structure entities + sparse answers |
| Client discovery wizard | Module/template-oriented path parallel to operator shell |
| FTGP catalog | ~37 question keys defined; richer than wired UI |
| Business field catalog | ~100 sector/field keys for intake search |
| Blueprint mapping | Advisory / informational — no enforced field→section matrix |

**Problem:** Crow already has **catalog richness** and **marketing journey richness**, but **intake/discovery UX and persistence** are fragmented and too thin for enterprise-scale Discovery.

## Design goal

One **adaptive field system** that:

1. Starts from Request Intake context (journey, org context, industry/field, scale)
2. Expands through Discovery stages with progressive disclosure
3. Produces Blueprint-ready structured outputs
4. Stays migration-safe until GAP-004 / owner-authorized schema work
5. Remains human-reviewable by ProCrow

## Ten layers

| Layer | Name | Role |
|-------|------|------|
| L1 | Universal Core | Always needed for any enterprise |
| L2 | Journey | Build New vs Transform Existing |
| L3 | Organization Context | New business / division / existing / modernization |
| L4 | Operating Model | People, responsibilities, workflows, decisions, systems, locations, capabilities |
| L5 | Trust / Security / Compliance | Identity, authorization, sensitivity, audit, regs, SoD |
| L6 | Commercial / Service | Products, customers, revenue, delivery, SLA, support |
| L7 | Industry Extension | Packs per industry (later) |
| L8 | Transformation | Current state, pain, legacy, migration, change readiness |
| L9 | Evidence | Docs, org charts, inventories, policies (references first) |
| L10 | Blueprint-Ready | Explicit map into Blueprint domains/sections |

See taxonomy doc for categories and example fields per layer.

## Architectural principles

1. **Progressive disclosure** — never show all fields at once  
2. **Adaptive questioning** — visibility depends on journey, org context, industry, prior answers  
3. **Schema-ready, migration-safe** — design future schema; persist MVP in notes/JSON answers until authorized  
4. **Human-reviewable** — ProCrow summaries, missing-info flags, contradictions  
5. **Blueprint-ready** — every MVP field declares `blueprintSection` mapping  
6. **Authority-safe** — fields are data, not grants  
7. **Evidence-aware** — optional evidence refs without requiring uploads in MVP  
8. **Extensible** — industry packs add keys without rewriting stages  
9. **Client-friendly** — plain language labels and helpers  
10. **Operator-friendly** — structured ProCrow review model  

## Persistence strategy (no migration now)

| Horizon | Approach |
|---------|----------|
| **Now (design)** | Canonical field keys + question metadata in docs (and later code catalogs) |
| **MVP build (future milestone)** | Prefer `DiscoveryAnswer(sectionKey, questionKey, valueJson)` + brief notes overlays; reuse FTGP catalog patterns |
| **Later** | Normalized tables only with owner-authorized migrations after GAP-004 isolation |

Do **not** add Prisma enums or migrations in this milestone.

## Dual-path consolidation rule

Today Crow has operator Discovery and client-led Discovery. Field architecture treats them as **one question model, two presentation surfaces**:

- Client answers subset of L1–L4 (+ L8 if Transform)
- ProCrow / implementer can deepen L4–L6, L5, L9
- Both write the same logical field keys

Consolidation of UX is deferred to CROW.DISCOVERY.1 / later build milestones.

## Relationship to Request Intake

Request Intake remains **qualification-thin**:

- journey, org context, business field/purpose, scale, goal, acknowledgements
- ProCrow qualification outcome

Discovery is where the **operating model depth** begins — after `qualified_for_discovery`.

## Downstream consumers

| Consumer | Use of fields |
|----------|----------------|
| ProCrow | Review, missing info, readiness for Discovery completion |
| Enterprise Blueprint | Draft sections from mapped fields (after approval workflow — not auto) |
| CEM / Enterprise Manager | Runtime structure candidates (later) |
| CyberCrow | Trust profile inputs (later) |
| SAREA | Experience / persona presentation inputs (later) |
| CroAI | Advisory explanations only — never authority (later) |

## Owner decisions still required

1. Confirm MVP field set vs later packs (proposed in taxonomy)  
2. Confirm single logical question catalog across client + operator surfaces  
3. Confirm evidence MVP = references/notes only (no new upload pipeline)  
4. Confirm industry packs start after general MVP (recommended)  
5. Confirm no schema migration until GAP-004 resolved  

## Next milestone

**CROW.DISCOVERY.1** — Discovery + Operating Model MVP design/build plan using this field architecture (still no unauthorized migration/hosted writes).
