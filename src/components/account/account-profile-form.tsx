"use client";

import { useActionState } from "react";
import {
  updateAccountProfile,
  type AccountActionState,
} from "@/lib/actions/account";
import type { PlatformAccountProfile } from "@prisma/client";

const initial: AccountActionState = undefined;

export function AccountProfileForm({
  profile,
}: {
  profile: PlatformAccountProfile | null;
}) {
  const [state, action, pending] = useActionState(updateAccountProfile, initial);

  return (
    <form action={action} className="mt-4 space-y-4">
      {state?.error && (
        <p className="cc-alert-warning text-sm" role="alert">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="displayName" className="block text-xs font-medium text-slate-500">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={profile?.displayName ?? ""}
          className="input-cc mt-1 w-full"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="handle" className="block text-xs font-medium text-slate-500">
          Handle (optional)
        </label>
        <input
          id="handle"
          name="handle"
          type="text"
          defaultValue={profile?.handle ?? ""}
          placeholder="your-handle"
          className="input-cc mt-1 w-full"
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="jobTitle" className="block text-xs font-medium text-slate-500">
          Job title (optional)
        </label>
        <input
          id="jobTitle"
          name="jobTitle"
          type="text"
          defaultValue={profile?.jobTitle ?? ""}
          className="input-cc mt-1 w-full"
          autoComplete="organization-title"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-medium text-slate-500">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile?.phone ?? ""}
          className="input-cc mt-1 w-full"
          autoComplete="tel"
        />
      </div>

      <div>
        <label
          htmlFor="preferredLanguage"
          className="block text-xs font-medium text-slate-500"
        >
          Preferred language (optional)
        </label>
        <input
          id="preferredLanguage"
          name="preferredLanguage"
          type="text"
          defaultValue={profile?.preferredLanguage ?? ""}
          placeholder="en"
          className="input-cc mt-1 w-full"
          autoComplete="language"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-xs font-medium text-slate-500">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={profile?.bio ?? ""}
          className="input-cc mt-1 w-full resize-y"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-400">
        <input
          type="checkbox"
          name="isPrivate"
          defaultChecked={profile?.isPrivate ?? true}
          className="rounded border-slate-600"
        />
        Keep profile private
      </label>

      <button type="submit" disabled={pending} className="btn-cc-primary">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
