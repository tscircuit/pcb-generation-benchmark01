/** Distances between convex outer-copper envelopes, in millimetres. */
export const EPS = 1e-6;
export type Point = [number, number];
export interface Primitive {
  vertices: Point[];
  radius: number;
  layers: string[];
  net: string | null;
  pin: string | null;
  bounds: number[];
}
const cross = (a: Point, b: Point, c: Point) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
function pointSegment(p: Point, a: Point, b: Point) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    den = dx * dx + dy * dy,
    t = den
      ? Math.max(
          0,
          Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / den),
        )
      : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function segments(a: Point, b: Point, c: Point, d: Point) {
  if (
    cross(a, b, c) * cross(a, b, d) < 0 &&
    cross(c, d, a) * cross(c, d, b) < 0
  )
    return 0;
  return Math.min(
    pointSegment(a, c, d),
    pointSegment(b, c, d),
    pointSegment(c, a, b),
    pointSegment(d, a, b),
  );
}
const edges = (v: Point[]): [Point, Point][] =>
  v.map((p, i) => [p, v[(i + 1) % v.length]]);
function inside(p: Point, v: Point[]) {
  if (v.length < 3) return false;
  const vs = edges(v).map(([a, b]) => cross(a, b, p));
  return vs.every((x) => x >= -EPS) || vs.every((x) => x <= EPS);
}
export function distance(a: Primitive, b: Primitive) {
  let gap = 0;
  if (
    !inside(a.vertices[0], b.vertices) &&
    !inside(b.vertices[0], a.vertices)
  ) {
    gap = Infinity;
    for (const [x, y] of edges(a.vertices))
      for (const [z, w] of edges(b.vertices))
        gap = Math.min(gap, segments(x, y, z, w));
  }
  return Math.max(0, gap - a.radius - b.radius);
}
export function primitive(
  vertices: Point[],
  radius: number,
  layers: string[],
  net: string | null,
  pin: string | null = null,
): Primitive {
  if (!vertices.length || radius < 0 || !vertices.flat().every(Number.isFinite))
    throw Error("Invalid copper geometry");
  vertices = [...new Map(vertices.map((p) => [JSON.stringify(p), p])).values()];
  return {
    vertices,
    radius,
    layers: [...new Set(layers)].sort(),
    net,
    pin,
    bounds: [
      Math.min(...vertices.map((p) => p[0])) - radius,
      Math.min(...vertices.map((p) => p[1])) - radius,
      Math.max(...vertices.map((p) => p[0])) + radius,
      Math.max(...vertices.map((p) => p[1])) + radius,
    ],
  };
}
export function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  angle: number,
  radius: number,
  layers: string[],
  net: string | null,
  pin: string | null = null,
) {
  if (w <= 0 || h <= 0 || radius < 0 || radius > Math.min(w, h) / 2 + EPS)
    throw Error("Invalid pad dimensions");
  const c = Math.cos((angle * Math.PI) / 180),
    s = Math.sin((angle * Math.PI) / 180),
    dx = w / 2 - radius,
    dy = h / 2 - radius;
  return primitive(
    [
      [-dx, -dy],
      [dx, -dy],
      [dx, dy],
      [-dx, dy],
    ].map(([a, b]) => [x + a * c - b * s, y + a * s + b * c]),
    radius,
    layers,
    net,
    pin,
  );
}
export class Union<T extends string | number = string> {
  parent = new Map<T, T>();
  find(x: T): T {
    if (!this.parent.has(x)) this.parent.set(x, x);
    if (this.parent.get(x) !== x)
      this.parent.set(x, this.find(this.parent.get(x)!));
    return this.parent.get(x)!;
  }
  join(a: T, b: T) {
    a = this.find(a);
    b = this.find(b);
    if (a !== b) this.parent.set(a > b ? a : b, a > b ? b : a);
  }
}
export function audit(
  shapes: Primitive[],
  clearance: number,
  unsupported: string[],
) {
  const uf = new Union<number>(),
    bad: any[] = [],
    shorts: any[] = [];
  const order = shapes
    .map((_, i) => i)
    .sort((a, b) => shapes[a].bounds[0] - shapes[b].bounds[0] || a - b);
  for (let n = 0; n < order.length; n++) {
    const i = order[n],
      a = shapes[i];
    uf.find(i);
    for (const j of order.slice(n + 1)) {
      const b = shapes[j];
      if (b.bounds[0] > a.bounds[2] + clearance + EPS) break;
      if (
        a.bounds[1] > b.bounds[3] + clearance + EPS ||
        b.bounds[1] > a.bounds[3] + clearance + EPS ||
        !a.layers.some((l) => b.layers.includes(l))
      )
        continue;
      const gap = distance(a, b);
      if (gap <= EPS) uf.join(i, j);
      if (a.net !== b.net && a.net !== null && b.net !== null) {
        if (gap + EPS < clearance)
          bad.push({ a: i, b: j, clearance_mm: Number(gap.toFixed(9)) });
        if (gap <= EPS) shorts.push({ a: i, b: j });
      }
    }
  }
  const pins = new Map<string | null, Map<string, Set<number>>>();
  shapes.forEach((s, i) => {
    if (s.pin !== null) {
      if (!pins.has(s.net)) pins.set(s.net, new Map());
      const m = pins.get(s.net)!;
      if (!m.has(s.pin)) m.set(s.pin, new Set());
      m.get(s.pin)!.add(uf.find(i));
    }
  });
  const disconnected: any[] = [];
  for (const [net, members] of pins) {
    const roots = new Set([...members.values()].flatMap((v) => [...v]));
    if (roots.size > 1)
      disconnected.push({
        net,
        copper_islands: roots.size,
        pins: [...members.keys()].sort(),
      });
  }
  return {
    clearance_violations: bad,
    shorts,
    disconnected_nets: disconnected,
    unsupported_geometry: [...new Set(unsupported)].sort(),
    primitive_count: shapes.length,
  };
}
