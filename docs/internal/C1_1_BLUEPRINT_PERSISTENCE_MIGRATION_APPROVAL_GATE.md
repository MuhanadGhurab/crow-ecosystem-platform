# C1.1 — Blueprint Persistence Migration Approval Gate (internal)

**Branch:** `feat/c1-1-blueprint-persistence-gate`  
**Stack:** PR #4 (C1 → C0) · Future PR #5 (C1.1 → C1)  
**Date:** 14 Jun 2026  
**Product-owner sign-off:** 14 Jun 2026

---

## Purpose

Architecture approval board for **Path C** persistence — determines **how** Blueprint versions, ROI, SOW, approvals, and trace events are stored **before** any Prisma migration is written.

**C1.1 does not implement migrations.**

---

## Precheck

| Item | Status |
|------|--------|
| Branch | `feat/c1-1-blueprint-persistence-gate` @ `12edf8d` |
| `prisma/schema.prisma` | Unchanged |
| Migration count | 13 |
| M4D / PR #2 | Untouched |
| C0 / C1 branches | Not modified directly |

---

## Decision

**APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION**

| Selected strategy | **Option 2 — Hybrid persistence** |
|-------------------|-------------------------------------|
| C2 implementation | **Authorized** — additive Prisma migration on **C2** branch |
| Rejected | Option 3 (minimal extension) — insufficient for immutability |

---

## Recorded product-owner decisions (22)

1. One active draft per Blueprint.  
2. Exactly one current approved version per Blueprint.  
3. Blueprint approval requires `platform_admin` or explicitly authorized implementer.  
4. Separation of duties must block inappropriate self-approval.  
5. Client approval is advisory acknowledgment only.  
6. Client acknowledgment does not authorize runtime deployment.  
7. Sales may propose and edit ROI assumptions but may not approve them.  
8. ROI assumption approval initially requires `platform_admin` or authorized implementer.  
9. Approved Blueprint versions are immutable.  
10. Changes after approval create a new version.  
11. Approved versions, approval evidence, ROI snapshots, SOW versions, and trace evidence use a policy-driven retention model with a seven-year operational default, subject to legal/contract review and legal hold.  
12. Maximum Blueprint snapshot size is initially 2 MB.  
13. Snapshot depth, structure, and schema must be validated.  
14. Generated SOW is an advisory draft.  
15. SOW requires authorized commercial and legal review before contractual use.  
16. No e-signature or legal contract execution is included in C2.  
17. Historical provenance must use explicit provenance states.  
18. Historical imports must never invent authors, approvals, or assurance evidence.  
19. Hybrid JSON snapshots are allowed only as validated, schema-versioned immutable envelopes.  
20. Digital signatures are deferred.  
21. Preserve an optional `externalSignatureRef` for future approved integration.  
22. SHA-256 remains a content-integrity reference only and must not be presented as a legal signature or blockchain proof.

---

## Mandatory C2 security gates

- Fix tenant scoping in `listEnterpriseBlueprints()`.
- Replace coarse Blueprint Studio authorization with explicit action-level authorization.
- Enforce server-side client-safe projections.
- Prevent cross-tenant relationships.
- Prevent stale-version approval.
- Enforce expected revision/hash checks.
- Reject silent last-write-wins behavior.
- Keep SAREA separate from authorization.
- Keep Blueprint approval separate from runtime deployment.
- AI may assist but may not approve, sign, authorize, or invent ROI values.

---

## Deliverables (C1.1)

| Artifact | Path |
|----------|------|
| Gate master | `docs/architecture/crow-core/c1/C1_1_MIGRATION_APPROVAL_GATE.md` |
| Auth matrix | `docs/architecture/crow-core/c1/C1_1_AUTHORIZATION_MATRIX.md` |
| Threat model | `docs/architecture/crow-core/c1/C1_1_THREAT_MODEL.md` |
| Backfill/rollout | `docs/architecture/crow-core/c1/C1_1_BACKFILL_AND_ROLLOUT_PLAN.md` |
| Schema preview (non-executable) | `docs/architecture/crow-core/c1/C1_1_SCHEMA_DESIGN_PREVIEW.md` |
| Updated proposal | `docs/architecture/crow-core/c1/C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md` |
| Verifier | `npm run c1-migration-gate:verify` |

---

## Operator next steps

1. ~~Product owner reviews C1.1 doc set and signs decision board.~~ **Done (14 Jun 2026).**
2. Merge C0 → main, then C1 → C0 per stack plan.
3. Open **PR #5** (C1.1 → C1) when ready to commit this branch.
4. Open **C2** branch for Prisma migration + dual-read adapter (authorized after this sign-off).
5. Do **not** run `prisma migrate` on the C1.1 branch.

---

## Related

- C1 summary: [`C1_ENTERPRISE_BLUEPRINT_STUDIO.md`](C1_ENTERPRISE_BLUEPRINT_STUDIO.md)
- C1 verifier: `npm run enterprise-blueprint-studio:verify`
