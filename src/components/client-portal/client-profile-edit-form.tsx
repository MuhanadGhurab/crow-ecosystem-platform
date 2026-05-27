"use client";

import { useActionState } from "react";
import {
  updateClientProfileMetadata,
  type ClientProfileUpdateResult,
} from "@/lib/actions/client-profile";
import type { ClientProfileSummary } from "@/lib/client-portal/client-profile-contract";

const initial: ClientProfileUpdateResult | null = null;

export function ClientProfileEditForm({ profile }: { profile: ClientProfileSummary }) {
  const [state, action, pending] = useActionState(updateClientProfileMetadata, initial);

  if (!profile.canEdit) {
    return (
      <p className="text-sm text-slate-400">
        {profile.editBlockedReason ??
          "Profile editing is not available for this account yet."}
      </p>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-4">
      {state?.ok === false && state.error && (
        <p className="cc-alert-warning text-sm" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Profile updated.
        </p>
      )}

      <div>
        <label htmlFor="full_name" className="block text-xs font-medium text-slate-500">
          Display name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={profile.displayName ?? ""}
          className="input-cc mt-1 w-full"
          autoComplete="name"
        />
        {state?.ok === false && state.fieldErrors?.full_name && (
          <p className="mt-1 text-xs text-amber-300">{state.fieldErrors.full_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-medium text-slate-500">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ""}
          className="input-cc mt-1 w-full"
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="job_title" className="block text-xs font-medium text-slate-500">
          Job title (optional)
        </label>
        <input
          id="job_title"
          name="job_title"
          type="text"
          defaultValue={profile.title ?? ""}
          className="input-cc mt-1 w-full"
          autoComplete="organization-title"
        />
      </div>

      <div>
        <label htmlFor="preferred_language" className="block text-xs font-medium text-slate-500">
          Preferred language (optional)
        </label>
        <input
          id="preferred_language"
          name="preferred_language"
          type="text"
          placeholder="e.g. en, ar"
          defaultValue={profile.preferredLanguage ?? ""}
          className="input-cc mt-1 w-full"
        />
      </div>

      <p className="text-xs text-slate-500">
        Email is managed through your sign-in provider and cannot be changed here.
      </p>

      <button type="submit" disabled={pending} className="cc-btn-primary text-sm">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
