import Link from "next/link";
import { ClientLinkingStatus } from "@/components/client-portal/client-linking-status";
import { ClientProfileCompleteness } from "@/components/client-portal/client-profile-completeness";
import { ClientProfileEditForm } from "@/components/client-portal/client-profile-edit-form";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientProfilePageModel } from "@/lib/services/client-profile.service";
import { routes } from "@/lib/routes";

export default async function ClientProfilePage() {
  const user = await requireClientAccess(routes.client.profile);
  const model = await buildClientProfilePageModel(user);
  const { profile } = model;

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        eyebrow="Account"
        title="Profile"
        description="Your Client Portal identity and readiness. Company details live on the Company page."
      />

      <ClientLinkingStatus state={model.accountLinkState} />

      <ClientProfileCompleteness
        title="Profile completeness"
        percent={profile.readiness.completenessPercent}
        missingFields={profile.readiness.missingFields}
        completedFields={profile.readiness.completedFields}
      />

      <ClientPortalStatusCard title="Account identity" badge="Your account" badgeTone="info">
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="text-white">{profile.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Display name</dt>
            <dd className="text-white">{profile.displayName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd className="text-white">{profile.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Job title</dt>
            <dd className="text-white">{profile.title ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Preferred language</dt>
            <dd className="text-white">{profile.preferredLanguage ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Sign-in method</dt>
            <dd className="text-white capitalize">{profile.authProvider ?? "—"}</dd>
          </div>
        </dl>
      </ClientPortalStatusCard>

      <ClientPortalStatusCard
        title={profile.canEdit ? "Update profile" : "Profile editing"}
        badge={profile.canEdit ? "Editable" : "Readiness only"}
        badgeTone={profile.canEdit ? "success" : "warning"}
      >
        <ClientProfileEditForm profile={profile} />
      </ClientPortalStatusCard>

      <ClientPortalStatusCard title="Security note" badge="Important" badgeTone="info">
        <p className="mt-3 text-sm text-slate-400">
          Completing your profile does not grant platform admin or ProCrow staff access. Scope
          approval is only available on a linked proposal when your account is the verified request
          submitter — not from email links alone.
        </p>
      </ClientPortalStatusCard>

      {profile.readiness.riskNotes.length > 0 && (
        <ClientPortalStatusCard title="Readiness notes" badge="Advisory">
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-400">
            {profile.readiness.riskNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      <section className="cc-glass-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Recommended next steps
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {profile.readiness.nextActions.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="text-teal-400" aria-hidden>
                →
              </span>
              <span>{a}</span>
            </li>
          ))}
          <li className="flex gap-2">
            <span className="text-teal-400" aria-hidden>
              →
            </span>
            <Link href={routes.client.company} className="text-teal-400 hover:text-teal-300">
              Review company profile
            </Link>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400" aria-hidden>
              →
            </span>
            <Link href={routes.client.requests} className="text-teal-400 hover:text-teal-300">
              View your requests
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
