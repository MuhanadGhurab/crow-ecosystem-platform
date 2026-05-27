import Link from "next/link";
import { routes } from "@/lib/routes";

/** Compact 10-minute demo path — staging/portfolio only (J8). */
export function ProCrowDemoRehearsalHint() {
  return (
    <section
      className="rounded-cc-sm border border-slate-700/40 bg-slate-900/40 px-4 py-3 text-xs text-slate-500"
      data-procrow="demo-rehearsal-hint"
    >
      <span className="font-semibold text-slate-400">10-minute demo path:</span>{" "}
      <Link href={routes.admin.queue} className="text-cyan-400/90 hover:text-cyan-300">
        queue
      </Link>
      {" → request detail → CyberCrow → SAREA → "}
      <Link href={routes.admin.goNoGo} className="text-cyan-400/90 hover:text-cyan-300">
        go/no-go
      </Link>
      {" → "}
      <Link href={routes.admin.operatorConsole} className="text-cyan-400/90 hover:text-cyan-300">
        operator console
      </Link>
      . Staging/demo mode — operator-guided; F23-gated production; no UI deploy or script execution.
    </section>
  );
}
