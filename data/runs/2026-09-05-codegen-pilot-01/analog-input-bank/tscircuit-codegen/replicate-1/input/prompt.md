# Six-channel divided and filtered analog input board

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 80 mm × 50 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use six two-pin input headers J1 through J6, each with pin 1 assigned IN1 through IN6 respectively and pin 2 GND. Use an eight-pin output header J7 with pins 1 through 8 assigned OUT1, OUT2, OUT3, OUT4, OUT5, OUT6, GND, GND. Inputs are nominally in the 0 V to 5 V range; outputs are intended for high-impedance measurement.
3. For each channel i from 1 through 6, connect a 10 kohm resistor from INi to a private divider node DIVi and a 20 kohm resistor from DIVi to GND. Connect a 1 kohm resistor from DIVi to OUTi and a 100 nF capacitor from OUTi to GND. Give all 24 passive components unique references. Do not join divider nodes or output nodes across channels.
4. Provide one exposed test pad at least 1 mm in diameter on each OUTi, plus one on GND, and label them. Place each output capacitor within 10 mm of J7 centre.
5. Arrange J1 through J6 along the top edge with centres within 6 mm of it and at least 11 mm centre spacing. Place J7 within 6 mm of the bottom edge, measured from its centre.
6. Add four nonplated 3.2 mm mounting holes centred 4 mm from each adjacent board edge. Keep copper and component bodies at least 1 mm from each hole edge.
