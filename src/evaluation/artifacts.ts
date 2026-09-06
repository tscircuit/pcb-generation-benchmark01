/** Read designs as data. Never execute generated design scripts. */
import { DOMParser } from "@xmldom/xmldom";
import { statSync } from "node:fs";
import { basename } from "node:path";
import { json, read, walk, equal } from "../lib/io";
import { Union, primitive, roundedRect, type Point } from "./geometry";
export class UnsupportedArtifact extends Error {}
export type SExpr = any[];
export function sexpr(text: string): SExpr {
  const tokens = text.match(/"(?:\\.|[^"\\])*"|[()]|[^\s()]+/g) ?? [],
    stack: SExpr[] = [];
  let root: SExpr | null = null;
  for (const token of tokens) {
    if (token === "(") {
      const item: SExpr = [];
      if (stack.length) stack.at(-1)!.push(item);
      else if (root) throw Error("Multiple S-expression roots");
      stack.push(item);
    } else if (token === ")") {
      if (!stack.length) throw Error("Unbalanced S-expression");
      const item = stack.pop()!;
      if (!stack.length) root = item;
    } else {
      if (!stack.length) throw Error("Atom outside S-expression");
      stack.at(-1)!.push(token.startsWith('"') ? JSON.parse(token) : token);
    }
  }
  if (stack.length || root === null) throw Error("Incomplete S-expression");
  return root;
}
export const children = (node: SExpr, key: string): SExpr[] =>
  node.filter((x) => Array.isArray(x) && x[0] === key);
export const child = (node: SExpr, key: string, fallback: any = null): any =>
  children(node, key)[0] ?? fallback;
export const atom = (node: SExpr, key: string, fallback: any = null): any =>
  child(node, key)?.[1] ?? fallback;
