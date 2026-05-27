import Link from "next/link";
import { CLIENT_PORTAL_APPROVAL_BLOCKED_REASON } from "@/lib/client-portal/client-portal-contract";
import { routes } from "@/lib/routes";

/**
 * Shown on list/summary pages — approval runs on proposal detail (I6).
 * `guide` = informational (I8 polish); `blocked` = explicit blocked wording (legacy compact).
 */
export function ClientPortalApprovalBlocked({
  context = "proposal",
  reason,
  compact = false,
  variant = "guide",
}: {
  context?: "proposal" | "blueprint" | "general";
  reason?: string;
  compact?: boolean;
  variant?: "guide" | "blocked";
}) {
  const label =
    context === "blueprint"
      ? "Blueprint scope approval"
      : context === "general"
        ? "Approval actions"
        : "Commercial proposal approval";

  const message = reason ?? CLIENT_PORTAL_APPROVAL_BLOCKED_REASON;
  const isGuide = variant === "guide" && !compact;

  if (compact) {
    return (
      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-sm font-medium text-amber-200">
          {label} — {variant === "guide" ? "on proposal detail" : "blocked"}
        </p>
        <p className="mt-1 text-sm text-slate-400">{message}</p>
      </section>
    );
  }

  return (
    <section
      className={
        isGuide
          ? "cc-glass-card border-cyan-500/20 bg-cyan-500/5"
          : "cc-glass-card border-amber-500/20 bg-amber-500/5"
      }
    >
      <h2
        className={`text-sm font-semibold ${isGuide ? "text-cyan-200" : "text-amber-200"}`}
      >
        {isGuide ? "How scope approval works" : label}
      </h2>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
      <p className="mt-3 text-xs text-slate-500">
        Email proposal links help you find materials — they do not authorize approval. Sign in with
        the same account as your request contact, open the proposal, and use{" "}
        <span className="text-slate-400">Approve scope for ProCrow review</span> when eligible.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={routes.client.proposals} className="cc-btn-primary text-sm">
          {isGuide ? "Open proposals" : "Open proposals to approve scope"}
        </Link>
        <Link href={routes.client.requests} className="cc-btn-secondary text-sm">
          Your requests
        </Link>
      </div>
    </section>
  );
}
