import type { ReactNode } from "react";

/** Isolated layout — no global public header/footer. */
export default function PublicHomePreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