export function number(value: any): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value)
    .replaceAll("Ω", "")
    .replaceAll("ohm", "")
    .replace(/[µμ]/g, "u")
    .trim();
  const scales: Record<string, number> = {
    "": 1,
    R: 1,
    p: 1e-12,
    n: 1e-9,
    u: 1e-6,
    m: 1e-3,
    k: 1e3,
    K: 1e3,
    M: 1e6,
    G: 1e9,
  };
  let m = text.match(/^([0-9]+(?:\.[0-9]+)?)\s*([pnumkKMGR]?)(?:F|V)?$/);
  if (m) return Number(m[1]) * scales[m[2]];
  m = text.match(/^([0-9]+)([RkKMmunp])([0-9]+)$/);
  return m ? Number(m[1] + "." + m[3]) * scales[m[2]] : null;
}
export function kind(ref: string, ftype = "") {
  for (const [prefix, name] of [
    ["TP", "testpoint"],
    ["JP", "jumper"],
    ["SW", "switch"],
    ["R", "resistor"],
    ["C", "capacitor"],
    ["J", "header"],
    ["Q", "transistor"],
    ["D", "diode"],
  ])
    if (ref.startsWith(prefix))
      return ftype.toLowerCase().includes("led") ? "led" : name;
  return "other";
}
function semantic(pin: any, hints: any[]) {
  hints = hints.map((x) => String(x).toLowerCase());
  for (const [key, ...aliases] of [
    ["A", "a", "anode"],
    ["K", "k", "cathode"],
    ["B", "b", "base"],
    ["C", "c", "collector"],
    ["E", "e", "emitter"],
    ["G", "g", "gate"],
    ["S", "s", "source"],
    ["D", "d", "drain"],
  ])
    if (hints.some((h) => aliases.includes(h))) return key;
  return String(pin);
}
const polarized = (k: string) => ["diode", "led", "transistor"].includes(k);
function blank(): any {
  return {
    components: {},
    copper: [],
    unsupported: [],
    silkscreen: [],
    holes: [],
    tracks: [],
    files: [],
    board: null,
    schematic_present: false,
    source_present: false,
    warnings: [],
  };
}
export function loadTscircuit(final: string) {
  const f = blank(),
    files = walk(final).filter((p) => basename(p) === "circuit.json");
  if (files.length > 1)
    throw new UnsupportedArtifact("Ambiguous multiple circuit.json files");
  if (!files.length) throw Error("Missing circuit.json");
  f.files = [files[0]];
  const data = json(files[0]);
  if (
    !Array.isArray(data) ||
    data.some(
      (o) =>
        !o ||
        typeof o !== "object" ||
        Array.isArray(o) ||
        typeof o.type !== "string",
    )
  )
    throw Error("circuit.json must be an array of typed objects");
  const get = (t: string): any[] => data.filter((o) => o.type === t),
    boards = get("pcb_board");
  if (boards.length !== 1) throw Error("Expected one PCB board");
  const b = boards[0],
    cx = b.center.x,
    cy = b.center.y,
    w = b.width,
    h = b.height;
  f.board = {
    width: w,
    height: h,
    layers: b.num_layers,
    bounds: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
    rectangular: !b.outline?.length,
  };
  if (b.outline?.length) f.unsupported.push("custom board outline");
  const sourceIds = get("source_component").map((o) => o.source_component_id),
    schIds = get("schematic_component").map((o) => o.source_component_id);
  f.schematic_present =
    !!sourceIds.length && sourceIds.every((s) => schIds.includes(s));
  f.source_present = walk(final, false).some(
    (p) => p.endsWith(".tsx") && statSync(p).size > 0,
  );
  const sources: Record<string, any> = Object.fromEntries(
      get("source_component").map((o) => [o.source_component_id, o]),
    ),
    ports: Record<string, any> = Object.fromEntries(
      get("source_port").map((o) => [o.source_port_id, o]),
    ),
    uf = new Union();
  for (const sid of Object.keys(ports)) uf.find(sid);
  for (const t of get("source_trace")) {
    const ids = [
      ...(t.connected_source_port_ids ?? []),
      ...(t.connected_source_net_ids ?? []),
    ];
    for (const sid of ids.slice(1)) uf.join(ids[0], sid);
  }
  for (const s of Object.values(sources))
    for (const group of s.internally_connected_source_port_ids ?? [])
      for (const sid of group.slice(1)) uf.join(group[0], sid);
  const pcbs: Record<string, any> = Object.fromEntries(
      get("pcb_component").map((o) => [o.source_component_id, o]),
    ),
    physical: Record<string, any> = Object.fromEntries(
      get("pcb_port").map((o) => [o.pcb_port_id, o]),
    ),
    logical: Record<string, any> = {};
  for (const [sid, s] of Object.entries(sources)) {
    const ref = s.name,
      p = pcbs[sid] ?? {},
      comp: any = {
        kind: kind(ref, s.ftype ?? ""),
        value: s.resistance ?? s.capacitance ?? null,
        pins: {},
        position: p.center ?? null,
        bounds: null,
        footprint: null,
        pads: [],
        part: s.manufacturer_part_number ?? null,
        color: s.color ?? null,
      };
    if (p.center && p.width != null)
      comp.bounds = [
        p.center.x - p.width / 2,
        p.center.y - p.height / 2,
        p.center.x + p.width / 2,
        p.center.y + p.height / 2,
      ];
    const groups = s.internally_connected_source_port_ids ?? [];
    for (const [pid, port] of Object.entries(ports)) {
      if (port.source_component_id !== sid) continue;
      let key = polarized(comp.kind)
        ? semantic(port.pin_number ?? port.name, port.port_hints ?? [])
        : String(port.pin_number ?? port.name);
      const index = groups.findIndex((g: string[]) => g.includes(pid));
      if (index >= 0) key = String(index + 1);
      comp.pins[key] = uf.find(pid);
      logical[pid] = [ref, key, uf.find(pid)];
    }
    f.components[ref] = comp;
  }
  for (const o of [...get("pcb_smtpad"), ...get("pcb_plated_hole")]) {
    const port = physical[o.pcb_port_id],
      info = port ? logical[port.source_port_id] : null;
    if (!info) {
      f.unsupported.push("pad missing logical port");
      continue;
    }
    const [ref, key, net] = info,
      shape = o.shape,
      x = o.x,
      y = o.y,
      layers = o.layers ?? [o.layer ?? "top"],
      angle = o.ccw_rotation ?? o.rect_ccw_rotation ?? 0;
    let geom = null;
    if (shape === "circle") {
      const diameter = (o.radius ?? 0) * 2 || o.diameter || o.outer_diameter;
      geom = diameter
        ? primitive([[x, y]], diameter / 2, layers, net, ref + "." + key)
        : null;
    } else if (
      [
        "rect",
        "rotated_rect",
        "roundrect",
        "circular_hole_with_rect_pad",
        "pill",
      ].includes(shape)
    ) {
      const w = o.width ?? o.rect_pad_width,
        h = o.height ?? o.rect_pad_height,
        radius =
          shape === "pill"
            ? Math.min(w, h) / 2
            : (o.radius ?? o.rect_border_radius ?? 0);
      geom = roundedRect(
        x,
        y,
        w,
        h,
        angle,
        radius,
        layers,
        net,
        ref + "." + key,
      );
    }
    if (geom) f.copper.push(geom);
    else f.unsupported.push("unsupported pad shape " + shape);
    f.components[ref].pads.push({
      pin: key,
      x,
      y,
      shape,
      width:
        o.width ?? o.rect_pad_width ?? o.outer_diameter ?? (o.radius ?? 0) * 2,
      height:
        o.height ??
        o.rect_pad_height ??
        o.outer_diameter ??
        (o.radius ?? 0) * 2,
      hole: o.hole_diameter ?? 0,
    });
  }
  for (const trace of get("pcb_trace")) {
    const source = get("source_trace").find(
        (s) => s.source_trace_id === trace.source_trace_id,
      ),
      ids = source?.connected_source_port_ids ?? [],
      cp = trace.connectsTo ?? [];
    const net = ids.length
      ? uf.find(ids[0])
      : cp.length && physical[cp[0]]
        ? logical[physical[cp[0]].source_port_id][2]
        : null;
    if (net === null) f.unsupported.push("trace missing logical net");
    const route = trace.route ?? [];
    for (let i = 0; i < route.length - 1; i++) {
      const left = route[i],
        right = route[i + 1];
      if (
        left.route_type === "wire" &&
        right.route_type === "wire" &&
        left.layer === right.layer
      ) {
        const width = left.width;
        f.copper.push(
          primitive(
            [
              [left.x, left.y],
              [right.x, right.y],
            ],
            width / 2,
            [left.layer],
            net,
          ),
        );
        f.tracks.push({ width, net });
      }
    }
    for (const v of route) {
      if (v.route_type === "via")
        f.copper.push(
          primitive(
            [[v.x, v.y]],
            v.via_diameter / 2,
            [v.from_layer, v.to_layer],
            net,
          ),
        );
      else if (v.route_type !== "wire")
        f.unsupported.push("unsupported route element");
    }
  }
  f.silkscreen = get("pcb_silkscreen_text").map((o) => o.text ?? "");
  f.holes = get("pcb_hole").map((o) => ({
    x: o.x,
    y: o.y,
    diameter: o.hole_diameter ?? o.diameter ?? null,
  }));
  for (const o of data)
    if (["pcb_copper_pour", "pcb_copper_text", "pcb_panel"].includes(o.type))
      f.unsupported.push(o.type);
  return f;
}
function xmlNetlist(raw: string) {
  const doc = new DOMParser({
    onError: (level, msg) => {
      if (level !== "warning")
        throw Error("Malformed XML netlist export: " + msg);
    },
  }).parseFromString(raw, "text/xml");
  function convert(e: any): SExpr {
    const attrs = Array.from(e.attributes ?? []) as any[],
      out: SExpr = [e.tagName, ...attrs.map((a) => [a.name, a.value])];
    let text = "";
    for (let c = e.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1) out.push(convert(c));
      else if (c.nodeType === 3) text += c.nodeValue;
    }
    if (text.trim()) out.splice(1 + attrs.length, 0, text.trim());
    return out;
  }
  return convert(doc.documentElement);
}
const layerName = (l: string) =>
  l === "F.Cu" ? "top" : l === "B.Cu" ? "bottom" : l;
