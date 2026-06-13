# M4D — Business Portal Invite Email Delivery

**Date:** 6 Jun 2026  
**Status:** **IMPLEMENTATION PASSED**  
**Branch:** `feat/m4d-invite-email-delivery`  
**Baseline:** R2 production stabilization (`e58a896` on `main`; docs commit `a5620c3`)

**Related:** [`M4C_TENANT_INVITE_ACCEPTANCE_TOKEN_EMAIL_DELIVERY.md`](M4C_TENANT_INVITE_ACCEPTANCE_TOKEN_EMAIL_DELIVERY.md) · [`R1B_PROCROW_TENANT_COMMAND_CENTER_WORKFORCE_ACTIVATION_UX_FIX.md`](R1B_PROCROW_TENANT_COMMAND_CENTER_WORKFORCE_ACTIVATION_UX_FIX.md)

---

## Existing limitation (pre-M4D)

M4C shipped secure invite-token acceptance with **manual copy-link only**. Operators created an invite in Tenant Command Center → Workforce Activation, copied the one-time URL, and sent it outside Crow. No transactional email was attempted; UI copy explicitly avoided false “email sent” claims.

---

## Provider architecture

Provider-neutral email layer under `src/lib/email/`:

| File | Role |
|------|------|
| `email-provider.ts` | Contract + `BusinessPortalInviteEmailPayload` |
| `email-delivery-result.ts` | Outcomes + safe operator messages |
| `email-provider-config.ts` | Env-driven config (`RESEND_API_KEY`, from-address) |
| `providers/configured-provider.ts` | Resend HTTP API (server-only) |
| `templates/business-portal-invite-email.ts` | HTML + plain-text transactional template |
| `send-business-portal-invite-email.ts` | App entry — returns `provider_unconfigured` when unset |

**Outcomes:** `delivered` · `provider_unconfigured` · `provider_rejected` · `invalid_recipient` · `delivery_error`

Application code outside `src/lib/email/` does not import provider SDKs directly.

---

## Configuration requirements

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Enables delivery attempt (same pattern as `notification.service.ts`) |
| `NOTIFICATION_FROM_EMAIL` or `BUSINESS_PORTAL_INVITE_FROM_EMAIL` | From address for invite mail |

When credentials are absent:

- Invite creation **still succeeds** (token hash persisted).
- UI shows **“Create invite link”** and reports email delivery unavailable.
- Copy-link fallback remains mandatory.

No API keys in client components or browser bundles.

---

## Invitation delivery flow

1. Operator authorized (platform staff or tenant admin with `cem.users.invite`).
2. Validate tenant + role (`tenant_user` \| `tenant_admin` only).
3. Generate raw token; persist **tokenHash** only.
4. Build invite URL (raw token in URL once in operator response).
5. **Attempt** `sendBusinessPortalInviteEmail()` — failure does **not** roll back invite.
6. Return `CreateTenantInviteTokenResult` with `emailDelivery` summary + one-time `inviteUrl`.
7. Audit: `tenant_invite_created` + email delivery events via `platformNotification` (`eventType: tenant_invite_email`).

---

## Manual fallback behavior

After every successful invite create:

- One-time invite URL shown with **Copy this link now** UI.
- Operator can deliver manually regardless of email outcome.
- UI never claims delivery when outcome is `provider_unconfigured` or failed.

---

## Delivery result states (operator UI)

| Outcome | Operator message pattern |
|---------|---------------------------|
| `delivered` | “Invite email delivered” + recipient + expiry + copy link |
| `provider_unconfigured` | Invite created; email delivery unavailable — copy manually |
| `provider_rejected` / `delivery_error` | Invite created; email could not be delivered — safe summary + copy link |
| `invalid_recipient` | Invalid recipient — invite still valid with copy link |

---

## Email template summary

- **Subject:** `You're invited to the {Tenant Name} Business Portal`
- Business Portal access statement; invited role in plain language
- Expiry (UTC); **Accept Business Portal Invite** button (HTML)
- Plain-text URL fallback
- **Exact-email notice:** sign in with the same address that received the invitation
- **Security notice:** does not grant ProCrow or platform administration access
- No marketing, payment, compliance certification, or platform-admin wording

---

## Security boundaries

- Raw invite tokens never stored in DB, logs, or audit metadata.
- Full invite URLs with token never logged.
- Provider API keys server-only.
- Invite-token acceptance flow unchanged (M4C).
- No `platform_admin`, ProCrow roles, client approval, payments, public self-join, or domain auto-join.
- Email failure does not invalidate pending invite.

---

## Retry delivery

`retryTenantInviteEmailDelivery()` + `retryTenantInviteEmailAction` re-send email for the **same** pending invite when the operator still holds the original `inviteUrl` in session.

- Reuses existing invite row — **no new token**, no hash reconstruction.
- If raw URL is no longer available, operator must create a new invite.

---

## Audit behavior

Safe `platformNotification` metadata includes tenant ID, invite ID, recipient email, operator ID, delivery outcome category, timestamp. Never includes raw token, full invite URL, or provider secrets.

---

## Migration decision

**No migration.** Existing `TenantMembershipInvite` schema is sufficient.

---

## Verification

```bash
npm run tenant-invite-email:verify
npm run tenant-invite-acceptance:verify
npm run tenant-invite:verify
npm run tenant-membership:verify
npm run access-gateway:verify
npm run auth-landing:verify
npm run procrow-workbench:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run smoke:phase1
```

Verifier: `scripts/verify-tenant-invite-email-delivery.ts` · `npm run tenant-invite-email:verify`

---

## Remaining gaps

- Production Resend domain/from-address must be configured by operator for live delivery.
- End-to-end “create and email invite” browser smoke with real provider not run in agent pass (requires credentials).
- M4C phase doc still describes historical manual-only mode; superseded by M4D for delivery behavior.

---

## Final decision

**M4D — IMPLEMENTATION PASSED**

Controlled Business Portal invite email delivery added via server-only provider abstraction; M4C token security and manual copy-link fallback preserved; no schema migration; verifiers and validation suite green on branch.

**Recommended next:** Operator smoke with configured Resend on preview/production · **M4E — Tenant Membership Management UX** · **M3.6 — Purchase-to-Stock UX Refinement**
