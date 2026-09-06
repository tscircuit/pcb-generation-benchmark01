# Analog input bank: tscircuit code generation

Final editable entry: `attempt-03/index.circuit.tsx`. Compiled editable schematic and PCB representation: `attempt-03/dist/index/circuit.json`. Views: `attempt-03/dist/index/schematic.svg`, `schematic.png`, `pcb.svg`, and `pcb.png`. Rebuild with the installed `tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine --autorouter-timeout 180s` from the candidate directory.

The design uses six 2-pin 2.54 mm male input headers and one 8-pin 2.54 mm male output header. R1–R18 repeat 10 kohm / 20 kohm / 1 kohm per channel; C1–C6 are 100 nF. All passives use builtin 0805 footprints. TP1–TP6 are 1.5 mm exposed circular output pads and TP7 is ground. Header pin 1 uses the builtin square pad and is identified by the additional connector legend. The source is the editable authority; SVG and PNG are previews. No KiCad, GUI, imported design, manufacturing export, or physical test was used.

Attempts are preserved separately. Attempt 01 failed because the installed core did not register the documented pcbkeepout element. Attempt 02 removed that unsupported element and compiled/routed successfully. Attempt 03 adjusted schematic header positions and J7 box width following schematic-placement suggestions. This was the second and final allowed repair.

The final netlist, schematic-placement, placement, build, and Gerber-derived shorts checks all exited 0. No shorts were reported. The final circuit JSON contains 56 PCB traces, 22 vias, and no generation errors. Geometry audit records the 80 × 50 mm two-layer board, 0.25 mm minimum routed width, capacitor-to-J7 distances of 6.13–8.74 mm, input spacing of 11.2 mm, and header centres 4 mm from their respective edges. Hole geometry is 3.2 mm, with centres 4 mm from adjacent edges; conservative component/copper bounding calculations found 4.38 mm minimum clearance to hole edges.

Unresolved requirements and limitations:
- Although source requests 0.25 mm trace clearance and routing tolerances, compiled board defaults record 0.1 mm pad/trace clearances. A complete measurement of copper-to-copper spacing has not been performed. The requested 0.25 mm clearance is not certified.
- Physical continuity of every net has not been independently measured. The router produced traces without generation errors; this is not a separate continuity certification.
- Compiler warnings remain for seven missing testpoint courtyards and absence of a schematic sheet boundary. These were not hidden. Schematic placement check exits 0 with no issues after the last repair.
- Silkscreen labels are small and some builtin component labels are crowded; PCB and schematic previews were visually inspected, but no exhaustive silkscreen clearance check was run.
- The failed initial candidate's package manifest used an assumed React package version; its actual execution used the installed shared toolchain via node_modules symlink. Later manifests reflect actual installed versions. `installed-versions.json`, `toolchain.package.json`, and `toolchain.bun.lock` preserve toolchain provenance. No dependencies were installed or updated.

Raw command diagnostics are in `../logs`, and `../result.json` summarizes actual outcomes. `completed` describes normal generation completion and does not assert correctness or full benchmark compliance.
