import Link from "next/link";
import { ProCrowPageHeader } from "@/components/procrow/procrow-page-header";
import { ProCrowOperatorQueuePanel } from "@/components/procrow/procrow-operator-queue-panel";
import { ProCrowOperatorQueueBrowser } from "@/components/procrow/procrow-operator-queue-browser";
import { ProCrowSafetyNote } from "@/components/procrow/procrow-safety-note";
import { ProCrowQueueSummaryStrip } from "@/components/procrow/procrow-queue-summary-strip";
import { routes } from "@/lib/routes";
import { getProCrowOperatorQueueSnapshot } from "@/lib/services/procrow-operator-queue.service";

export default async function AdminOperatorQueuePage() {
  const snapshot = await getProCrowOperatorQueueSnapshot();

  return (
    <div className="space-y-8">
      <Link href={routes.admin.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Control tower overview
      </Link>

      <ProCrowPageHeader
        badge="ProCrow · Operator queue"
        title="Request-to-tenant operator queue"
        description="Derived readiness from requests, blueprints, client review signals, onboarding, tenant runtime, and trust checks — read-only. Not a task engine; production remains F23-gated."
      />

      <ProCrowSafetyNote />

      <p className="text-xs text-slate-500">
        Before prioritizing queue work for a demo or deploy, review the{" "}
        <Link href={routes.admin.goNoGo} className="text-cyan-400 hover:text-cyan-300">
          deployment go/no-go center
        </Link>{" "}
        for advisory validation baseline and F23 release gate copy — read-only; no queue mutation.
      </p>

      <ProCrowQueueSummaryStrip summary={snapshot.summary} />

      <ProCrowOperatorQueuePanel
        snapshot={snapshot}
        compact
        showSummary={false}
        showSafetyNotes={false}
        title="Priority highlights"
      />

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Browse by stage
        </h2>
        <p className="text-xs text-slate-500">
          Stage filters group derived items only — statuses are not mutated from this view.
        </p>
        <ProCrowOperatorQueueBrowser snapshot={snapshot} />
      </section>

      {snapshot.nextRecommendedActions.length > 0 && (
        <section className="cc-glass-card !p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Suggested next actions
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
            {snapshot.nextRecommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
