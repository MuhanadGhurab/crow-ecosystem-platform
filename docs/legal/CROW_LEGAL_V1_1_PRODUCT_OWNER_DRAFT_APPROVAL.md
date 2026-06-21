# Crow Legal v1.1 — Product-owner draft approval record

**Status:** Product draft and implementation fidelity formally approved for counsel review  
**Date:** 2026-06-18  
**Version:** 1.1 (semantic); versionNumber 2 in platform schema

## Approval statement

The product owner approves the canonical Crow Legal v1.1 source bodies
as the product draft submitted for qualified legal-counsel review.

The product owner also formally approves reconciled implementation fidelity:
committed templates match the canonical source documents with no editorial
or material differences.

This does not constitute legal advice, counsel approval, certification,
regulatory approval, or authorization to publish the documents.

## Recorded status

```text
PRODUCT_OWNER_SOURCE=AVAILABLE
PRODUCT_OWNER_DRAFT_APPROVED=true
IMPLEMENTATION_FIDELITY_APPROVED=true
COUNSEL_APPROVED=false
HOSTED_PUBLICATION_AUTHORIZED=false
PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=false
```

## Approved canonical documents

| Document | Sections |
|----------|----------|
| Crow Platform Terms of Service v1.1 | 14 |
| Crow Platform Privacy Notice v1.1 | 14 |
| Crow Acceptable Use Policy v1.1 | 10 |

## Approved fidelity status

| Document | Classification |
|----------|----------------|
| Terms of Service | EXACT_MATCH |
| Privacy Notice | EXACT_MATCH |
| Acceptable Use Policy | EXACT_MATCH |

- Editorial differences: **none**
- Material differences: **none**

Verified by `npm run crow-legal-v1-1:verify`.

## Approved commits (product draft + fidelity reconciliation)

- `27df4f9` — `docs(legal): add canonical product-owner v1.1 source`
- `294e5ac` — `fix(legal): reconcile templates with approved product draft`
- `ad2c9f7` — `test(legal): verify exact source-content fidelity`
- `9385865` — `docs(legal): record product-owner draft approval`

## Canonical source location

```text
docs/legal/source/product-owner-v1-1/terms-of-service-v1-1.md
docs/legal/source/product-owner-v1-1/privacy-notice-v1-1.md
docs/legal/source/product-owner-v1-1/acceptable-use-policy-v1-1.md
```

Implementation templates in `src/lib/legal/crow-legal-v1-1-content.ts` load these files
and are verified for exact fidelity by `npm run crow-legal-v1-1:verify`.

## Explicit non-approvals

This approval is **only** of the product draft and implementation fidelity. It is **not**:

- qualified legal-counsel approval;
- authorization to publish v1.1;
- authorization to supersede hosted v1.0;
- authorization to apply the lifecycle migration to the shared database;
- authorization to redeploy Production.

| Gate | Status |
|------|--------|
| Counsel approval | **Pending** |
| Hosted publication | **Not authorized** |
| Supersede hosted v1.0 | **Not authorized** |
| Shared-database lifecycle migration | **Not authorized** |
| Production redeploy for legal alone | **Not authorized** |

## Publication environment flags (must remain closed)

```text
CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED=false
ALLOW_HOSTED_LEGAL_PUBLICATION=false
PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=false
```

Hosted v1.0 remains the mandatory current legal version on the shared database
(fingerprint `0355c17692e2a90d`) until separately authorized.
