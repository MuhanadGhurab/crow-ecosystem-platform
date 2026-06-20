# C3.9B — Preview Lockdown, Unifonic Selection & Migration Reconciliation

**Branch:** `feat/c3-account-registration-email-verification`  
**Product-owner decisions:** Unifonic primary, Taqnyat regional fallback (not implemented), temporary `CROW_ONBOARDING_GENERATION_REQUIRED=1`, migration apply **not authorized**.

---

## 1. Preview lockdown

**Required branch Preview flags:**

| Variable | Value |
|----------|-------|
| `ACCOUNT_REGISTRATION_ENABLED` | `false` |
| `C3_REGISTRATION_DIAGNOSTICS` | `false` |
| `C3_SESSION_DIAGNOSTICS` | `false` |
| `C3_AUTH_CANARY_ENABLED` | `false` |
| `CROW_ONBOARDING_GENERATION_REQUIRED` | `1` |

**Operator commands:**

```bash
npm run c3-preview:lockdown -- --deploy
npm run c3-preview:read-env
```

---

## 2. Legacy generation compatibility (temporary)

| Account type | Generation | Active when required=1 |
|--------------|------------|------------------------|
| Legacy ACTIVE (post-migration backfill) | 1 | ✓ (`1 >= 1`) |
| New dual-channel enrollment | 2 (DB default) | Only after legal+email+phone → ACTIVE |

`getCurrentEnrollmentGeneration()` is **independent** of `CROW_ONBOARDING_GENERATION_REQUIRED` — new accounts always enroll as generation **2**.

### Future cutover (not now)

1. Maintenance window announcement  
2. Disable registration on Preview/Production  
3. Verified logical backup + `MIGRATION_BACKUP_CHECKSUM`  
4. Execute authorized identity reset (`identity-reset:execute` with PO phrase)  
5. Set `CROW_ONBOARDING_GENERATION_REQUIRED=2`  
6. Redeploy  
7. All returning users complete fresh dual-channel onboarding  

---

## 3. Unifonic operator checklist

### Account creation (manual)

- [ ] Register Unifonic business account at [unifonic.com](https://www.unifonic.com)
- [ ] Complete business verification (legal entity name, CR/commercial registration)
- [ ] Request AppSid for Crow platform application
- [ ] Submit alphanumeric **Sender ID** registration (CST approval ~2 weeks for Saudi)
- [ ] Provide trademark or brand ownership proof linking sender name to Crow
- [ ] Declare OTP / transactional use case (account verification only)
- [ ] Configure IP allowlist if required by Unifonic
- [ ] Set account spending cap and per-minute rate limits
- [ ] Designate account owner + recovery contact
- [ ] Store `C3_SMS_PROVIDER_API_KEY` (AppSid) in Vercel **Preview only** until proof window
- [ ] Document credential rotation: update Vercel env → redeploy → revoke old AppSid in Unifonic console

### Proposed sender ID candidates (manual approval — do not submit yet)

1. **Crow** (preferred if trademark aligns)  
2. **CYBERCRW** (11 chars, alphanumeric fallback)  
3. **CrowApp** (product-scoped)

### OTP templates (transactional)

**English:**  
`Your Crow verification code is: {{CODE}}. It expires in {{MINUTES}} minutes. Do not share this code.`

**Arabic:**  
`رمز التحقق الخاص بحساب Crow هو: {{CODE}}. تنتهي صلاحيته خلال {{MINUTES}} دقائق. لا تشارك هذا الرمز مع أي شخص.`

Regulatory review may require approved legal entity name in final copy.

### Preview env (future proof window only)

```text
C3_PHONE_DELIVERY_MODE=hosted-sms
C3_SMS_PROVIDER=unifonic
C3_SMS_PROVIDER_API_KEY=<AppSid>
C3_SMS_SENDER_ID=<approved sender>
C3_PHONE_SMS_TEST_ALLOWLIST=<E.164 product-owner numbers, comma-separated>
C3_SMS_MESSAGE_CAP=<monthly cap>
C3_SMS_WEBHOOK_SECRET=<if webhooks enabled>
C3_SMS_DEFAULT_LOCALE=en
```

---

## 4. Hosted adapter

- Provider: `C3_SMS_PROVIDER=unifonic` only  
- Endpoint: `https://el.cloud.unifonic.com/rest/SMS/messages` (override via `C3_SMS_API_BASE_URL`)  
- Crow OTP engine authoritative; adapter transport only  
- Preview allowlist enforced; Production does not use allowlist gate  

---

## 5. Migration reconciliation

```bash
APP_ENVIRONMENT=preview \
DATABASE_ENVIRONMENT=production \
BACKEND_ISOLATION=shared \
EXPECTED_DATABASE_FINGERPRINT=<fingerprint> \
npm run db:migrate:controlled -- --environment preview --check-only --allow-shared-production-backend
```

```bash
npm run c3-migration:reconcile
```

**Do not:** apply migrations, edit `_prisma_migrations`, or mark migrations applied manually.

---

## 6. Backup / apply preflight (later authorization)

```bash
# 1. Logical backup (operator — Supabase dashboard or pg_dump via DIRECT_URL)
pg_dump "$DIRECT_URL" -Fc -f .backups/crow-pre-c38-$(date +%Y%m%d).dump

# 2. Checksum
sha256sum .backups/crow-pre-c38-*.dump

# 3. Archive list validation
pg_restore -l .backups/crow-pre-c38-*.dump | head

# 4. Disposable local restore (port 5433 only)
# 5. Row-count validation against census from identity-reset:plan

# 6. Controlled check-only
npm run db:migrate:controlled -- --environment preview --check-only --allow-shared-production-backend

# Apply (NOT AUTHORIZED YET):
# MIGRATION_BACKUP_CHECKSUM=<sha256> ALLOW_DATABASE_MIGRATION=true \
# npm run db:migrate:controlled -- --environment preview --confirm "APPLY PREVIEW DATABASE MIGRATIONS" --allow-shared-production-backend
```

---

## 7. Google OAuth manual checklist

- [ ] Create Google Cloud OAuth client (Web application)  
- [ ] Authorized redirect URI: `https://<preview-host>/auth/callback`  
- [ ] Preserve Production redirect URI unchanged  
- [ ] Enable Google provider in Supabase Preview project  
- [ ] Store client ID/secret in Vercel (not Git)  
- [ ] Test with dedicated Google test identity  
- [ ] Inspect `email_verified` claim server-side  
- [ ] Confirm collision handling (existing email → safe error)  
- [ ] Confirm legal + phone gates still required after OAuth  

**Do not activate Google OAuth in production until dual-channel E2E passes.**

---

## 8. Verification

```bash
npm run c3-hosted-sms:verify
npm run c3-dual-channel:verify
npm run c3-dual-channel:hosted-schema-verify
npm run c3-account:verify
npm run c3-auth-convergence:verify
npm run auth-landing:verify
npm run c2-database-isolation:verify
npm run typecheck && npm run lint && npm run build
```
