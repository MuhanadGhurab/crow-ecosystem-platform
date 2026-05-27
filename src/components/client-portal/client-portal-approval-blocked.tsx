import Link from "next/link";
import { CLIENT_PORTAL_APPROVAL_BLOCKED_REASON } from "@/lib/client-portal/client-portal-contract";
import { routes } from "@/lib/routes";

/** I3 — approval actions disabled until verified ownership is enforced server-side. */
export function ClientPortalApprovalBlocked({
  context = "proposal",
  reason,
  compact = false,
}: {
  context?: "proposal" | "blueprint" | "general";
  reason?: string;
  compact?: boolean;
}) {
  const label =
    context === "blueprint"
      ? "Blueprint scope approval"
      : context === "general"
        ? "Approval actions"
        : "Commercial proposal approval";

  const message = reason ?? CLIENT_PORTAL_APPROVAL_BLOCKED_REASON;

  if (compact) {
    return (
      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-sm font-medium text-amber-200">{label} — blocked</p>
        <p className="mt-1 text-sm text-slate-400">{message}</p>
      </section>
    );
  }

  return (
    <section className="cc-glass-card border-amber-500/20 bg-amber-500/5">
      <h2 className="text-sm font-semibold text-amber-200">{label}</h2>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
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
