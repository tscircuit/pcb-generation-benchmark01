# Four-button digital input board

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 50 mm × 35 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use a six-pin header J1 with pins 1 through 6 assigned +3V3, GND, BTN1, BTN2, BTN3, BTN4 respectively.
3. For each channel i from 1 through 4, connect a 10 kohm resistor Ri from +3V3 to BTNi, a 100 nF capacitor Ci from BTNi to GND, and a normally-open momentary switch SWi between BTNi and GND. If a switch has duplicated terminals, map both terminal pairs correctly.
4. Arrange SW1 through SW4 in a left-to-right row with at least 10 mm centre spacing. Label each switch with its BTN signal. Each button must pull only its own signal to GND when pressed; all four channels share the supply and ground.
