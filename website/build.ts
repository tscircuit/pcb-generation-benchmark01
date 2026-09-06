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
import { HEADER, FOOTER } from "./templates";
const EID = "2026-09-05-codegen-pilot-01",
  VID = "deterministic-v1-5a9c0cca93c84a315b17",
  OUT = join(ROOT, "website/dist"),
  EV = join(ROOT, "data/evaluations", EID, VID);
const methods = ["kicad-codegen", "tscircuit-codegen"],
  names = ["KiCad", "tscircuit"];
const counts = (r: any) =>
  ["passed", "failed", "unknown_or_unsupported"].map((k) =>
    r.category_scores.reduce((a: number, c: any) => a + c[k], 0),
  );
const badges = (r: any) => {
  const [p, f, u] = counts(r);
  return `<span class="pass">${p} passed</span><span class="fail">${f} failed</span><span class="unknown">${u} unresolved</span>`;
};
const result = (r: any) =>
  r.overall_pass === false
    ? '<span class="status fail">Clearance failure</span>'
    : '<span class="status unknown">Awaiting evidence</span>';
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
  const order = Object.keys(paired).sort(
      (a, b) =>
        ["easy", "medium", "hard"].indexOf(meta[a].difficulty) -
          ["easy", "medium", "hard"].indexOf(meta[b].difficulty) ||
        a.localeCompare(b),
    ),
    parts = [HEADER];
  for (const p of order) {
    const m = meta[p],
      tags = m.labels
        .filter((x: string) => !["easy", "medium", "hard"].includes(x))
        .join(" · ");
    parts.push(
      `<tr><th scope="row"><span class="difficulty ${m.difficulty}">${m.difficulty}</span><a href="#${p}">${esc(m.title)}</a><small>${esc(tags)}</small></th>`,
    );
    for (const method of methods) {
      const r = paired[p][method];
      parts.push(`<td>${result(r)}<div class="counts">${badges(r)}</div></td>`);
    }
    parts.push("</tr>");
  }
  parts.push(
    '</tbody></table></div></section><section id="designs"><div class="section-heading"><h2>Inspect the generated designs</h2><span>Final preserved candidates</span></div><p class="muted">Native tscircuit PCB views and KiCad layer exports. Layers start at 50% opacity. Open the layer controls to adjust visibility and opacity; click a KiCad drawing item to adjust it individually.</p>',
  );
  const publicResults: any[] = [],
    downloadManifest: any[] = [];
  for (const [index, p] of order.entries()) {
    const m = meta[p];
    parts.push(
      `<article id="${p}" class="design"><div class="design-heading"><div><span class="index">${String(index + 1).padStart(2, "0")}</span><h3>${esc(m.title)}</h3></div><span class="difficulty ${m.difficulty}">${m.difficulty}</span></div><div class="pair">`,
    );
    const outcomes: Record<string, any[]> = {};
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
        previewHtml = `<iframe allow="fullscreen" allowfullscreen class="pcb-viewer" width="100%" height="640" style="display:block;width:100%;height:640px;border:0" loading="lazy" title="${esc(m.title)} ${name} PCB layer viewer" src="${viewer}"></iframe><a class="open-viewer" href="${viewer}" target="_blank" rel="noopener">Open full PCB viewer ↗</a>`;
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
        downloads = `<div class="downloads"><strong>Editable KiCad files</strong><a class="download-all" download href="downloads/${p}/${zipname}">Download KiCad files (.zip) ↓</a><div>${links.join(" · ")}</div><small>Final recorded attempt · original files, including known failures. Open with KiCad 10; standard libraries may be required.</small></div>`;
      }
      parts.push(
        `<div class="method ${method}"><div class="method-heading"><h4>${name}</h4>${result(r)}</div>${previewHtml}<div class="counts">${badges(r)}</div><p class="range">Possible score range <b>${r.possible_total_min}–${r.possible_total_max}</b> / 100<br><small>Unresolved bounds · not an awarded score</small></p>${downloads}</div>`,
      );
      outcomes[method] = json(join(EV, p, method, "evaluation.json")).outcomes;
    }
    parts.push(
      '</div><details><summary>Compare category checks &amp; individual rules</summary><div class="table-wrap"><table><thead><tr><th>Category / weight</th><th>KiCad: pass / fail / unresolved</th><th>tscircuit: pass / fail / unresolved</th></tr></thead><tbody>',
    );
    for (const [i, c] of paired[p][methods[0]].category_scores.entries()) {
      const label = c.category.replaceAll("_", " ");
      parts.push(
        `<tr><th>${esc(label[0].toUpperCase() + label.slice(1))} · ${c.weight}%</th>`,
      );
      for (const method of methods) {
        const a = paired[p][method].category_scores[i];
        parts.push(
          `<td>${a.passed} / ${a.failed} / ${a.unknown_or_unsupported}</td>`,
        );
      }
      parts.push("</tr>");
    }
    parts.push(
      '</tbody></table><table class="rule-table"><thead><tr><th>Rule</th><th>KiCad</th><th>tscircuit</th></tr></thead><tbody>',
    );
    for (const o of outcomes[methods[0]]) {
      parts.push(`<tr><th>${esc(o.test_id.replaceAll("-", " "))}</th>`);
      for (const method of methods) {
        const outcome = outcomes[method].find(
          (x) => x.test_id === o.test_id,
        )?.outcome;
        if (!outcome) throw Error("Unpaired rule");
        const cls = ["pass", "fail"].includes(outcome) ? outcome : "unknown";
        parts.push(`<td><span class="${cls}">${esc(outcome)}</span></td>`);
      }
      parts.push("</tr>");
    }
    parts.push("</tbody></table></div></details>");
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
      `<details><summary>Read the canonical prompt</summary><pre>${esc(prompt)}</pre></details></article>`,
    );
    publicResults.push({
      prompt_id: p,
      metadata: { title: m.title, difficulty: m.difficulty, labels: m.labels },
      methods: Object.fromEntries(
        methods.map((method) => [
          method,
          {
            summary: paired[p][method],
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
      { experiment_id: EID, evaluation_id: VID, prompts: publicResults },
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
