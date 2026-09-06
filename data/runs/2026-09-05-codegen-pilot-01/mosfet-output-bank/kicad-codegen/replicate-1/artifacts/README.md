# Four-channel protected MOSFET board

Final entry files: `attempt-03/board.kicad_pro`, `attempt-03/board.kicad_sch`, and `attempt-03/board.kicad_pcb`. Open the project in KiCad 10. The schematic embeds standard symbols; local library tables point to this machine's standard KiCad libraries and may need path changes on another machine. Native footprints are embedded in the board. `attempt-03/generate.py` is the complete editable generator and router source. SVGs are inspection exports, not design substitutes.

The board is 70 × 50 mm, with F.Cu and B.Cu routing. Signal traces are 0.25 mm; +12V, GND and OUT traces are 0.5 mm. The project minimum clearance is 0.25 mm. Through vias use 0.6 mm copper / 0.3 mm drill. All 24 components are on the front, and all required pad connections are routed. A shell-only Python generator uses installed KiCad pcbnew APIs, standard footprint libraries, embedded standard schematic symbols and a two-layer grid router. Named electrical labels connect the schematic components; there are no pictorial-only connections.

## Components and mapping

- Q1–Q4: Alpha & Omega AO3400A, SOT-23. Pin 1 gate, pin 2 source/GND, pin 3 drain/OUTi. VDS 30 V; maximum RDS(on) 48 milliohm at VGS 2.5 V. See [manufacturer datasheet](https://www.aosmd.com/sites/default/files/res/datasheets/AO3400A.pdf), verified during generation.
- D1–D4: Vishay SS14 Schottky, SMA (DO-214AC), 40 V reverse / 1 A average forward current. Pad 1 cathode to +12V, pad 2 anode to OUTi. The standard footprint cathode bar marks pad 1. See [manufacturer SS12–SS16 datasheet](https://www.vishay.com/docs/88746/ss12.pdf), verified during generation.
- R1/R3/R5/R7: 100 ohm 0805, CTRL to gate. R2/R4/R6/R8: 100 kohm 0805, gate to GND.
- C1: 10 uF, at least 25 V, X7R ceramic 0805. C2: 100 nF, 50 V, X7R ceramic 0805. Procurement part numbers and effective capacitance under DC bias are not assessed. Both capacitor centres are about 5.2–5.7 mm from the J1 pad-pair centre.
- All connectors use through-hole 2.54 mm vertical pin headers. J1 pin 1 +12V, pin 2 GND. J2 pin 1 GND, pins 2–5 CTRL1–CTRL4. J3–J6 pin 1 +12V, pin 2 OUT1–OUT4. Connector pin numbers and net names are on front silkscreen; square pads identify pin 1.

J3–J6 centres are 5 mm from the right edge, spaced 11 mm apart. Diode centres are approximately 6.13 mm from their respective header centres. External loads connect between each output header's +12V and OUT terminal, up to the requested 100 mA/channel.

## Validation and retained history

Final native schematic netlist/SVG export and PCB SVG export succeeded. KiCad 10.0.6 ERC: 0 violations. PCB DRC including schematic parity: 0 violations, 0 unconnected items, 0 parity findings. Exact commands, exit codes and raw JSON reports are in `../logs/validate-attempt-03.zsh` and `../logs/attempt-03-*`. Independent board geometry, pad connectivity and trace-width measurements are in `../logs/geometry-connectivity-audit.json`.

Attempt 01 preserves the failed initial generator (incorrect generic MOSFET library lookup). Attempt 02 preserves its repaired generator and complete routed board, along with its ERC/DRC reports: no copper violations or unconnected items, but library links, net-name parity and silkscreen issues. Attempt 03 is the second and final preserved repair; it resolves those findings. No previous attempt was overwritten.

No manufacturing exports, hardware tests, thermal measurements, transient simulation, or assembly validation were performed. These outcomes remain unmeasured. ERC/DRC results describe the checks run; they do not establish physical performance. All generation used shell/API work without GUI operations, tscircuit, evaluator references, or other runs.
