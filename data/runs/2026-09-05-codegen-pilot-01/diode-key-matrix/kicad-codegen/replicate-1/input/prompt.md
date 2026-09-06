# Nine-key diode-isolated matrix

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 65 mm × 65 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use a six-pin header J1 with pins 1 through 6 assigned ROW1, ROW2, ROW3, COL1, COL2, COL3. The external controller supplies scanning and pull-ups; do not add a controller, supply connector, or pull-up resistors.
3. Create nine normally-open momentary switches SW11 through SW33 in a three-row, three-column grid. For each position (r,c), connect COLc to one terminal of SWrc, the other switch terminal to the anode of a dedicated diode Drc, and the diode cathode to ROWr. Each switch-diode junction must be its own net.
4. Use small-signal switching diodes with visible cathode markings. Record diode part numbers and footprint pin mappings. If switches have duplicated terminals, map the terminal pairs correctly.
5. Place switch centres at x = 12, 32, and 52 mm for columns 1 through 3 and y = 12, 32, and 52 mm for rows 1 through 3, measured from the lower-left corner. Tolerance is 0.5 mm in each axis. Mark each switch RrCc on silkscreen.
6. Place each diode within 8 mm of its switch centre. Keep all three row nets and all three column nets distinct, connected only through their specified switch-diode branches.
