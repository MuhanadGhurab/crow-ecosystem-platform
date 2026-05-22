import Link from "next/link";
import { isUseMockData } from "@/lib/mock/env";
import { routes } from "@/lib/routes";
import type { DiscoveryContext } from "@/lib/services/discovery.service";

function readIdentityAnswer(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string {
  const a = answers.find((x) => x.sectionKey === "identity" && x.questionKey === questionKey);
  if (!a) return "—";
  const v = a.valueJson;
  return typeof v === "string" ? v : String(v ?? "—");
}

const IDP_LABELS: Record<string, string> = {
  supabase_email: "Supabase email (default)",
  entra_id: "Microsoft Entra ID (SSO)",
  saml: "SAML enterprise IdP",
};

type Props = {
  blueprintId: string;
  requestId: string;
  discovery: DiscoveryContext | null;
  variant: "identity" | "integrations";
};

export function BlueprintDiscoveryReadonly({
  blueprintId,
  requestId,
  discovery,
  variant,
}: Props) {
  const profile = discovery?.discoveryProfile;
  const b = routes.blueprint(blueprintId);

  if (!profile) {
    return (
      <p className="text-sm text-slate-500">
        No discovery profile linked yet. Complete discovery for this request first.
      </p>
    );
  }

  if (variant === "identity") {
    const answers = profile.answers;
    const idp = readIdentityAnswer(answers, "idpPreference");
    const mfa = readIdentityAnswer(answers, "mfaRequired");
    const notes = readIdentityAnswer(answers, "ssoNotes");

    return (
      <div className="space-y-6">
        <header className="cc-entity-block cc-entity-block--cybercrow !p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Identity & access
          </p>
          <h2 className="cc-section-title mt-2 text-lg">From discovery</h2>
          <p className="mt-2 text-sm text-slate-400">
            Read-only snapshot — edit in discovery before go-live.
          </p>
        </header>

        <dl className="cc-glass-card grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Identity provider</dt>
            <dd className="mt-1 text-sm text-violet-200">
              {IDP_LABELS[idp] ?? idp}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">MFA for admins</dt>
            <dd className="mt-1 text-sm text-violet-200 capitalize">{mfa}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">SSO / identity notes</dt>
            <dd className="mt-1 text-sm text-slate-300">{notes === "—" ? "—" : notes}</dd>
          </div>
        </dl>

        {isUseMockData() && (
          <p className="text-xs text-amber-400/90">
            Mock demo — identity defaults from pipeline fixtures when answers are empty.
          </p>
        )}

        <Link href={routes.discovery(requestId).identity} className="text-sm text-cyan-400 hover:text-cyan-300">
          Edit in discovery →
        </Link>
        <Link href={b.overview} className="block text-sm text-slate-500 hover:text-slate-400">
          ← Blueprint overview
        </Link>
      </div>
    );
  }

  const integrations = profile.integrations ?? [];

  return (
    <div className="space-y-6">
      <header className="cc-entity-block cc-entity-block--cem !p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Integrations
        </p>
        <h2 className="cc-section-title mt-2 text-lg">From discovery</h2>
        <p className="mt-2 text-sm text-slate-400">
          Planned connectors — provision wiring happens at go-live.
        </p>
      </header>

      {integrations.length === 0 ? (
        <p className="cc-glass-card text-sm text-slate-500">No integrations captured in discovery yet.</p>
      ) : (
        <ul className="space-y-2">
          {integrations.map((i) => (
            <li
              key={i.id}
              className="cc-glass-card flex flex-wrap items-start justify-between gap-2 !p-4"
            >
              <div>
                <p className="font-medium text-cyan-200">{i.providerKey}</p>
                {i.notes && <p className="mt-1 text-sm text-slate-400">{i.notes}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link href={routes.discovery(requestId).integrations} className="text-sm text-cyan-400 hover:text-cyan-300">
        Edit in discovery →
      </Link>
      <Link href={b.overview} className="block text-sm text-slate-500 hover:text-slate-400">
        ← Blueprint overview
      </Link>
    </div>
  );
}
