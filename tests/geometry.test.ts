import { test, expect } from "bun:test";
import {
  primitive,
  roundedRect,
  distance,
  audit,
} from "../src/evaluation/geometry";
const line = (y: number, net: string, layer = "top") =>
  primitive(
    [
      [0, y],
      [10, y],
    ],
    0.15,
    [layer],
    net,
  );
test("clearance boundary", () => {
  const a = line(0, "a"),
    b = line(0.55, "b");
  expect(distance(a, b)).toBeCloseTo(0.25, 10);
  expect(audit([a, b], 0.25, []).clearance_violations).toHaveLength(0);
  expect(
    audit([a, line(0.549, "b")], 0.25, []).clearance_violations,
  ).not.toHaveLength(0);
});
test("crossings are layer aware", () => {
  const a = line(0, "a"),
    b = primitive(
      [
        [5, -2],
        [5, 2],
      ],
      0.15,
      ["top"],
      "b",
    );
  expect(audit([a, b], 0.25, []).shorts).not.toHaveLength(0);
  b.layers = ["bottom"];
  expect(audit([a, b], 0.25, []).shorts).toHaveLength(0);
});
test("same assigned net can be disconnected", () => {
  const a = primitive([[0, 0]], 0.5, ["top"], "a", "J1.1"),
    b = primitive([[5, 0]], 0.5, ["top"], "a", "R1.1");
  expect(audit([a, b], 0.25, []).disconnected_nets).not.toHaveLength(0);
  expect(
    audit(
      [
        a,
        b,
        primitive(
          [
            [0, 0],
            [5, 0],
          ],
          0.15,
          ["top"],
          "a",
        ),
      ],
      0.25,
      [],
    ).disconnected_nets,
  ).toHaveLength(0);
});
test("via connects layers", () => {
  const shapes = [
    primitive([[0, 0]], 0.5, ["top"], "a", "J1.1"),
    primitive([[5, 0]], 0.5, ["bottom"], "a", "R1.1"),
    primitive(
      [
        [0, 0],
        [2, 0],
      ],
      0.15,
      ["top"],
      "a",
    ),
    primitive(
      [
        [2, 0],
        [5, 0],
      ],
      0.15,
      ["bottom"],
      "a",
    ),
  ];
  expect(audit(shapes, 0.25, []).disconnected_nets).not.toHaveLength(0);
  shapes.push(primitive([[2, 0]], 0.3, ["top", "bottom"], "a"));
  expect(audit(shapes, 0.25, []).disconnected_nets).toHaveLength(0);
});
test("rounded corner differs from bounding box", () =>
  expect(
    distance(
      roundedRect(0, 0, 2, 2, 0, 0.5, ["top"], "a"),
      primitive([[1, 1]], 0, ["top"], "b"),
    ),
  ).toBeGreaterThan(0.2));
test("capsule is not an infinite line", () =>
  expect(
    distance(
      roundedRect(0, 0, 4, 2, 0, 1, ["top"], "a"),
      primitive([[10, 0]], 0, ["top"], "b"),
    ),
  ).toBeCloseTo(8, 10));
test("rotation", () =>
  expect(
    distance(
      roundedRect(0, 0, 4, 2, 90, 0, ["top"], "a"),
      primitive([[0, 4]], 0, ["top"], "b"),
    ),
  ).toBeCloseTo(2, 10));
test("unsupported geometry retained", () =>
  expect(audit([], 0.25, ["zone"]).unsupported_geometry).toEqual(["zone"]));
