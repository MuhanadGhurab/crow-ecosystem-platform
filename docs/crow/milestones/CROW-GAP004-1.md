# CROW.GAP004.1 — Preview/Production Database Isolation Audit and Decision Plan

| Field | Value |
|-------|-------|
| **Status** | Complete — audit + decision plan prepared (execution not authorized) |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `a210013` (CROW.DISCOVERY.MVP-CERT.1 tip) |
| **Final HEAD** | _(pinned after docs commit)_ |
| **Issue** | [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · **archive only** |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Owner authorization

**CROW.GAP004.1 — GAP-004 audit and decision plan only.**

No database settings changes, no hosted env edits, no migrations, no hosted business writes, no Production deploy, no `main` push, no PR #10 merge, no Discovery hosted persistence, no Blueprint generation.

## Deliverables

| Doc | Path |
|-----|------|
| Audit | [`docs/crow/gaps/GAP-004-DB-ISOLATION-AUDIT.md`](../gaps/GAP-004-DB-ISOLATION-AUDIT.md) |
| Plan | [`docs/crow/gaps/GAP-004-DB-ISOLATION-PLAN.md`](../gaps/GAP-004-DB-ISOLATION-PLAN.md) |
| This milestone | `docs/crow/milestones/CROW-GAP004-1.md` |

## Audit summary

| Topic | Result |
|-------|--------|
| Vercel project | `crow-ecosystem-platform` on team `muhanadghurabs-projects` |
| Build migrate | **Not** in `vercel.json` (generate + build only) |
| Isolation proven? | **No** — historical C2.1 evidence: shared Supabase ref `wbwnsndcxrgyqwppurms` |
| Residual risk | Preview runtime / operator scripts can still write Production data while shared |
| Engineering controls | Fingerprint + phrase-gated controlled migration; shared-backend acknowledgment path |

## Required owner decisions (next)

1. Provision dedicated Preview Supabase  
2. Bind Vercel Preview env to Preview DB  
3. End shared Preview→Production as normal mode  
4. Authorize Preview controlled migrate only after isolation proof  
5. Keep Discovery hosted persistence and Blueprint generation blocked until GAP-004 mitigated  

## Parallel recommendation

Proceed with **GAP-015** planning after or alongside owner decision on GAP-004 provisioning — release-plane safety is complementary, not a substitute for data-plane isolation.

## Holds honored

- No migrations · no hosted writes · no Vercel settings changes · no Production · no `main` · PR #10 archive  

## GAP status after this milestone

| Gap | Status |
|-----|--------|
| GAP-004 | **Open / blocked** — audit+plan ready; isolation not implemented |
| GAP-015 | Open |
| GAP-017 | Partial (Discovery local-first; hosted still blocked by GAP-004) |

## Final verdict

**READY — GAP-004 DATABASE ISOLATION AUDIT AND DECISION PLAN PREPARED**
