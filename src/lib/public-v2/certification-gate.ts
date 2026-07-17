import "server-only";

import { notFound } from "next/navigation";

import { isFtgpCertificationHostGateEnabled } from "@/lib/ftgp/ftgp-certification-host-gate";

/** Certification-only preview routes return 404 outside FTGP certification mode. */
export function assertPublicV2PreviewEnabled(): void {
  if (!isFtgpCertificationHostGateEnabled()) {
    notFound();
  }
}
