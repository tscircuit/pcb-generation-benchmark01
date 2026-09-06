/** Frozen retrospective v1 specifications. New rules require a new version. */
export const SPECIFICATIONS = {
  "analog-input-bank": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "OUT1",
          "2": "OUT2",
          "3": "OUT3",
          "4": "OUT4",
          "5": "OUT5",
          "6": "OUT6",
          "7": "GND",
          "8": "GND",
        },
        ref: "J7",
        role: "J7",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "IN1",
          "2": "GND",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN1",
          "2": "DIV1",
        },
        ref: null,
        role: "top1",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV1",
          "2": "GND",
        },
        ref: null,
        role: "bottom1",
        value: 20000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV1",
          "2": "OUT1",
        },
        ref: null,
        role: "series1",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT1",
          "2": "GND",
        },
        ref: null,
        role: "cap1",
        value: 1e-7,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "OUT1",
        },
        ref: null,
        role: "tp1",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "IN2",
          "2": "GND",
        },
        ref: "J2",
        role: "J2",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN2",
          "2": "DIV2",
        },
        ref: null,
        role: "top2",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV2",
          "2": "GND",
        },
        ref: null,
        role: "bottom2",
        value: 20000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV2",
          "2": "OUT2",
        },
        ref: null,
        role: "series2",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT2",
          "2": "GND",
        },
        ref: null,
        role: "cap2",
        value: 1e-7,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "OUT2",
        },
        ref: null,
        role: "tp2",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "IN3",
          "2": "GND",
        },
        ref: "J3",
        role: "J3",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN3",
          "2": "DIV3",
        },
        ref: null,
        role: "top3",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV3",
          "2": "GND",
        },
        ref: null,
        role: "bottom3",
        value: 20000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV3",
          "2": "OUT3",
        },
        ref: null,
        role: "series3",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT3",
          "2": "GND",
        },
        ref: null,
        role: "cap3",
        value: 1e-7,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "OUT3",
        },
        ref: null,
        role: "tp3",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "IN4",
          "2": "GND",
        },
        ref: "J4",
        role: "J4",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN4",
          "2": "DIV4",
        },
        ref: null,
        role: "top4",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV4",
          "2": "GND",
        },
        ref: null,
        role: "bottom4",
        value: 20000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV4",
          "2": "OUT4",
        },
        ref: null,
        role: "series4",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT4",
          "2": "GND",
        },
        ref: null,
        role: "cap4",
        value: 1e-7,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "OUT4",
        },
        ref: null,
        role: "tp4",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "IN5",
          "2": "GND",
        },
        ref: "J5",
        role: "J5",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN5",
          "2": "DIV5",
        },
        ref: null,
        role: "top5",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV5",
          "2": "GND",
        },
        ref: null,
        role: "bottom5",
        value: 20000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV5",
          "2": "OUT5",
        },
        ref: null,
        role: "series5",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT5",
          "2": "GND",
        },
        ref: null,
        role: "cap5",
        value: 1e-7,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "OUT5",
        },
        ref: null,
        role: "tp5",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "IN6",
          "2": "GND",
        },
        ref: "J6",
        role: "J6",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN6",
          "2": "DIV6",
        },
        ref: null,
        role: "top6",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV6",
          "2": "GND",
        },
        ref: null,
        role: "bottom6",
        value: 20000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "DIV6",
          "2": "OUT6",
        },
        ref: null,
        role: "series6",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT6",
          "2": "GND",
        },
        ref: null,
        role: "cap6",
        value: 1e-7,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "OUT6",
        },
        ref: null,
        role: "tp6",
        value: null,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "GND",
        },
        ref: null,
        role: "groundtp",
        value: null,
      },
    ],
    prompt_id: "analog-input-bank",
    prompt_revision: 1,
    prompt_sha256:
      "441ad72121511dea1787995ae6086eabd660a0a235f60ea4d0cf70d11adac869",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 50,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 80,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "test-pads",
        requirement: "Requested exposed test pads have diameter at least 1 mm.",
        rule: {
          minimum_mm: 1,
          op: "testpads",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J7", "side": "bottom"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J7",
          side: "bottom",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J1", "side": "top"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J1",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-03",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "cap1", "b": "J7", "maximum_mm": 10, "op": "role_distance"}',
        rule: {
          a: "cap1",
          b: "J7",
          maximum_mm: 10,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-04",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J2", "side": "top"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J2",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-05",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "cap2", "b": "J7", "maximum_mm": 10, "op": "role_distance"}',
        rule: {
          a: "cap2",
          b: "J7",
          maximum_mm: 10,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-06",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J3", "side": "top"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J3",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-07",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "cap3", "b": "J7", "maximum_mm": 10, "op": "role_distance"}',
        rule: {
          a: "cap3",
          b: "J7",
          maximum_mm: 10,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-08",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J4", "side": "top"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J4",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-09",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "cap4", "b": "J7", "maximum_mm": 10, "op": "role_distance"}',
        rule: {
          a: "cap4",
          b: "J7",
          maximum_mm: 10,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-10",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J5", "side": "top"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J5",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-11",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "cap5", "b": "J7", "maximum_mm": 10, "op": "role_distance"}',
        rule: {
          a: "cap5",
          b: "J7",
          maximum_mm: 10,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-12",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J6", "side": "top"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J6",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-13",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "cap6", "b": "J7", "maximum_mm": 10, "op": "role_distance"}',
        rule: {
          a: "cap6",
          b: "J7",
          maximum_mm: 10,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-14",
        requirement:
          'Prompt-specific placement/routing constraint: {"minimum_spacing_mm": 11, "op": "spacing", "refs": ["J1", "J2", "J3", "J4", "J5", "J6"]}',
        rule: {
          minimum_spacing_mm: 11,
          op: "spacing",
          refs: ["J1", "J2", "J3", "J4", "J5", "J6"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-15",
        requirement:
          'Prompt-specific placement/routing constraint: {"clearance_mm": 1, "diameter_mm": 3.2, "edge_offset_mm": 4, "op": "mounting_holes"}',
        rule: {
          clearance_mm: 1,
          diameter_mm: 3.2,
          edge_offset_mm: 4,
          op: "mounting_holes",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "button-input-bank": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "V3",
          "2": "GND",
          "3": "BTN1",
          "4": "BTN2",
          "5": "BTN3",
          "6": "BTN4",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V3",
          "2": "BTN1",
        },
        ref: "R1",
        role: "R1",
        value: 10000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "BTN1",
          "2": "GND",
        },
        ref: "C1",
        role: "C1",
        value: 1e-7,
      },
      {
        kind: "switch",
        pins: {
          "1": "BTN1",
          "2": "GND",
        },
        ref: "SW1",
        role: "SW1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V3",
          "2": "BTN2",
        },
        ref: "R2",
        role: "R2",
        value: 10000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "BTN2",
          "2": "GND",
        },
        ref: "C2",
        role: "C2",
        value: 1e-7,
      },
      {
        kind: "switch",
        pins: {
          "1": "BTN2",
          "2": "GND",
        },
        ref: "SW2",
        role: "SW2",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V3",
          "2": "BTN3",
        },
        ref: "R3",
        role: "R3",
        value: 10000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "BTN3",
          "2": "GND",
        },
        ref: "C3",
        role: "C3",
        value: 1e-7,
      },
      {
        kind: "switch",
        pins: {
          "1": "BTN3",
          "2": "GND",
        },
        ref: "SW3",
        role: "SW3",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V3",
          "2": "BTN4",
        },
        ref: "R4",
        role: "R4",
        value: 10000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "BTN4",
          "2": "GND",
        },
        ref: "C4",
        role: "C4",
        value: 1e-7,
      },
      {
        kind: "switch",
        pins: {
          "1": "BTN4",
          "2": "GND",
        },
        ref: "SW4",
        role: "SW4",
        value: null,
      },
    ],
    prompt_id: "button-input-bank",
    prompt_revision: 1,
    prompt_sha256:
      "41d352cc9a6280e14727ad0186f65a05ced344cb4a848c5689204b0beea64e47",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 35,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 50,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"minimum_spacing_mm": 10, "op": "row", "refs": ["SW1", "SW2", "SW3", "SW4"]}',
        rule: {
          minimum_spacing_mm: 10,
          op: "row",
          refs: ["SW1", "SW2", "SW3", "SW4"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "Normally-open momentary behavior and internal switch-terminal grouping need verified component-library evidence.",
        rule: {
          op: "unknown",
          reason:
            "Normally-open momentary behavior and internal switch-terminal grouping need verified component-library evidence.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "diode-key-matrix": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "ROW1",
          "2": "ROW2",
          "3": "ROW3",
          "4": "COL1",
          "5": "COL2",
          "6": "COL3",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL1",
          "2": "K11",
        },
        ref: "SW11",
        role: "SW11",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K11",
          K: "ROW1",
        },
        ref: "D11",
        role: "D11",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL2",
          "2": "K12",
        },
        ref: "SW12",
        role: "SW12",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K12",
          K: "ROW1",
        },
        ref: "D12",
        role: "D12",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL3",
          "2": "K13",
        },
        ref: "SW13",
        role: "SW13",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K13",
          K: "ROW1",
        },
        ref: "D13",
        role: "D13",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL1",
          "2": "K21",
        },
        ref: "SW21",
        role: "SW21",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K21",
          K: "ROW2",
        },
        ref: "D21",
        role: "D21",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL2",
          "2": "K22",
        },
        ref: "SW22",
        role: "SW22",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K22",
          K: "ROW2",
        },
        ref: "D22",
        role: "D22",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL3",
          "2": "K23",
        },
        ref: "SW23",
        role: "SW23",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K23",
          K: "ROW2",
        },
        ref: "D23",
        role: "D23",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL1",
          "2": "K31",
        },
        ref: "SW31",
        role: "SW31",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K31",
          K: "ROW3",
        },
        ref: "D31",
        role: "D31",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL2",
          "2": "K32",
        },
        ref: "SW32",
        role: "SW32",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K32",
          K: "ROW3",
        },
        ref: "D32",
        role: "D32",
        value: null,
      },
      {
        kind: "switch",
        pins: {
          "1": "COL3",
          "2": "K33",
        },
        ref: "SW33",
        role: "SW33",
        value: null,
      },
      {
        kind: "diode",
        pins: {
          A: "K33",
          K: "ROW3",
        },
        ref: "D33",
        role: "D33",
        value: null,
      },
    ],
    prompt_id: "diode-key-matrix",
    prompt_revision: 1,
    prompt_sha256:
      "8d97a8456932f786386bc04b8f672eb1a0dd9759deed87a475b0328ec07adc15",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 65,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 65,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D11", "b": "SW11", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D11",
          b: "SW11",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW11", "tolerance_mm": 0.5, "x_mm": 12, "y_mm": 12}',
        rule: {
          op: "position",
          ref: "SW11",
          tolerance_mm: 0.5,
          x_mm: 12,
          y_mm: 12,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-03",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D12", "b": "SW12", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D12",
          b: "SW12",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-04",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW12", "tolerance_mm": 0.5, "x_mm": 32, "y_mm": 12}',
        rule: {
          op: "position",
          ref: "SW12",
          tolerance_mm: 0.5,
          x_mm: 32,
          y_mm: 12,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-05",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D13", "b": "SW13", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D13",
          b: "SW13",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-06",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW13", "tolerance_mm": 0.5, "x_mm": 52, "y_mm": 12}',
        rule: {
          op: "position",
          ref: "SW13",
          tolerance_mm: 0.5,
          x_mm: 52,
          y_mm: 12,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-07",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D21", "b": "SW21", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D21",
          b: "SW21",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-08",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW21", "tolerance_mm": 0.5, "x_mm": 12, "y_mm": 32}',
        rule: {
          op: "position",
          ref: "SW21",
          tolerance_mm: 0.5,
          x_mm: 12,
          y_mm: 32,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-09",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D22", "b": "SW22", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D22",
          b: "SW22",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-10",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW22", "tolerance_mm": 0.5, "x_mm": 32, "y_mm": 32}',
        rule: {
          op: "position",
          ref: "SW22",
          tolerance_mm: 0.5,
          x_mm: 32,
          y_mm: 32,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-11",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D23", "b": "SW23", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D23",
          b: "SW23",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-12",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW23", "tolerance_mm": 0.5, "x_mm": 52, "y_mm": 32}',
        rule: {
          op: "position",
          ref: "SW23",
          tolerance_mm: 0.5,
          x_mm: 52,
          y_mm: 32,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-13",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D31", "b": "SW31", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D31",
          b: "SW31",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-14",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW31", "tolerance_mm": 0.5, "x_mm": 12, "y_mm": 52}',
        rule: {
          op: "position",
          ref: "SW31",
          tolerance_mm: 0.5,
          x_mm: 12,
          y_mm: 52,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-15",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D32", "b": "SW32", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D32",
          b: "SW32",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-16",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW32", "tolerance_mm": 0.5, "x_mm": 32, "y_mm": 52}',
        rule: {
          op: "position",
          ref: "SW32",
          tolerance_mm: 0.5,
          x_mm: 32,
          y_mm: 52,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-17",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D33", "b": "SW33", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D33",
          b: "SW33",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-18",
        requirement:
          'Prompt-specific placement/routing constraint: {"op": "position", "ref": "SW33", "tolerance_mm": 0.5, "x_mm": 52, "y_mm": 52}',
        rule: {
          op: "position",
          ref: "SW33",
          tolerance_mm: 0.5,
          x_mm: 52,
          y_mm: 52,
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "Momentary switch behavior, duplicated terminal grouping, and diode switching part/pin mapping require verified component-library evidence.",
        rule: {
          op: "unknown",
          reason:
            "Momentary switch behavior, duplicated terminal grouping, and diode switching part/pin mapping require verified component-library evidence.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-evidence-02",
        requirement:
          "Cathode markings and RrCc marking association need reviewed footprint evidence.",
        rule: {
          op: "unknown",
          reason:
            "Cathode markings and RrCc marking association need reviewed footprint evidence.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "i2c-pullup-hub": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "V3",
          "2": "GND",
          "3": "SDA",
          "4": "SCL",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "V3",
          "2": "GND",
        },
        ref: "C1",
        role: "C1",
        value: 1e-7,
      },
      {
        kind: "header",
        pins: {
          "1": "V3",
          "2": "GND",
          "3": "SDA",
          "4": "SCL",
        },
        ref: "J2",
        role: "J2",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "V3",
          "2": "GND",
        },
        ref: "C2",
        role: "C2",
        value: 1e-7,
      },
      {
        kind: "header",
        pins: {
          "1": "V3",
          "2": "GND",
          "3": "SDA",
          "4": "SCL",
        },
        ref: "J3",
        role: "J3",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "V3",
          "2": "GND",
        },
        ref: "C3",
        role: "C3",
        value: 1e-7,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V3",
          "2": "PU1",
        },
        ref: "R1",
        role: "R1",
        value: 4700,
      },
      {
        kind: "jumper",
        pins: {
          "1": "PU1",
          "2": "SDA",
        },
        ref: "JP1",
        role: "JP1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V3",
          "2": "PU2",
        },
        ref: "R2",
        role: "R2",
        value: 4700,
      },
      {
        kind: "jumper",
        pins: {
          "1": "PU2",
          "2": "SCL",
        },
        ref: "JP2",
        role: "JP2",
        value: null,
      },
    ],
    prompt_id: "i2c-pullup-hub",
    prompt_revision: 1,
    prompt_sha256:
      "63731fd6945270a8a0584ce606aacb4b084064584774f34cc24007635c1b5810",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 35,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 45,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "C1", "b": "J1", "maximum_mm": 5, "op": "distance"}',
        rule: {
          a: "C1",
          b: "J1",
          maximum_mm: 5,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "C2", "b": "J2", "maximum_mm": 5, "op": "distance"}',
        rule: {
          a: "C2",
          b: "J2",
          maximum_mm: 5,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-03",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "C3", "b": "J3", "maximum_mm": 5, "op": "distance"}',
        rule: {
          a: "C3",
          b: "J3",
          maximum_mm: 5,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-04",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J1", "side": "left"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J1",
          side: "left",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-05",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J2", "side": "right"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J2",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-06",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J3", "side": "top"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J3",
          side: "top",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-07",
        requirement:
          'Prompt-specific placement/routing constraint: {"minimum_mm": 0.25, "op": "jumper_gap", "refs": ["JP1", "JP2"]}',
        rule: {
          minimum_mm: 0.25,
          op: "jumper_gap",
          refs: ["JP1", "JP2"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "SDA PU / SCL PU marking association and solderability require reviewed marking/material evidence.",
        rule: {
          op: "unknown",
          reason:
            "SDA PU / SCL PU marking association and solderability require reviewed marking/material evidence.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "led-indicator": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "V5",
          "2": "GND",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V5",
          "2": "A",
        },
        ref: "R1",
        role: "R1",
        value: 1000,
      },
      {
        kind: "led",
        pins: {
          A: "A",
          K: "GND",
        },
        ref: "D1",
        role: "D1",
        value: null,
      },
    ],
    prompt_id: "led-indicator",
    prompt_revision: 1,
    prompt_sha256:
      "ac819606ce733f29806a8bc142714050d32099f1bef99a8d611b0e0581442f5b",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 20,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 30,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J1", "side": "left"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J1",
          side: "left",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "D1", "side": "right"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "D1",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "LED color and selected part identity require component evidence beyond copper geometry.",
        rule: {
          op: "unknown",
          reason:
            "LED color and selected part identity require component evidence beyond copper geometry.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-evidence-02",
        requirement:
          "Cathode-mark polarity and placement require a reviewed marking/footprint evidence record.",
        rule: {
          op: "unknown",
          reason:
            "Cathode-mark polarity and placement require a reviewed marking/footprint evidence record.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "mosfet-output-bank": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "V12",
          "2": "GND",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "GND",
          "2": "CTRL1",
          "3": "CTRL2",
          "4": "CTRL3",
          "5": "CTRL4",
        },
        ref: "J2",
        role: "J2",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "V12",
          "2": "GND",
        },
        ref: null,
        role: "bulk",
        value: 0.00001,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "V12",
          "2": "GND",
        },
        ref: null,
        role: "decouple",
        value: 1e-7,
      },
      {
        kind: "transistor",
        pins: {
          D: "OUT1",
          G: "GATE1",
          S: "GND",
        },
        ref: "Q1",
        role: "Q1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "CTRL1",
          "2": "GATE1",
        },
        ref: null,
        role: "gate1",
        value: 100,
      },
      {
        kind: "resistor",
        pins: {
          "1": "GATE1",
          "2": "GND",
        },
        ref: null,
        role: "pull1",
        value: 100000,
      },
      {
        kind: "diode",
        pins: {
          A: "OUT1",
          K: "V12",
        },
        ref: "D1",
        role: "D1",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "V12",
          "2": "OUT1",
        },
        ref: "J3",
        role: "J3",
        value: null,
      },
      {
        kind: "transistor",
        pins: {
          D: "OUT2",
          G: "GATE2",
          S: "GND",
        },
        ref: "Q2",
        role: "Q2",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "CTRL2",
          "2": "GATE2",
        },
        ref: null,
        role: "gate2",
        value: 100,
      },
      {
        kind: "resistor",
        pins: {
          "1": "GATE2",
          "2": "GND",
        },
        ref: null,
        role: "pull2",
        value: 100000,
      },
      {
        kind: "diode",
        pins: {
          A: "OUT2",
          K: "V12",
        },
        ref: "D2",
        role: "D2",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "V12",
          "2": "OUT2",
        },
        ref: "J4",
        role: "J4",
        value: null,
      },
      {
        kind: "transistor",
        pins: {
          D: "OUT3",
          G: "GATE3",
          S: "GND",
        },
        ref: "Q3",
        role: "Q3",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "CTRL3",
          "2": "GATE3",
        },
        ref: null,
        role: "gate3",
        value: 100,
      },
      {
        kind: "resistor",
        pins: {
          "1": "GATE3",
          "2": "GND",
        },
        ref: null,
        role: "pull3",
        value: 100000,
      },
      {
        kind: "diode",
        pins: {
          A: "OUT3",
          K: "V12",
        },
        ref: "D3",
        role: "D3",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "V12",
          "2": "OUT3",
        },
        ref: "J5",
        role: "J5",
        value: null,
      },
      {
        kind: "transistor",
        pins: {
          D: "OUT4",
          G: "GATE4",
          S: "GND",
        },
        ref: "Q4",
        role: "Q4",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "CTRL4",
          "2": "GATE4",
        },
        ref: null,
        role: "gate4",
        value: 100,
      },
      {
        kind: "resistor",
        pins: {
          "1": "GATE4",
          "2": "GND",
        },
        ref: null,
        role: "pull4",
        value: 100000,
      },
      {
        kind: "diode",
        pins: {
          A: "OUT4",
          K: "V12",
        },
        ref: "D4",
        role: "D4",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "V12",
          "2": "OUT4",
        },
        ref: "J6",
        role: "J6",
        value: null,
      },
    ],
    prompt_id: "mosfet-output-bank",
    prompt_revision: 1,
    prompt_sha256:
      "46049eb02f86cb9da99159dcdd96c5eb5dd7bdba53dc4b53cb60572b4ecfdf4e",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 50,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 70,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "bulk", "b": "J1", "maximum_mm": 7, "op": "role_distance"}',
        rule: {
          a: "bulk",
          b: "J1",
          maximum_mm: 7,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "decouple", "b": "J1", "maximum_mm": 7, "op": "role_distance"}',
        rule: {
          a: "decouple",
          b: "J1",
          maximum_mm: 7,
          op: "role_distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-03",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J3", "side": "right"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J3",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-04",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D1", "b": "J3", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D1",
          b: "J3",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-05",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J4", "side": "right"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J4",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-06",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D2", "b": "J4", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D2",
          b: "J4",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-07",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J5", "side": "right"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J5",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-08",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D3", "b": "J5", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D3",
          b: "J5",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-09",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 6, "op": "edge", "ref": "J6", "side": "right"}',
        rule: {
          maximum_mm: 6,
          op: "edge",
          ref: "J6",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-10",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "D4", "b": "J6", "maximum_mm": 8, "op": "distance"}',
        rule: {
          a: "D4",
          b: "J6",
          maximum_mm: 8,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-11",
        requirement:
          'Prompt-specific placement/routing constraint: {"minimum_spacing_mm": 10, "op": "spacing", "refs": ["J3", "J4", "J5", "J6"]}',
        rule: {
          minimum_spacing_mm: 10,
          op: "spacing",
          refs: ["J3", "J4", "J5", "J6"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-12",
        requirement:
          'Prompt-specific placement/routing constraint: {"minimum_mm": 0.5, "nets": ["V12", "GND", "OUT1", "OUT2", "OUT3", "OUT4"], "op": "net_width"}',
        rule: {
          minimum_mm: 0.5,
          nets: ["V12", "GND", "OUT1", "OUT2", "OUT3", "OUT4"],
          op: "net_width",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "MOSFET VDS/on-resistance gate voltage, diode reverse/current ratings, capacitor voltage ratings, and manufacturer pin mapping need independently verified datasheets.",
        rule: {
          op: "unknown",
          reason:
            "MOSFET VDS/on-resistance gate voltage, diode reverse/current ratings, capacitor voltage ratings, and manufacturer pin mapping need independently verified datasheets.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-evidence-02",
        requirement:
          "Flyback diode polarity markings need reviewed footprint evidence.",
        rule: {
          op: "unknown",
          reason:
            "Flyback diode polarity markings need reviewed footprint evidence.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "req-06",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "npn-led-driver": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "V5",
          "2": "GND",
          "3": "CTRL1",
          "4": "CTRL2",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "V5",
          "2": "GND",
        },
        ref: "C1",
        role: "C1",
        value: 1e-7,
      },
      {
        kind: "transistor",
        pins: {
          B: "BASE1",
          C: "COL1",
          E: "GND",
        },
        ref: "Q1",
        role: "Q1",
        value: null,
      },
      {
        kind: "led",
        pins: {
          A: "A1",
          K: "COL1",
        },
        ref: "D1",
        role: "D1",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "CTRL1",
          "2": "BASE1",
        },
        ref: null,
        role: "base1",
        value: 4700,
      },
      {
        kind: "resistor",
        pins: {
          "1": "BASE1",
          "2": "GND",
        },
        ref: null,
        role: "pull1",
        value: 100000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V5",
          "2": "A1",
        },
        ref: null,
        role: "ledr1",
        value: 1000,
      },
      {
        kind: "transistor",
        pins: {
          B: "BASE2",
          C: "COL2",
          E: "GND",
        },
        ref: "Q2",
        role: "Q2",
        value: null,
      },
      {
        kind: "led",
        pins: {
          A: "A2",
          K: "COL2",
        },
        ref: "D2",
        role: "D2",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "CTRL2",
          "2": "BASE2",
        },
        ref: null,
        role: "base2",
        value: 4700,
      },
      {
        kind: "resistor",
        pins: {
          "1": "BASE2",
          "2": "GND",
        },
        ref: null,
        role: "pull2",
        value: 100000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "V5",
          "2": "A2",
        },
        ref: null,
        role: "ledr2",
        value: 1000,
      },
    ],
    prompt_id: "npn-led-driver",
    prompt_revision: 1,
    prompt_sha256:
      "0bef478d2b6e9752e4230aab7eecf8bd3bab485b1a1927d697114e1e22542bf6",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 30,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 45,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "C1", "b": "J1", "maximum_mm": 5, "op": "distance"}',
        rule: {
          a: "C1",
          b: "J1",
          maximum_mm: 5,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"minimum_spacing_mm": 10, "op": "row", "refs": ["D1", "D2"]}',
        rule: {
          minimum_spacing_mm: 10,
          op: "row",
          refs: ["D1", "D2"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "NPN part identity, red LED color, and SOT-23 manufacturer pin mapping need verified component documentation.",
        rule: {
          op: "unknown",
          reason:
            "NPN part identity, red LED color, and SOT-23 manufacturer pin mapping need verified component documentation.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-evidence-02",
        requirement:
          "LED polarity markings require reviewed footprint evidence.",
        rule: {
          op: "unknown",
          reason: "LED polarity markings require reviewed footprint evidence.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "rc-low-pass": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "IN",
          "2": "GND",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "OUT",
          "2": "GND",
        },
        ref: "J2",
        role: "J2",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "IN",
          "2": "OUT",
        },
        ref: "R1",
        role: "R1",
        value: 1000,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "OUT",
          "2": "GND",
        },
        ref: "C1",
        role: "C1",
        value: 1e-7,
      },
    ],
    prompt_id: "rc-low-pass",
    prompt_revision: 1,
    prompt_sha256:
      "eda1af0a7aa0fba25e862b7795c61a6137ad61d76285ec39f641765016bb6541",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 25,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 35,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J1", "side": "left"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J1",
          side: "left",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J2", "side": "right"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J2",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-03",
        requirement:
          'Prompt-specific placement/routing constraint: {"a": "C1", "b": "J2", "maximum_mm": 5, "op": "distance"}',
        rule: {
          a: "C1",
          b: "J2",
          maximum_mm: 5,
          op: "distance",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "stereo-passive-attenuator": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "LIN",
          "2": "GND",
          "3": "RIN",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "LOUT",
          "2": "GND",
          "3": "ROUT",
        },
        ref: "J2",
        role: "J2",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "LIN",
          "2": "LAC",
        },
        ref: null,
        role: "Lcap",
        value: 0.000001,
      },
      {
        kind: "resistor",
        pins: {
          "1": "LAC",
          "2": "LOUT",
        },
        ref: null,
        role: "Lseries",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "LOUT",
          "2": "GND",
        },
        ref: null,
        role: "Lshunt",
        value: 10000,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "LOUT",
        },
        ref: null,
        role: "Ltp",
        value: null,
      },
      {
        kind: "capacitor",
        pins: {
          "1": "RIN",
          "2": "RAC",
        },
        ref: null,
        role: "Rcap",
        value: 0.000001,
      },
      {
        kind: "resistor",
        pins: {
          "1": "RAC",
          "2": "ROUT",
        },
        ref: null,
        role: "Rseries",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "ROUT",
          "2": "GND",
        },
        ref: null,
        role: "Rshunt",
        value: 10000,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "ROUT",
        },
        ref: null,
        role: "Rtp",
        value: null,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "GND",
        },
        ref: null,
        role: "groundtp",
        value: null,
      },
    ],
    prompt_id: "stereo-passive-attenuator",
    prompt_revision: 1,
    prompt_sha256:
      "2af5de18a6c2a7bf188a0b22ee6714466cbfa080c2f6a28bdd81a3579968fb4a",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 30,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 50,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "test-pads",
        requirement: "Requested exposed test pads have diameter at least 1 mm.",
        rule: {
          minimum_mm: 1,
          op: "testpads",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J1", "side": "left"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J1",
          side: "left",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J2", "side": "right"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J2",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-03",
        requirement:
          'Prompt-specific placement/routing constraint: {"half": "top", "op": "half", "roles": ["Lcap", "Lseries", "Lshunt"]}',
        rule: {
          half: "top",
          op: "half",
          roles: ["Lcap", "Lseries", "Lshunt"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-04",
        requirement:
          'Prompt-specific placement/routing constraint: {"half": "bottom", "op": "half", "roles": ["Rcap", "Rseries", "Rshunt"]}',
        rule: {
          half: "bottom",
          op: "half",
          roles: ["Rcap", "Rseries", "Rshunt"],
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: false,
        id: "component-evidence-01",
        requirement:
          "Nonpolar ceramic capacitor construction needs verified component identity.",
        rule: {
          op: "unknown",
          reason:
            "Nonpolar ceramic capacitor construction needs verified component identity.",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "req-05",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
  "voltage-divider": {
    applicability: {
      connectivity: true,
      deliverable_integrity: true,
      functional_requirements: true,
      physical_constraints: true,
    },
    expected_components: [
      {
        kind: "header",
        pins: {
          "1": "VIN",
          "2": "GND",
        },
        ref: "J1",
        role: "J1",
        value: null,
      },
      {
        kind: "header",
        pins: {
          "1": "VOUT",
          "2": "GND",
        },
        ref: "J2",
        role: "J2",
        value: null,
      },
      {
        kind: "resistor",
        pins: {
          "1": "VIN",
          "2": "VOUT",
        },
        ref: "R1",
        role: "R1",
        value: 10000,
      },
      {
        kind: "resistor",
        pins: {
          "1": "VOUT",
          "2": "GND",
        },
        ref: "R2",
        role: "R2",
        value: 10000,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "VOUT",
        },
        ref: "TP1",
        role: "TP1",
        value: null,
      },
      {
        kind: "testpoint",
        pins: {
          "1": "GND",
        },
        ref: "TP2",
        role: "TP2",
        value: null,
      },
    ],
    prompt_id: "voltage-divider",
    prompt_revision: 1,
    prompt_sha256:
      "9bf89efc737280478cc01e57d670eb4caa16ad81b4e140e03bc68d6adcab33a5",
    retrospective: true,
    tests: [
      {
        category: "functional_requirements",
        critical: true,
        id: "required-components",
        requirement:
          "Required electronic component types and counts are present.",
        rule: {
          op: "component_counts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "functional_requirements",
        critical: true,
        id: "passive-values",
        requirement:
          "All requested resistor and capacitor nominal values match the prompt.",
        rule: {
          op: "values",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "topology",
        requirement:
          "Required logical net topology and connector pin assignments match, allowing interchangeable passive terminals and unconstrained references.",
        rule: {
          op: "topology",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "schematic-pcb-net-agreement",
        requirement: "Schematic-export and PCB assigned-net partitions agree.",
        rule: {
          op: "net_agreement",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "routed-copper",
        requirement:
          "Every required pad is joined by continuous copper to other pads on its net.",
        rule: {
          op: "routing",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "connectivity",
        critical: true,
        id: "no-copper-shorts",
        requirement:
          "Different assigned nets do not touch in supported copper geometry.",
        rule: {
          op: "shorts",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "board-size",
        requirement: "Requested board dimensions within 0.1 mm.",
        rule: {
          height_mm: 20,
          op: "board_size",
          tolerance_mm: 0.1,
          width_mm: 30,
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layers",
        requirement: "Two copper layers.",
        rule: {
          count: 2,
          op: "layers",
        },
        source_criteria: ["req-01"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "trace-width",
        requirement: "All copper track widths at least 0.25 mm.",
        rule: {
          minimum_mm: 0.25,
          op: "trace_width",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: true,
        id: "copper-clearance",
        requirement:
          "At least 0.25 mm clearance between separate-net copper outer envelopes.",
        rule: {
          minimum_mm: 0.25,
          op: "clearance",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "component-containment",
        requirement:
          "Declared component/pad/courtyard bounds remain inside the board.",
        rule: {
          op: "containment",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "header-pitch",
        requirement: "Through-hole header pin pitch is 2.54 mm.",
        rule: {
          op: "header_pitch",
          pitch_mm: 2.54,
          tolerance_mm: 0.01,
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "passive-packages",
        requirement:
          "Resistor/capacitor and requested LED pad geometry is compatible with the documented 0805 recognition contract.",
        rule: {
          op: "packages_0805",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "signal-markings",
        requirement:
          "Connector pin 1 and requested signal/part markings are correctly associated and readable.",
        rule: {
          op: "unknown",
          reason:
            "Automated presence of text does not verify pin/signal association, polarity, and readable silkscreen placement.",
        },
        source_criteria: ["common-layout"],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "test-pads",
        requirement: "Requested exposed test pads have diameter at least 1 mm.",
        rule: {
          minimum_mm: 1,
          op: "testpads",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-01",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J1", "side": "left"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J1",
          side: "left",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "physical_constraints",
        critical: false,
        id: "layout-02",
        requirement:
          'Prompt-specific placement/routing constraint: {"maximum_mm": 5, "op": "edge", "ref": "J2", "side": "right"}',
        rule: {
          maximum_mm: 5,
          op: "edge",
          ref: "J2",
          side: "right",
        },
        source_criteria: [
          "req-01",
          "req-02",
          "req-03",
          "req-04",
          "deliverables",
          "common-layout",
        ],
      },
      {
        category: "deliverable_integrity",
        critical: true,
        id: "editable-artifacts",
        requirement:
          "Editable source/native files and parseable schematic/PCB artifacts are present.",
        rule: {
          op: "artifacts",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "readme",
        requirement: "Nonempty README accompanies the generated artifacts.",
        rule: {
          op: "readme",
        },
        source_criteria: ["deliverables"],
      },
      {
        category: "deliverable_integrity",
        critical: false,
        id: "source-replay-and-documentation",
        requirement:
          "Source and generated artifacts agree, and component choices/unresolved requirements are documented.",
        rule: {
          op: "unknown",
          reason:
            "A read-only static audit does not prove source/build reproducibility, exported-netlist freshness, or the semantic completeness of README component/limitation documentation.",
        },
        source_criteria: ["deliverables"],
      },
    ],
    version: "1.0.0",
    weights: {
      connectivity: 30,
      deliverable_integrity: 20,
      functional_requirements: 30,
      physical_constraints: 20,
    },
  },
};
