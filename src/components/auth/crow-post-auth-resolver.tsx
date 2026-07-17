"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { CrowProofIdentityPanel } from "@/components/auth/crow-proof-identity-panel";
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
    active: "Securing your Google session",
    done: "Google session secured",
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

type ResolverPhase = "running" | "failed";

type Props = {
  nextPath?: string;
  showProofPanel?: boolean;
};

function stageIndex(stage: PostAuthResolutionStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function CrowPostAuthResolver({ nextPath, showProofPanel = false }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<ResolverPhase>("running");
  const [completedStages, setCompletedStages] = useState<PostAuthResolutionStage[]>([]);
  const [failedStage, setFailedStage] = useState<PostAuthResolutionStage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supportRef, setSupportRef] = useState<string | null>(null);
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
        setErrorMessage(
          "We authenticated your Google account, but could not prepare your Crow account."
        );
        setFailedStage("account_checked");
        setPhase("failed");
        return;
      }

      if (!result) {
        setErrorMessage(
          "We authenticated your Google account, but could not prepare your Crow account."
        );
        setFailedStage("account_checked");
        setPhase("failed");
        return;
      }

      if (result.status === "no_session") {
        router.replace(`${routes.auth.login}?error=oauth-session`);
        return;
      }

      if (result.status === "resolver_error") {
        await revealConfirmedStages(result.stages, stageDelayMs, setCompletedStages);
        setFailedStage(result.failureStage);
        setErrorMessage(result.message);
        setSupportRef(result.supportRef);
        setPhase("failed");
        return;
      }

      for (const stage of STAGE_ORDER) {
        if (!result.stages.includes(stage)) break;
        if (stageDelayMs > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, stageDelayMs));
        }
        setCompletedStages((current) =>
          current.includes(stage) ? current : [...current, stage]
        );
      }

      if (result.status === "complete" || result.status === "account_status") {
        router.replace(result.redirectPath);
        return;
      }

      setErrorMessage(
        "We authenticated your Google account, but could not prepare your Crow account."
      );
      setFailedStage("account_checked");
      setPhase("failed");
    })();
  }, [nextPath, retryKey, router]);

  if (phase === "failed") {
    return (
      <ResolverShell showProofPanel={showProofPanel}>
        <StageList
          completedStages={completedStages}
          failedStage={failedStage}
          running={false}
        />
        <div className="mt-6 space-y-4 text-center">
          <p className="text-base text-slate-200">
            {errorMessage ??
              "We authenticated your Google account, but could not prepare your Crow account."}
          </p>
          {supportRef ? (
            <p className="text-xs text-slate-500">
              Reference: <span className="font-mono text-slate-400">{supportRef}</span>
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                started.current = false;
                setPhase("running");
                setCompletedStages([]);
                setFailedStage(null);
                setErrorMessage(null);
                setSupportRef(null);
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
    <ResolverShell showProofPanel={showProofPanel}>
      <StageList
        completedStages={completedStages}
        failedStage={null}
        running
      />
    </ResolverShell>
  );
}

async function revealConfirmedStages(
  confirmed: PostAuthResolutionStage[],
  stageDelayMs: number,
  setCompletedStages: React.Dispatch<React.SetStateAction<PostAuthResolutionStage[]>>
): Promise<void> {
  for (const stage of STAGE_ORDER) {
    if (!confirmed.includes(stage)) break;
    if (stageDelayMs > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, stageDelayMs));
    }
    setCompletedStages((current) =>
      current.includes(stage) ? current : [...current, stage]
    );
  }
}

function StageList({
  completedStages,
  failedStage,
  running,
}: {
  completedStages: PostAuthResolutionStage[];
  failedStage: PostAuthResolutionStage | null;
  running: boolean;
}) {
  const failedIndex = failedStage != null ? stageIndex(failedStage) : -1;

  return (
    <ul className="space-y-3 text-sm" aria-live="polite" aria-busy={running}>
      {STAGE_ORDER.map((stage, index) => {
        const done = completedStages.includes(stage);
        const failed = failedStage === stage;
        const pendingAfterFailure = failedIndex >= 0 && index > failedIndex;
        const active =
          running &&
          !done &&
          !failed &&
          !pendingAfterFailure &&
          STAGE_ORDER.slice(0, index).every((s) => completedStages.includes(s));

        const copy = STAGE_COPY[stage];
        return (
          <li
            key={stage}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
              failed
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : done
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-100"
                  : active
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100 crow-resolver-stage-active"
                    : "border-white/5 bg-white/[0.02] text-slate-600"
            }`}
          >
            <StageMarker done={done} active={active} failed={failed} />
            <span>
              {failed
                ? `${copy.active} — could not complete`
                : done
                  ? copy.done
                  : active
                    ? copy.active
                    : copy.active}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function StageMarker({
  done,
  active,
  failed,
}: {
  done: boolean;
  active: boolean;
  failed: boolean;
}) {
  if (failed) {
    return (
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center text-xs text-rose-300"
        aria-hidden
      >
        ✕
      </span>
    );
  }
  if (done) {
    return (
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center text-xs text-emerald-300"
        aria-hidden
      >
        ✓
      </span>
    );
  }
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${
        active ? "bg-cyan-400 crow-resolver-pulse" : "bg-slate-700"
      }`}
      aria-hidden
    />
  );
}

function ResolverShell({
  children,
  showProofPanel,
}: {
  children: React.ReactNode;
  showProofPanel: boolean;
}) {
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
        <CrowProofIdentityPanel enabled={showProofPanel} />
      </div>
    </div>
  );
}
