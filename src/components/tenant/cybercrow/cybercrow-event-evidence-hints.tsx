import Link from "next/link";
import type { EventEvidenceContext } from "@/lib/services/cybercrow-evidence-grc.service";
import { routes } from "@/lib/routes";

type Props = {
  tenantSlug: string;
  context: EventEvidenceContext;
};

export function CybercrowEventEvidenceHints({ tenantSlug, context }: Props) {
  const r = routes.tenant(tenantSlug).cybercrow;
  return (
    <div className="mt-2 rounded-cc-sm border border-indigo-500/15 bg-indigo-950/10 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-indigo-300">Evidence linkage</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            context.evidenceReady
              ? "bg-teal-500/15 text-teal-300"
              : "bg-amber-500/15 text-amber-300"
          }`}
        >
          {context.evidenceReady ? "Review captured" : "Needs review"}
        </span>
      </div>
      <p className="mt-1 text-slate-500">{context.auditNote}</p>
      <ul className="mt-2 list-inside list-disc text-slate-500">
        {context.hints.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap gap-3">
        <Link href={r.evidence} className="text-indigo-400 hover:text-indigo-300">
          Evidence catalog →
        </Link>
        <Link href={r.auditLogs} className="text-cyan-400 hover:text-cyan-300">
          Audit logs →
        </Link>
      </div>
    </div>
  );
}
