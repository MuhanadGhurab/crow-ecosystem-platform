# FTGP.1 — Request to review plan

## Goal

Move the first retained implementation request through ProCrow review using **database-backed** operator authority — not Supabase metadata.

## Prerequisites (from FTGP.0B)

- [ ] Migration `20260621120000_ftgp_platform_internal_role_assignment` applied in controlled Preview/staging window
- [ ] `ftgp-authority-boundaries:test` passing on deployed branch
- [ ] Retained customer requester unchanged (role-neutral, `/account` landing)
- [ ] Separate operator identity provisioned (not the requester Gmail)

## Operator assignment (controlled, post-FTGP.0B)

1. Dry-run platform internal role bootstrap plan against operator `PlatformAccount` id/fingerprint
2. Operator authorization sign-off (human, out of band)
3. Grant **`IMPLEMENTER`** via `grantInternalPlatformRole` with correlation id and audit reason
4. Verify `/admin/requests` queue, detail, start discovery, reject — without `platform_admin` breadth

## Requester path

1. Requester remains on `/account` until authoritative `submittedByUserId` ownership exists
2. Request submission binds ownership to authenticated Supabase user id
3. Client portal opens only for owned request (or future org membership)

## Review workflow (ProCrow)

| Step | Actor | Authority check |
|------|-------|-----------------|
| View queue | Operator | `platform.requests.view` |
| Open detail | Operator | `platform.requests.view` |
| Start discovery | Operator | `platform.requests.manage` (implementer+) |
| Request more info | Operator | Operational (no dedicated status in F7) |
| Reject | Operator | `platform.requests.manage` |
| Audit evidence | Operator | `platform.audit.view` (scoped) |

## Out of scope for FTGP.1

- Tenant provisioning
- Production deploy
- Bulk metadata reconciliation
- Legal v1.1 publication

## Success criteria

- Operator with DB `IMPLEMENTER` completes review actions on retained request
- Requester without ownership cannot open `/client` or another requester's detail
- Stale `crow_role` on either identity does not bypass guards
