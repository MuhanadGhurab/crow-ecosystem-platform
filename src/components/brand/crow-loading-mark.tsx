"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { CROW_MOTION_OUTLINE_PATH } from "@/components/brand/crow-svg-paths";
import { isStartupLoaderBypassPath } from "@/lib/auth/public-auth-paths";

/** Loader shares canonical motion outline geometry with hero and motion mark. */
const LOADER_MOTION_PATH = CROW_MOTION_OUTLINE_PATH;

const SESSION_KEY = "crow-startup-loader-seen";
const LOADER_MAX_MS = 12_000;

export type CrowLoadingMarkProps = {
  className?: string;
  phase?: "loading" | "complete";
};

export function CrowLoadingMark({ className = "", phase = "loading" }: CrowLoadingMarkProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className} ${
        phase === "complete" ? "crow-loader-complete" : ""
      }`}
      aria-hidden
    >
      <CrowMarkSvg
        variant="motion"
        className="h-20 w-20 sm:h-24 sm:w-24"
        data-crow-motion-path={LOADER_MOTION_PATH.slice(0, 8)}
      />
      <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
        <div className="crow-loader-bar h-full w-full origin-left bg-cyan-400/70" />
      </div>
    </div>
  );
}

export function CrowStartupLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipLoader = isStartupLoaderBypassPath(pathname ?? "/");
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"loading" | "fade" | "done">(
    skipLoader ? "done" : "loading"
  );

  useEffect(() => {
    if (skipLoader) {
      setPhase("done");
      setVisible(false);
      return;
    }

    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen === "1") {
      setPhase("done");
      return;
    }
    setVisible(true);
    const loadMs = reduced ? 280 : 900;
    const fadeMs = reduced ? 200 : 450;
    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
      setVisible(false);
    };
    const t1 = window.setTimeout(() => setPhase("fade"), loadMs);
    const t2 = window.setTimeout(finish, loadMs + fadeMs);
    const tMax = window.setTimeout(() => {
      setPhase("fade");
      finish();
    }, LOADER_MAX_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(tMax);
    };
  }, [skipLoader]);

  if (phase === "done" && !visible) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {visible ? (
        <div
          className={`crow-loader-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#04060c] transition-opacity duration-300 ${
            phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden
        >
          <CrowLoadingMark phase={phase === "fade" ? "complete" : "loading"} />
        </div>
      ) : null}
    </>
  );
}
