import Link from "next/link";
import { redirect } from "next/navigation";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { getCrowAuth, isPlatformConsoleRole } from "@/lib/auth/roles";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { routes } from "@/lib/routes";

export default async function ClientRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const user = await requireClientAccess(routes.client.requests);
  const { role } = getCrowAuth(user);
  const { preview } = await searchParams;

  if (isPlatformConsoleRole(role) && preview !== "client") {
    redirect(routes.admin.overview);
  }

  const snapshot = await buildClientPortalDashboardSnapshot(user);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        eyebrow="Pipeline"
        title="Requests"
        description="Implementation requests linked to your account. ProCrow owns review, discovery, and pipeline status."
      />

      {snapshot.requests.length === 0 ? (
        <ClientPortalStatusCard
          title="No linked requests"
          description="Sign in with the same email as your request contact, or submit a new request."
        >
          <Link href={routes.public.request} className="cc-btn-primary mt-4 inline-flex text-sm">
            Submit a request
          </Link>
        </ClientPortalStatusCard>
      ) : (
        <ul className="space-y-4">
          {snapshot.requests.map((r) => (
            <li key={r.requestId}>
              <Link
                href={routes.client.request(r.requestId)}
                className="cc-glass-card block hover:border-teal-500/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-white">
                      {r.organizationName}
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-500">{r.referenceCode}</p>
                  </div>
                  <RequestStatusBadge status={r.status} />
                </div>
                <p className="mt-3 text-sm text-slate-400">{r.nextAction}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
