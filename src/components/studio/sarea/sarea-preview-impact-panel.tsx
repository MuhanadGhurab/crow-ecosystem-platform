import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  materializationStateLabel,
  type SareaPersonaMaterializationRow,
} from "@/lib/services/sarea-materialization.service";

type Props = {
  slug: string;
  label: string;
  rows: SareaPersonaMaterializationRow[];
};

export function SareaPreviewImpactPanel({ slug, label, rows }: Props) {
  const tenantDashboard = routes.tenant(slug).dashboard;
  const backed = rows.filter((r) => r.state === "tenant_backed").length;
  const mappedRoles = [...new Set(rows.flatMap((r) => r.mappedRoleSlugs))];

  return (
    <section className="rounded-lg border border-violet-500/15 bg-violet-950/10 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-violet-200">Experience source · {label}</h3>
        <span className="text-[10px] text-slate-500">
          {backed}/{rows.length} tenant-backed
        </span>
      </div>
      <dl className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-slate-600">Tenant</dt>
          <dd className="font-mono text-slate-300">/{slug}</dd>
        </div>
        <div>
          <dt className="text-slate-600">Mapped RBAC roles</dt>
          <dd className="text-slate-400">
            {mappedRoles.length > 0 ? mappedRoles.join(", ") : "None — use role mapping studio"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600">Dashboard layout source</dt>
          <dd className="text-slate-400">Tenant `DashboardLayout` when materialized</dd>
        </div>
        <div>
          <dt className="text-slate-600">Widget source</dt>
          <dd className="text-slate-400">Tenant `WidgetRule` rows (visibility only)</dd>
        </div>
        <div>
          <dt className="text-slate-600">Navigation source</dt>
          <dd className="text-slate-400">`NavigationProfile.configJson.primary`</dd>
        </div>
        <div>
          <dt className="text-slate-600">Device behavior</dt>
          <dd className="text-slate-400">Device rules JSON (advisory)</dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-slate-600">Tenant-backed vs fallback</dt>
          <dd className="text-slate-400">
            Preview cookies use tenant studio rows when state is tenant-backed; analyst and
            tenant_admin may use recommended definitions until profiles exist.
          </dd>
        </div>
      </dl>
      <ul className="space-y-1 text-[11px] text-slate-500">
        {rows.map((r) => (
          <li key={r.personaKey} className="flex flex-wrap gap-2">
            <span className="text-slate-400">{r.label}</span>
            <span>{materializationStateLabel(r.state)}</span>
            <span className="text-slate-600">
              L{r.layoutCount} W{r.widgetCount} N{r.navCount}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-cyan-200/80">
        After safe studio edits: role mapping changes which profile a slug sees; widget visibility
        changes dashboard blocks only; navigation keys change shell links only — RBAC still gates
        routes.
      </p>
      <Link href={routes.sarea.roleMapping} className="inline-block text-xs text-cyan-300">
        Open role mapping →
      </Link>
      <span className="mx-2 text-slate-700">·</span>
      <Link
        href={`/api/sarea/preview?redirect=${tenantDashboard}`}
        className="inline-block text-xs text-slate-400"
      >
        Clear preview for /{slug}
      </Link>
    </section>
  );
}
