"use client";

import { useState, useTransition } from "react";
import { CEM_MODULES, type CemModuleKey } from "@/lib/constants/modules";
import { saveModulesDiscovery } from "@/lib/actions/discovery";

export function DiscoveryModulesForm({
  requestId,
  initialSelected,
}: {
  requestId: string;
  initialSelected: CemModuleKey[];
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const keys = form.getAll("modules") as CemModuleKey[];

    startTransition(async () => {
      try {
        await saveModulesDiscovery(requestId, keys);
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
        <h2 className="cc-section-title text-lg">Module alignment</h2>
        <p className="mt-1 text-sm text-slate-400">
          Confirm CEM modules for the enterprise blueprint. Pre-selected from the implementation request.
        </p>
      </header>

      <ul className="grid gap-2 sm:grid-cols-2">
        {CEM_MODULES.map((m) => (
          <li key={m.key}>
            <label className="label-cc cursor-pointer">
              <input
                type="checkbox"
                name="modules"
                value={m.key}
                defaultChecked={initialSelected.includes(m.key)}
              />
              <span>
                {m.icon} {m.nameEn}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <footer className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="cc-btn-primary disabled:opacity-50">
          {pending ? "Saving…" : "Save modules"}
        </button>
        {saved && <span className="text-sm text-teal-300">Saved</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </footer>
    </form>
  );
}
