"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  clientApproveProposalAction,
  clientDeclineProposalAction,
} from "@/lib/actions/commercial";

export function ProposalClientActions({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await clientApproveProposalAction(token);
            router.refresh();
          })
        }
        className="cc-btn-primary disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Approve proposal"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await clientDeclineProposalAction(token);
            router.refresh();
          })
        }
        className="cc-btn-secondary disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}
