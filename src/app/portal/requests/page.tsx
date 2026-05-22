import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { requireClientAccess } from "@/lib/auth/session";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_CLIENT_REQUESTS } from "@/lib/mock/portal";
import { routes } from "@/lib/routes";
import { listClientRequests } from "@/lib/services/client-request-link.service";
import { formatSar } from "@/lib/services/commercial.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function PortalRequestsPage() {
  const user = await requireClientAccess();
  const { role } = getCrowAuth(user);
  const staffPreview = isPlatformStaff(role);

  let rows: {
    id: string;
    referenceCode: string;
    organizationName: string;
    status: ImplementationRequestStatus;
    estimatedMonthlySar: number | null;
    proposalToken: string | null;
    updatedAt: Date | string;
  }[] = [];

  if (isUseMockData()) {
    rows = MOCK_CLIENT_REQUESTS.map((r) => ({
      id: r.id,
      referenceCode: r.referenceCode,
      organizationName: r.organizationName,
      status: r.status,
      estimatedMonthlySar: r.estimatedMonthlySar,
      proposalToken: r.proposalToken,
      updatedAt: r.updatedAt,
    }));
  } else if (user.email) {
    try {
      const requests = await listClientRequests(user.id, user.email);
      rows = requests.map((r) => ({
        id: r.id,
        referenceCode: r.referenceCode,
        organizationName: r.organizationName,
        status: r.status as ImplementationRequestStatus,
        estimatedMonthlySar: r.estimatedMonthlySar ? Number(r.estimatedMonthlySar) : null,
        proposalToken: r.enterpriseBlueprint?.proposalToken ?? null,
        updatedAt: r.updatedAt,
      }));
    } catch {
      rows = [];
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/90">
          Client portal
        </p>
        <h1 className="cc-page-title mt-2">Your implementation requests</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track status from submission through discovery, blueprint, and proposal. Sign in with the
          same Microsoft account as your request contact email.
        </p>
        {staffPreview && (
          <p className="cc-alert-warning mt-4 text-sm">
            Staff preview — you are viewing the client portal as platform staff.
          </p>
        )}
        {isUseMockData() && (
          <p className="mt-2 text-xs text-amber-200/80">
            Demo data — <code className="text-amber-100">USE_MOCK_DATA=true</code>
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <section className="cc-glass-card text-center">
          <p className="text-slate-400">No requests linked to your account yet.</p>
          <Link href={routes.public.request} className="cc-btn-primary mt-6 inline-flex">
            Submit a request
          </Link>
        </section>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={routes.portal.request(r.id)}
                className="cc-glass-card block transition hover:border-cyan-500/30"
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
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  {r.estimatedMonthlySar != null && (
                    <span>Est. {formatSar(r.estimatedMonthlySar)}/mo</span>
                  )}
                  {r.proposalToken && <span className="text-cyan-400">Proposal available</span>}
                  <span>
                    Updated{" "}
                    {typeof r.updatedAt === "string"
                      ? new Date(r.updatedAt).toLocaleDateString()
                      : r.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
