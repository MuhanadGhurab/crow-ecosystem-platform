import type { EnterpriseOperatingGraph } from "../domain-types";
import type { CatalogRelationshipRule, RelationshipValidationFinding } from "./relationship-types";
import { CATALOG_RELATIONSHIP_RULES, getRelationshipRule } from "./relationship-registry";

export function validateCatalogRelationshipRules(): RelationshipValidationFinding[] {
  const findings: RelationshipValidationFinding[] = [];
  const keys = new Set<string>();

  for (const r of CATALOG_RELATIONSHIP_RULES) {
    if (keys.has(r.ruleKey)) {
      findings.push({ severity: "BLOCKING_ERROR", code: "DUPLICATE_RULE", message: `Duplicate rule key ${r.ruleKey}`, ruleKey: r.ruleKey });
    }
    keys.add(r.ruleKey);
    if (!r.version) findings.push({ severity: "BLOCKING_ERROR", code: "UNVERSIONED_RULE", message: `Rule ${r.ruleKey} missing version`, ruleKey: r.ruleKey });
    if (r.authorityEffect !== "NONE") {
      findings.push({ severity: "BLOCKING_ERROR", code: "AUTHORITY_EFFECT", message: `Rule ${r.ruleKey} has authority effect`, ruleKey: r.ruleKey });
    }
    if (r.status === "DEPRECATED" && r.implementationStatus !== "LEGACY_COMPATIBILITY") {
      findings.push({ severity: "WARNING", code: "DEPRECATED_WITHOUT_COMPAT", message: `Deprecated rule ${r.ruleKey} without compatibility status`, ruleKey: r.ruleKey });
    }
  }

  const byPair = new Map<string, CatalogRelationshipRule[]>();
  for (const r of CATALOG_RELATIONSHIP_RULES) {
    const k = `${r.sourceType}:${r.targetType}:${r.relationshipType}`;
    const list = byPair.get(k) ?? [];
    list.push(r);
    byPair.set(k, list);
  }
  for (const [k, rules] of byPair) {
    const current = rules.filter((r) => r.status === "CURRENT");
    if (current.length > 1 && rules.every((r) => r.priority === current[0]!.priority)) {
      findings.push({ severity: "WARNING", code: "AMBIGUOUS_PRIORITY", message: `Ambiguous priority for ${k}`, ruleKey: current[0]!.ruleKey });
    }
  }

  return findings;
}

export function validateResolvedRelationships(graph: EnterpriseOperatingGraph): RelationshipValidationFinding[] {
  const findings: RelationshipValidationFinding[] = [];
  const nodeIds = new Set(graph.nodes.map((n) => n.id));

  for (const e of graph.edges) {
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
      findings.push({ severity: "BLOCKING_ERROR", code: "UNKNOWN_ENDPOINT", message: `Edge ${e.id} references unknown node` });
      continue;
    }
    const ruleKey = e.provenance.startsWith("rule:") ? e.provenance.slice(5) : undefined;
    if (ruleKey && !getRelationshipRule(ruleKey)) {
      findings.push({ severity: "WARNING", code: "UNKNOWN_RULE_REF", message: `Edge ${e.id} references unknown rule ${ruleKey}` });
    }
    if (!ruleKey) {
      findings.push({ severity: "BLOCKING_ERROR", code: "UNDOCUMENTED_EDGE", message: `Edge ${e.id} lacks registry rule reference` });
    }
  }

  return findings;
}
