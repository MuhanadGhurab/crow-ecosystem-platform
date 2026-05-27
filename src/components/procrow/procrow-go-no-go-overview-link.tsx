import Link from "next/link";
import { routes } from "@/lib/routes";

/** Compact control-tower link to the J6 go/no-go center. */
export function ProCrowGoNoGoOverviewLink() {
  return (
    <section className="cc-glass-card !p-5" data-procrow="go-no-go-overview-link">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Deployment go/no-go
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Advisory readiness — validation baseline, F23 production gate, migration and payment guardrails. Operator-run
            scripts only; no deploy automation from this surface.
          </p>
        </div>
        <Link
          href={routes.admin.goNoGo}
          className="shrink-0 rounded-cc-sm border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/15"
        >
          Open go/no-go center →
        </Link>
      </div>
    </section>
  );
}
