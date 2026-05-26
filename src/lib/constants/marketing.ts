/** Public marketing copy — clients, industries, case studies */

export const MARKETING_CLIENTS = [
  {
    name: "Al Noor Holdings",
    industry: "Conglomerate",
    region: "Riyadh · KSA",
    engines: ["CEM", "CyberCrow", "SAREA"],
  },
  {
    name: "Riyadh Logistics Co.",
    industry: "Logistics",
    region: "Eastern Province · KSA",
    engines: ["CEM", "CyberCrow"],
  },
  {
    name: "Gulf Health Network",
    industry: "Healthcare",
    region: "GCC",
    engines: ["CEM", "SAREA"],
  },
  {
    name: "Najd Retail Group",
    industry: "Retail",
    region: "Central · KSA",
    engines: ["CEM", "CyberCrow", "SAREA"],
  },
] as const;

export { MARKETING_INDUSTRIES_LEGACY as MARKETING_INDUSTRIES } from "@/lib/constants/sector-catalog";
