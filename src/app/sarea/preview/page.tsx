import Link from "next/link";
import { SareaAcceptanceHub } from "@/components/studio/sarea/sarea-acceptance-hub";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";
import {
  getSareaStudioSummary,
  listSareaExperienceProfiles,
} from "@/lib/services/sarea.service";

const PREVIEW_PERSONAS = [
  { key: "executive", label: "Executive", note: "Trust summary, fleet KPIs, compact nav" },
  { key: "manager", label: "Manager", note: "Workflow warnings, team ops widgets" },
  { key: "frontline", label: "Frontline", note: "Task-first density, logistics shortcuts" },
] as const;

const ADVISORY_PERSONAS = [
  { key: "analyst", label: "Analyst", note: "Map via profile personaKey in studio — preview cookie uses executive/manager/frontline" },
  { key: "tenant_admin", label: "Tenant admin", note: "Full nav; map role slug to admin profile in role mapping" },
] as const;

export default async function SareaPreviewPage() {
  const [summary, profiles] = await Promise.all([
    getSareaStudioSummary(),
    listSareaExperienceProfiles(),
  ]);
  const tenantDashboard = routes.tenant(MEEM_TENANT_SLUG).dashboard;

  return (
    <SareaStudioPage
      title="Studio preview"
      description="Switch persona context on the live MEEM dashboard — RBAC unchanged."
    >
      <section className="rounded-lg border border-rose-500/20 bg-rose-950/15 px-4 py-3 text-sm">
        <p className="font-medium text-rose-200">RBAC vs SAREA</p>
        <p className="mt-1 text-xs text-slate-400">
          Preview sets a cookie for platform staff only. It changes dashboard widgets and navigation
          density — not role permissions. CyberCrow analysts should use the security console for
          posture; executives see trust-oriented widgets here.
        </p>
      </section>

      <SareaAcceptanceHub compact />

      <section>
        <h3 className="text-sm font-medium text-rose-300">Live persona preview (MEEM)</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {PREVIEW_PERSONAS.map((p) => (
            <Link
              key={p.key}
              href={`/api/sarea/preview?persona=${p.key}&redirect=${tenantDashboard}`}
              className="cc-btn-secondary text-sm capitalize"
            >
              {p.label}
            </Link>
          ))}
          <Link
            href={`/api/sarea/preview?redirect=${tenantDashboard}`}
            className="text-sm text-slate-400 underline"
          >
            Clear preview
          </Link>
        </div>
        <ul className="mt-3 space-y-1 text-xs text-slate-500">
          {PREVIEW_PERSONAS.map((p) => (
            <li key={p.key}>
              <span className="capitalize text-slate-300">{p.label}</span> — {p.note}
            </li>
          ))}
        </ul>
      </section>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-slate-300">Additional personas (studio mapping)</h3>
        <ul className="mt-2 space-y-2 text-xs text-slate-500">
          {ADVISORY_PERSONAS.map((p) => (
            <li key={p.key}>
              <span className="text-slate-300">{p.label}</span> — {p.note}
            </li>
          ))}
        </ul>
        <Link href={routes.sarea.roleMapping} className="mt-3 inline-block text-xs text-rose-300">
          Role mapping →
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="cc-glass-card text-center">
          <p className="text-xl font-bold text-cyan-300">{summary.layoutCount}</p>
          <p className="text-xs text-slate-500">Layouts</p>
        </div>
        <div className="cc-glass-card text-center">
          <p className="text-xl font-bold text-cyan-300">{summary.widgetRuleCount}</p>
          <p className="text-xs text-slate-500">Widget rules</p>
        </div>
        <div className="cc-glass-card text-center">
          <p className="text-xl font-bold text-cyan-300">{summary.deviceRuleCount}</p>
          <p className="text-xs text-slate-500">Device rules</p>
        </div>
      </section>

      <ul className="mt-6 space-y-2">
        {profiles.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap justify-between gap-2 rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
          >
            <span className="text-white">{p.name}</span>
            <span className="text-slate-500">
              {p.personaKey} · {p._count.dashboardLayouts} layouts · {p._count.widgetRules} widgets
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 pt-4">
        <Link href={routes.sarea.layouts} className="cc-btn-secondary text-sm">
          Edit layouts
        </Link>
        <Link href={routes.sarea.profiles} className="cc-btn-secondary text-sm">
          All profiles
        </Link>
      </div>
    </SareaStudioPage>
  );
}
