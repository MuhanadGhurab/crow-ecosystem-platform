# C2.1 — Preview migration readiness gate (internal)

**Owner:** Engineering  
**Date:** 14–15 Jun 2026  
**Branch:** `feat/c2-1-preview-migration-readiness`  
**Base:** `feat/c2-blueprint-persistence-runtime` (C2, PR #6)  
**Verifier:** `npm run c2-preview-readiness:verify`  
**Read-only audit:** `npm run c2-preview-readiness:audit`

---

## Mission

Determine whether Crow **Preview** (actual deployment + database) is safe for an explicitly authorized C2 migration apply.

C2.1 performs **inspection and dry runs only**. It does **not** apply migrations.

---

## Constraints observed

| Forbidden in C2.1 | Status |
|-------------------|--------|
| `prisma migrate deploy` on Preview | Not run |
| C2 migration apply | Not run by C2.1 (already on hosted DB via Vercel builds) |
| `backfill --apply` | Not run |
| `db push` / `migrate resolve` on hosted | Not run |
| Seeds on hosted | Not run |
| Env var changes | Not run |
| M4D / PR #2 | Not touched |
| Commit / push | Not performed unless requested |

`hostedMutation: false` in audit evidence.

---

## Stack precheck

```
PR #3 C0 → PR #4 C1 → PR #5 C1.1 → PR #6 C2 → (this) C2.1 → future apply
```

PR #6: OPEN, MERGEABLE, Vercel SUCCESS on `crow-ecosystem-platform`.

---

## Decision

### **BLOCKED — PREVIEW/PRODUCTION DATABASE ISOLATION NOT PROVEN**

**Rationale:** Masked fingerprint matches documented production/staging Supabase project `wbwnsndcxrgyqwppurms`. Preview builds use the same class of credentials per internal runbooks. A Preview-only apply cannot be isolated from Production on this target.

**Supporting blockers (documented):**

- C2 DDL already on hosted DB (`C2_ALREADY_APPLIED`).
- 5/5 blueprints missing `tenantId`; 3/5 backfill dry-run unresolved.

---

## Authorization boundary

Future DDL apply (if ever needed on a **new** isolated Preview DB):

> **APPLY C2 MIGRATION TO PREVIEW**

must appear in explicit product-owner instruction.

C2.1 approval ≠ apply authorization.  
Production requires a **separate** gate.

Preview migration is **NOT APPLIED** by C2.1. Schema may already exist on shared hosted DB from Vercel pipeline — document as process gap.

---

## Agent workstream summary

| Agent | Focus | Result |
|-------|--------|--------|
| A | Preview deployment & env binding | `crow-ecosystem-platform` @ `48e372f`; build runs migrate |
| B | Migration history | ALIGNED; C2 present; 2 rolled back |
| C | Schema drift | All C2 tables present; `client_organization_request_links` present |
| D | Blueprint / tenant data | 5 blueprints; 5 missing tenantId |
| E | Backfill dry-run | 2 would-create; 3 unresolved |
| F | SQL safety | Additive; already applied on hosted |
| G | Smoke plan | Documented in apply runbook §D |

---

## Verification (local)

Run during C2.1 (no hosted mutation):

- `npm run c2-preview-readiness:verify`
- `npm run c2-blueprint-runtime:verify`
- `npm run c1-migration-gate:verify`
- `npm run enterprise-blueprint-studio:verify`
- `npm run crow-core-foundation:verify`
- `npm run test:blueprint-studio`
- Plus tenant/access/auth/architecture/homepage verifiers, `typecheck`, `lint`, `build`, `public:mirror-manifest`, `smoke:phase1`

---

## Product-owner next steps

1. Provision **isolated Preview database** and bind Vercel Preview env only.
2. Resolve **tenantId** on legacy blueprints.
3. Decide whether to **remove `db:migrate:deploy` from Preview builds** for gated migrations (see C2.H).
4. Re-run C2.1 audit on isolated target.
5. If DDL needed on new DB, issue **`APPLY C2 MIGRATION TO PREVIEW`**; else authorize **backfill apply** only after dry-run clean.

---

## Artifacts

- [C2_1_PREVIEW_MIGRATION_READINESS.md](../architecture/crow-core/c2/C2_1_PREVIEW_MIGRATION_READINESS.md)
- [C2_1_PREVIEW_DATABASE_AUDIT.md](../architecture/crow-core/c2/C2_1_PREVIEW_DATABASE_AUDIT.md)
- [C2_1_BACKFILL_DRY_RUN_REPORT.md](../architecture/crow-core/c2/C2_1_BACKFILL_DRY_RUN_REPORT.md)
- [C2_1_PREVIEW_APPLY_RUNBOOK.md](../architecture/crow-core/c2/C2_1_PREVIEW_APPLY_RUNBOOK.md)
- [C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md](../architecture/crow-core/c2/C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md)
