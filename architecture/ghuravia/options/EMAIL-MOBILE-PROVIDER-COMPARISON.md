# Email and Mobile Provider Comparison

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-OPT-EML-001 |
| **Version** | 1.0.0 |
| **Status** | **COMPARISON · DECISION DEFERRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-016 |

## Scope

| Channel | Launch need | Status |
|---------|-------------|--------|
| Email | Required (activation) | Adapter locked, vendor deferred |
| SMS/Mobile | Not in activation formula | Deferred |

## Email options

| Provider | Pros | Cons |
|----------|------|------|
| Resend | Dev-friendly API | Regional deliverability TBD |
| SendGrid | Mature | Cost, template complexity |
| Amazon SES | Cost-effective | Setup friction |
| Postmark | Deliverability | Limited regions |
| Local SMTP | Control | Deliverability risk |

## SMS options (deferred)

| Provider | Notes |
|----------|-------|
| Twilio | Global; Saudi route verification needed |
| Unifonic | Regional MENA focus — **NOT VALIDATED** |
| AWS SNS | Generic |

## Evaluation criteria

Deliverability to Saudi mailboxes, Arabic template support, bounce handling, webhook security, cost per activation, sandbox for spike-free validation.

## Non-claims

No provider contract. SMS not required for 1C activation baseline.
