# I2C connector and pull-up hub

Create an editable schematic and a fully placed and routed two-layer PCB for the circuit below. Provide the editable design source/native files and a short README identifying the entry files, component choices, and any unresolved requirements. A schematic generated from editable source is acceptable. Use millimetres for all dimensions. Use 2.54 mm through-hole headers for connectors, 0805 resistors and capacitors unless otherwise specified, and clearly mark connector pin 1 and signal names on silkscreen. Choose footprints that match the component pin mapping. Keep all components inside the board outline. Use at least 0.25 mm copper clearance and 0.25 mm signal trace width. Route every required connection; do not leave unrouted nets. Do not substitute a rendered picture for editable design files. Manufacturing exports and physical testing are not required.

## Circuit and layout requirements

1. Use a rectangular 45 mm × 35 mm board outline (dimension tolerance 0.1 mm) with two copper layers.
2. Use three four-pin headers J1, J2, and J3. On each header, pins 1 through 4 are +3V3, GND, SDA, SCL. Connect corresponding signals across all three headers.
3. Connect +3V3 through R1 = 4.7 kohm and a two-pad solder jumper JP1 in series to SDA. Connect +3V3 through R2 = 4.7 kohm and a separate two-pad solder jumper JP2 in series to SCL. Each jumper must have two isolated copper pads with a solderable gap and no default copper short.
4. Add C1, C2, and C3, each 100 nF between +3V3 and GND, within 5 mm of the corresponding connector centre. Mark JP1 as SDA PU and JP2 as SCL PU.
5. Place J1 within 5 mm of the left edge, J2 within 5 mm of the right edge, and J3 within 5 mm of the top edge, measured from footprint centres. This board contains no controller or peripheral IC.
