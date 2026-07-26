# GHURAVIA Arabic Notification Language

| Field | Value |
|-------|-------|
| **Status** | READY FOR FOUNDER COPY REVIEW — not LOCKED |
| **Date** | 2026-07-26 |

## Structure

Where applicable:

```text
EVENT
→ CONSEQUENCE
→ OPTIONAL ACTION
```

Example:

```text
تأثرت خدمة الدخول.
ارتفع زمن الاستجابة، لكن الخدمة ما زالت متاحة.
راجع تفاصيل الإشارة.
```

## Signal kinds (prototype)

| Kind | Tag Arabic | Purpose |
|------|------------|---------|
| World | إشارة عالم | Ambient world change (demo data only when prototype) |
| Mission | إشارة مهمة | Mission state changed after a decision |
| RAVEN | ملاحظة RAVEN | Contextual guidance tied to consequence |
| Save | حفظ | Persist / sync status |
| Risk | تنبيه مخاطر | Risk increased; invite review |
| Evidence | إشارة أدلة | Evidence recorded to Flight Log |
| Route | مسار متاح | New route available after consequence |
| Echo | رحلة صدى | Alternate exploration ready |

## Rules

- Do not write vague atmospheric notifications merely for mood.
- Cap transient signals (prototype: max two visible).
- Log retains history after dismiss.
- No auto-play sound.
- Prototype demo copy must say when data is sample / not live.

## Rejected

| Avoid | Prefer |
|-------|--------|
| نبضة بعيدة عبر السماء الحيّة | نشاط نموذجي في السماء الحيّة — بلا تشغيل فعلي |
| استمرارية أعلى | تحسّن توفر الخدمة |
| انشعاب صدى — المسار الكنسي محفوظ | رحلة الصدى جاهزة — رحلتك الأصلية محفوظة |
