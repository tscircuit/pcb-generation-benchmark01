# Voltage divider — tscircuit code generation

Final entry: `attempt-03/index.circuit.tsx`. Compile with `tsci build artifacts/attempt-03/index.circuit.tsx --svgs --pcb-png --disable-parts-engine` from this run root. Compiled editable connectivity, schematic and routed PCB data are in `attempt-03/dist/index/circuit.json`; adjacent `schematic.svg`, `pcb.svg`, and `pcb.png` are previews.

Components: J1/J2 are two-pin 2.54 mm through-hole `pinrow2` headers, square pad pin 1. J1 pin 1 VIN, J2 pin 1 VOUT, both pin 2 GND. R1/R2 are generic 10 kohm 0805 resistors. TP1 VOUT and TP2 GND are exposed 1.5 mm circular pads. Connector pin numbers and signal names are included on silkscreen. The board is 30 by 20 mm, two layers; header centres are 3 mm from their respective edges. Unloaded nominal output is 2.5 V for 5 V input.

Method: authored TSX using documented built-in primitives; local tscircuit autorouter; shell only. Toolchain: tsci/tscircuit 0.0.2462, bun 1.3.14. Each attempt has package.json plus a preserved global toolchain lockfile (not a project-specific lock). No manufacturer-specific part procurement was performed.

History: attempt-01 retained initial schematic label overlap; attempt-02 disabled automatic schematic layout and corrected section assignment but retained a trace simplification issue; attempt-03 applied the suggested resistor schematic move. All three original sources and build artifacts remain preserved. Raw check logs and executable validation helper are under `../logs`.

Final netlist, schematic placement, PCB placement and Gerber-based shorts checks exited 0 with no actionable reported violations. Seven routed PCB connections span all three required nets. Independent geometry inspection found 0.25 mm minimum trace width and approximately 0.266529 mm minimum clearance between separate nets, using buffered geometry and 512-sided circle approximations. See `geometry-validation.json` and the raw geometry log.

Limitations: emitted PCB board clearance metadata retained default 0.1 mm trace-to-pad and pad-to-pad values despite the source routingTolerances request; the present physical routes pass the independent 0.25 mm geometry test, but regeneration/editing requires revalidation. Compiler warns that TP1/TP2 lack courtyards and that no explicit schematicsheet drawing area is defined. No physical test or manufacturing export was requested or performed. No separate visual review was performed. Generation completed normally; this is not an independent benchmark correctness score.
