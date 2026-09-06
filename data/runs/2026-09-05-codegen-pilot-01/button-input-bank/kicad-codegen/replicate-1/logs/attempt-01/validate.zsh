#!/bin/zsh
kicad-cli sch export netlist artifacts/attempt-01/buttons.kicad_sch -o artifacts/attempt-01/buttons.net > logs/attempt-01/netlist.log 2>&1
print $? > logs/attempt-01/netlist.exit
kicad-cli sch export svg artifacts/attempt-01/buttons.kicad_sch -o artifacts/attempt-01/schematic-svg > logs/attempt-01/schematic-export.log 2>&1
print $? > logs/attempt-01/schematic-export.exit
kicad-cli sch erc artifacts/attempt-01/buttons.kicad_sch -o logs/attempt-01/erc.rpt > logs/attempt-01/erc.log 2>&1
print $? > logs/attempt-01/erc.exit
kicad-cli pcb drc artifacts/attempt-01/buttons.kicad_pcb -o logs/attempt-01/drc.rpt > logs/attempt-01/drc.log 2>&1
print $? > logs/attempt-01/drc.exit
kicad-cli pcb export svg artifacts/attempt-01/buttons.kicad_pcb -o artifacts/attempt-01/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/attempt-01/pcb-export.log 2>&1
print $? > logs/attempt-01/pcb-export.exit
