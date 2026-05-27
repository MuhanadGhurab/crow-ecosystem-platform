"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { approveClientProposalScopeAction } from "@/lib/actions/client-approval";
import {
  CLIENT_APPROVAL_DISCLAIMER,
  CLIENT_APPROVAL_REQUEST_CHANGES_DEFERRED,
  type ClientApprovalEligibility,
} from "@/lib/client-portal/client-approval-contract";
import { routes } from "@/lib/routes";

export function ClientProposalApprovalPanel({
  proposalId,
  eligibility,
}: {
  proposalId: string;
  eligibility: ClientApprovalEligibility;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "ok" | "err"; message: string } | null>(null);

  const approved = eligibility.proposalState === "approved";

  if (approved) {
    return (
      <section className="cc-glass-card border-teal-500/20 bg-teal-500/5">
        <h2 className="text-sm font-semibold text-teal-200">Scope approved for ProCrow review</h2>
        <p className="mt-2 text-sm text-slate-400">
          Your team&apos;s scope approval is on record. ProCrow will review onboarding and
          provisioning readiness. This is not production go-live or payment authorization.
        </p>
        {eligibility.approvedAt && (
          <p className="mt-2 text-xs text-slate-500">
            Recorded {new Date(eligibility.approvedAt).toLocaleString()}
          </p>
        )}
        {eligibility.requestId && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={routes.client.request(eligibility.requestId)} className="cc-btn-secondary text-sm">
              View request status
            </Link>
            <Link href={routes.client.onboarding} className="cc-btn-secondary text-sm">
              Onboarding tracker
            </Link>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="cc-glass-card border-amber-500/20 bg-amber-500/5">
      <h2 className="text-sm font-semibold text-amber-200">Scope approval for ProCrow</h2>
      <p className="mt-2 text-sm text-slate-400">{CLIENT_APPROVAL_DISCLAIMER}</p>

      {!eligibility.canApprove && eligibility.blockedMessage && (
        <p className="mt-3 text-sm text-amber-200/90">{eligibility.blockedMessage}</p>
      )}

      {feedback && (
        <p
          className={`mt-3 text-sm ${feedback.tone === "ok" ? "text-teal-300" : "text-rose-300"}`}
          role="status"
        >
          {feedback.message}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending || !eligibility.canApprove}
          onClick={() =>
            startTransition(async () => {
              setFeedback(null);
              const result = await approveClientProposalScopeAction(proposalId);
              setFeedback({
                tone: result.ok ? "ok" : "err",
                message: result.message,
              });
              if (result.ok) {
                window.location.reload();
              }
            })
          }
          className="cc-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Approve scope for ProCrow review"}
        </button>
        <span
          className="cc-btn-secondary pointer-events-none cursor-not-allowed opacity-50"
          aria-disabled
          title={CLIENT_APPROVAL_REQUEST_CHANGES_DEFERRED}
        >
          Request changes (coming soon)
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500">{CLIENT_APPROVAL_REQUEST_CHANGES_DEFERRED}</p>
    </section>
  );
}
