/** SAREA experience package — monthly add-on used in commercial estimates */

export const SAREA_DEFAULT_MONTHLY_SAR = 4_299;



export const SAREA_PACKAGES = [

  {

    key: "essential",

    label: "Frontline",

    monthlySar: 2_399,

    description: "Frontline personas · standard widget density",

  },

  {

    key: "professional",

    label: "Manager",

    monthlySar: SAREA_DEFAULT_MONTHLY_SAR,

    description: "Manager personas · role-mapped navigation",

  },

  {

    key: "executive",

    label: "Executive",

    monthlySar: 5_799,

    description: "Executive layouts · unlimited personas + device rules",

  },

] as const;



export type SareaPackageKey = (typeof SAREA_PACKAGES)[number]["key"];



export function sareaPackageMonthlySar(key?: string | null): number {

  const pkg = SAREA_PACKAGES.find((p) => p.key === key);

  return pkg?.monthlySar ?? SAREA_DEFAULT_MONTHLY_SAR;

}

