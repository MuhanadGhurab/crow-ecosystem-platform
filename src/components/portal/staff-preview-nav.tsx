import Link from "next/link";
import { isPlatformConsoleRole, isPlatformStaff, type CrowRole } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

const MEEM_SLUG = "meem-global";

interface StaffPreviewNavProps {
  role: CrowRole | null;
  tenantSlugs: string[];
}

/**
 * Platform staff preview links on the client portal — hidden from real client users.
 */
export function StaffPreviewNav({ role, tenantSlugs }: StaffPreviewNavProps) {
  if (!role || !isPlatformConsoleRole(role)) {
    return null;
  }

  const showMeem =
    isPlatformStaff(role) || tenantSlugs.includes(MEEM_SLUG);

  return (
    <nav
      className="mb-6 rounded-cc-sm border border-amber-500/25 bg-amber-500/5 px-4 py-3"
      aria-label="Staff preview navigation"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">
        Staff preview — CEM Command Center
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <li>
          <Link
            href={routes.admin.overview}
            className="font-medium text-teal-400 hover:text-teal-300"
          >
            CEM Command Center
          </Link>
        </li>
        <li>
          <Link
            href={routes.admin.requests}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Admin requests
          </Link>
        </li>
        <li>
          <Link
            href={routes.admin.notifications}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Notifications
          </Link>
        </li>
        {showMeem && (
          <li>
            <Link
              href={routes.tenant(MEEM_SLUG).dashboard}
              className="text-cyan-400 hover:text-cyan-300"
            >
              MEEM dashboard
            </Link>
          </li>
        )}
        <li>
          <Link
            href={`${routes.portal.requests}?preview=client`}
            className="text-slate-400 hover:text-slate-300"
          >
            Stay on client portal
          </Link>
        </li>
      </ul>
    </nav>
  );
}
