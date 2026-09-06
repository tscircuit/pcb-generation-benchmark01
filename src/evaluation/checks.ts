/** Executable v1 acceptance rules over normalized facts. */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { equal, read } from "../lib/io";
import { EPS, audit, distance, primitive, type Point } from "./geometry";
export const electronic = (facts: any): Record<string, any> =>
  Object.fromEntries(
    Object.entries(facts.components).filter(
      ([, v]: any) => v.kind !== "other" || Object.keys(v.pins ?? {}).length,
    ),
  );
export function matchTopology(
  expected: any[],
  actual: Record<string, any>,
  values = false,
  limit = 20000,
): [any, boolean] {
  if (expected.length !== Object.keys(actual).length) return [null, false];
  let visits = 0,
    exhausted = false,
    missing = false;
  function options(e: any, netmap: Record<string, string>, used: Set<string>) {
    const found: [string, Record<string, string>][] = [];
    for (const [ref, a] of Object.entries(actual).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0,
    )) {
      if (used.has(ref) || a.kind !== e.kind || (e.ref && e.ref !== ref))
        continue;
      if (values && e.value != null) {
        if (a.value == null) {
          missing = true;
          continue;
        }
        if (
          Math.abs(a.value - e.value) >
          Math.max(1e-15, 1e-9 * Math.max(Math.abs(a.value), Math.abs(e.value)))
        )
          continue;
      }
      const pins = a.pins,
        ekeys = Object.keys(e.pins),
        akeys = Object.keys(pins);
      let arrangements: Record<string, string>[];
      if (
        ["resistor", "capacitor", "switch", "jumper"].includes(e.kind) &&
        akeys.length === 2
      ) {
        const ks = akeys.sort();
        arrangements = [ks, [...ks].reverse()].map((v) =>
          Object.fromEntries(ekeys.slice(0, v.length).map((k, i) => [k, v[i]])),
        );
      } else if (equal([...ekeys].sort(), akeys.sort()))
        arrangements = [Object.fromEntries(ekeys.map((k) => [k, k]))];
      else {
        if (!akeys.length || ["diode", "led", "transistor"].includes(e.kind))
          missing = true;
        continue;
      }
      for (const arrangement of arrangements) {
        const extension = { ...netmap },
          inverse = Object.fromEntries(
            Object.entries(extension).map(([k, v]) => [v, k]),
          );
        let okay = true;
        for (const [ep, ap] of Object.entries(arrangement)) {
          const en = e.pins[ep],
            an = pins[ap];
          if (an == null) {
            missing = true;
            okay = false;
            break;
          }
          if (
            (en in extension && extension[en] !== an) ||
            (an in inverse && inverse[an] !== en)
          ) {
            okay = false;
            break;
          }
          extension[en] = an;
          inverse[an] = en;
        }
        if (okay) found.push([ref, extension]);
      }
    }
    return found;
  }
  function visit(
    remaining: any[],
    netmap: Record<string, string>,
    assigned: Record<string, string>,
  ): any {
    if (++visits > limit) {
      exhausted = true;
      return null;
    }
    if (!remaining.length) return { roles: assigned, nets: netmap };
    const ranked = remaining
      .map((e) => ({
        e,
        opts: options(e, netmap, new Set(Object.values(assigned))),
      }))
      .sort(
        (a, b) =>
          a.opts.length - b.opts.length ||
          (a.e.role < b.e.role ? -1 : a.e.role > b.e.role ? 1 : 0),
      );
    const { e, opts } = ranked[0];
    for (const [ref, updated] of opts) {
      const answer = visit(
        remaining.filter((v) => v.role !== e.role),
        updated,
        { ...assigned, [e.role]: ref },
      );
      if (answer) return answer;
      if (exhausted) return null;
    }
    return null;
  }
  const result = visit(expected, {}, {});
  return [result, exhausted || (!result && missing)];
}
const count = (items: string[]) => {
  const r: Record<string, number> = {};
  for (const x of items) r[x] = (r[x] ?? 0) + 1;
  return r;
};
const pairs = <T>(xs: T[]): [T, T][] =>
  xs.flatMap((a, i) => xs.slice(i + 1).map((b) => [a, b] as [T, T]));
