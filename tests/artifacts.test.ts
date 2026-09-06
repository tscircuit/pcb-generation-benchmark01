import { test, expect } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { write } from "../src/lib/io";
import {
  sexpr,
  number,
  loadKicad,
  loadTscircuit,
} from "../src/evaluation/artifacts";
import { matchTopology, Checker } from "../src/evaluation/checks";
function temporary(fn: (p: string) => void) {
  const p = mkdtempSync(join(tmpdir(), "pcb-reader-"));
  try {
    fn(p);
  } finally {
    rmSync(p, { recursive: true, force: true });
  }
}
test("multiline and escaped strings", () =>
  expect(sexpr('(x\n(label "a \\"quote\\""))')).toEqual([
    "x",
    ["label", 'a "quote"'],
  ]));
test("malformed S expressions", () => {
  for (const s of ["(a", "a", "(a))", "(a)(b)"])
    expect(() => sexpr(s)).toThrow();
});
test("electronic units", () => {
  expect(number("4k7")).toBe(4700);
  expect(number("100nF")).toBeCloseTo(1e-7, 14);
  expect(number("1M")).toBe(1e6);
  expect(number("unknown")).toBeNull();
  expect(number(0)).toBe(0);
});
test("native named nets and footprint centre", () =>
  temporary((p) => {
    write(
      join(p, "board.kicad_pcb"),
      `(kicad_pcb (layers (0 "F.Cu" signal) (31 "B.Cu" signal)) (gr_rect (start 0 0) (end 30 20) (layer "Edge.Cuts")) (footprint "header" (at 4 8) (property "Reference" "J1") (pad "1" thru_hole rect (at 0 0) (size 1.7 1.7) (drill 1) (layers "*.Cu") (net "/VIN")) (pad "2" thru_hole circle (at 0 2.54) (size 1.7 1.7) (drill 1) (layers "*.Cu") (net "/GND"))) (segment (start 4 8) (end 10 8) (width .3) (layer "F.Cu") (net "/VIN")))`,
    );
    const f = loadKicad(p);
    expect(f.components.J1.pcb_pins).toEqual({ "1": "/VIN", "2": "/GND" });
    expect(f.components.J1.position.y).toBeCloseTo(-9.27);
    expect(f.components.J1.origin.y).toBe(-8);
  }));
test("passive pins and arbitrary net names may swap, values still matter", () => {
  const expected = [
      {
        role: "J1",
        ref: "J1",
        kind: "header",
        value: null,
        pins: { "1": "V", "2": "G" },
      },
      {
        role: "r",
        ref: null,
        kind: "resistor",
        value: 1000,
        pins: { "1": "V", "2": "G" },
      },
    ],
    actual = {
      J1: { kind: "header", value: null, pins: { "1": "foo", "2": "bar" } },
      R99: { kind: "resistor", value: 1000, pins: { "1": "bar", "2": "foo" } },
    };
  expect(matchTopology(expected, actual, true)[0]).not.toBeNull();
  actual.R99.value = 2000;
  expect(matchTopology(expected, actual, true)[0]).toBeNull();
  expect(matchTopology(expected, actual)[0]).not.toBeNull();
});
test("header pin swaps cannot be hidden", () => {
  const expected = ["J1", "J2"].map((ref) => ({
    role: ref,
    ref,
    kind: "header",
    value: null,
    pins: { "1": "V", "2": "G" },
  }));
  expect(
    matchTopology(expected, {
      J1: { kind: "header", pins: { "1": "x", "2": "y" } },
      J2: { kind: "header", pins: { "1": "y", "2": "x" } },
    })[0],
  ).toBeNull();
});
test("unsupported representation is unknown; missing artifact fails", () =>
  temporary((p) => {
    expect(
      new Checker(null, { expected_components: [] }, p, true).check({
        op: "artifacts",
      })[0],
    ).toBe("unknown");
    expect(
      new Checker(null, { expected_components: [] }, p).check({
        op: "artifacts",
      })[0],
    ).toBe("fail");
  }));
test("bad circuit records are data errors", () =>
  temporary((p) => {
    write(join(p, "circuit.json"), "[123]");
    expect(() => loadTscircuit(p)).toThrow();
  }));
