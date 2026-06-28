import { ClientRouteLoading } from "@/components/client/client-route-loading";

export default function AuthResolvingLoading() {
  return <ClientRouteLoading message="Resolving your session…" />;
}
