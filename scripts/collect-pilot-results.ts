/** Inventory retained runs, without executing or changing generation artifacts. */
import { existsSync, statSync, readFileSync } from "node:fs";
import { join, relative, basename, extname } from "node:path";
import {
  ROOT,
  json,
  write,
  walk,
  sha,
  validId,
  finalCandidate,
  equal,
} from "../src/lib/io";
export function collectPilot(experimentId: string, requireComplete = false) {
  validId(experimentId);
  const config = json(join(ROOT, "configs", experimentId + ".json")),
    rows: any[] = [];
  for (const item of config.execution_order) {
    validId(item.prompt_id);
    validId(item.method);
    const runDir = join(
        ROOT,
        "data/runs",
        experimentId,
        item.prompt_id,
        item.method,
        "replicate-1",
      ),
      run = json(join(runDir, "run.json")),
      raw = readFileSync(join(runDir, "input/prompt.md"));
    if (
      !raw.equals(
        readFileSync(join(ROOT, "prompts/items", item.prompt_id, "prompt.md")),
      )
    )
      throw Error("Canonical prompt bytes changed: " + runDir);
    if (sha(raw) !== run.prompt_sha256)
      throw Error("Canonical input hash mismatch: " + runDir);
    const result = existsSync(join(runDir, "result.json"))
        ? json(join(runDir, "result.json"))
        : null,
      metadata = json(join(runDir, "input/metadata.json")),
      final = finalCandidate(runDir);
    rows.push({
      final_candidate: final ? relative(runDir, final) : null,
      prompt_id: item.prompt_id,
      method: item.method,
      difficulty: metadata.difficulty,
      labels: metadata.labels,
      run_directory: relative(ROOT, runDir),
      status: result?.status ?? run.status,
      result,
      files: walk(runDir).map((p) => ({
        path: relative(runDir, p),
        size_bytes: statSync(p).size,
        sha256: sha(readFileSync(p)),
      })),
    });
  }
  if (requireComplete) {
    const expected = config.prompt_revisions
        .flatMap((p: any) =>
          config.methods.map((m: string) => p.prompt_id + "/" + m),
        )
        .sort(),
      actual = rows.map((r) => r.prompt_id + "/" + r.method).sort();
    if (!equal(expected, actual))
      throw Error("Incomplete or duplicated prompt-method pairing");
    for (const r of rows)
      if (
        !r.result ||
        ![
          "completed",
          "failed",
          "timeout",
          "unsupported",
          "cancelled",
        ].includes(r.status) ||
        (r.result.final_attempt && !r.final_candidate)
      )
        throw Error(
          "Unfinished run or missing final candidate: " + r.run_directory,
        );
  }
  rows.sort(
    (a, b) =>
      ["easy", "medium", "hard"].indexOf(a.difficulty) -
        ["easy", "medium", "hard"].indexOf(b.difficulty) ||
      (a.prompt_id + "/" + a.method).localeCompare(
        b.prompt_id + "/" + b.method,
      ),
  );
  const out = join(ROOT, "reports", experimentId);
  write(
    join(out, "inventory.json"),
    JSON.stringify({ experiment_id: experimentId, runs: rows }, null, 2) + "\n",
  );
  const text = [
    "# Two-method code-generation pilot",
    "",
    `Experiment: \`${experimentId}\`. One replicate per prompt and method. Computer use was excluded at the user’s request.`,
    "",
    "[**Compare KiCad and tscircuit side by side: rule results and score bounds**](scoring.md).",
    "",
    `Recorded outcomes: ${rows.filter((r) => r.result).length} of ${rows.length} runs. All raw candidates and reported failures are retained.`,
    "",
  ];
  const notes = join(ROOT, "data/runs", experimentId, "execution-notes.json");
  if (existsSync(notes)) text.push(json(notes).context_policy, "");
  text.push(
    "This is an exploratory generation pilot. Completion describes execution, not design correctness. Model settings and token/cost measurements are unavailable; no comparative quality score is claimed. See each run’s result and original validation reports for failures and limitations.",
    "",
    "| Prompt | Difficulty | Method | Run status | Files and diagnostics |",
    "| --- | --- | --- | --- | --- |",
  );
  for (const r of rows) {
    const rel = "../../" + r.run_directory,
      link = r.result
        ? `[Result](${rel}/result.json) · [Files](${rel}/artifacts/README.md)`
        : "Pending";
    text.push(
      `| ${r.prompt_id} | ${r.difficulty} | ${r.method} | ${r.status} | ${link} |`,
    );
  }
  text.push(
    "",
    "## PCB previews",
    "",
    "Previews show generated artifacts, including candidates with known validation failures.",
    "",
    "| Prompt | tscircuit | KiCad |",
    "| --- | --- | --- |",
  );
  const provenance: any[] = [];
  for (const pid of [...new Set(rows.map((r) => r.prompt_id))]) {
    const cells: string[] = [];
    for (const method of ["tscircuit-codegen", "kicad-codegen"]) {
      const r = rows.find((r) => r.prompt_id === pid && r.method === method);
      if (!r?.final_candidate) {
        cells.push("Pending");
        continue;
      }
      const base = join(ROOT, r.run_directory, r.final_candidate),
        all = walk(base),
        candidates = [
          ...all.filter((p) => p.endsWith(".png")),
          ...all.filter((p) => p.endsWith(".svg")),
          ...all.filter((p) => basename(p) === "pcb-svg"),
        ].filter(
          (p) =>
            /pcb|board/i.test(basename(p)) &&
            !relative(base, p).toLowerCase().includes("schematic"),
        );
      if (candidates.length) {
        const source = candidates[0],
          preview = join(
            out,
            "previews",
            `${pid}--${method}${extname(source) === ".png" ? ".png" : ".svg"}`,
          );
        write(preview, readFileSync(source));
        provenance.push({
          source: relative(ROOT, source),
          preview: relative(ROOT, preview),
          operation: "byte-for-byte copy with standardized filename",
          sha256: sha(readFileSync(source)),
        });
        cells.push(`![${pid} ${method}](previews/${basename(preview)})`);
      } else
        cells.push(
          `[Native files](../../${r.run_directory}/artifacts/README.md)`,
        );
    }
    text.push(`| ${pid} | ${cells[0]} | ${cells[1]} |`);
  }
  write(
    join(out, "preview-provenance.json"),
    JSON.stringify(provenance, null, 2) + "\n",
  );
  text.push("", "## Recorded limitations", "");
  for (const r of rows) {
    let limitations = r.result?.known_limitations ?? [];
    if (typeof limitations === "string") limitations = [limitations];
    if (limitations.length)
      text.push(
        `**${r.prompt_id} / ${r.method}**`,
        "",
        ...limitations.map((s: string) => "- " + s),
        "",
      );
  }
  write(join(out, "README.md"), text.join("\n") + "\n");
  return {
    runs: rows.length,
    results: rows.filter((r) => r.result).length,
    report: join(out, "README.md"),
  };
}
if (import.meta.main)
  console.log(
    JSON.stringify(
      collectPilot(Bun.argv[2] ?? "", Bun.argv.includes("--require-complete")),
    ),
  );
