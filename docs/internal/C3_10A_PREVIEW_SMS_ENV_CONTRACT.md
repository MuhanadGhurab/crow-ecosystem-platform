# C3.10A — Preview hosted SMS environment contract

All variables are **server-only** — none use `NEXT_PUBLIC_`.

## Required for hosted SMS (Preview)

| Variable | Purpose |
|----------|---------|
| `C3_PHONE_DELIVERY_MODE` | Must be `hosted-sms` |
| `C3_SMS_PROVIDER` | Must be `unifonic` |
| `C3_SMS_PROVIDER_API_KEY` | Unifonic AppSid / API key (**not** `C3_SMS_UNIFONIC_APP_SID` in code) |
| `C3_SMS_SENDER_ID` | Approved sender ID |
| `C3_PHONE_SMS_TEST_ALLOWLIST` | Server-only E.164 allowlist (mandatory on Preview) |
| `C3_SMS_MESSAGE_CAP` | Rolling cap (single env; split hourly/daily optional later) |
| `C3_SMS_WEBHOOK_SECRET` | Webhook authenticity |
| `C3_SMS_API_BASE_URL` | Optional override (default Unifonic REST URL) |

## Fail-closed behavior

- Hosted mode throws when configuration incomplete (`assertHostedSmsConfigurationComplete`)  
- Preview without allowlist blocks destinations  
- No in-memory/local SMS fallback when `C3_PHONE_DELIVERY_MODE=hosted-sms` on Vercel  
- Production must not depend on Preview allowlist  

## Verification

```bash
npm run c3-hosted-sms:verify
```

## C3.10A constraints

- Do not configure live secrets during C3.10A  
- Do not send SMS  
- Registration remains disabled  
