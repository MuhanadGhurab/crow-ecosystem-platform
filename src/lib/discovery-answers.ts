import type { CemModuleKey } from "@/lib/constants/modules";

export type DiscoveryAnswerRow = {
  sectionKey: string;
  questionKey: string;
  valueJson: unknown;
};

export function getDiscoveryAnswer<T>(
  answers: DiscoveryAnswerRow[],
  sectionKey: string,
  questionKey: string
): T | undefined {
  const row = answers.find((a) => a.sectionKey === sectionKey && a.questionKey === questionKey);
  return row?.valueJson as T | undefined;
}

/** Resolved module keys: discovery save overrides implementation request defaults */
export function getConfirmedModuleKeys(
  requestedModuleKeys: string[],
  answers: DiscoveryAnswerRow[]
): CemModuleKey[] {
  const fromAnswers = getDiscoveryAnswer<string[]>(answers, "modules", "confirmedKeys");
  if (fromAnswers?.length) {
    return fromAnswers as CemModuleKey[];
  }
  return requestedModuleKeys as CemModuleKey[];
}

/** SAREA experience package key from discovery — feeds pricing.service / PricingEstimate */
export function getSareaPackageKey(answers: DiscoveryAnswerRow[]): string | null {
  const key = getDiscoveryAnswer<string>(answers, "experience", "sareaPackageKey");
  return key && typeof key === "string" ? key : null;
}

/** Employee band from discovery organization step, else request default */
export function getDiscoveryEmployeeBand(
  answers: DiscoveryAnswerRow[],
  requestEmployeeBand?: string | null
): string | null {
  return (
    getDiscoveryAnswer<string>(answers, "organization", "employeeBand") ??
    requestEmployeeBand ??
    null
  );
}

/** AI extras from discovery experience step */
export function getAiExtraKeys(answers: DiscoveryAnswerRow[]): string[] {
  const keys = getDiscoveryAnswer<string[]>(answers, "experience", "aiExtras");
  return Array.isArray(keys) ? keys : [];
}
