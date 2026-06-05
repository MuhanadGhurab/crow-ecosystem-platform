"use client";

import { useActionState } from "react";
import {
  advancePurchaseToStockStageAction,
  createPurchaseToStockRequestAction,
  type CemTransactionActionState,
} from "@/lib/actions/cem-transaction-workflow";
import type { CemTransactionWorkflowSnapshot } from "@/lib/cem/cem-transaction-workflow-contract";

type Props = {
  snapshot: CemTransactionWorkflowSnapshot;
};

export function CemTransactionWorkflowActions({ snapshot }: Props) {
  const [createState, createAction, createPending] = useActionState<
    CemTransactionActionState,
    FormData
  >(createPurchaseToStockRequestAction, undefined);

  const [advanceState, advanceAction, advancePending] = useActionState<
    CemTransactionActionState,
    FormData
  >(advancePurchaseToStockStageAction, undefined);

  if (!snapshot.actionsEnabled && snapshot.request.source === "advisory") {
    return (
      <p className="text-sm text-slate-400">
        Read-only advisory prototype — create tenant purchase data or use ops seeding to enable
        stage actions.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {snapshot.request.id !== "advisory-purchase-to-stock" && snapshot.nextActions.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Stage actions</p>
          {snapshot.nextActions.map((action) => (
            <form key={action.id} action={advanceAction} className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="tenantSlug" value={snapshot.tenantSlug} />
              <input type="hidden" name="requestId" value={snapshot.request.id} />
              <input type="hidden" name="actionKey" value={action.actionKey ?? ""} />
              <button
                type="submit"
                disabled={!action.allowed || advancePending}
                className="cc-btn-primary text-sm disabled:opacity-50"
                title={action.blockedReason}
              >
                {action.label}
              </button>
              <span className="text-xs text-slate-500">{action.description}</span>
            </form>
          ))}
          {advanceState?.error && <p className="text-sm text-rose-400">{advanceState.error}</p>}
          {advanceState?.success && <p className="text-sm text-teal-400">{advanceState.success}</p>}
        </div>
      )}

      {snapshot.actionsEnabled && (
        <details className="rounded-lg border border-white/10 p-4">
          <summary className="cursor-pointer text-sm font-medium text-white">
            Create purchase-to-stock request
          </summary>
          <form action={createAction} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="tenantSlug" value={snapshot.tenantSlug} />
            <label className="block sm:col-span-2">
              <span className="text-xs text-slate-400">Title</span>
              <input name="title" required className="cc-input mt-1 w-full" />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Item</span>
              <input name="itemName" required className="cc-input mt-1 w-full" />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Quantity</span>
              <input name="quantity" type="number" min={1} defaultValue={1} className="cc-input mt-1 w-full" />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Department</span>
              <input name="department" required className="cc-input mt-1 w-full" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-slate-400">Business reason</span>
              <textarea name="businessReason" required rows={2} className="cc-input mt-1 w-full" />
            </label>
            <button type="submit" disabled={createPending} className="cc-btn-secondary text-sm sm:col-span-2">
              Create draft request
            </button>
          </form>
          {createState?.error && <p className="mt-2 text-sm text-rose-400">{createState.error}</p>}
          {createState?.success && <p className="mt-2 text-sm text-teal-400">{createState.success}</p>}
        </details>
      )}
    </div>
  );
}
