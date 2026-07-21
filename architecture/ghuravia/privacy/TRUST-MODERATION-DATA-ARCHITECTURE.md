# Trust and Moderation Data Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-PRIV-TRU-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-013 |

```text
Trust: non-public, non-numeric
Separate from mastery/progression
Product Code: BLOCKED
```

## 1. Data stores (logical)

| Store | Contents | Visibility |
|-------|----------|------------|
| User-facing trust state | Categorical eligibility, restriction tags | Internal + moderated views |
| Restricted signals | Investigation notes, risk markers | Moderator/admin only |
| Moderation cases | Reports, decisions, appeals | Moderation roles |

## 2. Rules (SPK-ARC-013)

- Numeric public scores **prohibited** — architecture throws on numeric trust.
- `publicView()` returns no trust/score fields.
- Moderation overturn restores eligibility without altering mastery/progression.

## 3. Separation

| Concern | Trust domain | Progression domain |
|---------|--------------|-------------------|
| Mastery | Not stored | Authoritative |
| Route eligibility | May restrict access | Computed from Evidence events |
| Public leaderboard | No trust dimension | Optional progression summary |

## 4. Audit

All moderation decisions append audit with actor, reason, case id.

## 5. Non-claims

Operational moderation SLAs not defined. Appeals UX deferred.
