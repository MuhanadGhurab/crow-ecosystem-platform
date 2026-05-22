"use client";

import { useParams } from "next/navigation";

export function useTenantSlug(): string | undefined {
  const params = useParams();
  const tenant = params?.tenant;
  return typeof tenant === "string" ? tenant : undefined;
}
