# Product-owner Crow Legal v1.1 source texts

**Status:** Canonical product-owner draft deposited and approved for fidelity baseline.  
**Counsel approval:** Pending. **Hosted publication:** Not authorized.

| File | Document | Sections |
|------|----------|----------|
| `terms-of-service-v1-1.md` | Crow Platform Terms of Service v1.1 | 14 |
| `privacy-notice-v1-1.md` | Crow Platform Privacy Notice v1.1 | 14 |
| `acceptable-use-policy-v1-1.md` | Crow Acceptable Use Policy v1.1 | 10 |

These files are the **source of truth** for Crow Legal v1.1 body text. Implementation
templates in `src/lib/legal/crow-legal-v1-1-content.ts` load them directly.

The static verifier (`npm run crow-legal-v1-1:verify`) compares committed templates
against these files line-by-line. Expected classification after reconciliation:
`EXACT_MATCH` for all three documents.

Placeholder syntax (finalized only at controlled publication):

```text
{{CROW_LEGAL_ENTITY_NAME}}
{{LEGAL_CONTACT_EMAIL}}
{{PRIVACY_CONTACT_EMAIL}}
{{DATA_RIGHTS_CONTACT_EMAIL}}
{{SECURITY_CONTACT_EMAIL}}
{{ABUSE_CONTACT_EMAIL}}
```

**Do not commit counsel-restricted communications, real entity names, or personal contact addresses.**

See also: `docs/legal/CROW_LEGAL_V1_1_PRODUCT_OWNER_DRAFT_APPROVAL.md`
