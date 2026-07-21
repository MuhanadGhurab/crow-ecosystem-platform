# Scanning Provider Comparison

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-OPT-SCN-001 |
| **Version** | 1.0.0 |
| **Status** | **COMPARISON · DECISION DEFERRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-021 |

```text
Pipeline ACCEPTED · Provider DEFERRED
Fail-closed mandatory regardless of vendor
```

## Options

| Provider type | Examples | Notes |
|---------------|----------|-------|
| Cloud AV API | ClamAV Lambda, GuardDuty Malware Protection | Async friendly |
| SaaS scanning | VirusTotal API, MetaDefender | Cost per file |
| Built-in ClamAV | Self-hosted daemon | Ops + signature updates |
| Secret scanning | Custom regex + trufflehog-class | Required complement |

## Mandatory architecture behaviors

| Behavior | Required |
|----------|----------|
| Fail-closed on outage | Yes |
| Quarantine until pass | Yes |
| Secret pattern scan | Yes |
| No auto-release on timeout | Yes |

## Decision

Vendor **DEFERRED** — pipeline pattern accepted via SPK-ARC-008.

## Non-claims

Detection rates not benchmarked. No vendor SLA assumed.
