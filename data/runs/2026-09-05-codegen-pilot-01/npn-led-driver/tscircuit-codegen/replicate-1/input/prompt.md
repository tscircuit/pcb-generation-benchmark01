# Two-channel transistor LED driver

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 45 mm × 30 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use J1 with pins 1 through 4 assigned +5V, GND, CTRL1, CTRL2. Control inputs are 0 V or 3.3 V relative to GND.
3. For each channel i from 1 through 2, use an NPN transistor Qi with emitter to GND, collector to the cathode of LED Di, and base connected to CTRLi through a 4.7 kohm resistor. Connect a 100 kohm resistor between base and emitter. Connect +5V through a 1 kohm resistor to the anode of Di.
4. Use red 0805 LEDs and NPN transistors in SOT-23 packages. Name the transistor part and verify its base/collector/emitter mapping against the selected footprint in the README. Give every resistor a unique reference.
5. Place the two LEDs in a row with at least 10 mm centre spacing. Add C1 = 100 nF between +5V and GND within 5 mm of J1 centre.
