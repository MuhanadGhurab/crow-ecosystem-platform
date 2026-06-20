# C3.10A — Unifonic operator readiness checklist (sanitized)

Do **not** store credentials or sender documents in the repository.

## Business account

- [ ] Unifonic business account provisioned and billing active  
- [ ] Transactional OTP use case approved  
- [ ] Credential owner documented (internal ops contact)  
- [ ] Recovery contact documented  
- [ ] Credential rotation procedure documented  
- [ ] Incident revocation procedure documented  

## Sender ID

- [ ] Approved sender ID registered with Unifonic  
- [ ] Sender registration documents submitted (kept outside repo)  
- [ ] Arabic and English OTP templates approved  

## API credentials (server-only Preview)

- [ ] AppSid / API key stored in Vercel Preview only (`C3_SMS_PROVIDER_API_KEY`)  
- [ ] Sender ID in Vercel Preview (`C3_SMS_SENDER_ID`)  
- [ ] Webhook secret generated (`C3_SMS_WEBHOOK_SECRET`)  

## Limits and allowlist

- [ ] Preview test-number allowlist (`C3_PHONE_SMS_TEST_ALLOWLIST`)  
- [ ] Message cap configured (`C3_SMS_MESSAGE_CAP`)  
- [ ] Spending cap agreed with finance  

## Webhook

- [ ] Callback URL designed (not public until credentials validated)  
- [ ] Signature/secret verification configured  
- [ ] Delivery receipts recorded as transport evidence only (no account activation)  

## Adapter status

Crow adapter: **STRUCTURALLY_READY — PROVIDER CREDENTIAL VALIDATION REQUIRED**

- Endpoint: `https://el.cloud.unifonic.com/rest/SMS/messages` (override via `C3_SMS_API_BASE_URL`)  
- Auth: form field `AppSid` (maps to `C3_SMS_PROVIDER_API_KEY`)  
- No live SMS in C3.10A  
