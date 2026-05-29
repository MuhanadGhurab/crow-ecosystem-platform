import Link from "next/link";
import { ProCrowOperatorQueueBrowser } from "@/components/procrow/procrow-operator-queue-browser";
import { ProCrowOperatorQueuePanel } from "@/components/procrow/procrow-operator-queue-panel";
import { ProCrowQueueSummaryStrip } from "@/components/procrow/procrow-queue-summary-strip";
import { ProCrowSafetyNote } from "@/components/procrow/procrow-safety-note";
import { ProCrowContextLinkGrid } from "@/components/procrow/procrow-context-link-grid";
import { ProCrowWorkbenchPageHeader } from "@/components/procrow/procrow-workbench-page-header";
import { routes } from "@/lib/routes";
import { getProCrowOperatorQueueSnapshot } from "@/lib/services/procrow-operator-queue.service";

export default async function AdminOperatorQueuePage() {
  const snapshot = await getProCrowOperatorQueueSnapshot();

  return (
    <div className="space-y-6">
      <ProCrowWorkbenchPageHeader
        eyebrow="ProCrow · Operator queue"
        title="What needs attention now"
        purpose="Derived request-to-tenant readiness — read-only. Pick a lane, open the workspace, act. Not a task engine."
        backHref={routes.admin.overview}
        backLabel="← Control tower"
      />

      <ProCrowQueueSummaryStrip summary={snapshot.summary} />

      {snapshot.nextRecommendedActions.length > 0 && (
        <section className="cc-glass-card !p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Suggested next</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {snapshot.nextRecommendedActions.slice(0, 4).map((action) => (
              <li key={action}>• {action}</li>
            ))}
          </ul>
        </section>
      )}

      <ProCrowOperatorQueuePanel
        snapshot={snapshot}
        compact
        showSummary={false}
        showSafetyNotes={false}
        title="Priority highlights"
      />

      <ProCrowWorkbenchSectionInline title="Browse by stage" hint="Filter derived items — no status mutations.">
        <ProCrowOperatorQueueBrowser snapshot={snapshot} />
      </ProCrowWorkbenchSectionInline>

      <ProCrowContextLinkGrid
        links={[
          { label: "All requests", href: routes.admin.requests, description: "Request list" },
          { label: "Go / No-Go", href: routes.admin.goNoGo, description: "Deployment discipline" },
          { label: "Operator console", href: routes.admin.operatorConsole, description: "Runbooks & verifiers" },
        ]}
      />

      <ProCrowSafetyNote />
    </div>
  );
}

function ProCrowWorkbenchSectionInline({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
      {children}
    </section>
  );
}
