#!/bin/zsh
attempt=$1
base=artifacts/$attempt/driver
kicad-cli sch export netlist "$base.kicad_sch" -o "logs/$attempt.net" > "logs/$attempt-netlist.log" 2>&1
print $? > "logs/$attempt-netlist.exit"
kicad-cli sch export svg "$base.kicad_sch" -o "artifacts/$attempt/schematic-svg/" > "logs/$attempt-sch-export.log" 2>&1
print $? > "logs/$attempt-sch-export.exit"
kicad-cli sch erc "$base.kicad_sch" -o "logs/$attempt-erc.rpt" --exit-code-violations > "logs/$attempt-erc.log" 2>&1
print $? > "logs/$attempt-erc.exit"
kicad-cli pcb drc "$base.kicad_pcb" -o "logs/$attempt-drc.rpt" --exit-code-violations > "logs/$attempt-drc.log" 2>&1
print $? > "logs/$attempt-drc.exit"
kicad-cli pcb export svg "$base.kicad_pcb" -o "artifacts/$attempt/pcb-svg/" -l F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > "logs/$attempt-pcb-export.log" 2>&1
print $? > "logs/$attempt-pcb-export.exit"
