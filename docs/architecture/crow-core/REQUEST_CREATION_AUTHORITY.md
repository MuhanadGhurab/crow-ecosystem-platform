# Request Creation Authority (CROW.REQUEST.2)

## Allowed

Fully activated authenticated client with active `PlatformAccount` and legal acceptance.

## Ownership

`ImplementationRequest.submittedByUserId` = authenticated Supabase user id from server session.

## Denied

- Anonymous direct mutation
- Unverified account / incomplete legal acceptance
- Email-only ownership, metadata-only ownership, tenant membership alone
- Client-supplied owner IDs or URL account IDs

## Implementation

`createModernServiceRequest()` in `client-service-request.service.ts` calls `ensureClientRoleForAuthenticatedIntake()` and `findPlatformAccountBySupabaseUserId()`.

## Idempotency

Duplicate submit within 10 minutes with same `idempotencyKey` returns existing request (no second row).
