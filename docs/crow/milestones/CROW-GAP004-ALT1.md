# CROW.GAP004.ALT1 — No-Cost Preview DB-Disabled Safety Mode Plan

| Field | Value |
|-------|-------|
| **Status** | **Passed (plan package)** — implementation deferred |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `23070f6` (CROW.GAP004.3 tip) |
| **Final HEAD** | _(pinned after docs commit)_ |
| **Issue** | [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · **archive only** |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Owner authorization

**Adopt no-cost alternate mitigation: Preview DB-Disabled Safety Mode** (do not create a paid second Supabase project; do not pause development).

This milestone is **plan-only**. No runtime code, no migrations, no hosted writes, no Production deploy, no `main` push, no PR #10 merge.

## Purpose

Keep Vercel Preview usable for public/local-first UI while **failing closed** before any DB or hosted business mutation when Preview/Production isolation is unproven.

## Source documents

- [`../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md)  
- [`../gaps/GAP-004-DB-ISOLATION-PLAN.md`](../gaps/GAP-004-DB-ISOLATION-PLAN.md)  
- [`../gaps/GAP-004-ISOLATION-EVIDENCE.md`](../gaps/GAP-004-ISOLATION-EVIDENCE.md)  
- Existing: `scripts/lib/database-environment.ts`, `src/lib/db.ts`, Discovery local-first MVP  

## Current repository truth

- GAP-004 isolation **not proven** (shared historical ref `wbwnsndcxrgyqwppurms`)  
- Owner cost constraint: no paid Preview Supabase  
- `vercel.json` has no build-time migrate  
- Discovery D0–D6 local-first certified; hosted persistence still held  

## In scope (ALT1)

- [x] Record owner cost constraint  
- [x] Define GAP-004A alternate path  
- [x] Design helpers, route/Discovery behavior, evidence model  
- [x] Update GAP ledger / START-HERE / CURRENT-STATE / roadmap / GAP-004 plan  
- [x] Update Issue #16 (keep open)  

## Out of scope

- Implementing helpers / Prisma guards / UI  
- Creating Supabase projects  
- Migrations, hosted writes, Production changes  
- Closing GAP-004 as isolation proven  
- Enabling Discovery hosted persistence or Blueprint generation  

## Protected boundaries

Payment ≠ authority · SAREA ≠ authority · CroAI ≠ authority · Request ≠ tenant · Discovery ≠ authority · Verification ≠ membership  

## Deliverable

Canonical plan: [`../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md)

## Recommended next milestone

**CROW.GAP004.ALT2** — implement Preview DB-disabled helpers + Prisma fail-closed + unit tests (still no paid Preview DB).

## Final verdict

**READY — GAP-004A PREVIEW DB-DISABLED SAFETY MODE PLAN PREPARED**
