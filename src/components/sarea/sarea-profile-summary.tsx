import Link from "next/link";
import { routes } from "@/lib/routes";
import { SAREA_COPY } from "@/lib/constants/sarea-ux-depth";
import { SareaReadinessCard } from "./sarea-readiness-card";

type SareaProfileSummaryProps = {
  tenantBackedPersonas: number;
  fallbackPersonas: number;
  partialPersonas: number;
  notMaterializedPersonas: number;
  roleMapCount: number;
  navigationProfileCount: number;
  widgetRuleCount: number;
  tenantsNeedingReview: number;
};

export function SareaProfileSummary({
  tenantBackedPersonas,
  fallbackPersonas,
  partialPersonas,
  notMaterializedPersonas,
  roleMapCount,
  navigationProfileCount,
  widgetRuleCount,
  tenantsNeedingReview,
}: SareaProfileSummaryProps) {
  return (
    <section className="cc-glass-card cc-entity-block--sarea !p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-rose-300">
            Profile & experience readiness
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {SAREA_COPY.tenantBacked} {SAREA_COPY.fallback}
          </p>
        </div>
        <Link href={routes.sarea.profiles} className="cc-btn-secondary text-xs">
          Profiles →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SareaReadinessCard
          label="Tenant-backed personas"
          value={tenantBackedPersonas}
          status="tenant_backed"
        />
        <SareaReadinessCard
          label="Fallback personas"
          value={fallbackPersonas}
          status="fallback"
        />
        <SareaReadinessCard
          label="Role maps"
          value={roleMapCount}
          status={roleMapCount === 0 ? "needs_mapping" : "tenant_backed"}
          hint="RBAC slug → profile"
        />
        <SareaReadinessCard
          label="Tenants needing review"
          value={tenantsNeedingReview}
          status={tenantsNeedingReview > 0 ? "needs_review" : "tenant_backed"}
        />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <SareaReadinessCard
          label="Partial materialization"
          value={partialPersonas}
          status="needs_review"
        />
        <SareaReadinessCard
          label="Navigation profiles"
          value={navigationProfileCount}
          status={navigationProfileCount === 0 ? "incomplete" : "tenant_backed"}
        />
        <SareaReadinessCard
          label="Widget rules"
          value={widgetRuleCount}
          status={widgetRuleCount === 0 ? "incomplete" : "tenant_backed"}
        />
      </div>
      {notMaterializedPersonas > 0 ? (
        <p className="mt-3 text-xs text-amber-200/90">
          {notMaterializedPersonas} persona(s) not materialized — confirm tenant-backed state before
          external demos.
        </p>
      ) : null}
    </section>
  );
}
