# Internal-ID Removal Policy — Experience Design

| Field | Value |
|-------|-------|
| **Status** | POLICY PROPOSAL — design authority · **not yet applied in Product Code** |
| **Applies to** | Learner-facing product copy, chrome, marketing, Mission UI, Portal, Debrief |
| **Does not apply to** | Explicit developer/administrator diagnostic interfaces · server logs · governance docs · test fixtures |

## Prohibited in learner-facing experience

The following identifier families must **never** appear in learner-facing product copy:

```text
ACT-*
ONB-*
IDN-*
CAP-*
GHV.*
DEC-*
RISK-*
DEP-*
```

Also prohibited as learner labels: raw route paths used as titles (e.g. `/activation/terms`), aggregate state enums as headings, and Gate jargon in banners.

## Allowed exceptions

| Context | Rule |
|---------|------|
| `/dev/local-tools` and similar | May show technical tokens behind clear “developer only” labeling |
| Support diagnostics (future admin) | Behind authentication + role; never on public Portal |
| Playwright `data-*` attributes | May retain IDs for tests; **not** visible text |
| Error correlation IDs | Allowed as support codes with human preface |

## User-facing replacements (current leaks → proposed copy)

| Current leak (examples) | Learner-facing replacement |
|-------------------------|----------------------------|
| `ACT-003` / “Activation (ACT-003)” | “تأكيد البريد” / “Verify your email” |
| `ACT-005` | “الموافقة على الشروط” / “Accept terms” |
| `ACT-013` | “قبول مخاطر الحساب” / “Accept account risk notice” |
| `ACT-006` | “تم تفعيل حسابك” / “Your account is ready” |
| `ACT-007` | “التحقق من الجوال (اختياري)” / “Mobile verification (optional)” |
| `ACT-011` | “نتيجة التحقق” / “Verification result” |
| `ACT-012` | “استعادة التفعيل” / “Resume activation” |
| `ONB-001` | “إنشاء حضورك” / “Create your presence” |
| `IDN-001` | “تخصيص الغراب” / “Personalize your Crow” |
| `IDN-002` | “اختيار الموطن” / “Choose a habitat” |
| `IDN-003` | “اختيار الشخصية” / “Choose a character” |
| `ONB-002` | “أصل رحلتك” / “Set your Origin” |
| `ONB-003`…`ONB-007` | Nest / Horizon human titles already in catalogs — use those, never IDs |
| `CAP-*` | Capability plain-language names from Nest catalogue only |
| `LOCAL DEVELOPMENT ONLY · NOT DEPLOYED` | Environment-accurate banners: local synthetic · controlled Preview · never false “not deployed” on Preview |
| Progress lists showing `ONB-004 ✓` | Human step labels (“فحص الجاهزية”) with internal ID only in `data-*` |

## Implementation note

This task does **not** change Product Code. Remediation belongs to a later authorized experience-implementation wave (preflight Wave 0 hygiene).
