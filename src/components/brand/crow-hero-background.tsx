import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import type { CrowHeroIntensity, CrowHeroMotion, CrowHeroPosition } from "@/components/brand/types";
import {
  CROW_NETWORK_EDGES,
  CROW_NETWORK_NODES,
  CROW_VIEWBOX,
} from "@/components/brand/crow-svg-paths";

export type CrowHeroBackgroundProps = {
  intensity?: CrowHeroIntensity;
  position?: CrowHeroPosition;
  motion?: CrowHeroMotion;
  showNetwork?: boolean;
  showGlow?: boolean;
  className?: string;
};

const INTENSITY_OPACITY: Record<CrowHeroIntensity, string> = {
  subtle: "opacity-[0.22]",
  balanced: "opacity-[0.38]",
  prominent: "opacity-[0.52]",
};

const POSITION_CLASS: Record<CrowHeroPosition, string> = {
  left: "left-[-8%] right-auto",
  right: "right-[-6%] left-auto",
  center: "left-1/2 -translate-x-1/2",
  "center-right": "right-[-4%] left-auto sm:right-[-2%]",
};

export function CrowHeroBackground({
  intensity = "balanced",
  position = "center-right",
  motion = "ambient",
  showNetwork = true,
  showGlow = true,
  className = "",
}: CrowHeroBackgroundProps) {
  const motionClass = motion === "ambient" ? "crow-hero-ambient" : "";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {showGlow ? (
        <div
          className={`absolute top-1/4 h-[min(520px,70vw)] w-[min(520px,70vw)] -translate-y-1/4 rounded-full bg-cyan-500/10 blur-3xl ${POSITION_CLASS[position]} crow-hero-glow`}
        />
      ) : null}
      {showGlow ? (
        <div
          className={`absolute top-1/3 h-[min(360px,55vw)] w-[min(360px,55vw)] rounded-full bg-violet-500/8 blur-3xl ${POSITION_CLASS[position]} translate-x-8`}
        />
      ) : null}

      <div
        className={`crow-hero-mark-layer absolute top-1/2 w-[min(640px,95vw)] max-w-none -translate-y-1/2 ${INTENSITY_OPACITY[intensity]} ${POSITION_CLASS[position]} ${motionClass}`}
      >
        <CrowMarkSvg variant="hero" className="h-auto w-full" />
      </div>

      {showNetwork ? (
        <svg
          viewBox={CROW_VIEWBOX}
          className={`crow-hero-network-layer absolute top-1/2 w-[min(640px,95vw)] -translate-y-1/2 ${INTENSITY_OPACITY[intensity]} opacity-60 ${POSITION_CLASS[position]} ${motionClass}`}
          aria-hidden
        >
          {CROW_NETWORK_EDGES.map(([a, b], i) => {
            const from = CROW_NETWORK_NODES[a];
            const to = CROW_NETWORK_NODES[b];
            if (!from || !to) return null;
            return (
              <line
                key={`edge-${i}`}
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                stroke="currentColor"
                strokeOpacity={0.25}
                className="text-cyan-300 crow-network-line"
              />
            );
          })}
          {CROW_NETWORK_NODES.map((node, i) => (
            <circle
              key={`node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r={3}
              className="fill-cyan-400/40 crow-network-node"
            />
          ))}
        </svg>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-r from-[#04060c] via-[#04060c]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060c] via-transparent to-[#04060c]/40" />
    </div>
  );
}
