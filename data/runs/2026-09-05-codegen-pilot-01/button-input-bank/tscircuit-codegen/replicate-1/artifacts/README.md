# Four-button digital input board

Selected candidate: `attempt-02/index.circuit.tsx` (editable tscircuit source).
Compiled editable schematic/PCB data: `attempt-02/dist/index/circuit.json`.
Views: `attempt-02/dist/index/schematic.svg`, `schematic.png`, `pcb.svg`, `pcb.png`.
Build with tscircuit 0.0.2462: `tsci build artifacts/attempt-02/index.circuit.tsx --svgs --pcb-png` from the run root.

50 × 35 mm, two copper layers. J1 is a generic 6-position male 2.54 mm through-hole header; square pad identifies pin 1. Header signals are V3V3 (+3V3), GND, BTN1–BTN4. R1–R4 are 0805 10 kohm; C1–C4 are 0805 100 nF. SW1–SW4 are generic normally-open momentary switches using tscircuit's `pushbutton` footprint: 4.5 mm horizontal and 6.5 mm vertical hole spacing, 1 mm holes, 1.5 mm copper pads. Pins 1/2 are one internal terminal and pins 3/4 the other, matching the local footprinter geometry. Switch centres are x=-18,-6,6,18 mm, y=-7 mm. Choose a physical switch with that exact terminal geometry and pairing; no manufacturer part number is claimed.

Method: shell-generated TSX, installed tsci CLI, local autorouter; no GUI, KiCad design creation, publishing, or commits. Installed package metadata and original global Bun lockfile are preserved under `logs/`. No per-candidate install was needed. Explicit 0.25 mm trace widths and trace clearance plus pad/via-to-pad clearance settings are specified. All generated trace wire widths are 0.25 mm. Physical minimum copper clearance has not been independently measured.

Validation: selected attempt's netlist/build and PCB placement checks ran; PCB placement reports zero errors/warnings. Shorts check reports no shorts. A supplementary compiler-connectivity graph check finds one connected group for each of six nets, accounting for switch internal terminal pairs. This is not an independent geometric open-circuit check. Raw commands and diagnostics are under `../logs/`.

Unresolved: schematic-placement reports J1 box too wide (suggested 0.58 versus 1.5); CLI still exits zero. The parts engine automatically associates J1 with JLCPCB C492420 and warns that its footprint differs from the chosen generic header. Treat the header as generic and disregard the automatic sourcing association. No formal schematic sheet is present in attempt 2; its rendered schematic remains available. Manufacturer selection, independent comprehensive clearance DRC, manufacturing exports, and physical testing were not performed.

Attempt history: attempt 1 rejected the +3V3 pin identifier and omitted J1; artifacts retained. Attempt 2 repaired the identifier and clearance settings and is selected. Attempt 3 narrowed the header box, disabled auto sourcing, and added an empty sheet; CLI checks passed but its schematic preview is empty, so it is retained as an unsuccessful visual repair and not selected. No fourth candidate was created. React key warnings are retained in raw logs.
