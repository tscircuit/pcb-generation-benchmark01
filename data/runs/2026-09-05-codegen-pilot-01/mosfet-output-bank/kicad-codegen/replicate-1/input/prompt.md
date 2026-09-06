# Four-channel protected MOSFET output board

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 70 mm × 50 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use J1 with pin 1 +12V and pin 2 GND. Use J2 with pins 1 through 5 assigned GND, CTRL1, CTRL2, CTRL3, CTRL4. Control inputs are 0 V or 3.3 V. External loads connect between +12V and each switched output; assume at most 100 mA per channel.
3. For each channel i from 1 through 4, connect an N-channel MOSFET Qi source to GND and drain to OUTi. Connect CTRLi through a 100 ohm resistor to the gate and a 100 kohm resistor from gate to source. Use MOSFETs with VDS rating at least 30 V and on-resistance specified at a gate voltage no greater than 3.3 V; document the selected part and pin mapping.
4. Use four two-pin output headers J3 through J6: pin 1 is +12V and pin 2 is OUT1 through OUT4 respectively. Place a flyback diode on each channel with cathode at +12V and anode at OUTi; choose diodes rated for at least 30 V reverse voltage and 100 mA forward current. Document their parts and polarity.
5. Add a 10 uF capacitor rated at least 25 V and a 100 nF capacitor rated at least 25 V between +12V and GND within 7 mm of J1 centre. Use at least 0.5 mm trace width on +12V, GND, and switched load paths.
6. Arrange J3 through J6 along the right edge with centres within 6 mm of that edge and at least 10 mm centre spacing. Place each flyback diode within 8 mm of its output header centre.
