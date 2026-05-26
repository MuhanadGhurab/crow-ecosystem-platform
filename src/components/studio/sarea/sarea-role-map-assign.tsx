"use client";

import { useActionState } from "react";
import {
  updateRoleMapProfileAction,
  type SareaActionState,
} from "@/lib/actions/sarea";

type ProfileOption = { id: string; label: string };

type Props = {
  mapId: string;
  currentProfileId: string;
  currentProfileLabel: string;
  roleSlug: string;
  recommendedProfileName?: string | null;
  profileOptions: ProfileOption[];
};

export function SareaRoleMapAssign({
  mapId,
  currentProfileId,
  currentProfileLabel,
  roleSlug,
  recommendedProfileName,
  profileOptions,
}: Props) {
  const [state, action, pending] = useActionState<SareaActionState, FormData>(
    updateRoleMapProfileAction,
    undefined
  );

  return (
    <form action={action} className="mt-3 space-y-2 rounded-lg border border-amber-500/15 bg-amber-950/10 p-3">
      <p className="text-[11px] text-amber-200/90">
        Reassign <span className="font-mono text-slate-300">{roleSlug}</span> to another SAREA
        profile on the same tenant. Current: <span className="text-slate-300">{currentProfileLabel}</span>
        {recommendedProfileName ? (
          <>
            {" "}
            · Recommended: <span className="text-cyan-300/90">{recommendedProfileName}</span>
          </>
        ) : null}
        . Does not change RBAC permissions.
      </p>
      <label className="block text-xs text-slate-500">
        SAREA profile
        <select
          name="profileId"
          defaultValue={currentProfileId}
          className="mt-1 w-full rounded-cc border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white"
        >
          {profileOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-slate-500">
        Type <span className="font-mono text-slate-400">yes</span> to confirm
        <input
          name="confirm"
          type="text"
          autoComplete="off"
          className="mt-1 w-full rounded-cc border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white"
          placeholder="yes"
        />
      </label>
      <input type="hidden" name="id" value={mapId} />
      <button
        type="submit"
        disabled={pending}
        className="cc-btn-secondary text-xs disabled:opacity-50"
      >
        {pending ? "Saving…" : "Apply profile mapping"}
      </button>
      {state?.error ? <p className="text-xs text-rose-400">{state.error}</p> : null}
      {state?.success ? <p className="text-xs text-teal-400">{state.success}</p> : null}
    </form>
  );
}
