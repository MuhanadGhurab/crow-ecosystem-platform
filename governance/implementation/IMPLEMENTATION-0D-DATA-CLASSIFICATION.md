# IMPLEMENTATION-0D — Data Classification

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-DATA-CLASS |
| **Gate** | GHV.IMPLEMENTATION.0D · GHV.IMPLEMENTATION.0D-CLOSURE-01 |
| **Baseline** | Personalization/Origin v0.4.0 |
| **Date** | 2026-07-22 |

## Classifications

| Data | Classification |
|------|----------------|
| Wingprint setup (Crow / color / style / habitat / character / accessory selections) | **PRIVATE DURING ONBOARDING** |
| Origin responses (region / experience / goals options) | **PRIVATE ONBOARDING CONTEXT** |
| Public Origin | **PROHIBITED** |
| Origin in Trust | **PROHIBITED** |
| Origin in Progression | **PROHIBITED** |
| Origin in commercial entitlement | **PROHIBITED** |
| Origin in general telemetry | **PROHIBITED** |
| Public Wingprint derivative | **DEFERRED TO LATER PRIVACY/PUBLICATION GATE** |

## Storage fields (`onboarding_aggregates`)

Personalization (private during onboarding):

```text
path
crow_option_id · color_option_id · style_option_id
habitat_option_id · character_option_id · accessory_option_id
personalization_status
contrast_override_acknowledged · privacy_preview_acknowledged
personalization_catalogue_version
```

Origin (private onboarding context):

```text
origin_status
origin_region_option · origin_experience_option · origin_goals_options
origin_catalogue_version
```

No prohibited PII columns exist (no legal name, national ID, passport, precise address/GPS, exact DOB, religion, tribe, ethnicity, medical, income, employer, school, immigration, political opinion, unrestricted free text).

## Owner access

- Aggregate id equals activation account id (session-bound).
- Read/write only for the authenticated synthetic session owner.
- Cross-account read/write: **PROHIBITED** (enforced by session aggregate binding).

## Retention assumption

- Local disposable / CI ephemeral databases only for this Gate.
- Production retention: **NOT ESTABLISHED** (no Production deployment).
- Future privacy Gate must define retention, export, and deletion SLAs.

## Deletion / change considerations

- Origin and personalization remain editable later (later-edit compatibility preserved).
- Wingprint Home (IDN-004+) and public publication are **out of scope**.
- Hard delete / right-to-erasure workflows: deferred to future privacy Gate.

## Audit metadata (allowed)

```text
Action · Changed field category · Catalogue version
Prior status · Resulting status · Actor · Authority · Reason · Correlation ID
```

## Prohibited audit payloads

```text
Origin option values as free-form body dumps
Personalization option IDs in unrestricted audit blobs
Tokens · secrets · contact plaintext beyond opaque actorRef patterns already used
```

## Prohibited telemetry payloads

```text
Origin responses in general product telemetry
Trust / Progression / entitlement derivations from Origin
Unrestricted free-text capture
```

## Future privacy Gate dependency

Public Wingprint derivatives, publication surfaces, retention/deletion SLAs, and external legal review remain **OPEN** / deferred. This record classifies the 0D implementation surface only.
