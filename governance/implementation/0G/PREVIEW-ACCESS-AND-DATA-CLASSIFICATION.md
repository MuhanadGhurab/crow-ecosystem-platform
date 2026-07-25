# Preview Access and Data Classification — GHV.IMPLEMENTATION.0G

| Field | Value |
|-------|-------|
| **Status** | ACTIVE |
| **Gate** | GHV.IMPLEMENTATION.0G |
| **Auth** | GHV-IMP-AUTH-007 |

## Access control

| Control | Implementation |
|---------|----------------|
| Audience | Founder-only at this stage |
| Mechanism | Vercel Deployment Protection (SSO) — `all_except_custom_domains` |
| Git fork protection | Enabled |
| Public synthetic bootstrap | **Denied** outside verified `controlled_preview` / local / CI modes |

## Synthetic session (Preview)

| Rule | Requirement |
|------|-------------|
| Environment gate | `assertLocalRuntime` + `loadConfig` require `VERCEL_ENV=preview`, `GHURAVIA_RUNTIME_MODE=controlled_preview`, `GHURAVIA_DATA_CLASSIFICATION=demo_only` |
| Database identity | `GHURAVIA_PREVIEW_PROJECT_REF` must appear in DB URL; Production fingerprints denied |
| Shared demo backend | `ALLOW_SHARED_DEMO_BACKEND=false` |
| Credentials | No hardcoded credentials; secret via Preview-scoped env only |
| Cookie | `httpOnly`; `secure` on Preview HTTPS |
| Production | Synthetic session **denied** (`VERCEL_ENV=production` → DENY) |

## Data classification

| Asset | Classification on Preview |
|-------|---------------------------|
| Learner identities | Synthetic only |
| Mission runs / events / Crowprint / suggestions / Echo | Synthetic demo_only |
| Real names / emails / phones / customer data | **Prohibited** |

## Runtime guard matrix (required)

| Case | Expectation |
|------|-------------|
| Local development | ALLOW |
| CI (`automated_test`) | ALLOW |
| Verified Preview | ALLOW |
| Preview missing classification | DENY |
| Preview missing database identity | DENY |
| Preview pointing to Production | DENY |
| Production | DENY |
| Unknown environment | DENY |
