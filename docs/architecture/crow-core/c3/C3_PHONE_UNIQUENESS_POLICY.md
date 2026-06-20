# C3.8 Phone Uniqueness Policy

**Decision (C3.8 default):** One verified phone number (`phoneNormalized`, E.164) may belong to at most one **active or in-progress onboarding** Crow platform account at a time.

## Enforcement

- Before issuing SMS OTP, `phone-verification.service` checks for another account with the same `phoneNormalized` where `phoneVerifiedAt` is set and status is active or pending verification.
- Conflicts return a **generic** error: *"This phone number cannot be used. Try another or contact support."*
- No indication which account owns the number.

## Exceptions

- **Suspended / deactivated** identities: reuse requires operator recovery review (not automatic).
- **Family / shared company numbers:** require an explicit exception policy and manual operator approval — not silent duplication.

## Privacy

- Store `phoneNormalized` (E.164) and `phoneMasked` for display.
- Never expose full numbers in audit logs, reset manifests, or client APIs after capture.

## Future

- Hosted SMS adapter (`C3_PHONE_DELIVERY_MODE=hosted-sms`) pending provider selection and cost approval.
