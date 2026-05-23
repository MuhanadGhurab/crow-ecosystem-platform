import Link from "next/link";
import {
  MEEM_LIVE_BLUEPRINT_ID,
  MEEM_LIVE_REQUEST_ID,
  MEEM_TENANT_SLUG,
} from "@/lib/mock/meem-global";
import { routes } from "@/lib/routes";

const PERSONAS = ["executive", "manager", "frontline"] as const;

type SareaAcceptanceHubProps = {
  requestId?: string | null;
  blueprintId?: string | null;
  tenantSlug?: string | null;
  compact?: boolean;
};

/** MEEM lighthouse — Omar SAREA acceptance path (discovery → blueprint → preview). */
export function SareaAcceptanceHub({
  requestId = MEEM_LIVE_REQUEST_ID,
  blueprintId = MEEM_LIVE_BLUEPRINT_ID,
  tenantSlug = MEEM_TENANT_SLUG,
  compact = false,
}: SareaAcceptanceHubProps) {
  if (!requestId || !blueprintId || !tenantSlug) return null;

  const d = routes.discovery(requestId);
  const bp = routes.blueprint(blueprintId);
  const tenantDashboard = routes.tenant(tenantSlug).dashboard;

  const steps = [
    { href: d.experience, label: "1 · Discovery experience", desc: "SAREA package + persona brief" },
    { href: bp.sarea, label: "2 · Blueprint SAREA", desc: "Acceptance tab — provision proof" },
    { href: routes.sarea.preview, label: "3 · Studio preview", desc: "Persona preview hub" },
  ] as const;

  return (
    <section className="cc-glass-card border-rose-500/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
        Lighthouse · SAREA acceptance
      </p>
      <h3 className="mt-2 text-sm font-medium text-white">
        {tenantSlug} — Discovery → Blueprint → Preview
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Twin-engine tenant: SAREA admin validates personas; CyberCrow admin validates security on the
        same slug.
      </p>

      {!compact && (
        <ol className="mt-4 space-y-2">
          {steps.map((step) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className="flex flex-col rounded-cc border border-rose-500/10 bg-rose-950/15 px-3 py-2 text-sm transition hover:border-rose-400/25"
              >
                <span className="font-medium text-rose-100">{step.label}</span>
                <span className="text-xs text-slate-500">{step.desc}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4">
        <p className="text-xs text-slate-500">Step 4 — preview each persona on the live dashboard:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PERSONAS.map((persona) => (
            <Link
              key={persona}
              href={`/api/sarea/preview?persona=${persona}&redirect=${tenantDashboard}`}
              className="cc-btn-secondary text-sm capitalize"
            >
              {persona}
            </Link>
          ))}
          <Link
            href={`/api/sarea/preview?redirect=${tenantDashboard}`}
            className="self-center text-sm text-slate-400"
          >
            Clear
          </Link>
          <Link href={tenantDashboard} className="self-center text-sm text-cyan-400">
            Dashboard →
          </Link>
        </div>
      </div>
    </section>
  );
}
