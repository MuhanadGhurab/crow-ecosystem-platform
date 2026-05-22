import Link from "next/link";
import { AI_EXTRAS } from "@/lib/constants/ai-extras";
import { MEEM_LOGISTICS_FEATURES } from "@/lib/meem/meem-ops-catalog";
import { routes } from "@/lib/routes";

type MeemLogisticsHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemLogisticsHub({ slug, organizationName, aiExtraKeys }: MeemLogisticsHubProps) {
  const enabled = new Set(aiExtraKeys);
  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <section className="cc-glass-card border-cyan-500/15">
        <h3 className="text-sm font-medium text-cyan-400">Operations hub</h3>
        <p className="mt-2 text-sm text-slate-400">
          {organizationName} — multi-hub logistics with OCR document intake and AI-assisted dispatch
          on live CEM workflows.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={r.workflows} className="cc-btn-secondary text-sm">
            View workflows
          </Link>
          <Link href={`${r.cybercrow.auditLogs}?category=logistics`} className="cc-btn-secondary text-sm">
            Logistics audit trail
          </Link>
          <Link href={r.warehouse} className="cc-btn-secondary text-sm">
            Warehouse
          </Link>
          <Link href={r.inventory} className="cc-btn-secondary text-sm">
            Inventory
          </Link>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-teal-300">OCR & AI capabilities</h3>
        <p className="mt-1 text-xs text-slate-500">
          Commercial add-ons from discovery — priced on blueprint; wired to tenant workflows below.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {MEEM_LOGISTICS_FEATURES.map((feature) => {
            const extra = AI_EXTRAS.find((e) => e.key === feature.aiExtraKey);
            const isOn = enabled.has(feature.aiExtraKey);
            return (
              <li
                key={feature.key}
                className={`rounded-cc border p-4 ${
                  isOn
                    ? "border-teal-500/25 bg-teal-950/20"
                    : "border-slate-700/40 bg-white/[0.02]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-white">{feature.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isOn ? "bg-teal-500/20 text-teal-300" : "bg-slate-700/50 text-slate-500"
                    }`}
                  >
                    {isOn ? feature.status : "Not subscribed"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                {extra && (
                  <p className="mt-3 text-xs text-teal-300/90">
                    +{extra.monthlySar} SAR/mo · {extra.nameEn}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-cyan-400">Shipment pipeline (static)</h3>
        <ol className="mt-4 space-y-2 text-sm text-slate-400">
          <li className="flex gap-2">
            <span className="font-mono text-cyan-500/80">1</span>
            OCR document capture — upload POD/BOL, extract, verify
          </li>
          <li className="flex gap-2">
            <span className="font-mono text-cyan-500/80">2</span>
            Shipment dispatch approval — hub review and release
          </li>
          <li className="flex gap-2">
            <span className="font-mono text-cyan-500/80">3</span>
            AI route optimization — dispatcher approves fleet plan
          </li>
          <li className="flex gap-2">
            <span className="font-mono text-cyan-500/80">4</span>
            Anomaly detection — SLA breach alerts to CyberCrow
          </li>
        </ol>
      </section>
    </div>
  );
}
