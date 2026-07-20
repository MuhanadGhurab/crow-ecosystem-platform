# Gate Report Template

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.XXXX |
| **Gate title** | `[title]` |
| **Date** | YYYY-MM-DD |
| **Branch** | `[branch]` |
| **HEAD** | `[commit SHA]` |
| **Operator** | `[name / agent]` |

## Objectives

1. `[...]`

## Scope

### In scope

- `[...]`

### Out of scope

- `[...]`

### Protected boundaries

- `[...]`

## Evidence

| Item | Result | Reference |
|------|--------|-----------|
| `[check]` | PASS / FAIL / N/A | `[path or command]` |

## Safety verification

- [ ] No unauthorized Production change
- [ ] No unauthorized database change
- [ ] No secret exposure
- [ ] Working tree / commit state recorded

## Blockers and risks

- `[none or list]`

## Verdict

Use exactly one:

```text
PASS
```

```text
PARTIAL
```

```text
BLOCKED
```

## Next recommended gate

```text
[GATE ID — TITLE]
```
