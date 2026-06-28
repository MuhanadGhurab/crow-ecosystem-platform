# Certification Route Authority Matrix (CROW.CERT.1)

**Status:** PASS · **AUTHORITY_BYPASS_COUNT=0**

Gates: `client-enterprise-design-authority:test` · `ftgp-authority-boundaries:test` · `procrow-access-card:test` · `metadata-crow-role-classification:test`

| Actor | Public pages | Client routes | Admin / studios | Tenant runtime |
|-------|--------------|---------------|-----------------|----------------|
| Anonymous | Allowed (marketing, signup, login) | Denied → login | Denied | Denied |
| Unverified account | Auth + verification only | Denied | Denied | Denied |
| Legal-incomplete | Legal routes only | Denied | Denied | Denied |
| Activated client | Public + client | Allowed (own requests) | Denied | Denied unless member |
| Request owner | — | Own request + Discovery | Denied | Denied |
| Unrelated client | — | Denied foreign requests | Denied | Denied |
| IMPLEMENTER-only | — | Denied admin | Implementer routes only | Per membership |
| PLATFORM_ADMIN | — | Client if also client | Full ProCrow console | Per membership |
| Metadata-only `platform_admin` | — | No ProCrow card | Denied | Denied |
| Email-only claim | — | No authority | Denied | Denied |

Client cannot access Model Forge, Blueprint Studio, or Tenant Studio. Request ownership enforced via `submittedByUserId` → PlatformAccount resolution only.
