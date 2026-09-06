# Stereo AC-coupled attenuator

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 50 mm × 30 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use J1 with pins 1 through 3 assigned LEFT_IN, GND, RIGHT_IN, and J2 with pins 1 through 3 assigned LEFT_OUT, GND, RIGHT_OUT.
3. For each of the left and right channels, connect the input through a nonpolar 1 uF ceramic capacitor to an internal node, connect a 10 kohm resistor from that node to the output, and connect another 10 kohm resistor from the output to GND. Give every component a unique reference.
4. Keep the left and right signal nets separate and share only GND. Place the left channel components in the top half and the right channel components in the bottom half of the board, measured by footprint centres.
5. Place J1 within 5 mm of the left edge and J2 within 5 mm of the right edge, measured from footprint centres. Add separate exposed test pads at least 1 mm in diameter for LEFT_OUT, RIGHT_OUT, and GND.
