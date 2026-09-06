import { test, expect } from "bun:test";
import {
  CATEGORIES,
  score,
  validateRules,
  type Rules,
  type Decision,
} from "../src/evaluation/scoring";
const rules = (): Rules => ({
  version: "1.0.0",
  weights: { ...CATEGORIES },
  applicability: Object.fromEntries(
    Object.keys(CATEGORIES).map((k) => [k, true]),
  ) as Rules["applicability"],
  expected_components: [],
  tests: Object.keys(CATEGORIES).map((k) => ({
    id: k,
    category: k as keyof typeof CATEGORIES,
    critical: true,
    rule: { op: "example" },
    requirement: "Example",
    source_criteria: ["r1"],
  })),
});
const outcomes = (r: Rules, value: Decision["outcome"] = "pass"): Decision[] =>
  r.tests.map((t) => ({
    test_id: t.id,
    outcome: value,
    evidence: ["fixture"],
  }));
test("all pass awards 100", () => {
  const r = rules(),
    s = score(r, outcomes(r));
  expect(s.total_score).toBe(100);
  expect(s.overall_pass).toBe(true);
});
test("all fail awards zero", () => {
  const r = rules(),
    s = score(r, outcomes(r, "fail"));
  expect(s.total_score).toBe(0);
  expect(s.overall_pass).toBe(false);
});
test("weights and critical override", () => {
  const r = rules(),
    o = outcomes(r);
  o[0].outcome = "fail";
  const s = score(r, o);
  expect(s.total_score).toBe(70);
  expect(s.critical_failure).toBe(true);
});
test("partial category", () => {
  const r = rules();
  r.tests.push({ ...r.tests[0], id: "second" });
  const o = outcomes(r);
  o.at(-1)!.outcome = "fail";
  expect(score(r, o).total_score).toBe(85);
});
test("unknown is not zero", () => {
  const r = rules(),
    o = outcomes(r);
  o[2].outcome = "unknown";
  const s = score(r, o);
  expect(s.total_score).toBeNull();
  expect(s.overall_pass).toBeNull();
  expect([s.possible_total_min, s.possible_total_max]).toEqual([80, 100]);
});
test("unsupported remains null", () => {
  const r = rules(),
    o = outcomes(r);
  o[0].outcome = "unsupported";
  expect(score(r, o).total_score).toBeNull();
});
test("critical failure survives unknown", () => {
  const r = rules(),
    o = outcomes(r);
  o[0].outcome = "fail";
  o[2].outcome = "unknown";
  expect(score(r, o).overall_pass).toBe(false);
  expect(score(r, o).total_score).toBeNull();
});
test("inapplicable category removed from denominator", () => {
  const r = rules(),
    o = outcomes(r);
  r.applicability.physical_constraints = false;
  o[2].outcome = "unknown";
  expect(score(r, o).total_score).toBe(100);
});
test("no applicable categories cannot pass vacuously", () => {
  const r = rules();
  for (const k of Object.keys(r.applicability))
    r.applicability[k as keyof typeof CATEGORIES] = false;
  const s = score(r, outcomes(r));
  expect(s.total_score).toBeNull();
  expect(s.overall_pass).toBeNull();
});
test("missing and duplicate outcomes rejected", () => {
  const r = rules(),
    o = outcomes(r);
  expect(() => score(r, o.slice(1))).toThrow();
  expect(() => score(r, [...o.slice(0, -1), o[0]])).toThrow();
});
test("pass/fail requires evidence", () => {
  const r = rules(),
    o = outcomes(r);
  o[0].evidence = [];
  expect(() => score(r, o)).toThrow();
});
test("invalid rule definitions rejected", () => {
  const r = rules();
  r.tests.push(r.tests[0]);
  expect(() => validateRules(r)).toThrow();
  const other = rules();
  (other.applicability as any).connectivity = null;
  expect(() => validateRules(other)).toThrow();
});
test("outcome order does not change scores", () => {
  const r = rules(),
    o = outcomes(r);
  expect(score(r, o)).toEqual(score(r, o.reverse()));
});
