import Link from "next/link";
import type { SareaExperienceMappingSnapshot } from "@/lib/sarea/sarea-experience-mapping-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: SareaExperienceMappingSnapshot;
  variant?: "tenant" | "request-preview";
};

const STATUS_CLASS: Record<string, string> = {
  not_started: "border-slate-600/50 text-slate-300",
  needs_blueprint: "border-amber-500/40 text-amber-200",
  needs_roles: "border-amber-500/40 text-amber-200",
  needs_cybercrow_boundaries: "border-violet-500/40 text-violet-200",
  mapping_ready: "border-teal-500/40 text-teal-200",
  ready_for_go_no_go: "border-teal-500/40 text-teal-200",
  blocked: "border-rose-500/40 text-rose-200",
};

export function AdminSareaExperienceMappingPanel({ snapshot, variant = "tenant" }: Props) {
  const statusClass = STATUS_CLASS[snapshot.status] ?? STATUS_CLASS.needs_blueprint;

  return (
    <section className="rounded-xl border border-rose-500/25 bg-rose-950/15 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-rose-100">SAREA experience mapping</h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
        >
          {snapshot.status.replace(/_/g, " ")}
        </span>
      </div>

      {variant === "request-preview" && !snapshot.tenantSlug && (
        <p className="text-sm text-amber-100/90">
          Preparation preview — expected personas from discovery/blueprint. RBAC applies after tenant
          provision; SAREA does not grant access.
        </p>
      )}

      <p className="text-xs text-slate-500">{snapshot.disclaimers[0]}</p>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-slate-500">Personas</dt>
          <dd className="text-white">{snapshot.personas.length} recommended</dd>
        </div>
        <div>
          <dt className="text-slate-500">Tenant-backed</dt>
          <dd className="text-white">
            {snapshot.tenantBackedPersonaCount} profile(s)
            {snapshot.fallbackUsed ? " · fallback in use" : ""}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">CyberCrow</dt>
          <dd className="text-xs text-violet-200/90">{snapshot.cyberCrowDependencies[0]}</dd>
        </div>
      </dl>

      {snapshot.missingInputs.length > 0 && (
        <ul className="text-xs text-amber-200/80 list-disc list-inside">
          {snapshot.missingInputs.slice(0, 4).map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}

      {snapshot.blockers.length > 0 && (
        <ul className="text-sm text-rose-200/90 list-disc list-inside">
          {snapshot.blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-400">
        Next: {snapshot.recommendedActions[0] ?? "Review studio mapping"}
      </p>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href={routes.sarea.overview} className="text-rose-300 hover:text-rose-200">
          SAREA studio →
        </Link>
        {snapshot.tenantSlug && (
          <Link href={routes.sarea.preview} className="text-rose-300 hover:text-rose-200">
            Experience preview →
          </Link>
        )}
      </div>
    </section>
  );
}
