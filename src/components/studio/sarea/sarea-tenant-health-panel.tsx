import Link from "next/link";
import { routes } from "@/lib/routes";
import type { TenantSareaHealthDetail } from "@/lib/services/sarea-studio.service";

const ADVISORY_STYLES: Record<
  TenantSareaHealthDetail["advisory"],
  { label: string; className: string }
> = {
  healthy: { label: "Healthy", className: "text-teal-300 border-teal-500/20 bg-teal-950/20" },
  needs_review: {
    label: "Needs review",
    className: "text-amber-300 border-amber-500/20 bg-amber-950/20",
  },
  missing_mapping: {
    label: "Missing mapping",
    className: "text-rose-300 border-rose-500/20 bg-rose-950/20",
  },
  fallback_only: {
    label: "Fallback only",
    className: "text-violet-300 border-violet-500/20 bg-violet-950/20",
  },
};

type Props = {
  health: TenantSareaHealthDetail;
  tenantSlug: string;
};

export function SareaTenantHealthPanel({ health, tenantSlug }: Props) {
  const style = ADVISORY_STYLES[health.advisory];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-cc border border-teal-500/15 bg-teal-950/15 px-3 py-2 text-center">
          <p className="text-lg font-semibold text-teal-300">
            {health.backedPersonas}/{health.totalPersonas}
          </p>
          <p className="text-[10px] text-slate-500">Tenant-backed personas</p>
        </div>
        <div className={`rounded-cc border px-3 py-2 text-center ${style.className}`}>
          <p className="text-sm font-semibold">{style.label}</p>
          <p className="text-[10px] opacity-80">Advisory posture</p>
        </div>
        <div className="rounded-cc border border-amber-500/15 bg-amber-950/15 px-3 py-2 text-center">
          <p className="text-lg font-semibold text-amber-300">{health.unmappedRoleSlugs.length}</p>
          <p className="text-[10px] text-slate-500">Unmapped RBAC slugs</p>
        </div>
        <div className="rounded-cc border border-cyan-500/15 bg-cyan-950/15 px-3 py-2 text-center">
          <p className="text-lg font-semibold text-cyan-300">
            {health.profilesWithoutWidgets.length + health.profilesWithoutNavigation.length}
          </p>
          <p className="text-[10px] text-slate-500">Profile gaps (widgets/nav)</p>
        </div>
      </div>

      {health.unmappedRoleSlugs.length > 0 ? (
        <p className="text-xs text-amber-200/90">
          Recommended RBAC slugs not yet mapped:{" "}
          <span className="font-mono text-slate-400">{health.unmappedRoleSlugs.join(", ")}</span>
        </p>
      ) : null}

      <div>
        <h4 className="text-xs font-medium text-slate-400">Next recommended actions</h4>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-500">
          {health.nextActions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-white/5 pt-3">
        <Link href={routes.sarea.roleMapping} className="text-sm text-rose-300 hover:text-rose-200">
          Role mapping →
        </Link>
        <Link href={routes.sarea.widgets} className="text-sm text-slate-400 hover:text-slate-300">
          Widgets →
        </Link>
        <Link href={routes.sarea.navigation} className="text-sm text-slate-400 hover:text-slate-300">
          Navigation →
        </Link>
        <Link href={routes.sarea.preview} className="text-sm text-slate-400 hover:text-slate-300">
          Preview →
        </Link>
        <Link
          href={`/api/sarea/preview?redirect=${routes.tenant(tenantSlug).dashboard}`}
          className="text-sm text-cyan-300 hover:text-cyan-200"
        >
          Clear preview cookie →
        </Link>
      </div>
    </div>
  );
}