const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export class Checker {
  parts: Record<string, any>;
  match: any;
  matchUnknown: boolean;
  geometry: ReturnType<typeof audit> | null;
  constructor(
    public f: any,
    public rules: any,
    public runDir: string,
    public readerUnsupported = false,
  ) {
    this.parts = f ? electronic(f) : {};
    [this.match, this.matchUnknown] = f
      ? matchTopology(rules.expected_components, this.parts)
      : [null, true];
    this.geometry = f ? audit(f.copper, 0.25, f.unsupported) : null;
  }
  check(rule: any): [any, any] {
    const op = rule.op,
      decision = (v: any, o: any): [string, any] => [v ? "pass" : "fail", o],
      unknown = (reason: string): [string, any] => ["unknown", { reason }],
      parts = Object.entries(this.parts),
      f = this.f;
    if (op === "unknown") return unknown(rule.reason);
    if (op === "readme") {
      let valid = false;
      try {
        const p = join(this.runDir, "artifacts/README.md");
        valid = existsSync(p) && statSync(p).isFile() && !!read(p).trim();
      } catch {}
      return decision(valid, { path: "artifacts/README.md" });
    }
    if (op === "artifacts" && this.readerUnsupported)
      return unknown(
        "Artifact reader does not support this representation; not a deliverable failure",
      );
    if (op === "artifacts")
      return decision(f && f.source_present && f.schematic_present && f.board, {
        scope: "structural parsing, not source replay",
      });
    if (!f)
      return unknown("Artifact reader failed or required artifact missing");
    if (op === "component_counts") {
      const wanted = count(
          this.rules.expected_components.map((e: any) => e.kind),
        ),
        actual = count(parts.map(([, c]) => c.kind));
      return decision(equal(wanted, actual), { expected: wanted, actual });
    }
    if (["topology", "values"].includes(op)) {
      const [mapping, uncertain] =
        op === "topology"
          ? [this.match, this.matchUnknown]
          : matchTopology(this.rules.expected_components, this.parts, true);
      if (mapping)
        return [
          "pass",
          { role_mapping: mapping.roles, net_mapping: mapping.nets },
        ];
      if (uncertain)
        return unknown(
          "Missing pin/value semantics or deterministic graph-search limit reached",
        );
      return [
        "fail",
        {
          reason:
            "No required netlist isomorphism" +
            (op === "values" ? " with requested values" : ""),
        },
      ];
    }
    if (op === "net_agreement") {
      if (
        f.warnings.some(
          (w: string) => w.includes("netlist") || w.includes("PCB assignments"),
        )
      )
        return unknown(
          "Schematic netlist export unavailable; do not substitute PCB assignment for schematic evidence",
        );
      if (!parts.some(([, c]) => "pcb_pins" in c))
        return unknown(
          "Compiled tscircuit source and PCB port links share an intermediate representation; independent schematic/source replay was not performed",
        );
      const logical = new Map<any, string[]>(),
        pcb = new Map<any, string[]>();
      for (const [ref, c] of parts) {
        if (
          !equal(
            Object.keys(c.pins).sort(),
            Object.keys(c.pcb_pins ?? {}).sort(),
          )
        )
          return [
            "fail",
            { component: ref, reason: "Schematic and PCB pin sets differ" },
          ];
        for (const [d, pins] of [
          [logical, c.pins],
          [pcb, c.pcb_pins],
        ] as const)
          for (const [pin, net] of Object.entries(pins)) {
            if (!d.has(net)) d.set(net, []);
            d.get(net)!.push(ref + "." + pin);
          }
      }
      const normalize = (d: Map<any, string[]>) =>
        [...d.values()]
          .map((v) => v.sort())
          .sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
      return decision(equal(normalize(logical), normalize(pcb)), {
        logical_partitions: normalize(logical),
        pcb_partitions: normalize(pcb),
      });
    }
    if (["routing", "shorts", "clearance"].includes(op)) {
      const key = (
          {
            routing: "disconnected_nets",
            shorts: "shorts",
            clearance: "clearance_violations",
          } as const
        )[op as "routing"],
        issues = this.geometry![key];
      if (issues.length && (op !== "routing" || !f.unsupported.length))
        return ["fail", { issues }];
      if (f.unsupported.length)
        return unknown(
          "Unsupported copper geometry: " +
            [...new Set(f.unsupported)].sort().join(", "),
        );
      if (f.copper.some((s: any) => s.net === null))
        return unknown("Copper has missing net assignments");
      const expected = parts.flatMap(([ref, c]) =>
          Object.keys(c.pins).map((pin) => ref + "." + pin),
        ),
        actual = new Set(
          f.copper.filter((s: any) => s.pin).map((s: any) => s.pin),
        ),
        missing = expected.filter((p) => !actual.has(p));
      if (missing.length)
        return ["fail", { missing_copper_pads: missing.sort() }];
      return [
        "pass",
        {
          issues: [],
          primitive_count: f.copper.length,
          scope: "supported outer copper envelopes; no source/build replay",
        },
      ];
    }
    const b = f.board,
      bounds = b.bounds;
    if (op === "board_size")
      return decision(
        b.rectangular &&
          Math.abs(b.width - rule.width_mm) <= rule.tolerance_mm + EPS &&
          Math.abs(b.height - rule.height_mm) <= rule.tolerance_mm + EPS,
        { width_mm: b.width, height_mm: b.height },
      );
    if (op === "layers")
      return decision(b.layers === rule.count, { layers: b.layers });
    if (op === "trace_width") {
      const widths = f.tracks.map((t: any) => t.width);
      return decision(
        widths.length && Math.min(...widths) + EPS >= rule.minimum_mm,
        { minimum_mm: widths.length ? Math.min(...widths) : null },
      );
    }
    if (op === "containment") {
      const missing = parts
          .filter(([, c]) => c.bounds === null)
          .map(([r]) => r),
        outside = parts
          .filter(
            ([, c]) =>
              c.bounds &&
              (c.bounds[0] < bounds[0] - EPS ||
                c.bounds[1] < bounds[1] - EPS ||
                c.bounds[2] > bounds[2] + EPS ||
                c.bounds[3] > bounds[3] + EPS),
          )
          .map(([r]) => r);
      if (outside.length) return ["fail", { outside }];
      return missing.length
        ? unknown(
            "Component body/courtyard bounds unavailable: " + missing.join(","),
          )
        : ["pass", { outside: [] }];
    }
    if (op === "header_pitch") {
      const issues: any[] = [];
      for (const [ref, c] of parts) {
        if (c.kind !== "header") continue;
        const pads = [...c.pads].sort(
          (a, b) =>
            (/^\d+$/.test(a.pin) ? Number(a.pin) : 999) -
            (/^\d+$/.test(b.pin) ? Number(b.pin) : 999),
        );
        if (pads.length < 2) return unknown("Insufficient header pad geometry");
        for (const p of pads)
          if (p.hole <= 0)
            issues.push({ header: ref, reason: "Non-through-hole pad" });
        for (let i = 0; i < pads.length - 1; i++) {
          const a = pads[i],
            z = pads[i + 1],
            d = Math.hypot(a.x - z.x, a.y - z.y);
          if (Math.abs(d - rule.pitch_mm) > rule.tolerance_mm + EPS)
            issues.push({ header: ref, pitch_mm: d });
        }
      }
      return decision(!issues.length, { issues });
    }
    if (op === "packages_0805") {
      const unrecognized: string[] = [];
      for (const [ref, c] of parts) {
        if (!["resistor", "capacitor", "led"].includes(c.kind)) continue;
        const pads = c.pads;
        if (pads.length !== 2) {
          unrecognized.push(ref);
          continue;
        }
        const [a, z] = pads,
          d = Math.hypot(a.x - z.x, a.y - z.y);
        if (!(
          d >= 1.6 - EPS &&
          d <= 2.2 + EPS &&
          pads.every(
            (p: any) =>
              Math.min(p.width, p.height) >= 0.8 - EPS &&
              Math.min(p.width, p.height) <= 1.3 + EPS &&
              Math.max(p.width, p.height) >= 1.1 - EPS &&
              Math.max(p.width, p.height) <= 1.7 + EPS &&
              !p.hole,
          )
        ))
          unrecognized.push(ref);
      }
      return unrecognized.length
        ? unknown(
            "Unrecognized 0805 land-pattern geometry: " +
              unrecognized.join(","),
          )
        : [
            "pass",
            {
              recognition:
                "two surface pads, centre spacing 1.6–2.2 mm, short side 0.8–1.3 mm and long side 1.1–1.7 mm",
            },
          ];
    }
    if (op === "testpads") {
      const missing = parts
        .filter(
          ([, c]) =>
            c.kind === "testpoint" &&
            (!c.pads.length ||
              c.pads.some(
                (p: any) => Math.min(p.width, p.height) + EPS < rule.minimum_mm,
              )),
        )
        .map(([r]) => r);
      return decision(!missing.length, {
        undersized: missing,
        exposure_note:
          "mask opening/material exposure is not independently measured",
      });
    }
    const refFor = (role: string) => this.match?.roles[role] ?? role,
      pos = (ref: string): Point | null => {
        const p = this.parts[ref]?.position;
        return p ? [p.x, p.y] : null;
      };
    if (["edge", "position"].includes(op)) {
      const p = pos(rule.ref);
      if (!p) return unknown("Missing component position");
      if (op === "position") {
        const xy = [p[0] - bounds[0], p[1] - bounds[1]];
        return decision(
          Math.abs(xy[0] - rule.x_mm) <= rule.tolerance_mm + EPS &&
            Math.abs(xy[1] - rule.y_mm) <= rule.tolerance_mm + EPS,
          { position_from_lower_left_mm: xy },
        );
      }
      const d = (
        {
          left: p[0] - bounds[0],
          right: bounds[2] - p[0],
          top: bounds[3] - p[1],
          bottom: p[1] - bounds[1],
        } as Record<string, number>
      )[rule.side];
      return decision(d >= -EPS && d <= rule.maximum_mm + EPS, {
        edge_distance_mm: d,
      });
    }
    if (["distance", "role_distance"].includes(op)) {
      const a = pos(op === "role_distance" ? refFor(rule.a) : rule.a),
        z = pos(rule.b);
      if (!a || !z) return unknown("Missing/unmatched component position");
      const d = dist(a, z);
      return decision(d <= rule.maximum_mm + EPS, { distance_mm: d });
    }
    if (["row", "spacing"].includes(op)) {
      const points = rule.refs.map(pos);
      if (points.some((p: any) => !p))
        return unknown("Missing component positions");
      const pts = points as Point[],
        d = Math.min(...pairs(pts).map(([a, z]) => dist(a, z)));
      let valid = d + EPS >= rule.minimum_spacing_mm;
      if (op === "row")
        valid =
          valid &&
          pts.slice(0, -1).every((a, i) => a[0] < pts[i + 1][0]) &&
          Math.max(...pts.map((p) => p[1])) -
            Math.min(...pts.map((p) => p[1])) <=
            EPS;
      return decision(valid, { positions_mm: pts, minimum_spacing_mm: d });
    }
    if (op === "half") {
      if (!this.match) return unknown("Component roles could not be matched");
      const points = rule.roles.map((r: string) => pos(refFor(r)));
      if (points.some((p: any) => !p)) return unknown("Missing positions");
      const mid = (bounds[1] + bounds[3]) / 2;
      return decision(
        points.every((p: Point) =>
          rule.half === "top" ? p[1] >= mid - EPS : p[1] <= mid + EPS,
        ),
        { positions_mm: points },
      );
    }
    if (op === "net_width") {
      if (!this.match) return unknown("Net roles unavailable");
      const selected = new Set(
          rule.nets.map((n: string) => this.match.nets[n]),
        ),
        widths = f.tracks
          .filter((t: any) => selected.has(t.net))
          .map((t: any) => t.width);
      return decision(
        widths.length && Math.min(...widths) + EPS >= rule.minimum_mm,
        { minimum_mm: widths.length ? Math.min(...widths) : null },
      );
    }
    if (op === "jumper_gap") {
      const gaps: number[] = [];
      for (const ref of rule.refs) {
        const pads = f.copper.filter((s: any) => s.pin?.startsWith(ref + "."));
        if (pads.length !== 2)
          return unknown("Jumper geometry is not two supported pads");
        gaps.push(distance(pads[0], pads[1]));
      }
      return decision(
        gaps.every((g) => g + EPS >= rule.minimum_mm),
        { pad_gaps_mm: gaps },
      );
    }
    if (op === "mounting_holes") {
      const off = rule.edge_offset_mm,
        expected: Point[] = [bounds[0] + off, bounds[2] - off].flatMap((x) =>
          [bounds[1] + off, bounds[3] - off].map((y) => [x, y] as Point),
        ),
        matched: any[] = [];
      for (const p of expected) {
        const candidates = f.holes.filter(
          (h: any) =>
            dist(p, [h.x, h.y]) <= EPS &&
            h.diameter !== null &&
            Math.abs(h.diameter - rule.diameter_mm) <= EPS,
        );
        if (candidates.length !== 1)
          return [
            "fail",
            {
              reason: "Missing/misplaced 3.2 mm mounting hole",
              expected_position: p,
            },
          ];
        matched.push(candidates[0]);
      }
      const issues = matched.filter((h) => {
        const hole = primitive(
          [[h.x, h.y]],
          h.diameter / 2,
          ["top", "bottom"],
          null,
        );
        return f.copper.some(
          (s: any) => distance(hole, s) + EPS < rule.clearance_mm,
        );
      });
      if (issues.length)
        return ["fail", { hole_copper_clearance_failures: issues }];
      return unknown(
        "Copper clears holes, but full component-body distance from holes is not measured",
      );
    }
    throw Error("Unknown rule operation: " + op);
  }
}
