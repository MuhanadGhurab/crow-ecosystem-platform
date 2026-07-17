import { isVisualMockMode } from "@/lib/auth/local-auth-mode";

export function LocalVisualPreviewBanner() {
  if (!isVisualMockMode()) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-500/40 bg-amber-950/90 px-4 py-2 text-center text-xs font-medium tracking-wide text-amber-200"
    >
      LOCAL VISUAL PREVIEW — AUTHORIZATION NOT BEING TESTED
    </div>
  );
}
