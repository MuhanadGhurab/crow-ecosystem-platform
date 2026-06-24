"use client";

import { useTransition, useState } from "react";
import { blueprintLifecycleAction } from "@/lib/actions/persistent-blueprint";
import type { BlueprintRootLifecycleState, BlueprintReviewActionType } from "@/lib/crow-core/blueprint-engine/types";

const ADMIN_ACTIONS: Partial<Record<BlueprintRootLifecycleState, BlueprintReviewActionType[]>> = {
  DRAFT_INTERNAL: ["SUBMIT_FOR_INTERNAL_REVIEW"],
  READY_FOR_INTERNAL_REVIEW: ["REQUEST_INTERNAL_CHANGES", "MARK_READY_TO_SHARE"],
  READY_TO_SHARE: ["SHARE_WITH_CLIENT"],
  CLIENT_ACCEPTED: ["PLATFORM_FINALIZE"],
};

export function PersistentBlueprintAdminActions(props: {
  blueprintId: string;
  lifecycleState: BlueprintRootLifecycleState;
  rowVersion: number;
  versionNumber: number;
  contentHash: string;
}) {
  const [rowVersion, setRowVersion] = useState(props.rowVersion);
  const [lifecycleState, setLifecycleState] = useState(props.lifecycleState);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const actions = ADMIN_ACTIONS[lifecycleState] ?? [];

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <h2 className="text-sm font-medium text-white">Lifecycle actions</h2>
      <p className="text-xs text-slate-400">PLATFORM_ADMIN only · exact version {props.versionNumber}</p>
      {actions.length === 0 && <p className="text-xs text-slate-500">No actions available in {lifecycleState}.</p>}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={pending}
            className="cc-btn-secondary text-xs"
            onClick={() => {
              setMessage(null);
              start(async () => {
                const result = await blueprintLifecycleAction({
                  blueprintId: props.blueprintId,
                  action,
                  versionNumber: props.versionNumber,
                  contentHashAtAction: props.contentHash,
                  expectedRowVersion: rowVersion,
                });
                if (result.ok) {
                  setLifecycleState(result.nextState);
                  setRowVersion((v) => v + 1);
                  setMessage(`Transitioned to ${result.nextState}`);
                } else {
                  setMessage(result.error);
                }
              });
            }}
          >
            {action.replace(/_/g, " ").toLowerCase()}
          </button>
        ))}
      </div>
      {message && <p className="text-xs text-amber-300">{message}</p>}
    </section>
  );
}
