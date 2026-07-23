# LINEAGE PRIVACY AND PUBLIC PROJECTION POLICY

| Field | Value |
|-------|-------|
| **Document** | Lineage Privacy and Public Projection Policy |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** |
| **Default** | **PRIVATE** |
| **Legal completion** | **NOT claimed** — legal/privacy validation remains pending where applicable |

## Chosen Lineage

- Private by default.
- May be publicly projected only as clearly self-selected **exploration** language (e.g. “Exploring: …”).
- Must not use earned/verified/proven wording without an independent Earned Active record.

## Suggested Lineage

- **Always private.**
- Never publicly projected.
- Never visible to employers, other users, teams, community members, or advertisers.

## Earned Lineage

May be publicly projected only when **all** hold:

- state is valid for projection;
- user explicitly opts in;
- privacy and age-safety rules permit;
- no suspension or unresolved projection hold;
- projection uses a **sanitized** record.

### Public projection may include

- active Lineage English name;
- approved Arabic display label when localization status allows;
- Horizon;
- clear state label;
- Lineage Mark when authorized;
- earned date or validity status where policy permits;
- sanitized capability summary;
- sanitized Evidence summary or opaque portfolio link when separately authorized.

### Public projection must never include

```text
Trust standing / category / reason
raw Evidence / private Evidence / rejected Evidence
Nest score
Origin data
recommendation history / dismissed suggestions
appeal details / integrity investigation details
private correction history
payment plan / subscription tier
legal identity / private contact data
```

## Cardinality of public focus

| Item | Rule |
|------|------|
| Primary public Lineage focus | **0 or 1** |
| Additional publicly projected Earned Lineages | **0 to many**, user-approved |

## Users under 18

```text
Public Lineage projection: OFF by default
Public Evidence projection: OFF by default
Additional safety and consent review: required before wider projection
```

## Public state labels (English authoritative)

| Internal concept | User-facing English |
|------------------|---------------------|
| Chosen | Exploring |
| Suggested | Suggested for you (**private only**) |
| Earned Active | Earned |
| Revalidation Due | Review due |
| Lapsed | Previously earned — renewal needed |
| Suspended | Temporarily unavailable |
| Revoked | No longer valid |
| Under Appeal | Under review |

Arabic identity-state terminology:

```text
CONTROLLED PROVISIONAL
NATIVE REVIEW NOT RUN
```
