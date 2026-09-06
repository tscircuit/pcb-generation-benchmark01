import { createHash } from "node:crypto";
import {
  readFileSync,
  readdirSync,
  lstatSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  realpathSync,
} from "node:fs";
import { resolve, relative, dirname, join, isAbsolute } from "node:path";
export const ROOT = resolve(import.meta.dir, "../..");
export const read = (p: string) => readFileSync(p, "utf8");
export const json = (p: string): any => JSON.parse(read(p));
export const sha = (s: string | Uint8Array) =>
  createHash("sha256").update(s).digest("hex");
export function sorted(value: any): any {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sorted(value[k])]),
    );
  if (typeof value === "number" && !Number.isFinite(value))
    throw Error("Non-finite JSON number");
  return value;
}
export const dump = (v: any) => JSON.stringify(sorted(v), null, 2) + "\n";
export const equal = (a: any, b: any) =>
  JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
export function write(p: string, v: string | Uint8Array) {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, v);
}
export function walk(dir: string, recursive = true): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (["node_modules", ".git", ".venv", "__pycache__"].includes(name))
      continue;
    const p = join(dir, name),
      s = lstatSync(p);
    if (s.isSymbolicLink()) continue;
    if (s.isDirectory() && recursive) out.push(...walk(p));
    else if (s.isFile()) out.push(p);
  }
  return out.sort();
}
export function safe(base: string, p: string) {
  const r = resolve(base, p),
    real = existsSync(r) ? realpathSync(r) : r,
    rel = relative(realpathSync(base), real);
  if (rel === ".." || rel.startsWith("../") || isAbsolute(rel))
    throw Error("Path escapes run directory: " + p);
  return r;
}
export function finalCandidate(run: string): string | null {
  const r = existsSync(join(run, "result.json"))
    ? json(join(run, "result.json"))
    : {};
  let f = r.final_attempt;
  if (typeof f === "number" && Number.isInteger(f))
    f = `artifacts/attempt-${String(f).padStart(2, "0")}`;
  if (typeof f !== "string") return null;
  let p = safe(run, f);
  if (!existsSync(p)) p = safe(run, "artifacts/" + f);
  return existsSync(p) && lstatSync(p).isDirectory() ? p : null;
}
export function validId(s: string) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(s)) throw Error("Invalid ID: " + s);
  return s;
}
export const escapeHtml = (s: unknown) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
