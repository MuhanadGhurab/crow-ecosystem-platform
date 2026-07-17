import { routes } from "@/lib/routes";

export type OwnedRequestLifecycleRow = {
  id: string;
  status: string;
  discoveryProfile: { status: string } | null;
};

/** Pure lifecycle routing from authoritative ownership rows — no email or metadata. */
export function resolveClientOnlyLifecycleDestinationFromRequests(
  requests: readonly OwnedRequestLifecycleRow[]
): string {
  if (requests.length === 0) return routes.account.home;
  if (requests.length > 1) return routes.client.requests;

  const only = requests[0]!;
  if (
    only.status === "UNDER_DISCOVERY" &&
    only.discoveryProfile?.status === "IN_PROGRESS"
  ) {
    return routes.client.requestDiscovery(only.id);
  }
  return routes.client.request(only.id);
}
