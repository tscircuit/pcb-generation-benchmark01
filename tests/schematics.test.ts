import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, json, read, sha, finalCandidate } from "../src/lib/io";

test("schematic switches expose all final preserved schematics without modifying evidence", () => {
  const out = join(ROOT, "website/dist");
  const manifest = json(join(out, "schematic-manifest.json"));
  const html = read(join(out, "index.html"));
  expect(manifest).toHaveLength(20);
  expect(new Set(manifest.map((item: { download: string }) => item.download)).size).toBe(20);
  for (const item of manifest) {
    const candidate = finalCandidate(join(ROOT, "data/runs/2026-09-05-codegen-pilot-01", item.prompt_id, item.method, "replicate-1"));
    expect(join(ROOT, item.source).startsWith(candidate + "/")).toBe(true);
    const original = readFileSync(join(ROOT, item.source));
    expect(readFileSync(join(out, item.download))).toEqual(original);
    expect(sha(original)).toBe(item.sha256);
    expect(html).toContain(`src="${item.download}"`);
    expect(html).toContain(`href="${item.download}"`);
    const id = `${item.prompt_id}--${item.method}`;
    expect(html).toContain(`id="${id}-sch" checked`);
    expect(html).toContain(`for="${id}-pcb"`);
  }
});
