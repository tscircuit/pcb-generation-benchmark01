import { test, expect } from "bun:test";
import { mkdtempSync, cpSync, rmSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, json, write, walk, sha } from "../src/lib/io";
import { evaluateExperiment } from "../scripts/score-experiment";
const eid = "2026-09-05-codegen-pilot-01";
const snapshot = (dir: string) =>
  Object.fromEntries(
    walk(dir).map((p) => [relative(dir, p), sha(readFileSync(p))]),
  );
test("CLI archive repeatability, input immutability, and untrusted generator claims", () => {
  const root = mkdtempSync(join(tmpdir(), "pcb-bun-test-"));
  try {
    for (const rel of ["src/evaluation", "src/lib", "evaluation/rules/v1"])
      cpSync(join(ROOT, rel), join(root, rel), {
        recursive: true,
        filter: (p) => !p.endsWith(".py") && !p.includes("__pycache__"),
      });
    for (const rel of [
      "evaluation/rubric-v1.json",
      "scripts/score-experiment.ts",
      "package.json",
      "bun.lock",
    ])
      write(join(root, rel), readFileSync(join(ROOT, rel)));
    const config = json(join(ROOT, "configs", eid + ".json"));
    config.execution_order = [
      { prompt_id: "led-indicator", method: "tscircuit-codegen" },
    ];
    config.prompt_revisions = config.prompt_revisions.filter(
      (p: any) => p.prompt_id === "led-indicator",
    );
    config.methods = ["tscircuit-codegen"];
    write(join(root, "configs", eid + ".json"), JSON.stringify(config));
    const rel = join(
        "data/runs",
        eid,
        "led-indicator/tscircuit-codegen/replicate-1",
      ),
      run = join(root, rel);
    cpSync(join(ROOT, rel), run, {
      recursive: true,
      filter: (p) =>
        !p.split("/").some((s) => ["node_modules", "__pycache__"].includes(s)),
    });
    const before = snapshot(run),
      one = evaluateExperiment(eid, root);
    expect(one.status).toBe("created");
    expect(snapshot(run)).toEqual(before);
    const archive = join(one.report, ".."),
      saved = snapshot(archive),
      two = evaluateExperiment(eid, root);
    expect(two.status).toBe("identical-existing-evaluation");
    expect(two.report).toBe(one.report);
    expect(snapshot(archive)).toEqual(saved);
    const original = json(
        join(archive, "led-indicator/tscircuit-codegen/evaluation.json"),
      ),
      result = json(join(run, "result.json"));
    result.validation = { everything: "failed", claimed_score: 0 };
    write(join(run, "result.json"), JSON.stringify(result));
    const three = evaluateExperiment(eid, root),
      updated = json(
        join(
          three.report,
          "../led-indicator/tscircuit-codegen/evaluation.json",
        ),
      );
    expect(updated.outcomes).toEqual(original.outcomes);
    expect(updated.scores).toEqual(original.scores);
    expect(snapshot(archive)).toEqual(saved);
    write(three.report, "tampered");
    expect(() => evaluateExperiment(eid, root)).toThrow("refusing overwrite");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 30000);
