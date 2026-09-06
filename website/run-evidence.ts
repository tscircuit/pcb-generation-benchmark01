import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { ROOT, json, write, sha, escapeHtml as esc } from "../src/lib/io";
import { runTiming } from "../src/evidence/timing";
export function timingHtml(t: ReturnType<typeof runTiming>) {
  const format = (v: number | null) =>
    v === null ? "Unavailable" : `${v.toFixed(3)} s`;
  return `<dl class="run-timing"><dt>Total run time · recorded</dt><dd>${format(t.recorded_total_seconds)}</dd>${t.derived_total_seconds !== null ? `<dt>Total run time · derived from timestamps</dt><dd>${format(t.derived_total_seconds)}</dd>` : ""}<dt>Generation-only time</dt><dd>${format(t.generation_only_seconds)}</dd></dl>`;
}
export function publishRunEvidence(
  eid: string,
  prompt: string,
  method: string,
  out: string,
) {
  const run = json(
    join(ROOT, "data/runs", eid, prompt, method, "replicate-1/run.json"),
  );
  const timing = runTiming(run);
  const base = join(ROOT, "data/supplementary", eid, "transcripts"),
    index = join(base, "index.json");
  const entry = existsSync(index)
    ? json(index).entries.find((e: any) => e.run_id === run.run_id)
    : null;
  let evidence: any = {
    run_id: run.run_id,
    status: "unavailable",
    notes: ["No recovered transcript evidence is available for this run."],
    events: [],
  };
  const stem = `${prompt}--${method}`,
    href = `transcripts/${stem}.html`,
    dataHref = `${stem}.json`;
  if (entry) {
    const bytes = readFileSync(join(base, entry.file));
    if (sha(bytes) !== entry.sha256)
      throw Error("Transcript hash mismatch: " + run.run_id);
    evidence = JSON.parse(bytes.toString("utf8"));
    if (evidence.run_id !== run.run_id || evidence.status !== entry.status)
      throw Error("Transcript mapping mismatch");
    write(join(out, "transcripts", dataHref), bytes);
  }
  const events = evidence.events
    .map(
      (e: any) =>
        `<details><summary>${esc(e.timestamp ?? "Timestamp unavailable")} · ${esc(e.item.role ?? e.item.type)} · source line ${e.source_line}</summary><pre>${esc(JSON.stringify(e.item, null, 2))}</pre></details>`,
    )
    .join("\n");
  write(
    join(out, href),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(run.run_id)} — transcript</title><style>body{font:16px/1.5 system-ui;max-width:1000px;margin:2rem auto;padding:0 1rem;color:#192334}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f1f4f8;padding:1rem}summary{cursor:pointer;padding:.6rem}details{border-bottom:1px solid #ccc}h1{overflow-wrap:anywhere}</style><body><a href="../index.html#${prompt}">← Comparison</a><h1>${esc(prompt)} · ${esc(method)}</h1><h2>Generation transcript · ${esc(evidence.status)}</h2>${evidence.notes.map((n: string) => `<p>${esc(n)}</p>`).join("")}${entry ? `<p><a href="${dataHref}">Download evidence JSON</a> · SHA-256: <code>${esc(entry.sha256)}</code></p><details><summary>Provenance and recorded repair attempts</summary><pre>${esc(JSON.stringify({ provenance: evidence.provenance, attempts: evidence.attempts }, null, 2))}</pre></details>` : ""}<h2>Timestamped events (${evidence.events.length})</h2>${events}</body></html>`,
  );
  return {
    timing,
    transcript: {
      href,
      status: evidence.status,
      sha256: entry?.sha256 ?? null,
    },
    html: `${timingHtml(timing)}<p><a href="${href}">Generation transcript · ${esc(evidence.status)}</a></p>`,
  };
}
