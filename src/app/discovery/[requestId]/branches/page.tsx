import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function DiscoveryBranchesRedirect({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  redirect(routes.discovery(requestId).departments);
}
