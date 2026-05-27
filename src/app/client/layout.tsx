import { ClientPortalShell } from "@/components/client-portal/client-portal-shell";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireClientAccess(routes.client.home);
  return <ClientPortalShell user={user}>{children}</ClientPortalShell>;
}
