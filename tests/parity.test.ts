import { test, expect } from "bun:test";
import { join } from "node:path";
import { ROOT, json, finalCandidate } from "../src/lib/io";
import { loadKicad, loadTscircuit } from "../src/evaluation/artifacts";
import { Checker } from "../src/evaluation/checks";
import { score } from "../src/evaluation/scoring";
const eid = "2026-09-05-codegen-pilot-01",
  archive = join(
    ROOT,
    "data/evaluations",
    eid,
    "deterministic-v1-5a9c0cca93c84a315b17",
  );
for (const item of json(join(ROOT, "configs", eid + ".json")).execution_order) {
  test(
    "retained Python/TypeScript parity: " +
      item.prompt_id +
      " / " +
      item.method,
    () => {
      const run = join(
          ROOT,
          "data/runs",
          eid,
          item.prompt_id,
          item.method,
          "replicate-1",
        ),
        final = finalCandidate(run)!,
        facts =
          item.method === "kicad-codegen"
            ? loadKicad(final)
            : loadTscircuit(final),
        rules = json(
          join(ROOT, "evaluation/rules/v1", item.prompt_id + ".json"),
        ),
        checker = new Checker(facts, rules, run),
        outcomes = rules.tests.map((t: any) => {
          const [outcome, observed] = checker.check(t.rule);
          return {
            test_id: t.id,
            outcome,
            observed,
            evidence: ["pass", "fail"].includes(outcome)
              ? ["input-manifest.json", "normalized-facts.json"]
              : [],
            critical: t.critical,
            category: t.category,
          };
        }),
        original = json(
          join(archive, item.prompt_id, item.method, "evaluation.json"),
        );
      expect(outcomes.map((o: any) => [o.test_id, o.outcome])).toEqual(
        original.outcomes.map((o: any) => [o.test_id, o.outcome]),
      );
      expect(score(rules, outcomes)).toEqual(original.scores);
    },
    30000,
  );
}
