/** Score retained artifacts into immutable, content-addressed archives. */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { join, relative, dirname } from "node:path";
import {
  ROOT,
  json,
  read,
  sha,
  dump,
  write,
  walk,
  validId,
  finalCandidate,
  equal,
} from "../src/lib/io";
import {
  loadKicad,
  loadTscircuit,
  UnsupportedArtifact,
} from "../src/evaluation/artifacts";
import { Checker } from "../src/evaluation/checks";
import {
  CATEGORIES,
  score,
  validateRules,
  type Decision,
} from "../src/evaluation/scoring";
export function evaluateExperiment(experimentId: string, root = ROOT) {
  validId(experimentId);
  const configPath = join(root, "configs", experimentId + ".json"),
    config = json(configPath),
    versions = {
      evaluator: "1.0.0-ts.1",
      bun: Bun.version,
      artifact_readers:
        "TypeScript data readers; no external native tool replay",
    };
  const rubric = json(join(root, "evaluation/rubric-v1.json"));
  if (rubric.version !== "1.0.0" || !equal(rubric.weights, CATEGORIES))
    throw Error(
      "Rubric version/weights differ from the implemented scoring contract",
    );
  const codeFiles = [
    ...walk(join(root, "src/evaluation")).filter((p) => p.endsWith(".ts")),
    ...walk(join(root, "src/lib")).filter((p) => p.endsWith(".ts")),
    join(root, "scripts/score-experiment.ts"),
    join(root, "evaluation/rubric-v1.json"),
    join(root, "package.json"),
    join(root, "bun.lock"),
  ];
  const sources = Object.fromEntries(
      codeFiles.map((p) => [relative(root, p), readFileSync(p)]),
    ),
    codeHash = sha(
      dump(
        Object.fromEntries(
          Object.entries(sources).map(([p, b]) => [p, sha(b)]),
        ),
      ),
    );
  const decisions: any[] = [],
    frozenRules: Record<string, Buffer> = {},
    allInputs: Record<string, string> = {},
    seen = new Set<string>();
  for (const item of config.execution_order) {
    validId(item.prompt_id);
    validId(item.method);
    const key = item.prompt_id + "/" + item.method;
    if (seen.has(key)) throw Error("Duplicate prompt-method entry");
    seen.add(key);
    const runDir = join(root, "data/runs", experimentId, key, "replicate-1"),
      run = json(join(runDir, "run.json")),
      final = finalCandidate(runDir);
    const files = [
      ...[
        "run.json",
        "result.json",
        "input/prompt.md",
        "input/metadata.json",
        "artifacts/README.md",
      ]
        .map((p) => join(runDir, p))
        .filter(existsSync),
      ...(final ? walk(final) : []),
    ];
    const manifest = [...new Set(files)]
      .sort()
      .map((p) => ({ path: relative(root, p), sha256: sha(readFileSync(p)) }));
    const raw = readFileSync(
        join(root, "evaluation/rules/v1", item.prompt_id + ".json"),
      ),
      rules = validateRules(JSON.parse(raw.toString()));
    frozenRules[item.prompt_id] = raw;
    if (
      sha(readFileSync(join(runDir, "input/prompt.md"))) !==
        rules.prompt_sha256 ||
      run.prompt_sha256 !== rules.prompt_sha256 ||
      run.prompt_revision !== rules.prompt_revision ||
      run.prompt_id !== rules.prompt_id ||
      run.method !== item.method
    )
      throw Error("Prompt/run identity mismatch");
    const metadata = json(join(runDir, "input/metadata.json")),
      required = metadata.acceptance_criteria
        .map((c: any) => c.criterion_id)
        .sort(),
      covered = [
        ...new Set(rules.tests.flatMap((t) => t.source_criteria)),
      ].sort();
    if (!equal(required, covered))
      throw Error("Acceptance-criterion coverage mismatch");
    for (const m of manifest) allInputs[m.path] = m.sha256;
    let facts: any = null,
      parseError: string | null = null,
      readerUnsupported = false;
    try {
      if (final) {
        if (item.method === "tscircuit-codegen") facts = loadTscircuit(final);
        else if (item.method === "kicad-codegen") facts = loadKicad(final);
        else throw new UnsupportedArtifact("Unsupported method");
      } else parseError = "No retained selected candidate";
    } catch (e) {
      readerUnsupported = e instanceof UnsupportedArtifact;
      parseError =
        (readerUnsupported ? "UnsupportedArtifact" : (e as Error).name) +
        ": " +
        (e as Error).message;
    }
    const checker = new Checker(facts, rules, runDir, readerUnsupported);
    const outcomes: Decision[] = rules.tests.map((test) => {
      const [outcome, observed] = checker.check(test.rule);
      return {
        test_id: test.id,
        outcome,
        observed,
        evidence: ["pass", "fail"].includes(outcome)
          ? ["input-manifest.json", "normalized-facts.json"]
          : [],
        critical: test.critical,
        category: test.category,
      };
    });
    const evaluation = {
      schema_version: "1.0.0",
      run_id: run.run_id,
      prompt_id: item.prompt_id,
      method: item.method,
      prompt_sha256: rules.prompt_sha256,
      rules_sha256: sha(raw),
      evaluator_code_sha256: codeHash,
      versions,
      retrospective: true,
      parse_error: parseError,
      outcomes,
      scores: score(rules, outcomes),
    };
    decisions.push({
      item,
      evaluation,
      facts,
      manifest,
      geometry: checker.geometry,
    });
  }
  const expected = config.prompt_revisions.flatMap((p: any) =>
    config.methods.map((m: string) => p.prompt_id + "/" + m),
  );
  if (!equal([...seen].sort(), expected.sort()))
    throw Error("Incomplete prompt-method pairs");
  const identity = {
    config_sha256: sha(readFileSync(configPath)),
    inputs: allInputs,
    rules: Object.fromEntries(
      Object.entries(frozenRules).map(([k, v]) => [k, sha(v)]),
    ),
    code_sha256: codeHash,
    versions,
  };
  const id = "deterministic-v1-ts-" + sha(dump(identity)).slice(0, 20),
    destination = join(root, "data/evaluations", experimentId, id),
    payload: Record<string, string | Buffer> = {
      "evaluation-manifest.json": dump({ evaluation_id: id, ...identity }),
    },
    summary: any[] = [];
  for (const { item, evaluation, facts, manifest, geometry } of decisions) {
    const rel = item.prompt_id + "/" + item.method;
    evaluation.evaluation_id = id + "--" + item.prompt_id + "--" + item.method;
    const normalized = facts
      ? Object.fromEntries(Object.entries(facts).filter(([k]) => k !== "files"))
      : null;
    for (const [name, value] of [
      ["evaluation.json", evaluation],
      ["normalized-facts.json", normalized],
      ["input-manifest.json", manifest],
      ["copper-audit.json", geometry],
    ])
      payload[rel + "/" + name] = dump(value);
    summary.push({
      prompt_id: item.prompt_id,
      method: item.method,
      ...evaluation.scores,
    });
  }
  for (const [name, raw] of Object.entries(frozenRules))
    payload["rules/" + name + ".json"] = raw;
  for (const [name, raw] of Object.entries(sources))
    payload["evaluator-source/" + name] = raw;
  summary.sort((a, b) =>
    (a.prompt_id + "/" + a.method).localeCompare(b.prompt_id + "/" + b.method),
  );
  payload["summary.json"] = dump(summary);
  payload["README.md"] = [
    "# Deterministic retrospective scoring",
    "",
    `Evaluation: \`${id}\`. TypeScript/Bun implementation of v1; original designs were read only.`,
    "",
    "Weights: functional requirements 30%, connectivity 30%, physical constraints 20%, deliverable integrity 20%. Unknown evidence blocks strict totals. Ranges are possible bounds, not awarded scores.",
    "",
    "| Prompt | Method | Strict score | Possible range | Overall pass | Resolved rules | Evidence |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...summary.map(
      (r) =>
        `| ${r.prompt_id} | ${r.method} | ${r.total_score ?? "unknown"} | ${r.possible_total_min}–${r.possible_total_max} | ${r.overall_pass ?? "unknown"} | ${r.resolved_test_count}/${r.applicable_test_count} | [Rules](${r.prompt_id}/${r.method}/evaluation.json) |`,
    ),
    "",
  ].join("\n");
  for (const [p, h] of Object.entries(allInputs))
    if (sha(readFileSync(join(root, p))) !== h)
      throw Error("Input changed during evaluation: " + p);
  let status = "created";
  if (existsSync(destination)) {
    const existing = walk(destination);
    if (
      existing.length !== Object.keys(payload).length ||
      existing.some(
        (p) =>
          !payload[relative(destination, p)] ||
          !readFileSync(p).equals(
            Buffer.from(payload[relative(destination, p)]),
          ),
      )
    )
      throw Error("Existing immutable evaluation differs; refusing overwrite");
    status = "identical-existing-evaluation";
  } else {
    mkdirSync(dirname(destination), { recursive: true });
    const temp = mkdtempSync(join(dirname(destination), ".scoring-"));
    try {
      const staged = join(temp, "evaluation");
      for (const [p, raw] of Object.entries(payload))
        write(join(staged, p), raw);
      renameSync(staged, destination);
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  }
  return {
    status,
    runs: summary.length,
    strict_scores: summary.filter((r) => r.total_score !== null).length,
    known_critical_failures: summary.filter((r) => r.critical_failure).length,
    report: join(destination, "README.md"),
  };
}
if (import.meta.main) {
  try {
    console.log(JSON.stringify(evaluateExperiment(Bun.argv[2] ?? "")));
  } catch (e) {
    console.error((e as Error).message);
    process.exitCode = 1;
  }
}
