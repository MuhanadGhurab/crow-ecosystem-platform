# Architecture Decisions & Open Questions

## ADR-001 — Canonical contract namespace (`src/lib/crow-core/`)

**Status:** Accepted (C0)  
**Decision:** Persistence-neutral TypeScript contracts live under `src/lib/crow-core/`. Existing `*-contract.ts` files remain; crow-core re-exports or extends where constitutional rules already exist.  
**Consequence:** Future Prisma mapping is explicit layer (C1+), not embedded in contracts.

## ADR-002 — SAREA never grants access

**Status:** Accepted (constitutional)  
**Decision:** SAREA composes experience only; RBAC remains sole access gate.  
**Evidence:** `sarea-experience-mapping-contract.ts`, doc 07, verifier checks.

## ADR-003 — 22-stage universal process lifecycle

**Status:** Accepted (C0)  
**Decision:** `ProcessLifecycleStage` (22 values) is canonical for process fabric. Marketing 13-step lifecycle (`crow-simplified-lifecycle.ts`) remains for public copy until REFRAME in C3.  
**Risk:** Two lifecycles in codebase until mapping documented.

## ADR-004 — Architecture Lab as reference prototype

**Status:** Accepted (C0)  
**Decision:** `/admin/architecture-lab` uses mock data only (`isReferencePrototype: true`), protected by `requirePlatformConsole()`.  
**Consequence:** No API routes, no Prisma, no mutations.

## ADR-005 — CyberCrow advisory scope

**Status:** Accepted  
**Decision:** CyberCrow emits signals and recommendations; not SIEM/EDR/autonomous SOC.  
**Evidence:** doc 08, forbidden overclaim list in verifier.

## ADR-006 — Saudi government integrations deferred

**Status:** Accepted (C0)  
**Decision:** Capability cards and constitutional rules only; no live adapters.

---

## Open questions

| ID | Question | Impact | Owner hint |
|----|----------|--------|------------|
| OQ-1 | Merge `EnterpriseBlueprint` and `Blueprint` Prisma models? | Schema migration risk | C1 |
| OQ-2 | Single discovery URL strategy vs role-based views? | UX + SEO | Product |
| OQ-3 | When does 13-step lifecycle retire from marketing? | Copy drift | C3 |
| OQ-4 | SAREA runtime: server-driven composition vs static tenant layout? | Performance | C5 |
| OQ-5 | Traceability store: new table vs audit log extension? | Migration | C2 |
| OQ-6 | AI quota enforcement: edge vs Convex action? | Cost | C7 |
| OQ-7 | Industry packs: npm packages vs DB config? | Release cadence | C9 |

---

## Risks (C0 scope)

- **Schema drift:** Contracts persistence-neutral; mapping layer not yet built
- **Route proliferation:** High REFRAME count; workspace pattern adoption needed
- **Verifier scope:** Presence/constitution only — not runtime behavior
- **Build memory:** Architecture Lab must stay static (M2.0 OOM guards)

---

## Conflicts watchlist

None identified in C0 foundation. If `SAREA grants access` or `Nafath grants admin` appear in new files, verifier fails.
