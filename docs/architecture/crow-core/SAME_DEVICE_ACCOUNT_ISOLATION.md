# Same-Device Account Isolation (CROW.UAT.1)

Request wizard drafts stored in `localStorage` keyed by:

```text
crow-client-scoped-v1:request-wizard-draft:pa-{platformAccountFingerprint}
```

On sign-out, `clearAllClientScopedStorage()` removes all versioned keys from localStorage and sessionStorage.

Drafts never store email, tokens, or auth IDs. Catalog search index remains shared (harmless).

Tests: `npm run uat-readiness:test`
