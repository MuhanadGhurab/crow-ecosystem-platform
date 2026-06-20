"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  runPostAuthResolutionAction,
  type PostAuthResolutionActionState,
} from "@/lib/actions/post-auth-resolution";
import type { PostAuthResolutionStage } from "@/lib/auth/c3-post-auth-resolution";
import { routes } from "@/lib/routes";

const STAGE_COPY: Record<
  PostAuthResolutionStage,
  { active: string; done: string }
> = {
  session_secured: {
    active: "Securing your session",
    done: "Session secured",
  },
  account_checked: {
    active: "Checking your Crow account",
    done: "Crow account checked",
  },
  legal_reviewed: {
    active: "Reviewing legal requirements",
    done: "Legal requirements reviewed",
  },
  workspace_ready: {
    active: "Preparing your workspace",
    done: "Workspace ready",
  },
};

const STAGE_ORDER: PostAuthResolutionStage[] = [
  "session_secured",
  "account_checked",
  "legal_reviewed",
  "workspace_ready",
];

type ResolverPhase = "running" | "timeout" | "failed";

type Props = {
  nextPath?: string;
};

export function CrowPostAuthResolver({ nextPath }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<ResolverPhase>("running");
  const [visibleStages, setVisibleStages] = useState<PostAuthResolutionStage[]>([]);
  const [timeoutRef, setTimeoutRef] = useState<string | null>(null);
  const [retryKey, retry] = useReducer((count: number) => count + 1, 0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stageDelayMs = reducedMotion ? 0 : 180;

    void (async () => {
      const formData = new FormData();
      if (nextPath) formData.set("next", nextPath);

      let result: PostAuthResolutionActionState;
      try {
        result = await runPostAuthResolutionAction(undefined, formData);
      } catch {
        setPhase("failed");
        return;
      }

      if (!result) {
        setPhase("failed");
        return;
      }

      if (result.status === "no_session") {
        router.replace(`${routes.auth.login}?error=oauth-session`);
        return;
      }

      if (result.status === "timeout") {
        setTimeoutRef(result.supportRef);
        setVisibleStages(result.stages);
        setPhase("timeout");
        return;
      }

      const completed = result.stages;
      for (let index = 0; index < STAGE_ORDER.length; index += 1) {
        const stage = STAGE_ORDER[index]!;
        if (!completed.includes(stage)) break;
        if (stageDelayMs > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, stageDelayMs));
        }
        setVisibleStages((current) =>
          current.includes(stage) ? current : [...current, stage]
        );
      }

      if (result.status === "complete" || result.status === "account_status") {
        router.replace(result.redirectPath);
        return;
      }

      setPhase("failed");
    })();
  }, [nextPath, retryKey, router]);

  const activeStage =
    STAGE_ORDER.find((stage) => !visibleStages.includes(stage)) ??
    STAGE_ORDER[STAGE_ORDER.length - 1];

  if (phase === "timeout") {
    return (
      <ResolverShell>
        <div className="space-y-4 text-center">
          <p className="text-base text-slate-200">
            We could not finish preparing your account.
          </p>
          {timeoutRef ? (
            <p className="text-xs text-slate-500">
              Reference: <span className="font-mono text-slate-400">{timeoutRef}</span>
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                started.current = false;
                setPhase("running");
                retry();
              }}
              className="cc-btn-primary px-4 py-2 text-sm"
            >
              Retry
            </button>
            <SignOutButton
              className="text-sm text-slate-400 hover:text-cyan-300"
              label="Sign out"
            />
          </div>
        </div>
      </ResolverShell>
    );
  }

  if (phase === "failed") {
    return (
      <ResolverShell>
        <div className="space-y-4 text-center">
          <p className="text-base text-slate-200">
            We could not finish preparing your account.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                started.current = false;
                setPhase("running");
                retry();
              }}
              className="cc-btn-primary px-4 py-2 text-sm"
            >
              Retry
            </button>
            <SignOutButton
              className="text-sm text-slate-400 hover:text-cyan-300"
              label="Sign out"
            />
          </div>
        </div>
      </ResolverShell>
    );
  }

  return (
    <ResolverShell>
      <div className="space-y-6">
        <ul className="space-y-3 text-sm" aria-live="polite" aria-busy="true">
          {STAGE_ORDER.map((stage) => {
            const done = visibleStages.includes(stage);
            const active = !done && stage === activeStage;
            const copy = STAGE_COPY[stage];
            return (
              <li
                key={stage}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                  done
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-100"
                    : active
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100 crow-resolver-stage-active"
                      : "border-white/5 bg-white/[0.02] text-slate-600"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    done
                      ? "bg-emerald-400"
                      : active
                        ? "bg-cyan-400 crow-resolver-pulse"
                        : "bg-slate-700"
                  }`}
                  aria-hidden
                />
                <span>{done ? copy.done : active ? copy.active : copy.active}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </ResolverShell>
  );
}

function ResolverShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="crow-resolver-glow relative">
            <CrowMarkSvg variant="motion" className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
          <div>
            <h1 className="cc-page-title text-lg sm:text-xl">Preparing your Crow account</h1>
            <p className="mt-2 text-xs text-slate-500">
              Google verified your identity. Crow is applying your account rules.
            </p>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
