import Link from "next/link";
import type { CyberCrowTenantTrustSnapshot } from "@/lib/cybercrow/cybercrow-tenant-trust-contract";
import { CYBERCROW_SCOPE } from "@/lib/constants/cybercrow-ux-depth";
import { routes } from "@/lib/routes";

type Props = {
  tenantSlug: string;
  snapshot: CyberCrowTenantTrustSnapshot;
};

export function CybercrowTenantTrustSummary({ tenantSlug, snapshot }: Props) {
  const r = routes.tenant(tenantSlug).cybercrow;

  return (
    <section className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-5 sm:p-6 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
          Tenant trust readiness (M1)
        </p>
        <p className="mt-1 text-sm text-slate-400">
          CyberCrow provides readiness and posture; it does not replace SIEM, legal audit, certified
          compliance, or live IdP enforcement.
        </p>
      </div>

      <p className="rounded-lg border border-violet-500/15 bg-violet-950/30 px-3 py-2 text-xs text-slate-400">
        Status: <span className="text-violet-200">{snapshot.trustStatus.replace(/_/g, " ")}</span>
        {" · "}
        {snapshot.nextProCrowAction}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-3">
          <h4 className="text-xs font-medium text-violet-300">Identity readiness</h4>
          <p className="mt-2 text-slate-300">{snapshot.identity.identityModel}</p>
          <p className="mt-1 text-xs text-slate-500">{snapshot.identity.entraReadiness}</p>
          <p className="mt-1 text-xs text-slate-500">{snapshot.identity.accessReviewStatus}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-3">
          <h4 className="text-xs font-medium text-indigo-300">GRC readiness</h4>
          <p className="mt-2 text-slate-300">{snapshot.grc.compliancePosture}</p>
          <p className="mt-1 text-xs text-slate-500">{snapshot.grc.controlMapping}</p>
          <Link href={r.grc} className="mt-2 inline-block text-xs text-indigo-400 hover:text-indigo-300">
            GRC console →
          </Link>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-3">
          <h4 className="text-xs font-medium text-teal-300">Evidence readiness</h4>
          <p className="mt-2 text-slate-300">{snapshot.evidence.readinessNotes}</p>
          {snapshot.evidence.missingEvidence.length > 0 && (
            <p className="mt-1 text-xs text-amber-200/90">
              {snapshot.evidence.missingEvidence.length} gap(s) flagged
            </p>
          )}
          <Link href={r.evidence} className="mt-2 inline-block text-xs text-teal-400 hover:text-teal-300">
            Evidence →
          </Link>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-3">
          <h4 className="text-xs font-medium text-amber-300">Risk posture</h4>
          <p className="mt-2 capitalize text-slate-300">{snapshot.risk.riskLevel}</p>
          <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
            {snapshot.risk.mainRisks.slice(0, 3).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <Link href={r.risk} className="mt-2 inline-block text-xs text-amber-400 hover:text-amber-300">
            Risk →
          </Link>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-3 md:col-span-2">
          <h4 className="text-xs font-medium text-cyan-300">Access review checklist</h4>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-400 space-y-0.5">
            {snapshot.accessReview.checklist.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-xs text-slate-500 border-t border-violet-500/10 pt-4">
        <p>
          <span className="text-rose-300/90">SAREA:</span> {snapshot.sareaRelationshipNote}
        </p>
        <p>
          <span className="text-cyan-300/90">Go/No-Go:</span> {snapshot.goNoGoDependencies[0]}
        </p>
        <p className="sm:col-span-2">
          <span className="text-teal-300/90">CEM:</span> {snapshot.cemRelationshipNote}
        </p>
      </div>

      <ul className="list-inside list-disc text-[11px] text-slate-600">
        {CYBERCROW_SCOPE.whatItIsNot.slice(0, 3).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
