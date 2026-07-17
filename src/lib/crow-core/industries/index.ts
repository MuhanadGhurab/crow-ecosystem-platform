/**
 * C0 — Industry and department template packs (configuration overlays).
 */

import type { VersionLabel } from "../common";

export type IndustryPackKey =
  | "construction"
  | "logistics"
  | "retail"
  | "healthcare"
  | "aviation"
  | "music"
  | "gaming"
  | "freelancers"
  | "software"
  | "hardware";

export type IndustryTemplatePack = {
  packKey: IndustryPackKey;
  label: string;
  version: VersionLabel;
  departmentStarters: readonly string[];
  processStarters: readonly string[];
  kpiStarters: readonly string[];
  terminologyOverlay: Record<string, string>;
  integrationHints: readonly string[];
};

export type DepartmentTemplate = {
  departmentKey: string;
  label: string;
  industryPackKey: IndustryPackKey | "generic";
  roleStarters: readonly string[];
  workflowStarters: readonly string[];
};
