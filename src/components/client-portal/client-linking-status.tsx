import type { ClientAccountLinkState } from "@/lib/client-portal/client-profile-contract";

const LINK_LABELS: Record<ClientAccountLinkState, { label: string; description: string }> = {
  no_request_submitted: {
    label: "No request linked",
    description:
      "No implementation request is linked to this account. Submit a request or sign in with your primary contact email.",
  },
  request_submitted_unlinked: {
    label: "Request not linked",
    description:
      "We could not match a request to this sign-in yet. Use the same email as your primary request contact.",
  },
  authenticated_linked: {
    label: "Linked",
    description: "Your account is linked to at least one implementation request.",
  },
  procrow_verification_required: {
    label: "Verification pending",
    description:
      "ProCrow must verify organization ownership before proposal approval actions are enabled.",
  },
  staff_preview: {
    label: "Staff preview",
    description: "Platform staff preview — client data appears only when safely linked.",
  },
};

export function ClientLinkingStatus({ state }: { state: ClientAccountLinkState }) {
  const info = LINK_LABELS[state];
  const tone =
    state === "authenticated_linked"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : state === "staff_preview"
        ? "border-cyan-500/30 bg-cyan-500/5"
        : "border-amber-500/30 bg-amber-500/5";

  return (
    <div className={`rounded-xl border px-4 py-3 ${tone}`}>
      <p className="text-sm font-medium text-white">{info.label}</p>
      <p className="mt-1 text-sm text-slate-400">{info.description}</p>
    </div>
  );
}
