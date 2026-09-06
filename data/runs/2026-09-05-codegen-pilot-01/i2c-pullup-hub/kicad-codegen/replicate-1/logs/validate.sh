#!/bin/zsh
attempt=$1
out=artifacts/$attempt
kicad-cli sch erc --format json --exit-code-violations -o logs/$attempt-erc.json $out/hub.kicad_sch > logs/$attempt-erc.log 2>&1
print $? > logs/$attempt-erc.exit
kicad-cli sch export netlist --format kicadxml -o $out/hub.net.xml $out/hub.kicad_sch > logs/$attempt-netlist.log 2>&1
print $? > logs/$attempt-netlist.exit
kicad-cli sch export svg -o $out/schematic-svg/ $out/hub.kicad_sch > logs/$attempt-sch-export.log 2>&1
print $? > logs/$attempt-sch-export.exit
kicad-cli pcb drc --format json --schematic-parity --exit-code-violations -o logs/$attempt-drc.json $out/hub.kicad_pcb > logs/$attempt-drc.log 2>&1
print $? > logs/$attempt-drc.exit
kicad-cli pcb export svg -l F.Cu,B.Cu,F.Silkscreen,Edge.Cuts -o $out/pcb-svg/ $out/hub.kicad_pcb > logs/$attempt-pcb-export.log 2>&1
print $? > logs/$attempt-pcb-export.exit
