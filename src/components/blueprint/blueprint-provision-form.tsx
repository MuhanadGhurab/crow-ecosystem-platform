"use client";

import { useState, useTransition } from "react";
import { provisionBlueprintTenant } from "@/lib/actions/blueprint";
import {
  TENANT_PROVISION_ALREADY_PREPARED,
  TENANT_PROVISION_BUTTON_LABEL,
  TENANT_PROVISION_PANEL_DESCRIPTION,
  TENANT_PROVISION_PANEL_TITLE,
  TENANT_PROVISION_PENDING_LABEL,
  TENANT_PROVISION_SAFETY_NOTE,
  TENANT_PROVISION_STATUS_NOTE,
} from "@/lib/constants/tenant-provisioning-wording";

export function BlueprintProvisionForm({
  blueprintId,
  suggestedSlug,
  disabled,
  blockers = [],
  warnings = [],
}: {
  blueprintId: string;
  suggestedSlug: string;
  disabled?: boolean;
  blockers?: string[];
  warnings?: string[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const gated = blockers.length > 0;

  if (disabled) {
    return (
      <p className="text-sm text-teal-300">{TENANT_PROVISION_ALREADY_PREPARED}</p>
    );
  }

  return (
    <form
      className="cc-glass-card space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const slug = new FormData(e.currentTarget).get("tenantSlug");
        startTransition(async () => {
          try {
            await provisionBlueprintTenant(blueprintId, slug ? String(slug) : undefined);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Runtime preparation failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-medium text-cyan-400">{TENANT_PROVISION_PANEL_TITLE}</h3>
      <p className="text-sm text-slate-400">{TENANT_PROVISION_PANEL_DESCRIPTION}</p>
      <p className="text-xs text-slate-500">{TENANT_PROVISION_STATUS_NOTE}</p>
      <p className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3 text-xs text-amber-100/90">
        {TENANT_PROVISION_SAFETY_NOTE}
      </p>
      {gated && (
        <ul className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-300">
          {blockers.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && !gated && (
        <ul className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3 text-sm text-amber-200/90">
          {warnings.map((w) => (
            <li key={w}>• {w}</li>
          ))}
        </ul>
      )}
      <label className="block text-sm text-slate-400">
        Tenant URL slug (staging workspace)
        <input
          name="tenantSlug"
          defaultValue={suggestedSlug}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className="input-cc mt-2 font-mono"
          required
        />
      </label>
      <button
        type="submit"
        disabled={pending || gated}
        className="cc-btn-primary disabled:opacity-50"
      >
        {pending ? TENANT_PROVISION_PENDING_LABEL : TENANT_PROVISION_BUTTON_LABEL}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
