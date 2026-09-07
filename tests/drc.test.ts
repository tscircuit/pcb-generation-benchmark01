import { test, expect } from "bun:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { ROOT, json, read, sha } from "../src/lib/io";

test("DRC comparison preserves reported failures, missing evidence, and report bytes without scores", () => {
  const out = join(ROOT, "website/dist");
  const results = json(join(out, "results.json"));
  expect(JSON.stringify(results)).not.toMatch(/score|critical_failure|overall_pass/);
  expect(read(join(out, "index.html"))).not.toMatch(/score|\/ 100/i);
  expect(results.prompts).toHaveLength(10);
  for (const prompt of results.prompts) {
    expect(prompt.methods["tscircuit-codegen"].drc.passed).toBeNull();
    expect(prompt.methods["tscircuit-codegen"].drc.report).toBeNull();
    const drc = prompt.methods["kicad-codegen"].drc;
    const run = join(ROOT, "data/runs", results.experiment_id, prompt.prompt_id, "kicad-codegen/replicate-1");
    const validation = json(join(run, "result.json")).validation;
    const record = Array.isArray(validation) ? validation.find((entry) => entry.check === "drc") : validation.drc ?? validation.pcb_drc;
    expect(drc.passed).toBe(record.passed ?? null);
    const bytes = readFileSync(join(run, record.report ?? record.log ?? record.log_path));
    expect(readFileSync(join(out, drc.report))).toEqual(bytes);
    expect(drc.sha256).toBe(sha(bytes));
  }
  expect(results.prompts.find((p: any) => p.prompt_id === "analog-input-bank").methods["kicad-codegen"].drc.violations).toBe(63);
  expect(results.prompts.find((p: any) => p.prompt_id === "diode-key-matrix").methods["kicad-codegen"].drc.passed).toBe(false);
});
