import Link from "next/link";
import {
  CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  CLIENT_PORTAL_TOKEN_LINK_NOTICE,
} from "@/lib/client-portal/client-portal-contract";
import { routes } from "@/lib/routes";

/**
 * I3 — public /proposal/[token] must not be approval-authoritative.
 * Replaces active approve/decline until server enforces authenticated ownership.
 */
export function ProposalTokenApprovalNotice() {
  return (
    <section className="cc-glass-card border-amber-500/20 bg-amber-500/5 space-y-4">
      <p className="text-sm text-amber-100/90">{CLIENT_PORTAL_TOKEN_LINK_NOTICE}</p>
      <p className="text-sm text-slate-400">{CLIENT_PORTAL_APPROVAL_BLOCKED_REASON}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={routes.auth.login} className="cc-btn-primary">
          Sign in to Client Portal
        </Link>
        <Link href={routes.public.request} className="cc-btn-secondary">
          Submit a request
        </Link>
      </div>
      <p className="text-xs text-slate-500">
        For official review or approval, use the Client Portal with the same email as your request
        contact. This link does not grant approval rights by itself.
      </p>
    </section>
  );
}
