# Crow Cloud Cost Guardrails

**Phase:** CLOUD.0  
**Organization plan:** Pro (verified)  
**Branch cost quote (MCP):** ~**$0.01344/hour** per Supabase branch (~$9.70/month if always on)

---

## 1. Principles

1. **Spend Cap does not cap everything** — PITR, branching compute, read replicas, and egress can exceed cap expectations.
2. **Branches are billable** — every orphaned PR branch costs hourly compute until deleted.
3. **Enable features on justification** — see feature matrix; no optional paid features without operator approval.
4. **Review monthly** — operator checklist below.

---

## 2. Cost model (monthly estimates)

Figures are **planning ranges** — confirm in Supabase + Vercel billing dashboards. Prices change; treat as order-of-magnitude.

| Line item | Typical range (USD/mo) | Notes |
|-----------|-------------------------|-------|
| Supabase Pro base | ~$25 | Organization subscription |
| Production compute (Micro→Small) | $0–$15+ | **UNKNOWN** current size — verify Dashboard |
| PITR add-on | ~$100+ | Optional; **not** in Spend Cap |
| Persistent staging branch/project | ~$10–25+ | One always-on environment |
| Ephemeral PR branches | ~$0.01/hr × branches × hours | **Primary leak risk** |
| Database storage | Low today (~17 MB) | Grows with tenants/evidence |
| Storage buckets + egress | $0 → scales with uploads | Enable with first tenant |
| Edge Functions | $0 today | Per invocation if deployed |
| Realtime | $0 today | Per connection-minute if enabled |
| Auth MAU | Included in Pro tier | Monitor as registration opens |
| Custom email (Resend) | Free tier → paid | Domain + volume |
| SMS (future) | **BLOCKED** | Provider per-message |
| Read replicas | ~$50+ each | Defer until scale |
| Log drains | Varies | Defer |
| Vercel (Hosting) | Existing plan | Preview deployments multiply |

### Scenario planning

| Scenario | Approx incremental monthly |
|----------|----------------------------|
| Production only (current) | Pro base + compute |
| + PITR | +~$100 |
| + 1 persistent staging | +~$10–25 |
| + 3 forgotten PR branches (30 days) | +~$29 |
| + 10 active PR branches (avg 48h) | +~$13 |

---

## 3. Recommended alerts and thresholds

| Metric | Alert threshold | Action |
|--------|-----------------|--------|
| Supabase branch count | > 3 active | Review and delete merged PR branches |
| Branch age | > 14 days | Auto-delete or operator ticket |
| Database size | > 5 GB | Review evidence retention |
| Storage egress | > 50 GB/mo | Audit bucket policies |
| Auth MAU | > 80% of plan | Upgrade planning |
| Resend emails | > 80% free tier | Upgrade or throttle |
| Monthly Supabase invoice | > $150 | Finance review (PITR/branches) |
| PITR enabled without approval | Any | Escalate — paid add-on |

Configure Supabase **Spend Cap** as a safety net only — do not treat it as a full budget envelope.

---

## 4. Lifecycle rules (cost control)

| Rule | Owner |
|------|-------|
| Delete Supabase branch within 24h of PR merge | CI / operator |
| Maximum one persistent staging branch | Platform operator |
| No read replicas without traffic justification | Architecture |
| PITR requires written approval + cost line item | Operator + finance |
| Preview DB must not point at Production after Wave 2 | Enforced via `DATABASE_ENVIRONMENT` |
| Weekly orphaned branch scan | Operator cron / calendar |

---

## 5. Environment-specific cost posture

| Environment | Cost posture |
|-------------|--------------|
| Production | Right-size compute; enable PITR when justified |
| Persistent staging | Smallest viable compute; sanitized data only |
| Ephemeral PR | Short-lived; shared seed; auto-teardown |
| Local | Docker Compose only — no Supabase branch charges |

---

## 6. Review checklist (monthly)

- [ ] List Supabase branches — delete orphans
- [ ] Confirm PITR still required if enabled
- [ ] Review compute size vs CPU metrics
- [ ] Review Storage usage and egress
- [ ] Review Auth MAU trend
- [ ] Review Resend invoice
- [ ] Confirm no Preview env uses Production `DATABASE_URL`
- [ ] Compare invoice to guardrail thresholds

---

## Related documents

- `CROW_ENVIRONMENT_SEPARATION_PLAN.md` §6
- `CROW_CLOUD_FEATURE_ENABLEMENT_MATRIX.md`
- `CROW_SUPABASE_PRO_FOUNDATION.md`
