# Two-channel transistor LED driver

Final entry: `attempt-03/driver.kicad_pro`, with editable `driver.kicad_sch` and fully routed `driver.kicad_pcb`. The final folder includes the selected standard KiCad symbols and footprints and relative library tables. `generate.py` is the editable generation source (requires the installed KiCad Python runtime and standard library paths shown in the script). SVG exports provide inspection views; native files are authoritative.

The method used direct KiCad schematic text generation and the KiCad 10.0.6 Python PCB API, with a two-layer grid router written for this run. No GUI, external board designs, or benchmark references were used. Three distinct candidates are retained. Attempt 01 had clearance, silkscreen, drill-spacing and schematic configuration/grid issues. Attempt 02 repaired these. Attempt 03 added symbol-to-footprint UUID links, complete footprint identifiers, a specific transistor ordering code and portable local libraries. Original reports and unsuccessful export commands are preserved; the export invocation was subsequently corrected without changing candidate files.

## Circuit and parts

- J1: 1×4, 2.54 mm through-hole header; pin 1 +5V, 2 GND, 3 CTRL1, 4 CTRL2. Square pad 1 and explicit `1 +5V` silkscreen identify orientation; other signals are on silkscreen.
- Q1/Q2: onsemi MMBT3904LT1G, SOT-23. Datasheet page 1 identifies pin 1 base, pin 2 emitter, pin 3 collector. The selected KiCad `Q_NPN_BEC` symbol has precisely this numbering; the `Package_TO_SOT_SMD:SOT-23` footprint has 1 and 2 on the two-pad side and 3 on the opposite side. Base is BASE1/BASE2, emitter GND and collector COL1/COL2. Manufacturer source: https://www.onsemi.com/pdf/datasheet/mmbt3904lt1-d.pdf (preserved under logs, with extracted text).
- D1/D2: red 0805 LEDs, standard `LED_0805_2012Metric`; pad 1 cathode to collector, pad 2 anode to 1 kΩ resistor. A specific LED manufacturer ordering code was not selected.
- R1/R4: 1 kΩ +5V-to-anode resistors. R2/R5: 4.7 kΩ CTRL-to-base resistors. R3/R6: 100 kΩ base-to-GND resistors. All are standard 0805.
- C1: 100 nF, standard 0805, between +5V and GND.

Outline centre lines are (50,50) to (95,80) mm: 45×30 mm; copper layers F.Cu/B.Cu. Edge bounding box including the 0.05 mm stroke measures 45.05×30.05 mm. D1/D2 centres are 15 mm apart. C1 centre is 4.00045 mm from the centroid of J1's four pads. Tracks are 0.25 mm wide; configured clearance is 0.25 mm. All components are inside the outline. No manufacturing or physical tests were requested or performed.

## Validation and unresolved issues

Final ERC: 0 errors, 0 warnings. Standard PCB DRC: 0 violations, 0 unconnected pads, 0 footprint errors. Native schematic netlist and SVG exports and PCB SVG export succeeded. Raw logs are in the run-level `logs/` folder, notably `attempt-03-erc.rpt`, `attempt-03-drc.rpt`, and `attempt-03-connectivity.json`.

The additional native `--schematic-parity` check failed with 28 net-name warnings: schematic local labels export as `/NET`, while PCB nets are named `NET`. An independent pin-group comparison, removing only this leading slash, confirms all 28 pins on all 10 nets exactly match both the schematic and intended pin map. This is a real naming inconsistency, retained because the maximum two repaired candidates were already used. Synchronizing the project in KiCad needs attention to these names.

The schematic uses named connections in a component grid. Inspection of the exported SVG found value/label overlap around transistors and LEDs; readability is imperfect even though connectivity is present and ERC passes. No circuit simulation or physical verification was performed. The final result is completed generation with documented limitations, not an unconditional correctness claim.
