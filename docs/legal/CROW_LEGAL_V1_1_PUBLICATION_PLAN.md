# Crow Legal v1.1 — Controlled Publication Plan

**Status:** BLOCKED — counsel, PO fidelity, contacts, and Production compatibility incomplete.

**Shared database:** Supabase `wbwnsndcxrgyqwppurms` · fingerprint `0355c17692e2a90d`

Publishing v1.1 on this database affects **both** Preview and Production legal state.

## Contact interpolation model (selected)

**Preferred model — immutable publication snapshot:**

```text
resolve approved legal entity and contacts (six env vars)
→ render complete final document body once
→ SHA-256 hash over finalized UTF-8 body
→ store immutable contentBody + contentSha256 + publishedAt/effectiveAt
→ render paths serve stored body only (no runtime env interpolation)
```

Implementation: `buildLegalV11PublicationPayload()` and `publishCrowLegalV11Controlled()` in
`src/lib/legal/legal-publication.service.ts`.

## Lifecycle

```text
DRAFT → REVIEWED → APPROVED_FOR_PUBLICATION → CURRENT (published) → SUPERSEDED
```

- Local seed (`seedLegalDocuments`) publishes **v1.0** and seeds **v1.1 as draft** only.
- Draft v1.1 does **not** trigger reacceptance (`status !== published`).
- Only `publishCrowLegalV11Controlled` may make v1.1 current.

## Release checklist

1. Counsel approves exact **rendered** bodies (after contact finalization).
2. Product owner approves all material differences vs canonical PO source files.
3. Six legal/entity contact values configured, monitored, and mailbox-tested.
4. Compatible code deployed to Preview and proven.
5. Fresh hosted database backup created and restore-verified.
6. Compatible Production release deployed or coordinated (`PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=true`).
7. `scripts/publish-crow-legal-v1-1-controlled.ts` runs **once** with explicit authorization env vars.
8. v1.1 becomes current; v1.0 becomes superseded.
9. Account-class reacceptance smoke tests run (requester, client, tenant, privileged human).
10. Audit evidence and rollback path verified.

## Publication authorization (all required for hosted)

```text
CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED=true
ALLOW_HOSTED_LEGAL_PUBLICATION=true
CROW_LEGAL_ENTITY_NAME=<approved entity>
LEGAL_CONTACT_EMAIL=<monitored>
PRIVACY_CONTACT_EMAIL=<monitored>
DATA_RIGHTS_CONTACT_EMAIL=<monitored>
SECURITY_CONTACT_EMAIL=<monitored>
ABUSE_CONTACT_EMAIL=<monitored>
PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=true   # shared DB only
```

Environment presence alone is **not** sufficient without `CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED`.

## Rollback / withdrawal

Acceptance evidence is **append-only** — do not delete `account_legal_acceptances` rows.

If v1.1 must be withdrawn after publication:

1. Counsel-approved communication to affected accounts.
2. Transition v1.1 versions to `superseded` via a new controlled operation (not in-place body edit).
3. Publish a corrective version or revert current mandatory version through a new version record.
4. Preserve all acceptance timestamps and hashes for audit.

## What not to run before authorization

- `seedLegalDocuments` against hosted DB expecting v1.1 to become current (v1.1 stays draft).
- Any manual SQL that sets v1.1 `status = published` without controlled publication script.
- Production redeploy solely to force reacceptance before compatible code ships.
