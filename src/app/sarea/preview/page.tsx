import Link from "next/link";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { routes } from "@/lib/routes";
import {
  getSareaStudioSummary,
  listSareaExperienceProfiles,
} from "@/lib/services/sarea.service";

export default async function SareaPreviewPage() {
  const [summary, profiles] = await Promise.all([
    getSareaStudioSummary(),
    listSareaExperienceProfiles(),
  ]);

  return (
    <SareaStudioPage
      title="Studio preview"
      description="Aggregate view of SAREA data across all tenants."
    >
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
              {p._count.dashboardLayouts} layouts · {p._count.widgetRules} widgets
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
