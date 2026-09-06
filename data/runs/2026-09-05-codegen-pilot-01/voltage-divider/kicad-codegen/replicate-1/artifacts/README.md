# Voltage divider — KiCad code-generation pilot

Open `attempt-02/divider.kicad_pro`, or open the native `.kicad_sch` and `.kicad_pcb` files independently. `generate.py` uses the Python 3.9 bundled with KiCad 10.0.6 and pcbnew. Standard installed KiCad symbols are embedded in the schematic; the library tables point to this machine’s KiCad SharedSupport directory and must be adjusted on another machine. Preview exports are in `pcb.svg` and `schematic-svg/`.

The 30 × 20 mm board has two copper layers. J1 and J2 are 2.54 mm through-hole headers, each 4 mm from the specified edge. R1/R2 are equal 10 kohm 0805 resistors. TP1 and TP2 are exposed 1.5 mm pads. All nets are routed using twelve 0.30 mm front-copper track segments; the board/project rules require at least 0.25 mm clearance. Pin 1 is VIN at J1 and VOUT at J2; pin 2 is GND. The test pads carry VOUT/GND respectively.

Attempt-01 passed ERC and physical DRC, but had two testpoint BOM-attribute parity warnings. Attempt-02 aligns schematic testpoint BOM attributes with the native footprints. Final ERC, DRC with schematic parity, native exports, pin-set comparison, dimensions, layer count, header positions, track widths, and test-pad size checks pass with no violations or unconnected pads. Exact native reports, including default ignored-check lists, are retained.

The first custom verification script could not parse KiCad’s multiline netlist format. Its failure log is retained; `verify-v2.py` uses an S-expression parser and successfully checks all ten pin assignments. This verifier correction did not modify the native design. Headless pcbnew emits a wxApp assertion diagnostic even though generation and verification return exit code zero; the exact messages are retained.

No physical testing or independent visual review was performed. Components are generic library parts. This parent-generated run reused orchestration context after the subagent thread limit and must not be treated as a fresh-context benchmark run. Both original candidates remain unchanged.
