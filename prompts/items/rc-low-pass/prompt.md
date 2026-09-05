# Single-stage RC low-pass filter

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 35 mm × 25 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use J1 with pin 1 SIGNAL_IN and pin 2 GND, and J2 with pin 1 SIGNAL_OUT and pin 2 GND. This is a passive filter for signals between 0 V and 3.3 V.
3. Connect R1 = 1 kohm from SIGNAL_IN to SIGNAL_OUT and C1 = 100 nF from SIGNAL_OUT to GND. Do not connect SIGNAL_IN directly to SIGNAL_OUT.
4. Place C1 within 5 mm of J2, measured between footprint centres. Place J1 within 5 mm of the left edge and J2 within 5 mm of the right edge, measured from footprint centres.
