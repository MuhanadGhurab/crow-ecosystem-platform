import type { TenantMembershipAccessSummary } from "@/lib/tenant/tenant-membership-contract";

type Props = {
  summary: TenantMembershipAccessSummary;
};

const MODEL_LABEL: Record<TenantMembershipAccessSummary["membershipModel"], string> = {
  database_backed: "Database-backed",
  metadata_only: "JWT metadata only (temporary)",
  hybrid: "Hybrid (DB + metadata)",
};

export function AdminTenantMembershipAccessPanel({ summary }: Props) {
  return (
    <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/15 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyan-100">
        Tenant membership & Business Portal access (M4)
      </h3>
      <p className="text-xs text-slate-500">
        Read-only view of how Business Portal access is proven for this tenant. Client Portal access
        does not imply Business Portal access.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
        <div>
          <p className="text-slate-500">Membership model</p>
          <p className="text-slate-200">{MODEL_LABEL[summary.membershipModel]}</p>
        </div>
        <div>
          <p className="text-slate-500">Tenant users (DB)</p>
          <p className="text-slate-200">{summary.activeMembershipCount}</p>
        </div>
        <div>
          <p className="text-slate-500">Slug</p>
          <p className="font-mono text-slate-300">/{summary.tenantSlug}</p>
        </div>
      </div>
      {summary.metadataOnlyWarning && (
        <p className="text-xs text-amber-200/90 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          No tenant_memberships rows yet — access may rely on JWT tenant_slugs only. Use Grant Tenant
          Access below to sync DB + metadata.
        </p>
      )}
      <ul className="list-disc space-y-1 pl-4 text-xs text-slate-500">
        {summary.accessSourceNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="text-xs text-teal-300/90">{summary.recommendedNextAction}</p>
    </section>
  );
}
