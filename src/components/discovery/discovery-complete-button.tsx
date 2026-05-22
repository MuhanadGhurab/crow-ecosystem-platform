"use client";

import { useState, useTransition } from "react";
import { completeDiscovery } from "@/lib/actions/discovery";

export function DiscoveryCompleteButton({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="cc-glass-card space-y-4">
      <h3 className="text-sm font-medium text-cyan-400">Complete discovery</h3>
      <p className="text-sm text-slate-400">
        Creates a draft enterprise blueprint with confirmed modules and moves the request to blueprint build.
      </p>
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
