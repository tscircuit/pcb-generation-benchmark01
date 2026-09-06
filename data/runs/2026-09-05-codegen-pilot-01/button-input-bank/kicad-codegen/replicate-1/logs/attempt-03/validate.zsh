#!/bin/zsh
kicad-cli sch export netlist artifacts/attempt-03/buttons.kicad_sch -o artifacts/attempt-03/buttons.net > logs/attempt-03/netlist.log 2>&1
print $? > logs/attempt-03/netlist.exit
kicad-cli sch export svg artifacts/attempt-03/buttons.kicad_sch -o artifacts/attempt-03/schematic-svg > logs/attempt-03/schematic-export.log 2>&1
print $? > logs/attempt-03/schematic-export.exit
kicad-cli sch erc artifacts/attempt-03/buttons.kicad_sch -o logs/attempt-03/erc.rpt > logs/attempt-03/erc.log 2>&1
print $? > logs/attempt-03/erc.exit
kicad-cli pcb drc artifacts/attempt-03/buttons.kicad_pcb -o logs/attempt-03/drc.rpt > logs/attempt-03/drc.log 2>&1
print $? > logs/attempt-03/drc.exit
kicad-cli pcb export svg artifacts/attempt-03/buttons.kicad_pcb -o artifacts/attempt-03/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/attempt-03/pcb-export.log 2>&1
print $? > logs/attempt-03/pcb-export.exit
