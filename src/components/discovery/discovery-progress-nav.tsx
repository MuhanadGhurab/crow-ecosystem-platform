"use client";

import { usePathname } from "next/navigation";
import { DiscoveryProgress } from "@/components/discovery/discovery-progress";
import type { DiscoveryStepId } from "@/lib/discovery-progress";

type ProfileSlice = React.ComponentProps<typeof DiscoveryProgress>["profile"];

function stepFromPathname(pathname: string): DiscoveryStepId | undefined {
  if (pathname.endsWith("/organization")) return "organization";
  if (pathname.endsWith("/modules")) return "modules";
  if (pathname.endsWith("/security")) return "security";
  if (pathname.endsWith("/departments") || pathname.endsWith("/branches")) return "structure";
  if (pathname.endsWith("/roles")) return "roles";
  if (pathname.endsWith("/workflows")) return "workflows";
  if (pathname.endsWith("/identity")) return "security";
  if (pathname.endsWith("/integrations")) return "structure";
  if (pathname.endsWith("/experience")) return "summary";
  if (pathname.endsWith("/summary")) return "summary";
  return undefined;
}

export function DiscoveryProgressNav({
  requestId,
  profile,
}: {
  requestId: string;
  profile: ProfileSlice;
}) {
  const pathname = usePathname();
  return (
    <DiscoveryProgress requestId={requestId} profile={profile} currentStep={stepFromPathname(pathname)} />
  );
}
