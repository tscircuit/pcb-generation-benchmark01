/** Pure deterministic scoring. Integer half-points avoid intermediate rounding. */
import { equal } from "../lib/io";
export const CATEGORIES = {
  functional_requirements: 30,
  connectivity: 30,
  physical_constraints: 20,
  deliverable_integrity: 20,
};
export type Category = keyof typeof CATEGORIES;
export type Outcome = "pass" | "fail" | "unknown" | "unsupported";
export interface RuleTest {
  id: string;
  category: Category;
  critical: boolean;
  rule: Record<string, any>;
  requirement: string;
  source_criteria: string[];
}
export interface Rules {
  version: string;
  weights: typeof CATEGORIES;
  applicability: Record<Category, boolean>;
  tests: RuleTest[];
  expected_components: any[];
  [key: string]: any;
}
export interface Decision {
  test_id: string;
  outcome: Outcome;
  evidence: string[];
  [key: string]: any;
}
export function validateRules(rules: Rules) {
  if (rules.version !== "1.0.0") throw Error("Unsupported rules version");
  if (!equal(rules.weights, CATEGORIES))
    throw Error("Rules must use the frozen 30/30/20/20 weights");
  if (
    !equal(
      Object.keys(rules.applicability ?? {}).sort(),
      Object.keys(CATEGORIES).sort(),
    ) ||
    Object.values(rules.applicability).some((x) => typeof x !== "boolean")
  )
    throw Error("Every category needs explicit boolean applicability");
  const seen = new Set<string>(),
    counts = Object.fromEntries(Object.keys(CATEGORIES).map((k) => [k, 0]));
  for (const t of rules.tests ?? []) {
    if (typeof t.id !== "string" || !t.id || seen.has(t.id))
      throw Error("Missing or duplicate test ID");
    seen.add(t.id);
    if (!(t.category in CATEGORIES) || typeof t.critical !== "boolean")
      throw Error("Invalid category or critical flag");
    if (
      !t.rule ||
      typeof t.rule !== "object" ||
      Array.isArray(t.rule) ||
      !t.requirement ||
      !t.source_criteria?.length
    )
      throw Error(
        "Every test needs an executable rule and requirement provenance",
      );
    counts[t.category]++;
  }
  if (
    Object.keys(CATEGORIES).some(
      (c) => rules.applicability[c as Category] && !counts[c],
    )
  )
    throw Error("Applicable categories cannot have zero tests");
  return rules;
}
export function score(rules: Rules, outcomes: Decision[]) {
  validateRules(rules);
  const tests = rules.tests;
  if (
    outcomes.length !== tests.length ||
    !equal(
      [...new Set(outcomes.map((o) => o.test_id))].sort(),
      tests.map((t) => t.id).sort(),
    )
  )
    throw Error("Missing, duplicate, or unexpected outcomes");
  for (const o of outcomes) {
    if (!["pass", "fail", "unknown", "unsupported"].includes(o.outcome))
      throw Error("Invalid outcome");
    if (["pass", "fail"].includes(o.outcome) && !o.evidence?.length)
      throw Error("Pass/fail requires evidence");
  }
  const byId = Object.fromEntries(outcomes.map((o) => [o.test_id, o]));
  let points = 0,
    lower = 0,
    upper = 0,
    denominator = 0,
    anyUnknown = false,
    criticalFailure = false;
  const all: Outcome[] = [];
  const categories = Object.entries(CATEGORIES).map(([c, weight]) => {
    const category = c as Category,
      applicable = rules.applicability[category],
      selected = applicable
        ? tests
            .filter((t) => t.category === category)
            .map((t) => byId[t.id].outcome)
        : [];
    const passed = selected.filter((o) => o === "pass").length,
      failed = selected.filter((o) => o === "fail").length,
      unknown = selected.length - passed - failed;
    let value: number | null = null,
      lo: number | null = null,
      hi: number | null = null;
    if (applicable) {
      denominator += weight;
      all.push(...selected);
      if (unknown) {
        anyUnknown = true;
        lo = passed ? 1 : 0;
        hi = failed ? 1 : 2;
      } else {
        value = passed === selected.length ? 2 : passed ? 1 : 0;
        lo = hi = value;
        points += weight * value;
      }
      lower += weight * lo;
      upper += weight * hi;
      criticalFailure ||= tests.some(
        (t) =>
          t.category === category &&
          t.critical &&
          byId[t.id].outcome === "fail",
      );
    }
    return {
      category,
      weight,
      applicable,
      score: value,
      possible_score_min: lo,
      possible_score_max: hi,
      passed,
      failed,
      unknown_or_unsupported: unknown,
    };
  });
  return {
    category_scores: categories,
    total_score:
      denominator && !anyUnknown ? (50 * points) / denominator : null,
    overall_pass: criticalFailure
      ? false
      : anyUnknown || !denominator
        ? null
        : all.every((o) => o === "pass"),
    critical_failure: criticalFailure,
    possible_total_min: denominator ? (50 * lower) / denominator : null,
    possible_total_max: denominator ? (50 * upper) / denominator : null,
    resolved_test_count: all.filter((o) => ["pass", "fail"].includes(o)).length,
    applicable_test_count: all.length,
  };
}
