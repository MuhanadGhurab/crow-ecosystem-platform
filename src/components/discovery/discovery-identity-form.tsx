"use client";

import { useTransition } from "react";
import { saveIdentityDiscovery, type IdentityDiscoveryInput } from "@/lib/actions/discovery";

function readAnswer(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string {
  const a = answers.find((x) => x.sectionKey === "identity" && x.questionKey === questionKey);
  if (!a) return "";
  const v = a.valueJson;
  return typeof v === "string" ? v : String(v ?? "");
}

export function DiscoveryIdentityForm({
  requestId,
  answers,
}: {
  requestId: string;
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[];
}) {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input: IdentityDiscoveryInput = {
      idpPreference: String(fd.get("idpPreference") ?? ""),
      mfaRequired: String(fd.get("mfaRequired") ?? "yes"),
      ssoNotes: String(fd.get("ssoNotes") ?? ""),
    };
    startTransition(() => saveIdentityDiscovery(requestId, input));
  }

  return (
    <form onSubmit={onSubmit} className="cc-glass-card space-y-4">
      <div>
        <label className="mb-1 block text-xs text-slate-500">Identity provider preference</label>
        <select
          name="idpPreference"
          defaultValue={readAnswer(answers, "idpPreference") || "supabase_email"}
          className="input-cc w-full max-w-md"
        >
          <option value="supabase_email">Supabase email (default)</option>
          <option value="entra_id">Microsoft Entra ID (SSO)</option>
          <option value="saml">SAML enterprise IdP</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-500">MFA required for admins</label>
        <select
          name="mfaRequired"
          defaultValue={readAnswer(answers, "mfaRequired") || "yes"}
          className="input-cc max-w-md"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-500">SSO / identity notes</label>
        <textarea
          name="ssoNotes"
          rows={3}
          defaultValue={readAnswer(answers, "ssoNotes")}
          className="input-cc w-full"
          placeholder="Tenant domains, IdP metadata URLs, phased rollout…"
        />
      </div>
      <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
        {pending ? "Saving…" : "Save identity preferences"}
      </button>
    </form>
  );
}
