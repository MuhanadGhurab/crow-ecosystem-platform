# Request and Discovery Boundary (CROW.REQUEST.2)

## Request answers

Who is asking, business field, purpose, team scale, growth intention, guidance preference.

## Discovery answers

Operating model, capabilities, responsibilities, workflows, security, integrations, Blueprint inputs.

## Rules

- Do not merge into one long wizard.
- Request submit must not fabricate Discovery client answers.
- A blank `DiscoveryProfile` shell may be created lazily on first Discovery design save only.
- Discovery prefills from Request Brief; UI labels values as **Provided during your request**.
- Client may update prefilled values under existing ownership rules.

## Prefill mapping

See `prefillDesignDraftFromRequestBrief()` in `src/lib/client-service-request/discovery-prefill.ts`.
