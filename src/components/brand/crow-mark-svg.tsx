import type { ReactNode } from "react";
import type { CrowMarkVariant } from "@/components/brand/types";
import {
  CROW_ARMOR_PLATES,
  CROW_MOTION_OUTLINE_PATH,
  CROW_OUTLINE_PATH,
  type CrowArmorPlateFill,
} from "@/components/brand/crow-svg-paths";

export type CrowMarkSvgProps = {
  variant?: CrowMarkVariant;
  className?: string;
  labeled?: boolean;
  title?: string;
};

const VIEWBOX = "0 0 200 180";

const PLATE_FILLS: Record<CrowArmorPlateFill, string> = {
  highlight: "url(#crow-armor-highlight)",
  mid: "url(#crow-armor-mid)",
  shadow: "url(#crow-armor-shadow)",
  deep: "url(#crow-armor-deep)",
  beak: "url(#crow-armor-beak)",
  beakHighlight: "url(#crow-armor-beak-highlight)",
  eye: "var(--crow-loader-primary, #22d3ee)",
};

function CrowArmorDefs() {
  return (
    <defs>
      <linearGradient id="crow-armor-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="55%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
      <linearGradient id="crow-armor-mid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
      <linearGradient id="crow-armor-shadow" x1="0%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="crow-armor-deep" x1="0%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="#172554" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="crow-armor-beak" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#0c1222" />
      </linearGradient>
      <linearGradient id="crow-armor-beak-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
      </linearGradient>
      <filter id="crow-eye-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function renderArmorPlates(options?: { subtle?: boolean }) {
  const opacity = options?.subtle ? 0.35 : 1;
  return (
    <g className="crow-armor-plates" opacity={opacity}>
      {CROW_ARMOR_PLATES.map((plate) => (
        <path
          key={plate.id}
          d={plate.d}
          fill={PLATE_FILLS[plate.fill]}
          className={plate.fill === "eye" ? "crow-armor-eye" : undefined}
          filter={plate.fill === "eye" ? "url(#crow-eye-glow)" : undefined}
        />
      ))}
    </g>
  );
}

function renderPrimary() {
  return (
    <>
      <CrowArmorDefs />
      {renderArmorPlates()}
    </>
  );
}

function renderMonochrome() {
  return (
    <path
      d={CROW_OUTLINE_PATH}
      fill="currentColor"
      className="text-slate-200"
    />
  );
}

function renderHighContrast() {
  return (
    <>
      <CrowArmorDefs />
      {renderArmorPlates()}
      <path
        d={CROW_OUTLINE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="miter"
        className="text-cyan-300"
        opacity={0.9}
      />
    </>
  );
}

function renderMotion() {
  return (
    <>
      <CrowArmorDefs />
      <path
        d={CROW_MOTION_OUTLINE_PATH}
        fill="none"
        stroke="url(#crow-armor-highlight)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="miter"
        pathLength={100}
        className="crow-motion-stroke"
      />
      {renderArmorPlates({ subtle: true })}
    </>
  );
}

function renderSubtle() {
  return (
    <>
      <CrowArmorDefs />
      {renderArmorPlates({ subtle: true })}
    </>
  );
}

export function CrowMarkSvg({
  variant = "primary",
  className = "",
  labeled = false,
  title = "CyberCrow armored mark",
}: CrowMarkSvgProps) {
  let body: ReactNode;
  switch (variant) {
    case "motion":
      body = renderMotion();
      break;
    case "hero":
      body = renderSubtle();
      break;
    case "monochrome":
      body = renderMonochrome();
      break;
    case "watermark":
      body = (
        <g opacity={0.55}>
          <CrowArmorDefs />
          {renderArmorPlates({ subtle: true })}
        </g>
      );
      break;
    case "high-contrast":
      body = renderHighContrast();
      break;
    case "primary":
    default:
      body = renderPrimary();
      break;
  }

  return (
    <svg
      viewBox={VIEWBOX}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role={labeled ? "img" : undefined}
      aria-hidden={labeled ? undefined : true}
    >
      {labeled ? <title>{title}</title> : null}
      {body}
    </svg>
  );
}
