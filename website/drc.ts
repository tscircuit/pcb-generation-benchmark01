import { extname, join } from "node:path";
import { readFileSync } from "node:fs";
import { json, write, sha, escapeHtml } from "../src/lib/io";

export interface DrcResult {
  passed: boolean | null;
  violations: number | null;
  errors: number | null;
  warnings: number | null;
  report: string | null;
  sha256: string | null;
}

export function publishDrc(run: string, output: string, id: string): DrcResult {
  const result = json(join(run, "result.json"));
  const validation = result.validation;
  if (!validation || typeof validation !== "object") throw Error("Invalid DRC validation: " + run);
  const record = Array.isArray(validation)
    ? validation.find((entry) => entry.check === "drc" || entry.check === "pcb_drc")
    : validation.drc ?? validation.pcb_drc;
  const drc: DrcResult = { passed: null, violations: null, errors: null, warnings: null, report: null, sha256: null };
  if (record === undefined) return drc;
  if (!record || typeof record !== "object") throw Error("Invalid DRC record: " + run);
  if (record.passed !== undefined && typeof record.passed !== "boolean") throw Error("Invalid DRC status: " + run);
  drc.passed = record.passed ?? null;
  for (const field of ["violations", "errors", "warnings"] as const) {
    const value = field === "violations" ? record.violations ?? record.violation_count : record[field];
    if (value !== undefined && value !== null && (!Number.isSafeInteger(value) || value < 0)) throw Error("Invalid DRC count: " + run);
    drc[field] = value ?? null;
  }
  const source = record.report ?? record.log ?? record.log_path;
  if (typeof source !== "string") throw Error("Missing DRC report: " + run);
  const bytes = readFileSync(join(run, source));
  drc.report = "drc/" + id + extname(source);
  drc.sha256 = sha(bytes);
  write(join(output, drc.report), bytes);
  return drc;
}

export function drcHtml(drc: DrcResult): string {
  const status = drc.passed === true ? "Passed" : drc.passed === false ? "Failed" : drc.report ? "Status unrecorded" : "Not recorded";
  const counts = (["violations", "errors", "warnings"] as const)
    .filter((field) => drc[field] !== null)
    .map((field) => `${drc[field]} ${field}`).join(" · ");
  return `<div class="drc-result"><span>DRC</span><strong${drc.passed === false ? ' class="fail"' : ""}>${status}</strong>${counts ? `<small>${counts}</small>` : ""}${drc.report ? `<small><a href="${escapeHtml(drc.report)}">Recorded report ↗</a></small>` : ""}</div>`;
}
