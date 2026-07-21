# Evidence Scanning Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-EV-SCN-001 |
| **Version** | 1.0.0 |
| **Status** | **PIPELINE ACCEPTED · PROVIDER DEFERRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-021 |
| **Evidence** | SPK-ARC-008 |

```text
SCANNING FAIL-CLOSED
No release on outage or inconclusive result
```

## Pipeline stages

```text
enqueue → malware scan → secret scan → file type verify → PASS|FAIL|INCONCLUSIVE
```

## Fail-closed rules (SPK-ARC-008)

| Condition | Release to review |
|-----------|-------------------|
| SCAN_PASSED | Allowed |
| SCAN_FAILED | **Denied** |
| SCAN_INCONCLUSIVE (outage) | **Denied** |
| failOpen flag attempted | **Still denied** at architecture layer |

## Provider boundary

Scanner implemented via adapter; vendor **DEFERRED**. Synthetic spike uses harmless signatures only — no real malware samples.

## Post-pass

`grantReviewAfterScan` sets `reviewAccess = true` only when `scanStatus === SCAN_PASSED`.

## Non-claims

Production AV vendor not chosen. Zero-day coverage not claimed.
