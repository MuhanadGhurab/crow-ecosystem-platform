import type { SareaPersonaMaterializationRow } from "@/lib/services/sarea-materialization.service";
import {
  materializationStateHint,
  materializationStateLabel,
} from "@/lib/services/sarea-materialization.service";

function stateBadgeClass(state: SareaPersonaMaterializationRow["state"]): string {
  switch (state) {
    case "tenant_backed":
      return "bg-teal-500/15 text-teal-300";
    case "partial":
      return "bg-amber-500/15 text-amber-300";
    case "not_materialized":
      return "bg-slate-500/20 text-slate-400";
    case "recommended_fallback":
      return "bg-violet-500/15 text-violet-300";
    default:
      return "bg-white/5 text-slate-400";
  }
}

type Props = {
  rows: SareaPersonaMaterializationRow[];
  tenantSlug?: string;
  compact?: boolean;
};

export function SareaPersonaMaterializationPanel({ rows, tenantSlug, compact }: Props) {
  return (
    <div className="space-y-3">
      {tenantSlug ? (
        <p className="text-xs text-slate-500">
          Tenant <span className="font-mono text-slate-400">/{tenantSlug}</span> — Role → RBAC →
          SAREA profile → dashboard layout → navigation → widgets. SAREA does not grant access.
        </p>
      ) : null}
      <ul className={compact ? "space-y-2" : "space-y-3"}>
        {rows.map((row) => (
          <li
            key={row.personaKey}
            className="rounded-cc border border-cyan-500/10 bg-white/[0.02] px-4 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-white">{row.label}</span>
              <span className="font-mono text-[10px] text-slate-500">{row.personaKey}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${stateBadgeClass(row.state)}`}
              >
                {materializationStateLabel(row.state)}
              </span>
            </div>
            {!compact ? (
              <p className="mt-1 text-xs text-slate-500">{materializationStateHint(row.state)}</p>
            ) : null}
            <dl className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-slate-600">Recommended RBAC slugs</dt>
                <dd className="font-mono text-slate-400">
                  {row.recommendedRoleSlugs.length > 0
                    ? row.recommendedRoleSlugs.join(", ")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-600">Mapped in studio</dt>
                <dd className="font-mono text-slate-400">
                  {row.mappedRoleSlugs.length > 0 ? row.mappedRoleSlugs.join(", ") : "—"}
                </dd>
              </div>
              {row.state === "tenant_backed" || row.state === "partial" ? (
                <div className="sm:col-span-2">
                  <dt className="text-slate-600">Materialized</dt>
                  <dd className="text-slate-400">
                    {row.profileName ?? "—"} · {row.layoutCount} layouts · {row.widgetCount}{" "}
                    widgets · {row.navCount} nav
                  </dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
