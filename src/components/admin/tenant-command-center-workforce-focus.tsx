"use client";

import { useEffect } from "react";
import { TENANT_WORKFORCE_SECTION_ID } from "@/lib/constants/tenant-command-center";

/** Focus invite email when landing on workforce tab with hash anchor. */
export function TenantCommandCenterWorkforceFocus() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== `#${TENANT_WORKFORCE_SECTION_ID}`) return;
    const el = document.getElementById(TENANT_WORKFORCE_SECTION_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    const email = document.getElementById("m4c-invite-email");
    if (email instanceof HTMLInputElement) {
      window.setTimeout(() => email.focus(), 200);
    }
  }, []);

  return null;
}
