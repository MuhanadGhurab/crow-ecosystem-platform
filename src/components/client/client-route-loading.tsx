import { CrowLoadingMark } from "@/components/brand/crow-loading-mark";

type ClientRouteLoadingProps = {
  message?: string;
};

export function ClientRouteLoading({ message = "Loading…" }: ClientRouteLoadingProps) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CrowLoadingMark />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

export default function Loading() {
  return <ClientRouteLoading />;
}
