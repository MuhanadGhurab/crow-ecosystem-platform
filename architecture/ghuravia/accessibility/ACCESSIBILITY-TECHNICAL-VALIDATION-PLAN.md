# Accessibility Technical Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-A11Y-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §30 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-017 · SPK-ARC-002 · SPK-ARC-004 |
| **Related** | EXT-019 · SCR-007 (registers: NOT RUN) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
ACCESSIBILITY IS NOT VALIDATED IN GHV.ARCHITECTURE.1A
Do not mark accessibility validated in this Gate
NO Product Code
```

## 1. Purpose

Define how accessibility will be validated later across STATIC / AUTOMATED / MANUAL / USER VALIDATION methods. **1A produces the plan only.**

## 2. Surfaces and methods

| Surface | STATIC | AUTOMATED | MANUAL | USER VALIDATION |
|---------|:------:|:---------:|:------:|:---------------:|
| Keyboard | | ✓ | ✓ | ✓ |
| Screen reader | | | ✓ | ✓ |
| Focus order / visible focus | | ✓ | ✓ | ✓ |
| Headings / landmarks | ✓ | ✓ | ✓ | |
| Forms / labels / errors | ✓ | ✓ | ✓ | ✓ |
| Status messages (live regions) | | ✓ | ✓ | ✓ |
| Reduced motion | ✓ | ✓ | ✓ | ✓ |
| Contrast | ✓ | ✓ | ✓ | |
| Zoom / reflow (to 200%+) | | ✓ | ✓ | ✓ |
| Touch targets | ✓ | | ✓ | ✓ |
| Captions / transcripts | ✓ | | ✓ | ✓ |
| Technical diagrams | ✓ | | ✓ | ✓ |
| Code blocks | | | ✓ | ✓ |
| Timed activities | ✓ | | ✓ | ✓ |
| Live Sky alternatives | ✓ | | ✓ | ✓ |
| Accessible Evidence submission | ✓ | | ✓ | ✓ |
| Alternative assessment | ✓ | | ✓ | ✓ |
| Leaderboard opt-out | ✓ | | ✓ | ✓ |
| Cognitive load / language clarity | ✓ | | ✓ | ✓ |
| RTL + SR interaction | | | ✓ | ✓ |

## 3. Method definitions

| Method | Meaning |
|--------|---------|
| **STATIC** | Spec/checklist review against wireframes & principles |
| **AUTOMATED** | CI scanners / unit a11y assertions on implemented UI (future) |
| **MANUAL** | Expert keyboard/SR pass |
| **USER VALIDATION** | Tests with users with disabilities (future EXT) |

## 4. Spike

| Spike | Focus |
|-------|-------|
| SPK-ARC-017 | Accessibility + reduced-motion shell behavior (still NOT RUN) |

## 5. Explicit non-claim

```text
GHV.ARCHITECTURE.1A does NOT validate accessibility.
SCR-007 / EXT-019 remain NOT RUN.
```

## 6. Limitations

```text
VALIDATION PLAN ONLY · NOT RUN · DECISION PENDING
```

## 7. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §30 — accessibility technical validation plan |
