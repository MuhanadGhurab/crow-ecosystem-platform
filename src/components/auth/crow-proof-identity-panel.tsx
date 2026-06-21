"use client";

import { useEffect, useState } from "react";

type ProofIdentityPayload = {
  identityFingerprint: string;
  currentMandatoryLegalAcceptanceCount: number;
  resolutionState: string;
  platformAccountStatus: string | null;
};

const MANDATORY_LEGAL_TOTAL = 3;

type Props = {
  enabled: boolean;
};

export function CrowProofIdentityPanel({ enabled }: Props) {
  const [payload, setPayload] = useState<ProofIdentityPayload | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    void (async () => {
      try {
        const response = await fetch("/api/c3/proof-identity", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (response.status === 404) {
          setUnavailable(true);
          return;
        }
        if (!response.ok) return;
        const data = (await response.json()) as ProofIdentityPayload;
        setPayload(data);
      } catch {
        setUnavailable(true);
      }
    })();
  }, [enabled]);

  if (!enabled || unavailable || !payload) {
    return null;
  }

  const accountState =
    payload.resolutionState === "active"
      ? "Active"
      : payload.resolutionState === "conflict"
        ? "Conflict"
        : "Pending legal";

  return (
    <div
      className="mt-6 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3 text-left text-xs text-amber-100/90"
      aria-label="Operator proof identity diagnostic"
    >
      <p className="font-medium text-amber-200/90">Operator proof diagnostic</p>
      <dl className="mt-2 space-y-1 font-mono">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-slate-500">Proof identity:</dt>
          <dd>{payload.identityFingerprint}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-slate-500">Account state:</dt>
          <dd>{accountState}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-slate-500">Current legal:</dt>
          <dd>
            {payload.currentMandatoryLegalAcceptanceCount} of {MANDATORY_LEGAL_TOTAL}
          </dd>
        </div>
      </dl>
    </div>
  );
}
