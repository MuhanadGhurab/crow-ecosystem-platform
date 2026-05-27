import Link from "next/link";
import { routes } from "@/lib/routes";

/** Compact staging/trust copy for client dashboard — I8 demo polish. */
export function ClientPortalTrustStrip() {
  return (
    <section
      className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-400"
      aria-label="Client portal trust notice"
    >
      <p>
        <span className="font-medium text-slate-300">Staging preview.</span> Scope approval happens
        on a linked proposal detail page after sign-in — not from email links alone. No payments,
        e-signatures, or production go-live are activated here.
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Demo path (mock): sign in as{" "}
        <span className="font-mono text-slate-400">client.demo@alnoor.test</span> →{" "}
        <Link href={routes.client.proposals} className="text-teal-400 hover:text-teal-300">
          Proposals
        </Link>{" "}
        → <span className="font-mono text-slate-400">mock-bp-001</span>.
      </p>
    </section>
  );
}
