import Link from "next/link";
import { CLIENT_PORTAL_APPROVAL_BLOCKED_REASON } from "@/lib/client-portal/client-portal-contract";
import { routes } from "@/lib/routes";

/** I3 — approval actions disabled until verified ownership is enforced server-side. */
export function ClientPortalApprovalBlocked({
  context = "proposal",
}: {
  context?: "proposal" | "blueprint";
}) {
  const label =
    context === "blueprint"
      ? "Blueprint scope approval"
      : "Commercial proposal approval";

  return (
    <section className="cc-glass-card border-amber-500/20 bg-amber-500/5">
      <h2 className="text-sm font-semibold text-amber-200">{label}</h2>
      <p className="mt-2 text-sm text-slate-400">{CLIENT_PORTAL_APPROVAL_BLOCKED_REASON}</p>
      <p className="mt-3 text-xs text-slate-500">
        Token email links are for locating your materials only. Sign in with the same account as
        your request contact to prepare for verified review.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <span
          className="cc-btn-primary pointer-events-none cursor-not-allowed opacity-50"
          aria-disabled
        >
          Approve (coming soon)
        </span>
        <span
          className="cc-btn-secondary pointer-events-none cursor-not-allowed opacity-50"
          aria-disabled
        >
          Request changes (coming soon)
        </span>
        <Link href={routes.auth.login} className="cc-btn-secondary text-sm">
          Sign in to Client Portal
        </Link>
      </div>
    </section>
  );
}
