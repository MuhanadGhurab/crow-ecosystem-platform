# C2 — Authorization and tenant isolation

## Tenant ownership

New C2 records require `tenantId`. Repository lookups use tenant + resource ID. Cross-tenant relationship creation is rejected in services.

Legacy Blueprint rows without tenant are classified as unresolved — excluded from tenant write paths until backfill.

## Blueprint actions

Defined in `src/lib/auth/blueprint-actions.ts` and enforced via `requireBlueprintAction` in `blueprint-action-guard.ts`.

Coarse discovery-write authorization is replaced for Studio mutations with explicit capabilities (`blueprint.draft.edit.*`, `blueprint.approve`, etc.).

## Separation of duties

- Sales cannot approve ROI assumptions (enforced in guard)
- Client acknowledgment is advisory only
- Auditor is read-only
- SAREA is presentation-only — never authorization

## Client projection

`projectClientSafeBlueprint` runs server-side; UI must not be the only redaction layer.
