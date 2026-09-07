/** Build the comparison from preserved evaluation records without rescoring. */
import { join, relative, basename } from "node:path";
import { readFileSync, copyFileSync, mkdirSync } from "node:fs";
import { zipSync } from "fflate";
import {
  ROOT,
  json,
  read,
  write,
  walk,
  sha,
  finalCandidate,
  escapeHtml as esc,
} from "../src/lib/io";
import { publishRunEvidence } from "./run-evidence";
import { verifiedScore, overallVerifiedScore, type VerifiedScoreCategory } from "./verifiedScore";
import { HEADER, FOOTER } from "./templates";
const EID = "2026-09-05-codegen-pilot-01",
  VID = "deterministic-v1-5a9c0cca93c84a315b17",
  OUT = join(ROOT, "website/dist"),
  EV = join(ROOT, "data/evaluations", EID, VID);
const methods = ["kicad-codegen", "tscircuit-codegen"],
  names = ["KiCad", "tscircuit"];
function scoreHtml(result: { category_scores: VerifiedScoreCategory[]; critical_failure: boolean }): string {
  const score = verifiedScore(result.category_scores);
  const value = score === null ? "Unavailable" : score.toFixed(1);
  return `<div class="verified-score"><span>Verified score</span><strong>${value}${score === null ? "" : "<small> / 100</small>"}</strong>${result.critical_failure ? '<small class="fail">Critical check failed</small>' : ""}</div>`;
}
export function buildWebsite() {
  mkdirSync(OUT, { recursive: true });
  const rows: any[] = json(join(EV, "summary.json")),
    paired: Record<string, Record<string, any>> = {};
  for (const r of rows) (paired[r.prompt_id] ??= {})[r.method] = r;
  const meta: Record<string, any> = Object.fromEntries(
    Object.keys(paired).map((p) => [
      p,
      json(
        join(
          ROOT,
          "data/runs",
          EID,
          p,
          methods[0],
          "replicate-1/input/metadata.json",
        ),
      ),
    ]),
  );
  const evidence: Record<
    string,
    Record<string, ReturnType<typeof publishRunEvidence>>
  > = {};
  for (const p of Object.keys(paired)) {
    evidence[p] = {};
    for (const method of methods)
      evidence[p][method] = publishRunEvidence(EID, p, method, OUT);
  }
  const order = Object.keys(paired).sort(
      (a, b) =>
        ["easy", "medium", "hard"].indexOf(meta[a].difficulty) -
          ["easy", "medium", "hard"].indexOf(meta[b].difficulty) ||
        a.localeCompare(b),
    ),
    overallScores = Object.fromEntries(methods.map((method) => [method, {
      value: overallVerifiedScore(order.map((prompt) => verifiedScore(paired[prompt][method].category_scores))),
      design_count: order.length,
      maximum: 100,
      aggregation: "equal-design-mean-v1",
    }])),
    overallHtml = `<section class="overall-scores" aria-label="Overall verified scores">${methods.map((method, index) => {
      const score = overallScores[method];
      return `<div class="overall-score ${method}"><h2>${names[index]}</h2><strong>${score.value === null ? "Unavailable" : score.value.toFixed(1)}<small> / 100</small></strong><span>Overall verified score · ${score.design_count} designs</span></div>`;
    }).join("")}</section>`,
    parts = [HEADER.replace("<!-- overall-scores -->", overallHtml)];
  for (const p of order) {
    const m = meta[p];
    parts.push(
      `<tr><th scope="row"><span class="difficulty ${m.difficulty}">${m.difficulty}</span><a href="#${p}">${esc(m.title)}</a></th>`,
    );
    for (const method of methods) {
      const r = paired[p][method];
      parts.push(
        `<td>${scoreHtml(r)}</td>`,
      );
    }
    parts.push("</tr>");
  }
  parts.push(
    ' </tbody></table></div></details></section><section id="designs" aria-label="Designs">',
  );
  const publicResults: any[] = [],
    downloadManifest: any[] = [],
    schematicManifest: { prompt_id: string; method: string; source: string; download: string; sha256: string }[] = [];
  for (const p of order) {
    const m = meta[p];
    parts.push(
      `<article id="${p}" class="design"><div class="design-heading"><div><h3>${esc(m.title)}</h3></div></div><div class="pair">`,
    );
    const outcomes: Record<string, any[]> = {};
    const runDownloads: Record<string, string> = {};
    for (const [mi, method] of methods.entries()) {
      const name = names[mi],
        r = paired[p][method],
        preview = walk(join(ROOT, "reports", EID, "previews")).find((f) =>
          basename(f).startsWith(p + "--" + method + "."),
        );
      if (preview) {
        mkdirSync(join(OUT, "previews"), { recursive: true });
        copyFileSync(preview, join(OUT, "previews", basename(preview)));
      }
      const viewerName = p + "--" + method + ".html",
        viewerVersion = sha(readFileSync(join(OUT, "views", viewerName))).slice(
          0,
          12,
        ),
        viewer = `views/${viewerName}?v=${viewerVersion}`,
        viewId = p + "--" + method;
      const retainedCandidate = finalCandidate(join(ROOT, "data/runs", EID, p, method, "replicate-1"));
      if (!retainedCandidate) throw Error("Missing final candidate: " + viewId);
      const schematics = walk(retainedCandidate).filter((f) =>
        f.endsWith(".svg") && (basename(f) === "schematic.svg" || f.includes("/schematic-svg/")),
      );
      if (schematics.length !== 1) throw Error("Expected one retained schematic: " + viewId);
      const schematicSource = schematics[0],
        schematicPath = "schematics/" + viewId + ".svg",
        schematicBytes = readFileSync(schematicSource);
      write(join(OUT, schematicPath), schematicBytes);
      schematicManifest.push({ prompt_id: p, method, source: relative(ROOT, schematicSource), download: schematicPath, sha256: sha(schematicBytes) });
      const previewHtml = `<div class="view-switch"><input type="radio" name="${viewId}" id="${viewId}-sch" checked><label for="${viewId}-sch">Schematic</label><input type="radio" name="${viewId}" id="${viewId}-pcb"><label for="${viewId}-pcb">PCB</label><div class="schematic-panel"><a href="${schematicPath}" target="_blank" rel="noopener" title="Open full schematic"><img loading="lazy" src="${schematicPath}" alt="${esc(m.title)} · ${name} schematic"></a><a class="open-viewer" href="${schematicPath}" target="_blank" rel="noopener">Open schematic ↗</a></div><div class="pcb-panel"><iframe allow="fullscreen" allowfullscreen class="pcb-viewer" width="100%" height="640" loading="lazy" title="${esc(m.title)} ${name} PCB layer viewer" src="${viewer}"></iframe><a class="open-viewer" href="${viewer}" target="_blank" rel="noopener">Open PCB viewer ↗</a></div></div>`;
      let downloads = "";
      if (method === "kicad-codegen") {
        const run = join(ROOT, "data/runs", EID, p, method, "replicate-1"),
          final = json(join(run, "result.json")).final_attempt,
          candidate = finalCandidate(run)!;
        const dest = join(OUT, "downloads", p),
          native = walk(candidate).filter((f) =>
            /\.kicad_(sch|pcb|pro)$/.test(f),
          ),
          extensions = new Set(native.map((f) => f.split(".").at(-1)));
        if (
          !["kicad_sch", "kicad_pcb", "kicad_pro"].every((x) =>
            extensions.has(x),
          )
        )
          throw Error("Missing native KiCad file");
        const links: string[] = [],
          zipFiles: Record<string, Uint8Array> = {};
        for (const f of native) {
          const rel = relative(candidate, f),
            target = join(dest, rel),
            raw = readFileSync(f);
          write(target, raw);
          zipFiles[rel] = raw;
          const label = f.endsWith(".kicad_sch")
            ? "Schematic"
            : f.endsWith(".kicad_pcb")
              ? "PCB layout"
              : "Project";
          links.push(`<a download href="downloads/${p}/${rel}">${label} ↓</a>`);
          downloadManifest.push({
            prompt_id: p,
            final_attempt: final,
            source: relative(ROOT, f),
            download: relative(OUT, target),
            sha256: sha(raw),
          });
        }
        const zipname = p + "-kicad.zip";
        write(
          join(dest, zipname),
          zipSync(zipFiles, { mtime: new Date("2000-01-01T00:00:00Z") }),
        );
        downloads = `<div class="downloads"><a class="download-all" download href="downloads/${p}/${zipname}">↓ KiCad ZIP</a><div>${links.join(" · ")}</div><small>Original files · KiCad 10</small></div>`;
      }
      parts.push(
        `<div class="method ${method}"><div class="method-heading"><h4>${name}</h4>${scoreHtml(r)}</div>${previewHtml}</div>`,
      );
      runDownloads[method] = downloads;
      outcomes[method] = json(join(EV, p, method, "evaluation.json")).outcomes;
    }
    const detailRows: { label: string; cells: string[] }[] = [
      { label: "Verified score", cells: methods.map((method) => scoreHtml(paired[p][method])) },
      { label: "Total run time", cells: methods.map((method) => {
        const timing = evidence[p][method].timing;
        const seconds = timing.recorded_total_seconds ?? timing.derived_total_seconds;
        return seconds === null ? "Unavailable" : `${seconds.toFixed(3)} s <small class="muted">${timing.recorded_total_seconds === null ? "Derived" : "Recorded"}</small>`;
      }) },
      { label: "Generation-only time", cells: methods.map((method) => {
        const seconds = evidence[p][method].timing.generation_only_seconds;
        return seconds === null ? "Not measured" : seconds.toFixed(3) + " s";
      }) },
      { label: "Transcript", cells: methods.map((method) => {
        const transcript = evidence[p][method].transcript;
        return `<a href="${transcript.href}">View transcript ↗</a><small class="muted">${esc(transcript.status)}</small>`;
      }) },
      { label: "KiCad files", cells: methods.map((method) => method === "kicad-codegen" ? runDownloads[method] : "Not applicable") },
    ];
    parts.push(
      `</div><details class="shared-evidence"><summary>Run details &amp; downloads</summary><div class="table-wrap run-table"><table><thead><tr><th scope="col">Metric</th><th scope="col" class="kicad-text">KiCad</th><th scope="col" class="tscircuit-text">tscircuit</th></tr></thead><tbody>${detailRows.map((row) => `<tr><th scope="row">${row.label}</th>${row.cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`,
    );
    const prompt = read(
      join(
        ROOT,
        "data/runs",
        EID,
        p,
        methods[0],
        "replicate-1/input/prompt.md",
      ),
    );
    parts.push(
      `<details><summary>Design prompt</summary><pre>${esc(prompt)}</pre></details></article>`,
    );
    publicResults.push({
      prompt_id: p,
      metadata: { title: m.title, difficulty: m.difficulty, labels: m.labels },
      methods: Object.fromEntries(
        methods.map((method) => [
          method,
          {
            summary: paired[p][method],
            verified_score: { version: "verified-score-v1", value: verifiedScore(paired[p][method].category_scores), maximum: 100 },
            timing: evidence[p][method].timing,
            transcript: evidence[p][method].transcript,
            rules: outcomes[method].map((o) => ({
              test_id: o.test_id,
              outcome: o.outcome,
              critical: o.critical,
            })),
          },
        ]),
      ),
    });
  }
  parts.push(FOOTER);
  write(join(OUT, "schematic-manifest.json"), JSON.stringify(schematicManifest, null, 2) + "\n");
  write(
    join(OUT, "download-manifest.json"),
    JSON.stringify(downloadManifest, null, 2) + "\n",
  );
  const css = read(join(ROOT, "website/style.css")),
    cssVersion = sha(css).slice(0, 12);
  write(
    join(OUT, "index.html"),
    parts
      .join("")
      .replace('href="style.css"', `href="style.css?v=${cssVersion}"`),
  );
  write(
    join(OUT, "results.json"),
    JSON.stringify(
      { experiment_id: EID, evaluation_id: VID, overall_verified_scores: overallScores, prompts: publicResults },
      null,
      2,
    ) + "\n",
  );
  write(join(OUT, "style.css"), css);
  console.log(
    `Built ${order.length} prompt pairs, ${rows.length} designs in ${OUT}`,
  );
}
if (import.meta.main) buildWebsite();