export function loadKicad(final: string) {
  const f = blank(),
    files = walk(final, false),
    boards = files.filter((p) => p.endsWith(".kicad_pcb")),
    schematics = files.filter((p) => p.endsWith(".kicad_sch"));
  let netlists = files.filter((p) => p.endsWith(".net"));
  if (!netlists.length) netlists = files.filter((p) => p.endsWith(".net.xml"));
  if (boards.length > 1)
    throw new UnsupportedArtifact("Ambiguous multiple native boards");
  if (!boards.length) throw Error("Missing native board");
  const tree = sexpr(read(boards[0]));
  if (tree[0] !== "kicad_pcb") throw Error("Invalid PCB root");
  f.files = [...boards, ...schematics, ...netlists];
  f.source_present = true;
  const sch = schematics.length === 1 ? sexpr(read(schematics[0])) : null;
  f.schematic_present =
    !!sch && sch[0] === "kicad_sch" && children(sch, "symbol").length > 0;
  const copperLayers = child(tree, "layers", [])
    .slice(1)
    .filter((x: any) => Array.isArray(x) && x.length > 1)
    .map((x: any) => x[1])
    .filter((s: string) => s.endsWith(".Cu"));
  const edges = children(tree, "gr_line").filter(
      (g) => atom(g, "layer") === "Edge.Cuts",
    ),
    rects = children(tree, "gr_rect").filter(
      (g) => atom(g, "layer") === "Edge.Cuts",
    ),
    curves = ["gr_poly", "gr_arc", "gr_circle"]
      .flatMap((k) => children(tree, k))
      .filter((g) => atom(g, "layer") === "Edge.Cuts");
  const edgepts: Point[] = [...edges, ...rects].flatMap((g) =>
    ["start", "end"].map((e) => child(g, e).slice(1, 3).map(Number)),
  );
  if (!edgepts.length) {
    if (curves.length)
      throw new UnsupportedArtifact(
        "Board outline representation is unsupported",
      );
    throw Error("Missing board outline");
  }
  const minx = Math.min(...edgepts.map((p) => p[0])),
    maxx = Math.max(...edgepts.map((p) => p[0])),
    miny = Math.min(...edgepts.map((p) => p[1])),
    maxy = Math.max(...edgepts.map((p) => p[1]));
  const edgeKey = (a: any, b: any) => JSON.stringify([a, b].sort()),
    corners = [
      [minx, miny],
      [maxx, miny],
      [maxx, maxy],
      [minx, maxy],
    ],
    expected = [
      ...new Set(corners.map((a, i) => edgeKey(a, corners[(i + 1) % 4]))),
    ].sort(),
    actual = [
      ...new Set(
        edges.map((g) =>
          edgeKey(
            child(g, "start").slice(1, 3).map(Number),
            child(g, "end").slice(1, 3).map(Number),
          ),
        ),
      ),
    ].sort();
  const rectangular =
    !curves.length &&
    ((equal(actual, expected) && !rects.length) ||
      (rects.length === 1 && !actual.length));
  f.board = {
    width: maxx - minx,
    height: maxy - miny,
    layers: copperLayers.length,
    bounds: [minx, -maxy, maxx, -miny],
    rectangular,
  };
  const netnames = Object.fromEntries(
    children(tree, "net")
      .filter((o) => o.length > 2)
      .map((o) => [o[1], o[2]]),
  );
  const resolveNet = (v: any) =>
    netnames[v] ?? (v && !/^\d+$/.test(String(v)) ? v : null);
  const logical: Record<string, any> = {},
    pinNames: Record<string, string> = {},
    libIds: Record<string, string> = {};
  if (netlists.length === 1) {
    const raw = read(netlists[0]),
      net = raw.trimStart().startsWith("<") ? xmlNetlist(raw) : sexpr(raw);
    for (const c of child(net, "components", []).slice(1)) {
      if (!Array.isArray(c) || c[0] !== "comp") continue;
      const ref = atom(c, "ref"),
        libsrc = child(c, "libsource", []);
      libIds[ref] = JSON.stringify([atom(libsrc, "lib"), atom(libsrc, "part")]);
      logical[ref] = {
        kind: kind(ref, String(atom(libsrc, "part", ""))),
        value: number(atom(c, "value")),
        pins: {},
        part: atom(c, "value"),
      };
    }
    const libparts: Record<string, any> = {};
    for (const l of child(net, "libparts", []).slice(1)) {
      if (!Array.isArray(l) || l[0] !== "libpart") continue;
      libparts[JSON.stringify([atom(l, "lib"), atom(l, "part")])] =
        Object.fromEntries(
          child(l, "pins", [])
            .slice(1)
            .filter((p: any) => Array.isArray(p) && p[0] === "pin")
            .map((p: any) => [atom(p, "num"), atom(p, "name", "")]),
        );
    }
    for (const n of child(net, "nets", []).slice(1)) {
      if (!Array.isArray(n) || n[0] !== "net") continue;
      const name = atom(n, "name");
      for (const node of children(n, "node")) {
        const ref = atom(node, "ref"),
          pin = atom(node, "pin");
        if (!logical[ref]) continue;
        const hint =
            atom(node, "pinfunction") || libparts[libIds[ref]]?.[pin] || "",
          key = polarized(logical[ref].kind) ? semantic(pin, [hint]) : pin;
        logical[ref].pins[key] = name;
        pinNames[ref + "\0" + pin] = key;
      }
    }
  } else f.warnings.push("missing or ambiguous schematic netlist export");
  const embedded: Record<string, any> = {};
  if (sch) {
    for (const symbol of child(sch, "lib_symbols", []).slice(1)) {
      if (!Array.isArray(symbol) || symbol[0] !== "symbol") continue;
      const mappings: Record<string, string> = {};
      for (const unit of children(symbol, "symbol"))
        for (const pin of children(unit, "pin"))
          mappings[atom(pin, "number")] = atom(pin, "name", "");
      embedded[symbol[1]] = mappings;
    }
    for (const instance of children(sch, "symbol")) {
      const props = Object.fromEntries(
          children(instance, "property").map((o) => [o[1], o[2]]),
        ),
        ref = props.Reference,
        lib = atom(instance, "lib_id", "");
      if (ref && !logical[ref]) {
        logical[ref] = {
          kind: kind(ref, lib),
          value: number(props.Value),
          pins: {},
          part: props.Value ?? null,
        };
        for (const [pin, hint] of Object.entries(embedded[lib] ?? {}))
          pinNames[ref + "\0" + pin] = polarized(logical[ref].kind)
            ? semantic(pin, [hint])
            : pin;
      }
    }
  }
  for (const fp of children(tree, "footprint")) {
    const props = Object.fromEntries(
        children(fp, "property").map((o) => [o[1], o[2]]),
      ),
      ref =
        props.Reference ??
        children(fp, "fp_text").find((o) => o[1] === "reference")?.[2];
    if (!ref) throw Error("Unnamed footprint");
    const at = child(fp, "at", [0, 0, 0]).slice(1).map(Number),
      [x, y] = at,
      angle = at[2] ?? 0,
      c = Math.cos((angle * Math.PI) / 180),
      s = Math.sin((angle * Math.PI) / 180),
      transform = (dx: number, dy: number): Point => [
        x + dx * c + dy * s,
        -y + dx * s - dy * c,
      ];
    const comp: any = {
      ...(logical[ref] ?? {
        kind: kind(ref, props.Value ?? ""),
        value: number(props.Value),
        pins: {},
        part: props.Value ?? null,
      }),
      position: { x, y: -y },
      footprint: fp[1],
      pads: [],
      bounds: null,
    };
    const body: Point[] = [],
      assigned: Record<string, any> = {};
    for (const pad of children(fp, "pad")) {
      const pin = pad[1],
        key = pinNames[ref + "\0" + pin] ?? pin,
        pos = child(pad, "at", [0, 0, 0]).slice(1).map(Number),
        [px, py] = transform(pos[0], pos[1]),
        pa = pos[2] ?? angle,
        [w, h] = child(pad, "size", [0, 0, 0]).slice(1, 3).map(Number),
        net = resolveNet(atom(pad, "net"));
      let layers = child(pad, "layers", []).slice(1);
      layers = layers.includes("*.Cu")
        ? copperLayers
        : layers.filter((v: string) => v.endsWith(".Cu"));
      const ls = layers.map(layerName),
        drill = child(pad, "drill"),
        diameter = drill && drill[1] !== "oval" ? Number(drill[1]) : 0;
      if (pad[2] === "np_thru_hole") {
        f.holes.push({ x: px, y: py, diameter });
        continue;
      }
      const shape = pad[3];
      let geom = null;
      if (shape === "circle")
        geom = primitive([[px, py]], w / 2, ls, net, ref + "." + key);
      else if (["rect", "roundrect", "oval"].includes(shape)) {
        const radius =
          shape === "roundrect"
            ? Math.min(w, h) * Number(atom(pad, "roundrect_rratio", 0))
            : shape === "oval"
              ? Math.min(w, h) / 2
              : 0;
        geom = roundedRect(px, py, w, h, pa, radius, ls, net, ref + "." + key);
      }
      if (geom) {
        f.copper.push(geom);
        body.push(
          [geom.bounds[0], geom.bounds[1]],
          [geom.bounds[2], geom.bounds[3]],
        );
      } else f.unsupported.push("unsupported native pad " + shape);
      comp.pads.push({
        pin: key,
        x: px,
        y: py,
        shape,
        width: w,
        height: h,
        hole: diameter,
      });
      assigned[key] = net;
    }
    for (const g of [...children(fp, "fp_line"), ...children(fp, "fp_rect")])
      if (["F.CrtYd", "B.CrtYd"].includes(atom(g, "layer")))
        for (const e of ["start", "end"]) {
          const v = child(g, e);
          if (v) body.push(transform(Number(v[1]), Number(v[2])));
        }
    if (body.length)
      comp.bounds = [
        Math.min(...body.map((p) => p[0])),
        Math.min(...body.map((p) => p[1])),
        Math.max(...body.map((p) => p[0])),
        Math.max(...body.map((p) => p[1])),
      ];
    comp.origin = comp.position;
    if (comp.bounds) {
      const bb = comp.bounds;
      comp.position = { x: (bb[0] + bb[2]) / 2, y: (bb[1] + bb[3]) / 2 };
    }
    comp.pcb_pins = assigned;
    if (!Object.keys(comp.pins).length) {
      comp.pins = { ...assigned };
      f.warnings.push(
        "logical topology uses PCB assignments because schematic netlist is absent",
      );
    }
    f.components[ref] = comp;
    for (const t of [...children(fp, "fp_text"), ...children(fp, "property")])
      if (["F.SilkS", "B.SilkS"].includes(atom(t, "layer")))
        f.silkscreen.push(t[2]);
  }
  for (const seg of children(tree, "segment")) {
    const a = child(seg, "start"),
      b = child(seg, "end"),
      width = Number(atom(seg, "width")),
      net = resolveNet(atom(seg, "net")),
      layer = layerName(atom(seg, "layer"));
    f.copper.push(
      primitive(
        [
          [Number(a[1]), -Number(a[2])],
          [Number(b[1]), -Number(b[2])],
        ],
        width / 2,
        [layer],
        net,
      ),
    );
    f.tracks.push({ width, net });
  }
  for (const via of children(tree, "via")) {
    const a = child(via, "at"),
      ls = child(via, "layers", []).slice(1).map(layerName);
    f.copper.push(
      primitive(
        [[Number(a[1]), -Number(a[2])]],
        Number(atom(via, "size")) / 2,
        ls,
        resolveNet(atom(via, "net")),
      ),
    );
  }
  f.silkscreen.push(
    ...children(tree, "gr_text")
      .filter((g) => ["F.SilkS", "B.SilkS"].includes(atom(g, "layer")))
      .map((g) => g[1]),
  );
  if (children(tree, "arc").length || children(tree, "zone").length)
    f.unsupported.push("native copper arc or zone");
  return f;
}
