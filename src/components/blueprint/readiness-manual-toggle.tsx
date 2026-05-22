"use client";

import { useTransition } from "react";
import { toggleManualReadinessAction } from "@/lib/actions/readiness";
import type { GoLiveChecklistKey } from "@/lib/constants/go-live-checklist";

export function ReadinessManualToggle({
  blueprintId,
  itemKey,
  label,
  defaultChecked,
}: {
  blueprintId: string;
  itemKey: GoLiveChecklistKey;
  label: string;
  defaultChecked: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled={pending}
        onChange={(e) => {
          startTransition(() =>
            toggleManualReadinessAction(blueprintId, itemKey, e.target.checked)
          );
        }}
        className="rounded border-cyan-500/30"
      />
      {label}
    </label>
  );
}
