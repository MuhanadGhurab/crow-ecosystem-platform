import Link from "next/link";
import type { CyberCrowTenantTrustSnapshot } from "@/lib/cybercrow/cybercrow-tenant-trust-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: CyberCrowTenantTrustSnapshot;
  variant?: "tenant" | "request-preview";
};

const STATUS_CLASS: Record<string, string> = {
  not_started: "border-slate-600/50 text-slate-300",
  needs_review: "border-amber-500/40 text-amber-200",
  in_review: "border-indigo-500/40 text-indigo-200",
  ready_for_go_no_go: "border-teal-500/40 text-teal-200",
  blocked: "border-rose-500/40 text-rose-200",
  advisory_ready: "border-violet-500/40 text-violet-200",
};

export function AdminCybercrowTrustReadinessPanel({ snapshot, variant = "tenant" }: Props) {
  const statusClass = STATUS_CLASS[snapshot.trustStatus] ?? STATUS_CLASS.needs_review;
  const cybercrowHref = snapshot.tenantSlug
    ? routes.tenant(snapshot.tenantSlug).cybercrow.dashboard
    : null;

  return (
    <section className="rounded-xl border border-violet-500/25 bg-violet-950/15 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-violet-100">CyberCrow trust readiness</h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
        >
          {snapshot.trustStatus.replace(/_/g, " ")}
        </span>
      </div>

      {variant === "request-preview" && !snapshot.tenantSlug && (
        <p className="text-sm text-amber-100/90">
          Preparation preview — tenant not provisioned. Identity and GRC expectations from discovery
          and package; not live trust posture.
        </p>
      )}

      <p className="text-xs text-slate-500">{snapshot.disclaimers[0]}</p>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-slate-500">Identity</dt>
          <dd className="text-white">{snapshot.identity.authProviderMode}</dd>
          <dd className="mt-0.5 text-xs text-violet-200/80">{snapshot.identity.entraReadiness}</dd>
        </div>
        <div>
          <dt className="text-slate-500">GRC posture</dt>
          <dd className="text-white">{snapshot.grc.compliancePosture}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Evidence</dt>
          <dd className="text-white">{snapshot.grc.evidenceMapping}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Risk</dt>
          <dd className="text-white capitalize">{snapshot.risk.riskLevel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Access review</dt>
          <dd className="text-white">{snapshot.accessReview.status}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Next ProCrow action</dt>
          <dd className="text-white">{snapshot.nextProCrowAction}</dd>
        </div>
      </dl>

      {snapshot.blockers.length > 0 && (
        <ul className="text-sm text-rose-200/90 list-disc list-inside">
          {snapshot.blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}

      {snapshot.warnings.length > 0 && (
        <ul className="text-xs text-amber-200/80 list-disc list-inside">
          {snapshot.warnings.slice(0, 3).map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      {cybercrowHref && (
        <Link href={cybercrowHref} className="text-sm text-violet-300 hover:text-violet-200">
          Tenant CyberCrow dashboard →
        </Link>
      )}
    </section>
  );
}
