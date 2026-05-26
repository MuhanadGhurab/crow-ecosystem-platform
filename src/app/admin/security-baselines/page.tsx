import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { listSecurityBaselines } from "@/lib/services/platform-admin.service";
import { routes } from "@/lib/routes";

export default function AdminSecurityBaselinesPage() {
  const baselines = listSecurityBaselines();

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        title="Security baselines"
        description="Security package tiers offered during request intake. Advisory catalog — enforcement happens in CyberCrow, not in this list."
      />

      <section className="cc-glass-card space-y-3">
        <h3 className="text-sm font-medium text-cyan-400">Operator notes</h3>
        <ul className="space-y-2 text-sm text-slate-500">
          <li>- Baselines are selected during request intake and refined during discovery.</li>
          <li>- Use CyberCrow to review posture, evidence, and audit logs after go-live.</li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href={routes.admin.requests} className="cc-btn-secondary text-sm">
            Review requests →
          </Link>
          <Link href={routes.admin.audit} className="cc-btn-secondary text-sm">
            Audit feed →
          </Link>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Available tiers</h3>
        <ul className="mt-3 space-y-4">
          {baselines.map((b) => (
            <li key={b.key} className="cc-glass-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{b.name}</p>
                  <p className="font-mono text-xs text-cyan-400">{b.key}</p>
                </div>
                <p className="text-sm font-semibold text-cyan-300">+{b.monthlyAddonSar} SAR/mo</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">{b.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
