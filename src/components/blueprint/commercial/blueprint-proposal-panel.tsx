"use client";

import { useState, useTransition } from "react";
import type { ProposalStatus } from "@prisma/client";
import { PricingHeroPanel } from "@/components/blueprint/commercial/pricing-hero-panel";
import { adminSendProposalAction } from "@/lib/actions/commercial";
import { proposalStatusLabel } from "@/lib/services/commercial.service";

export function BlueprintProposalPanel({
  blueprintId,
  proposalStatus,
  proposalToken,
  estimatedMonthlySar,
  estimateBreakdown,
}: {
  blueprintId: string;
  proposalStatus: ProposalStatus;
  proposalToken: string | null;
  estimatedMonthlySar: number | null;
  estimateBreakdown: {
    baseMonthlySar: number;
    modulesMonthlySar: number;
    securityMonthlySar: number;
    sareaMonthlySar?: number;
    totalMonthlySar: number;
    vatRate?: number;
    vatAmountSar?: number;
    totalInclVatSar?: number;
  } | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState(proposalToken);

  const proposalUrl = token ? `/proposal/${token}` : null;

  function handleSend() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await adminSendProposalAction(blueprintId);
        if (res.token) setToken(res.token);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send proposal");
      }
    });
  }

  if (!estimateBreakdown) {
    return (
      <section className="cc-pricing-panel">
        <p className="text-sm text-slate-400">Pricing estimate unavailable — connect database or complete request selections.</p>
      </section>
    );
  }

  return (
    <PricingHeroPanel
      breakdown={estimateBreakdown}
      storedTotal={estimatedMonthlySar}
      proposalStatusLabel={proposalStatusLabel(proposalStatus)}
      footer={
        <>
          {proposalUrl && (
            <p className="text-xs text-slate-500">
              Client link:{" "}
              <a href={proposalUrl} className="break-all text-cyan-400 hover:text-cyan-300">
                {proposalUrl}
              </a>
            </p>
          )}
          {proposalStatus === "DRAFT" && (
            <button
              type="button"
              onClick={handleSend}
              disabled={pending}
              className="cc-btn-primary w-full text-sm disabled:opacity-50"
            >
              {pending ? "Sending…" : "Send proposal to client"}
            </button>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </>
      }
    />
  );
}
