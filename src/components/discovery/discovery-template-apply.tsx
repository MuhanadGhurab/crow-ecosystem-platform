"use client";

import { useTransition } from "react";
import { applyDiscoveryTemplateAction } from "@/lib/actions/discovery";
import { getDiscoveryTemplate } from "@/lib/constants/industry-templates";

export function DiscoveryTemplateApply({
  requestId,
  industry,
  hasStructure,
}: {
  requestId: string;
  industry?: string | null;
  hasStructure: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const pack = industry ? getDiscoveryTemplate(industry) : null;

  if (!pack) return null;

  if (hasStructure) {
    return (
      <p className="mb-4 rounded-lg border border-slate-700/80 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
        Industry: <span className="text-cyan-300">{pack.label}</span> — structure already captured.
        Clear departments/branches in Structure if you need a fresh template apply.
      </p>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-4 py-4">
      <p className="text-sm text-slate-300">
        <strong className="text-cyan-300">{pack.label}</strong> template available — pre-fills
        departments, branches, roles, workflows, modules, and security baseline.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => applyDiscoveryTemplateAction(requestId, pack.key))
        }
        className="cc-btn-primary mt-3 text-sm"
      >
        {pending ? "Applying…" : `Apply ${pack.label} template`}
      </button>
    </div>
  );
}
