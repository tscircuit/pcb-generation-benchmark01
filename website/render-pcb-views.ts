/** Derive visualizations from preserved native/SVG data; no rescoring or design edits. */
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { join, relative, basename } from "node:path";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
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
const EID = "2026-09-05-codegen-pilot-01",
  OUT = join(ROOT, "website/dist/views");
const LAYERS = [
  "B.Cu",
  "F.Cu",
  "B.Adhesive",
  "F.Adhesive",
  "B.Paste",
  "F.Paste",
  "B.Mask",
  "F.Mask",
  "B.Silkscreen",
  "F.Silkscreen",
  "B.Courtyard",
  "F.Courtyard",
  "B.Fab",
  "F.Fab",
  "Edge.Cuts",
];
const NS = "http://www.w3.org/2000/svg";
export async function renderViews() {
  mkdirSync(OUT, { recursive: true });
  const build = await Bun.build({
    entrypoints: [join(ROOT, "website/viewer-client.ts")],
    target: "browser",
    outdir: OUT,
    naming: "viewer.js",
  });
  if (!build.success) throw Error(build.logs.join("\n"));
  const css = read(join(ROOT, "website/viewer.css")),
    version = sha(readFileSync(join(OUT, "viewer.js"))).slice(0, 12),
    manifest: any[] = [];
  for (const item of [
    ...json(join(ROOT, "configs", EID + ".json")).execution_order,
  ].sort((a, b) =>
    (a.prompt_id + a.method).localeCompare(b.prompt_id + b.method),
  )) {
    const { prompt_id: prompt, method } = item;
    if (!["kicad-codegen", "tscircuit-codegen"].includes(method)) continue;
    const run = join(ROOT, "data/runs", EID, prompt, method, "replicate-1"),
      candidate = finalCandidate(run);
    if (!candidate) throw Error("Missing final candidate");
    const parser = new DOMParser(),
      doc = parser.parseFromString(
        `<svg xmlns="${NS}" width="100%" height="100%"/>`,
        "image/svg+xml",
      ),
      svg = doc.documentElement!,
      groups = new Map<string, any>();
    let source: string;
    if (method === "kicad-codegen") {
      source = walk(candidate).find((p) => p.endsWith(".kicad_pcb"))!;
      const output = join(OUT, "layers", prompt);
      mkdirSync(output, { recursive: true });
      const cli = process.env.KICAD_CLI ?? Bun.which("kicad-cli");
      if (!cli)
        throw Error(
          "KiCad CLI required; set KICAD_CLI or put kicad-cli on PATH",
        );
      const proc = Bun.spawnSync([
        cli,
        "pcb",
        "export",
        "svg",
        "--output",
        output + "/",
        "--layers",
        LAYERS.join(","),
        "--page-size-mode",
        "2",
        "--exclude-drawing-sheet",
        "--mode-multi",
        source,
      ]);
      if (proc.exitCode !== 0) throw Error(proc.stderr.toString());
      let vb: string | null = null;
      for (const layer of LAYERS) {
        const file = walk(output).find((p) =>
          p.endsWith("-" + layer.replaceAll(".", "_") + ".svg"),
        );
        if (!file) continue;
        const tree = parser.parseFromString(
          read(file),
          "image/svg+xml",
        ).documentElement!;
        if (vb === null) {
          vb = tree.getAttribute("viewBox");
          svg.setAttribute("viewBox", vb!);
        }
        if (tree.getAttribute("viewBox") !== vb)
          throw Error("Layer coordinate frames must match");
        const group = doc.createElementNS(NS, "g");
        for (let c = tree.firstChild; c; c = c.nextSibling)
          if (c.nodeType === 1 && (c as any).localName === "g")
            group.appendChild(doc.importNode(c, true));
        groups.set(layer, group);
      }
    } else {
      source = walk(candidate).find((p) => basename(p) === "pcb.svg")!;
      const tree = parser.parseFromString(
        read(source),
        "image/svg+xml",
      ).documentElement!;
      svg.setAttribute(
        "viewBox",
        tree.getAttribute("viewBox") ||
          `0 0 ${tree.getAttribute("width")} ${tree.getAttribute("height")}`,
      );
      for (let c = tree.firstChild; c; c = c.nextSibling) {
        if (c.nodeType !== 1) continue;
        const el = c as any;
        if (
          el.getAttribute("data-type") === "pcb_background" ||
          ["script", "foreignObject"].includes(el.localName)
        )
          continue;
        const layer = el.getAttribute("data-pcb-layer") || "global";
        if (!groups.has(layer)) groups.set(layer, doc.createElementNS(NS, "g"));
        groups.get(layer).appendChild(doc.importNode(c, true));
      }
    }
    if (!source || !existsSync(source) || !groups.size)
      throw Error("No PCB layers found");
    const controls: string[] = [];
    let i = 0;
    for (const [name, g] of groups) {
      g.setAttribute("id", `layer-${i}`);
      g.setAttribute("opacity", "0.5");
      svg.appendChild(g);
      controls.push(
        `<label><input type="checkbox" checked data-layer="layer-${i}"><span>${esc(name)}</span><input aria-label="${esc(name)} opacity" type="range" min="0" max="100" value="50" data-layer="layer-${i}"><output>50%</output></label>`,
      );
      i++;
    }
    const title = `${prompt} · ${method === "kicad-codegen" ? "KiCad" : "tscircuit"}`,
      document = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · PCB view</title><style>${css}</style><div class="bar"><button id="minus" aria-label="Zoom out">−</button><button id="plus" aria-label="Zoom in">+</button><button id="reset">Reset view</button><span>All layers: 50% opacity by default · drag to pan</span></div><div class="viewport">${new XMLSerializer().serializeToString(svg)}</div><details><summary>Layers &amp; opacity</summary><section>${controls.join("")}</section><button id="layers-reset">Reset all layers to 50%</button><p>Visualization only. Layer opacity does not change the design or its score.</p></details><script type="module" src="viewer.js?v=${version}"></script></html>`;
    const dest = join(OUT, prompt + "--" + method + ".html");
    write(dest, document);
    manifest.push({
      prompt,
      method,
      source: relative(ROOT, source),
      sha256: sha(readFileSync(source)),
      viewer: basename(dest),
      layers: [...groups.keys()],
      default_opacity: 0.5,
      operation:
        method === "kicad-codegen"
          ? "KiCad 10 SVG layer export"
          : "Group preserved SVG geometry by recorded layer",
    });
  }
  write(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Built ${manifest.length} PCB viewers; all layers start at 50% opacity`,
  );
}
if (import.meta.main) await renderViews();
