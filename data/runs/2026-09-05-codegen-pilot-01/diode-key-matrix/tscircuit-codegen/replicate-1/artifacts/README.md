# Nine-key diode-isolated matrix — tscircuit pilot

Final editable entry: `attempt-03/index.circuit.tsx`. Compiled schematic and PCB data: `attempt-03/dist/index/circuit.json`; previews: `schematic.svg`, `pcb.svg`, and `pcb.png` in that directory. The TSX is the editable design source and circuit JSON retains the routed PCB geometry. Run `tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine` from the attempt directory with tscircuit 0.0.2462. Installed package versions and the existing global Bun lockfile are preserved under `../logs/`.

The board is 65 × 65 mm with two copper layers. Coordinates in the source are relative to the board centre; adding 32.5 gives lower-left coordinates. Switch centres are exactly the specified 12/32/52 mm grid. Every diode is 6 mm from its switch centre. Routes use 0.25 mm trace width.

J1 is a 1×6 through-hole 2.54 mm header: pin 1 ROW1, 2 ROW2, 3 ROW3, 4 COL1, 5 COL2, 6 COL3. Pin 1 is square in the compiled footprint and signal labels are on silkscreen. There are no pull-ups, power connector, or controller.

D11–D33 use 1N4148W small-signal switching diodes, SOD-123 footprint. Pin 1 is cathode (left pad) and pin 2 anode (right pad); explicit pinLabels override tscircuit's default diode numbering. Each cathode has a K marker and bar. Each switch output goes to its diode anode via its own KEYrc net, and cathodes connect to the corresponding ROWr.

SW11–SW33 use the documented generic four-terminal normally-open momentary pushbutton footprint: 4.5 mm horizontal and 6.5 mm vertical lead centre spacing, 1.0 mm drills, 1.5 mm copper diameter. Pins 1/2 are the permanently connected left pair, and pins 3/4 are the permanently connected right pair. The left pair connects to COLc and right pair to KEYrc. Select a physical tactile switch matching that geometry and pair mapping; a manufacturer-specific switch part number was not selected. Each switch has an RrCc silkscreen label.

## Validation and unresolved requirements

Netlist, schematic placement, PCB placement, and final Gerber-derived shorts checks were run. They report no netlist errors, no final placement issues, and no shorts. A supplemental route-metadata continuity audit covers all 15 named nets; this is not independent geometric opens verification. There are 45 routed trace objects and 20 vias, with no reported missing-route error.

**The final design does not fully meet the requested 0.25 mm copper clearance.** The build reports one pad-to-trace clearance of 0.227 mm between `pcb_plated_hole_37` and the J1 pin 3 / D32 cathode route. The CLI returns zero despite this DRC error, so zero exit status is not treated as a clean DRC result. All other unmeasured metrics remain null. The schematic also has a missing-sheet styling warning, and React emits list-key warnings. Physical testing and manufacturing outputs were not requested or performed.

Attempt 01 is preserved unchanged: generated routes, header box styling issue, and default board clearance settings because the initial grouped tolerance prop was ineffective. Attempt 02 corrects the documented tolerance props and header box width; this exposes the 0.227 mm clearance error. Attempt 03 increases autorouter trace clearance margin, but the error remains. The permitted two repairs are exhausted. All candidates and raw diagnostics remain available. Generation used only tscircuit TSX and its local autorouter through shell tools, with no GUI, KiCad design creation, publishing, or reference designs.
