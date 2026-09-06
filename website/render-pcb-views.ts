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
  const nativeBuild = await Bun.build({
    entrypoints: [join(ROOT, "website/tscircuit-viewer.tsx")],
    target: "browser",
    outdir: OUT,
    naming: "tscircuit-viewer.js",
    minify: true,
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
  });
  if (!nativeBuild.success) throw Error(nativeBuild.logs.join("\n"));
  const nativeVersion = sha(
    readFileSync(join(OUT, "tscircuit-viewer.js")),
  ).slice(0, 12);
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
    if (method === "tscircuit-codegen") {
      const source = walk(candidate).find(
        (p) => basename(p) === "circuit.json",
      );
      if (!source) throw Error("Missing circuit.json for native viewer");
      const raw = readFileSync(source),
        data = JSON.parse(raw.toString());
      if (!Array.isArray(data)) throw Error("Invalid Circuit JSON");
      const dataName = "circuits/" + prompt + ".json",
        digest = sha(raw);
      write(join(OUT, dataName), raw);
      const title = prompt + " · tscircuit",
        dest = join(OUT, prompt + "--" + method + ".html");
      write(
        dest,
        `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · PCB view</title><style>${read(join(ROOT, "website/tscircuit-viewer.css"))}</style></head><body data-circuit="${dataName}?v=${digest.slice(0, 12)}"><div id="app"></div><script type="module" src="tscircuit-viewer.js?v=${nativeVersion}"></script></body></html>`,
      );
      manifest.push({
        prompt,
        method,
        source: relative(ROOT, source),
        sha256: digest,
        viewer: basename(dest),
        renderer: "@tscircuit/pcb-viewer",
        renderer_version: json(
          join(ROOT, "node_modules/@tscircuit/pcb-viewer/package.json"),
        ).version,
        default_opacity: 0.5,
        operation:
          "Render preserved Circuit JSON with the native tscircuit PCBViewer",
      });
      continue;
    }
    const parser = new DOMParser(),
      doc = parser.parseFromString(
        `<svg xmlns="${NS}" width="100%" height="100%"/>`,
        "image/svg+xml",
      ),
      svg = doc.documentElement!,
      groups = new Map<string, any>();
    let source = "";
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
    }
    if (!source || !existsSync(source) || !groups.size)
      throw Error("No PCB layers found");
    const controls: string[] = [];
    let i = 0;
    for (const [name, g] of groups) {
      g.setAttribute("id", `layer-${i}`);
      g.setAttribute("opacity", "0.5");
      g.setAttribute("data-layer-name", name);
      svg.appendChild(g);
      controls.push(
        `<div class="layer-control" data-layer-name="${esc(name)}"><label><input type="checkbox" checked data-layer="layer-${i}"><span>${esc(name)}</span></label><div class="slider-row"><input aria-label="${esc(name)} opacity" type="range" min="0" max="100" value="50" data-layer="layer-${i}"><output>50%</output><button data-solo>Solo</button></div></div>`,
      );
      i++;
    }
    const title = `${prompt} · ${method === "kicad-codegen" ? "KiCad" : "tscircuit"}`,
      document = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · PCB view</title><style>${css}</style><div class="bar"><button id="minus" aria-label="Zoom out">−</button><span id="zoom-level">100%</span><button id="plus" aria-label="Zoom in">+</button><button id="reset">Fit board</button><button id="fullscreen">Fullscreen</button></div><div class="viewport">${new XMLSerializer().serializeToString(svg)}</div><details id="inspector" class="inspector"><summary>Layers &amp; items</summary><div class="panel"><div class="item-controls"><h2>Selected drawing item</h2><p id="selected-item-name">Click a drawing item on the PCB</p><label>Item opacity<input id="item-opacity" type="range" min="0" max="100" value="100" disabled><output id="item-value">100%</output></label><p>Item opacity multiplies its layer opacity.</p><div class="actions"><button id="hide-item" disabled>Hide item</button><button id="restore-items">Restore items</button></div></div><h2>Layer visibility</h2><label for="layer-preset">Preset</label><select id="layer-preset"><option value="all">All layers</option><option value="copper">Copper + outline</option><option value="front">Front + outline</option><option value="back">Back + outline</option></select><div class="actions"><button id="show-all">Show all</button><button id="hide-all">Hide all</button><button id="layers-reset">Reset 50%</button></div><section class="layer-list">${controls.join("")}</section></div></details><script type="module" src="viewer.js?v=${version}"></script></html>`;
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
