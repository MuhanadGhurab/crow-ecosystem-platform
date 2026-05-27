import Link from "next/link";
import { routes } from "@/lib/routes";

/** Compact control-tower link to the J7 operator docs & validation console. */
export function ProCrowOperatorConsoleOverviewLink() {
  return (
    <section className="cc-glass-card !p-5" data-procrow="operator-console-overview-link">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Operator docs & validation
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Runbook index and npm verifier catalog with risk labels — shared command list with go/no-go. Manual
            execution only; this surface does not run scripts.
          </p>
        </div>
        <Link
          href={routes.admin.operatorConsole}
          className="shrink-0 rounded-cc-sm border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/15"
        >
          Open operator console →
        </Link>
      </div>
    </section>
  );
}
