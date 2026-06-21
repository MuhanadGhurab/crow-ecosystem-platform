# Product-owner Crow Legal v1.1 source texts

Deposit the **exact** product-owner approved markdown for each document here before hosted publication:

| File | Document |
|------|----------|
| `terms-of-service-v1-1.md` | Crow Platform Terms of Service v1.1 |
| `privacy-notice-v1-1.md` | Crow Platform Privacy Notice v1.1 |
| `acceptable-use-policy-v1-1.md` | Crow Acceptable Use Policy v1.1 |

The static verifier (`npm run crow-legal-v1-1:verify`) compares committed templates in
`src/lib/legal/crow-legal-v1-1-content.ts` against these files line-by-line.

**Do not commit counsel-restricted communications or personal contact addresses.**

Until all three files exist, fidelity classification remains `PO_SOURCE_MISSING` and hosted
publication stays blocked pending product-owner confirmation.
