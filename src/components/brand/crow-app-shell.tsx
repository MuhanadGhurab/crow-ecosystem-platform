"use client";

import { CrowStartupLoader } from "@/components/brand/crow-loading-mark";

export function CrowAppShell({ children }: { children: React.ReactNode }) {
  return <CrowStartupLoader>{children}</CrowStartupLoader>;
}
