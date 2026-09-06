# MOSFET output bank — tscircuit code generation pilot

Final editable entry: `attempt-03/index.circuit.tsx`. Its compiled design is `attempt-03/dist/index/circuit.json`, with `schematic.svg`, `pcb.svg`, and `pcb.png` in that directory. Rebuild using installed tsci 0.0.2462 and bun 1.3.14: `tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine` from the attempt directory. Package manifest, installed package versions, and the existing global Bun lockfile are retained. `node_modules` symlinks refer to the preinstalled global packages; no package installation occurred.

Generation completed normally, but the design does **not** meet every requirement. Final PCB placement and shorts checks pass. The build reports nine trace-clearance errors and two via-to-trace clearance errors, including a 0.111 mm reported trace gap, below the required 0.25 mm. Schematic-placement exits zero while reporting MOSFET box padding and trace simplification issues. These remain unresolved after the allowed two repairs. Build exit zero does not mean error-free output. This is a partial-compliance result.

## Component choices

- Q1–Q4: Alpha & Omega AO3400A, 30 V N-channel MOSFET, RDS(on) maximum 48 milliohms at VGS=2.5 V. SOT-23 physical pin 1 gate, 2 source, 3 drain. Final source uses explicit three-pin chip boxes so the physical mapping is reflected in the schematic and netlist. Source: https://www.aosmd.com/res/data_sheets/AO3400A.pdf and https://www.aosmd.com/products/mosfets/low-voltage-mosfets-12v-30v/ao3400a
- D1–D4: Diodes Incorporated 1N5819HW, SOD-123, 40 V reverse and 1 A forward rating. Footprint pin 1 is the banded cathode connected to V12; pin 2 is anode connected to OUTi. Source: https://www.diodes.com/datasheet/download/1N5819HW.pdf
- Odd-numbered resistors: 100 ohm; even-numbered resistors: 100 kohm. All use 0805 footprints.
- C1: 10 uF, 25 V minimum, 0805 ceramic; C2: 100 nF, 25 V minimum, 0805 ceramic. Voltage ratings are explicit in final source; exact capacitor manufacturer part numbers and DC-bias curves were not selected.
- J1–J6: through-hole 2.54 mm headers. J1 is 1:+12V/2:GND; J2 is 1:GND/2:CTRL1/3:CTRL2/4:CTRL3/5:CTRL4; J3–J6 are 1:+12V/2:OUT1–OUT4. V12 denotes +12V. Explicit pin-1 legends and per-pin labels are included on silkscreen.

## Measured compiled geometry

70 × 50 mm, two copper layers, 24 components, 41 routed traces, 27 vias. All wire widths in compiled routes are 0.5 mm. C1 and C2 centres are respectively 5.099 and 5.831 mm from J1. Output header centres are 4 mm from the right edge, with 12 mm consecutive spacing; each flyback diode is 6 mm from its header. The placement check reports all components within the board. All 14 electrical net groups are covered by the route endpoint graph; this is not an independent physical copper continuity check.

## Preserved attempts and validation

1. `attempt-01`: initial MOSFET primitive candidate, produced PCB/schematic. Netlist check did not report errors but showed built-in drain/gate aliases inconsistent with the intended AO3400A physical pin numbering. Capacitor voltage prop was also corrected later. Routing clearance errors retained.
2. `attempt-02`: changed to explicit chip boxes, corrected capacitor rating property, specified the documented diode, and adjusted schematic placement. An invalid schematic pin arrangement object prevented MOSFET creation; full build diagnostics and partial artifacts retained. Preliminary checks nevertheless exited zero.
3. `attempt-03`: corrected pin arrangement to arrays. All 24 devices now present and MOSFET gate/source/drain connectivity confirmed in the netlist. Remaining clearance and schematic issues retained.

Raw command lines, exit codes and complete stdout/stderr for build and validation are under `../logs/`; `commands.jsonl` records execution durations. The initial shorts invocation used the wrong output path and failed; its log is preserved, followed by a successful corrected-path invocation. `attempt-03/inspection.json` records direct measurements and exact compiled error records. Documentation discovery and initial setup tool output reside in the task transcript rather than raw shell logs. All generation and checking used shell commands and local tscircuit packages; no GUI, KiCad design creation, publishing, commits, or benchmark reference designs were used. Independent manufacturing DRC, physical testing and electrical simulation were not performed.
