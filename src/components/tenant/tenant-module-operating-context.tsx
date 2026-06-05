import Link from "next/link";
import type { CemModuleRoleAssignment } from "@/lib/cem/cem-operating-model-contract";
import type { CemOperatingFlow } from "@/lib/cem/cem-operating-model-contract";
import { routes } from "@/lib/routes";

type Props = {
  slug: string;
  moduleKey: string;
  moduleAssignment?: CemModuleRoleAssignment;
  relatedFlows: CemOperatingFlow[];
  cybercrowInitialized: boolean;
};

const READINESS_LABEL: Record<CemModuleRoleAssignment["readiness"], string> = {
  tenant_backed: "Tenant-backed",
  demo_limited: "Demo-limited",
  thin: "Thin / advisory",
  not_enabled: "Not enabled",
};

const READINESS_CLASS: Record<CemModuleRoleAssignment["readiness"], string> = {
  tenant_backed: "text-teal-300",
  demo_limited: "text-amber-300",
  thin: "text-slate-400",
  not_enabled: "text-slate-500",
};

export function TenantModuleOperatingContext({
  slug,
  moduleKey,
  moduleAssignment,
  relatedFlows,
  cybercrowInitialized,
}: Props) {
  const r = routes.tenant(slug);
  const readiness = moduleAssignment?.readiness ?? "thin";
  const roles = moduleAssignment?.roles ?? ["supporting_module"];

  return (
    <section className="cc-glass-card border-cyan-500/10 !py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Operating model context
        </h3>
        <span className={`text-[10px] font-medium ${READINESS_CLASS[readiness]}`}>
          {READINESS_LABEL[readiness]}
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Staging operational model — module relationships are advisory; not production ERP depth.
      </p>

      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Operating roles</dt>
          <dd className="text-slate-300">{roles.join(", ").replace(/_/g, " ")}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Related flows</dt>
          <dd className="text-slate-300">
            {relatedFlows.length > 0
              ? relatedFlows.map((f) => f.label).join(" · ")
              : "No mapped flow yet — advisory"}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3 text-xs">
        <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
          Tasks
        </Link>
        <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
          Workflows
        </Link>
        <Link href={r.reports} className="text-cyan-400 hover:text-cyan-300">
          Reports
        </Link>
        <Link
          href={cybercrowInitialized ? r.cybercrow.auditLogs : r.cybercrow.dashboard}
          className="text-violet-400 hover:text-violet-300"
        >
          CyberCrow evidence
        </Link>
        <Link href={routes.sarea.profiles} className="text-rose-400 hover:text-rose-300">
          SAREA experience
        </Link>
      </div>

      {relatedFlows[0] && (
        <p className="text-xs text-slate-500">
          SAREA: {relatedFlows[0].sareaExperienceImpact[0] ?? "Role view adapts when mapping exists"}
          {" · "}
          CyberCrow:{" "}
          {cybercrowInitialized
            ? (relatedFlows[0].cyberCrowEvidence[0] ?? "Audit context on actions")
            : "Initialize CyberCrow for evidence hooks"}
        </p>
      )}
    </section>
  );
}
