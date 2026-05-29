import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { resolveClientProposalFromToken } from "@/lib/services/client-review.service";

/**
 * Public /proposal/[token] — optional bridge to authenticated Client Portal review.
 * Does not grant approval; official approve/request-changes live under /client/*.
 */
export async function ProposalTokenClientPortalCta({
  token,
  user,
}: {
  token: string;
  user: User | null;
}) {
  if (!user?.email) return null;

  const resolved = await resolveClientProposalFromToken(token);
  if (!resolved) return null;

  const allowed = await clientCanAccessRequest(
    user.id,
    user.email,
    resolved.requestId
  ).catch(() => false);

  if (!allowed) return null;

  return (
    <section className="cc-glass-card border-teal-500/25 bg-teal-500/5 space-y-3">
      <p className="text-sm text-teal-100/90">
        You are signed in. Review scope, request changes, and approve (when eligible) in the Client
        Portal — not on this public summary page.
      </p>
      <Link href={routes.client.proposal(resolved.proposalId)} className="cc-btn-primary inline-flex">
        Open in Client Portal
      </Link>
      <p className="text-xs text-slate-500">
        Email links and this page are informational. Approval requires verified request ownership in
        the Client Portal.
      </p>
    </section>
  );
}
