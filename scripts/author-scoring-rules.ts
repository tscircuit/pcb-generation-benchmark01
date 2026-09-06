/** Reproduce the ten frozen evaluator-only v1 specifications. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, json, write, dump, equal, sha } from "../src/lib/io";
import { SPECIFICATIONS } from "../src/evaluation/specifications-v1";
import { validateRules, type Rules } from "../src/evaluation/scoring";
export function authorRules() {
  for (const [pid, spec] of Object.entries(SPECIFICATIONS)) {
    const r = validateRules(spec as Rules),
      p = join(ROOT, "prompts/items", pid),
      m = json(join(p, "metadata.json"));
    if (
      sha(readFileSync(join(p, "prompt.md"))) !== r.prompt_sha256 ||
      m.prompt_sha256 !== r.prompt_sha256 ||
      m.revision !== r.prompt_revision
    )
      throw Error("Frozen prompt identity changed: " + pid);
    const required = m.acceptance_criteria
        .map((c: any) => c.criterion_id)
        .sort(),
      covered = [...new Set(r.tests.flatMap((t) => t.source_criteria))].sort();
    if (!equal(required, covered))
      throw Error("Acceptance-criterion coverage mismatch");
    const dest = join(ROOT, "evaluation/rules/v1", pid + ".json");
    if (existsSync(dest)) {
      if (!equal(json(dest), r))
        throw Error("Refusing to overwrite frozen rules: " + dest);
    } else write(dest, dump(r));
  }
  console.log(
    "Verified/authored ten frozen evaluator-only rule specifications.",
  );
}
if (import.meta.main) authorRules();
