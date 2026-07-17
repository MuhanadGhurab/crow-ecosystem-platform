# Request to Discovery Handoff (CROW.REQUEST.2)

## Confirmation paths

After submit, `/client/requests/{id}/confirmation` offers:

1. Let ProCrow continue (client home)
2. Continue to Discovery → `/client/requests/{id}/discovery/design`
3. View request → `/client/requests/{id}`

Discovery is optional immediately after submit.

## Prefill

`buildClientEnterpriseDesignPageModel()` loads Request Brief from notes and calls `prefillDesignDraftFromRequestBrief()` when design draft is empty.

Prefilled fields: field, purpose, team range, growth intention, configuration mode, plain-language goal.

## UI indicator

`ClientDesignJourney` shows: *Provided during your request — you may update these answers during Discovery.*

## Edit eligibility

Design save allowed when request status is `PENDING_REVIEW` or `UNDER_DISCOVERY` (existing policy).
