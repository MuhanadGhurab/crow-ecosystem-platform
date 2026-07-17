# Client Blueprint Projection

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED

## Purpose

Deterministic server-side projection — **not UI hiding alone**.

Implementation: `src/lib/crow-core/blueprint-engine/client-projection.ts`

## Visibility classes

| Class | Treatment |
| ----- | --------- |
| CLIENT_VISIBLE | Included in projection |
| CLIENT_SUMMARIZED | Reduced form (e.g. policy summaries) |
| INTERNAL_ONLY | Stripped |
| CONDITIONALLY_VISIBLE | Policy-gated (future) |

## Client-visible sections

Executive summary, organization, departments, capabilities, entities, work personas, workflows, outcomes, KPIs, evidence, SAREA experiences, integrations, compliance overlays, unresolved decisions (client-relevant), scenario profile.

## Internal-only (stripped)

Implementation notes, operator notes, internal security rationale, platform validation details, legacy compatibility notes, internal deployment estimates, `warnings`, `authorityProposals`, full `provenanceSummary`, `metadata`.

## Sanitization rules

- Remove email-shaped strings
- Remove UUID-shaped identifiers where not required for client UX
- Preserve `contentHashPrefix` (16 chars) for fingerprint display
- Include advisory notice: acceptance does not provision tenant or grant permissions

## Output type

```typescript
ClientBlueprintProjection {
  versionNumber,
  contentHashPrefix,
  executiveSummary,
  sections,
  decisionsRequiringClientInput,
  advisoryNotice
}
```

## Tests

`blueprint-engine-design.test.ts` — deterministic projection, no `@` in serialized output.
