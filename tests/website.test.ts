import { test, expect } from "bun:test";
import { unzipSync } from "fflate";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, json, read, sha } from "../src/lib/io";
const out = join(ROOT, "website/dist");
test("website download data and default layer controls match preserved artifacts", () => {
  const records = json(join(out, "download-manifest.json"));
  expect(records).toHaveLength(30);
  for (const r of records) {
    expect(sha(readFileSync(join(out, r.download)))).toBe(r.sha256);
    expect(readFileSync(join(out, r.download))).toEqual(
      readFileSync(join(ROOT, r.source)),
    );
  }
  const views = json(join(out, "views/manifest.json"));
  expect(views).toHaveLength(20);
  for (const v of views) {
    const html = read(join(out, "views", v.viewer));
    if (v.method === "kicad-codegen") {
      expect(html.match(/id="layer-\d+" opacity="0.5"/g)?.length).toBe(
        v.layers.length,
      );
      expect(html.match(/value="50"/g)?.length).toBe(v.layers.length);
      for (const id of [
        "item-opacity",
        "hide-item",
        "restore-items",
        "layer-preset",
        "show-all",
        "hide-all",
        "fullscreen",
      ])
        expect(html).toContain('id="' + id + '"');
    } else {
      expect(v.renderer).toBe("@tscircuit/pcb-viewer");
      expect(html).toContain("tscircuit-viewer.js?v=");
      expect(html).not.toContain("<svg");
      expect(
        readFileSync(join(out, "views/circuits", v.prompt + ".json")),
      ).toEqual(readFileSync(join(ROOT, v.source)));
      expect(v.default_opacity).toBe(0.5);
    }
    expect(sha(readFileSync(join(ROOT, v.source)))).toBe(v.sha256);
  }
  const html = read(join(out, "index.html"));
  expect(html.match(/<iframe/g)?.length).toBe(20);
  expect(html).toContain('height="640"');
  expect(html).toMatch(/style.css\?v=[a-f0-9]+/);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = match[1];
    if (url.startsWith("https:")) continue;
    expect(existsSync(join(out, url.split("?")[0]))).toBe(true);
  }
  for (const p of json(join(out, "results.json")).prompts) {
    const zip = unzipSync(
      readFileSync(
        join(out, "downloads", p.prompt_id, p.prompt_id + "-kicad.zip"),
      ),
    );
    expect(Object.keys(zip)).toHaveLength(3);
    for (const [name, bytes] of Object.entries(zip))
      expect(Buffer.from(bytes)).toEqual(
        readFileSync(join(out, "downloads", p.prompt_id, name)),
      );
  }
});
