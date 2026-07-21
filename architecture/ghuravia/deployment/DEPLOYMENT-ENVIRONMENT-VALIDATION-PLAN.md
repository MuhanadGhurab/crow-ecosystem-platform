# Deployment and Environment Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-DEP-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §36 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-021 · TECH-018 (Preview DB readiness — NOT RUN) |
| **Related** | `vercel.json` deploy guard · docs/operations/VERCEL-PRE-PUSH-VERIFICATION.md |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO environment created during 1A
Preview ≠ customer data
Deployment guard remains active until a later Gate authorizes change
```

## 1. Environment matrix

| Environment | Purpose | Data classification | Secrets | Database | Object storage | Email | Payments | Integrations | Deploy approval | Migration approval | Observability | Test data | Reset policy | Access | Retention | Cost | Isolation |
|-------------|---------|---------------------|---------|----------|----------------|-------|----------|--------------|-----------------|--------------------|---------------|-----------|--------------|--------|-----------|------|-----------|
| **Local** | Dev on founder machines | Synthetic / fixtures | Dev-only; never Production | Local/ephemeral | Local mock | Mock | Mock | Mocks | Self | Self + review for shared scripts | Optional | Fixtures | Anytime | Founder | Short | LOW | Machine |
| **Test** | Automated CI | Synthetic | CI secrets scoped | Ephemeral CI DB | Mock/ephemeral | Mock | Mock | Mock | Pipeline | Pipeline gated | CI logs | Generated | Per run | CI + eng | Short | LOW–MOD | Strong |
| **Preview** | PR / branch previews | **Synthetic only** | Preview secrets ≠ Production | Preview DB if present; may be absent (TECH-018) | Isolated | Catch-all / mock | Test mode | Disabled/mocks | Guarded | Explicit review | Preview-safe | Synthetic | Destroy with branch | Eng | Short | MOD | **No customer data** |
| **Staging** | Pre-prod validation | Anonymized or synthetic | Staging vault | Staging DB | Staging bucket | Staging provider | Test/live-test | Sandbox | Dual approval draft | Explicit | Full-ish | Controlled | Scheduled | Restricted | Medium | MOD–HIGH | Prod-like |
| **Production** | Real users | Real classified data | Production vault only | Production | Production | Production | Live | Approved adapters | **Gate-authorized** | **Explicit + review** | Full | N/A | Controlled | Least privilege | Policy | HIGH | Strict |

## 2. Hard locks

1. **Preview must not use real customer data.**
2. **Production secrets must not appear in Preview.**
3. Migrations require explicit review.
4. Destructive operations require safeguards.
5. **Deployment guard remains active** (`feat/ghuravia-foundation`: false in `vercel.json`) until a later Gate authorizes change.
6. No environment provisioning in 1A.

## 3. Spike

| Spike | Focus |
|-------|-------|
| SPK-ARC-021 | Deployment-environment isolation |

## 4. Limitations

```text
VALIDATION PLAN ONLY · ENVIRONMENTS NOT CREATED · SPIKES NOT RUN
```

## 5. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §36 — deployment/environment validation plan |
