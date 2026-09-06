import { test, expect } from "bun:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { ROOT, json, sha } from "../src/lib/io";
import { runTiming } from "../src/evidence/timing";
import { visibleItem, redactText } from "../src/evidence/transcripts";
const eid = "2026-09-05-codegen-pilot-01";
test("timing distinguishes zero, null, recorded, derived and invalid timestamps", () => {
  const base = {
    started_at: "2026-09-05T17:59:19.185593+00:00",
    ended_at: "2026-09-05T18:03:45.127368+00:00",
    usage: { wall_time_seconds: null },
  };
  expect(runTiming(base).derived_total_seconds).toBe(265.941775);
  expect(runTiming(base).generation_only_seconds).toBeNull();
  expect(
    runTiming({ ...base, usage: { wall_time_seconds: 0 } })
      .recorded_total_seconds,
  ).toBe(0);
  expect(
    runTiming({ ...base, usage: { wall_time_seconds: 4 } })
      .derived_total_seconds,
  ).toBeNull();
  for (const ended_at of [
    null,
    "",
    "bad",
    "2026-02-30T00:00:00Z",
    "2026-09-05T17:00:00Z",
    "2026-09-05T18:03:45",
  ])
    expect(runTiming({ ...base, ended_at }).derived_total_seconds).toBeNull();
  expect(
    runTiming({ ...base, usage: { wall_time_seconds: -1 } })
      .recorded_total_seconds,
  ).toBeNull();
});
test("transcripts exclude hidden reasoning and credentials but preserve readable failures", () => {
  expect(
    visibleItem({
      type: "response_item",
      payload: { type: "reasoning", summary: "private" },
    }),
  ).toBeNull();
  expect(
    visibleItem({
      type: "response_item",
      payload: {
        type: "message",
        role: "assistant",
        channel: "analysis",
        content: "private",
      },
    }),
  ).toBeNull();
  const item = visibleItem({
    type: "response_item",
    payload: {
      type: "message",
      role: "assistant",
      content: [
        { type: "output_text", text: "Repair failed" },
        { type: "encrypted_content", encrypted_content: "private" },
      ],
    },
  });
  expect(JSON.stringify(item)).toContain("Repair failed");
  expect(JSON.stringify(item)).not.toContain("private");
  for (const text of [
    "api_key=abc123",
    "Bearer abc123",
    "https://user:abc123@example.com",
    "password: abc123",
  ])
    expect(redactText(text)).not.toContain("abc123");
});
test("all transcript mappings and downloadable hashes agree with preserved records", () => {
  const base = join(ROOT, "data/supplementary", eid, "transcripts");
  const index = json(join(base, "index.json"));
  expect(index.entries).toHaveLength(20);
  expect(new Set(index.entries.map((e: any) => e.run_id)).size).toBe(20);
  for (const entry of index.entries) {
    const bytes = readFileSync(join(base, entry.file)),
      evidence = JSON.parse(bytes.toString());
    expect(sha(bytes)).toBe(entry.sha256);
    expect(evidence.run_id).toBe(entry.run_id);
    expect(evidence.status).toBe("incomplete");
    expect(
      evidence.provenance.mapping.corroborating_source_lines.length,
    ).toBeGreaterThan(0);
    for (const ref of [
      evidence.provenance.mapping.run,
      evidence.provenance.mapping.config,
    ])
      expect(sha(readFileSync(join(ROOT, ref.path)))).toBe(ref.sha256);
    expect(evidence.events.length).toBe(entry.event_count);
    const sourceLines = evidence.events.map((e: any) => e.source_line);
    expect(sourceLines).toEqual(
      [...sourceLines].sort((a: number, b: number) => a - b),
    );
    for (const e of evidence.events) {
      expect(e.timestamp).toBeTruthy();
      expect(e.item.type).not.toBe("reasoning");
    }
    expect(bytes.toString()).not.toMatch(/gAAAA[A-Za-z0-9_=-]+/);
  }
  const out = join(ROOT, "website/dist");
  const results = json(join(out, "results.json"));
  for (const p of results.prompts)
    for (const [method, r] of Object.entries(p.methods) as [string, any][]) {
      const run = json(
        join(
          ROOT,
          "data/runs",
          eid,
          p.prompt_id,
          method,
          "replicate-1/run.json",
        ),
      );
      expect(r.timing).toEqual(runTiming(run));
      expect(r.transcript.status).toBe("incomplete");
      const transcript = readFileSync(
        join(out, r.transcript.href.replace(/html$/, "json")),
      );
      expect(sha(transcript)).toBe(r.transcript.sha256);
      expect(JSON.parse(transcript.toString()).run_id).toBe(run.run_id);
    }
});
