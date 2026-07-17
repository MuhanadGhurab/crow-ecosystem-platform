"use client";

import { useState, useTransition } from "react";
import { completeDiscovery } from "@/lib/actions/discovery";
import { DISCOVERY_BLUEPRINT_COMPLETE_BLOCKED_MESSAGE } from "@/lib/discovery/discovery-mvp-boundaries";
import type { DiscoveryBlueprintGateResult } from "@/lib/services/discovery-completion-gate.service";

export function DiscoveryCompleteButton({
  requestId,
  gate,
  /** CROW.DISCOVERY.2 — default true; server also asserts unless CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE=1 */
  mvpBlueprintCompleteBlocked = true,
}: {
  requestId: string;
  gate?: DiscoveryBlueprintGateResult | null;
  mvpBlueprintCompleteBlocked?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const advisoryBlock = gate && !gate.canProceedAdvisory && gate.status !== "blueprint_exists";

  if (mvpBlueprintCompleteBlocked) {
    return (
      <div
        className="cc-glass-card space-y-4 border border-amber-500/30"
        data-crow-discovery-complete-quarantine="d0-d2"
      >
        <h3 className="text-sm font-medium text-amber-200">Complete discovery → Blueprint</h3>
        <p className="text-sm text-slate-400">{DISCOVERY_BLUEPRINT_COMPLETE_BLOCKED_MESSAGE}</p>
        <button type="button" disabled className="cc-btn-primary cursor-not-allowed opacity-40">
          Blocked in Discovery MVP D0–D2
        </button>
      </div>
    );
  }

  return (
    <div className="cc-glass-card space-y-4">
      <h3 className="text-sm font-medium text-cyan-400">Complete discovery</h3>
      <p className="text-sm text-slate-400">
        Creates or refreshes the draft enterprise blueprint (idempotent by request), syncs modules
        and org model, and moves the request to blueprint build when not already past that stage.
      </p>
      {gate?.status === "blueprint_exists" && (
        <p className="text-xs text-cyan-300">
          Blueprint already exists — this action refreshes module mapping and org intelligence sync.
        </p>
      )}
      {advisoryBlock && (
        <p className="text-xs text-amber-200">
          Gate reports missing data. You can still proceed, but resolve blockers on the checklist above
          first.
        </p>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await completeDiscovery(requestId);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to complete discovery");
            }
          });
        }}
        className="cc-btn-primary disabled:opacity-50"
      >
        {pending ? "Creating blueprint…" : "Complete discovery → Blueprint"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
