"use client";

import { useActionState } from "react";
import type { SareaActionState } from "@/lib/actions/sarea";

type Field = {
  name: string;
  label: string;
  defaultValue: string;
  type?: "text" | "select";
  options?: string[];
};

export function SareaEditRow({
  id,
  action,
  fields,
  submitLabel = "Save",
}: {
  id: string;
  action: (prev: SareaActionState, formData: FormData) => Promise<SareaActionState>;
  fields: Field[];
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="id" value={id} />
      {fields.map((f) => (
        <div key={f.name} className="min-w-[8rem]">
          <label className="mb-0.5 block text-xs text-slate-500">{f.label}</label>
          {f.type === "select" && f.options ? (
            <select
              name={f.name}
              defaultValue={f.defaultValue}
              className="input-cc text-sm"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={f.name}
              defaultValue={f.defaultValue}
              className="input-cc text-sm"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={pending}
        className="cc-btn-secondary px-3 py-2 text-xs disabled:opacity-50"
      >
        {pending ? "…" : submitLabel}
      </button>
      {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
      {state?.success && <span className="text-xs text-teal-300">{state.success}</span>}
    </form>
  );
}
