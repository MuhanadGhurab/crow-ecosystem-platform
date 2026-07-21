# Environment Availability Matrix

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1A |
| **Document ID** | GHV-VAL-1A-EAM-001 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |

## Purpose

States which **execution environments** are available for GHV.VALIDATION.1A evidence collection. Absent environments must not be implied by documentation review alone.

## Summary matrix

| Environment | Status | DATABASE_URL | DIRECT_URL | Validation use | Product Code impact |
|-------------|--------|:------------:|:----------:|----------------|---------------------|
| **Local (repo only)** | **AVAILABLE** | N/A (no product DB) | N/A | Documentation · spike harness replay · static analysis | None — no product runtime |
| **Automated Test (spike harness historical)** | **AVAILABLE (historical)** | Harness-scoped only | Harness-scoped only | Architecture-era spike evidence · **not** external proof | None — harness ≠ Preview |
| **Preview** | **NOT ESTABLISHED** | **ABSENT** | **ABSENT** | **BLOCKED** — TECH-018 OPEN | **BLOCKING** COND-022 · COND-032 |
| **Staging** | **NOT ESTABLISHED** | — | — | Not configured for GHURAVIA validation | Deferred |
| **Production** | **EXISTS** | Present (ops) | Present (ops) | **VALIDATION PROHIBITED** | Operational only |

## Environment detail

### Local (repository only)

| Attribute | Value |
|-----------|-------|
| **Availability** | **AVAILABLE** |
| **Scope** | Git working tree · architecture docs · spike result markdown · validation workspace |
| **Database** | No GHURAVIA product database configured in this workspace |
| **Secrets** | No `.env` files in validation workspace; credentials not committed |
| **Isolation proof** | N/A — no hosted runtime |

### Automated Test (historical spike harness)

| Attribute | Value |
|-----------|-------|
| **Availability** | **AVAILABLE (historical evidence only)** |
| **Scope** | 25/25 spikes under `spikes/ghuravia/` — executed during Architecture gates 1B–1D |
| **Evidence** | [FINAL-TECHNICAL-SPIKE-RECONCILIATION.md](../../architecture/ghuravia/governance/FINAL-TECHNICAL-SPIKE-RECONCILIATION.md) |
| **Limitation** | Harness PASS / PWC **does not** prove Preview isolation, provider sandboxes, or production scale |
| **Re-run** | May require local deps; **not** equivalent to external validation programme |

### Preview

| Attribute | Value |
|-----------|-------|
| **Availability** | **NOT ESTABLISHED** |
| **DATABASE_URL** | **ABSENT** |
| **DIRECT_URL** | **ABSENT** |
| **Tracking item** | **TECH-018 OPEN** |
| **Source** | [REPOSITORY-TECHNOLOGY-INVENTORY.md](../../architecture/ghuravia/inventory/REPOSITORY-TECHNOLOGY-INVENTORY.md) — Preview URLs absent (ops inventory) |
| **Secrets path** | **UNDEFINED** for Preview — no governed secret injection path filed for GHURAVIA validation |
| **Isolation** | **Cannot be proven externally** — shared-host risk documented in CROW ops audits; GHURAVIA-specific Preview isolation **not demonstrated** |
| **Blocking** | COND-022 (Preview/Production external infra proof) · COND-032 (relational datastore host) · provider conditions requiring hosted runtime |

```text
Preview NOT ESTABLISHED
  → No DATABASE_URL
  → No DIRECT_URL
  → TECH-018 OPEN
  → External infra isolation: NOT PROVEN
```

### Staging

| Attribute | Value |
|-----------|-------|
| **Availability** | **NOT ESTABLISHED** |
| **Notes** | No dedicated GHURAVIA staging environment registered for Validation.1A |
| **Validation use** | Deferred until Preview established and isolation proven |

### Production

| Attribute | Value |
|-----------|-------|
| **Availability** | **EXISTS** (platform operations) |
| **Validation use** | **PROHIBITED** for exploratory validation, provider sandboxes, pen-test without governed authorization |
| **Rationale** | Production is live operational infrastructure — not a validation sandbox |
| **Related conditions** | COND-020 · COND-026 · COND-031 close at launch/implementation gates, not ad-hoc prod testing |

## TECH-018 register entry

| Field | Value |
|-------|-------|
| **ID** | TECH-018 |
| **Title** | Preview database environment (`DATABASE_URL` / `DIRECT_URL`) |
| **Status** | **OPEN** |
| **Impact** | Blocks Preview runtime validation · blocks external proof of DB host selection · blocks migration validation on Preview |
| **Gate reference** | [GATE-REGISTER.md](../../governance/gates/GATE-REGISTER.md) — Technical Validation NOT STARTED |

## Isolation statement

```text
External environment isolation CANNOT BE PROVEN at Validation.1A workspace open because:
  1. Preview is NOT ESTABLISHED (no DATABASE_URL / DIRECT_URL)
  2. Staging is NOT ESTABLISHED
  3. Provider sandboxes are NOT AVAILABLE
  4. Production validation is PROHIBITED for this programme phase

Architecture spike SPK-ARC-021 (deployment-environment isolation) PASS applies to
harness/conceptual proof only — not to live Preview/Production separation on chosen host.
```

## Explicit non-claims

```text
NOT ESTABLISHED ≠ "will fail"
NOT ESTABLISHED = no evidence may be filed claiming Preview PASS
Product Code: BLOCKED until Preview + blocking conditions addressed
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial matrix @ GHV.VALIDATION.1A |
