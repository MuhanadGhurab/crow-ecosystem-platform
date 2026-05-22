"use client";

import { useState, useTransition } from "react";
import { MetaDl } from "@/components/ui/meta-dl";
import {
  saveOrganizationDiscovery,
  type OrganizationDiscoveryInput,
} from "@/lib/actions/discovery";

export function DiscoveryOrganizationForm({
  requestId,
  initial,
}: {
  requestId: string;
  initial: OrganizationDiscoveryInput & {
    organizationName: string;
    industry?: string | null;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const input: OrganizationDiscoveryInput = {
      operatingModel: String(form.get("operatingModel")),
      employeeBand: String(form.get("employeeBand")),
      goLiveTarget: String(form.get("goLiveTarget")),
      discoveryNotes: String(form.get("discoveryNotes")),
    };

    startTransition(async () => {
      try {
        await saveOrganizationDiscovery(requestId, input);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="cc-glass-card space-y-6">
      <header>
        <h2 className="cc-section-title text-lg">Organization context</h2>
        <p className="mt-1 text-sm text-slate-400">
          Confirm how {initial.organizationName} operates before module alignment.
        </p>
      </header>

      <MetaDl
        items={[
          { label: "From request", value: initial.organizationName },
          ...(initial.industry ? [{ label: "Industry", value: initial.industry }] : []),
        ]}
      />

      <label className="block text-sm text-slate-400">
        Operating model
        <select name="operatingModel" required defaultValue={initial.operatingModel} className="input-cc mt-2">
          <option value="">Select…</option>
          <option value="single_hq">Single headquarters</option>
          <option value="multi_branch">Multi-branch national</option>
          <option value="multi_country">Multi-country</option>
          <option value="franchise">Franchise / partner network</option>
        </select>
      </label>

      <label className="block text-sm text-slate-400">
        Employee band
        <select name="employeeBand" required defaultValue={initial.employeeBand} className="input-cc mt-2">
          <option value="">Select…</option>
          <option value="1-50">1–50</option>
          <option value="51-200">51–200</option>
          <option value="201-1000">201–1,000</option>
          <option value="1000+">1,000+</option>
        </select>
      </label>

      <label className="block text-sm text-slate-400">
        Target go-live window
        <input
          name="goLiveTarget"
          defaultValue={initial.goLiveTarget}
          placeholder="e.g. Q3 2026"
          className="input-cc mt-2"
        />
      </label>

      <label className="block text-sm text-slate-400">
        Discovery notes
        <textarea
          name="discoveryNotes"
          rows={4}
          defaultValue={initial.discoveryNotes}
          className="input-cc mt-2"
          placeholder="Constraints, compliance drivers, integration priorities…"
        />
      </label>

      <footer className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="cc-btn-primary disabled:opacity-50">
          {pending ? "Saving…" : "Save organization"}
        </button>
        {saved && <span className="text-sm text-teal-300">Saved</span>}
        {error && <span className="cc-alert-error inline-block">{error}</span>}
      </footer>
    </form>
  );
}
