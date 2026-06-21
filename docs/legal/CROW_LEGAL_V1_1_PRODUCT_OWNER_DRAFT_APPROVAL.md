# Crow Legal v1.1 — Product-owner draft approval record

**Status:** Product draft approved for counsel review  
**Date:** 2026-06-18  
**Version:** 1.1 (semantic); versionNumber 2 in platform schema

## Approval statement

The product owner approves the canonical Crow Legal v1.1 source bodies
as the product draft submitted for qualified legal-counsel review.

This does not constitute legal advice, counsel approval, certification,
regulatory approval, or authorization to publish the documents.

## Canonical source location

```text
docs/legal/source/product-owner-v1-1/terms-of-service-v1-1.md
docs/legal/source/product-owner-v1-1/privacy-notice-v1-1.md
docs/legal/source/product-owner-v1-1/acceptable-use-policy-v1-1.md
```

Implementation templates in `src/lib/legal/crow-legal-v1-1-content.ts` load these files
and are verified for exact fidelity by `npm run crow-legal-v1-1:verify`.

## Explicit non-approvals

| Gate | Status |
|------|--------|
| Counsel approval | **Pending** |
| Hosted publication | **Not authorized** |
| Supersede hosted v1.0 | **Not authorized** |
| Production redeploy for legal alone | **Not authorized** |

## Publication environment flags (must remain closed)

```text
CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED=false
ALLOW_HOSTED_LEGAL_PUBLICATION=false
PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=false
```

Hosted v1.0 remains the mandatory current legal version on the shared database
(fingerprint `0355c17692e2a90d`) until separately authorized.
