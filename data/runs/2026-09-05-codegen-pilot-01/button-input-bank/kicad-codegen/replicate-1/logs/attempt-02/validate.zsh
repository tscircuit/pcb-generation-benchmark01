#!/bin/zsh
kicad-cli sch export netlist artifacts/attempt-02/buttons.kicad_sch -o artifacts/attempt-02/buttons.net > logs/attempt-02/netlist.log 2>&1
print $? > logs/attempt-02/netlist.exit
kicad-cli sch export svg artifacts/attempt-02/buttons.kicad_sch -o artifacts/attempt-02/schematic-svg > logs/attempt-02/schematic-export.log 2>&1
print $? > logs/attempt-02/schematic-export.exit
kicad-cli sch erc artifacts/attempt-02/buttons.kicad_sch -o logs/attempt-02/erc.rpt > logs/attempt-02/erc.log 2>&1
print $? > logs/attempt-02/erc.exit
kicad-cli pcb drc artifacts/attempt-02/buttons.kicad_pcb -o logs/attempt-02/drc.rpt > logs/attempt-02/drc.log 2>&1
print $? > logs/attempt-02/drc.exit
kicad-cli pcb export svg artifacts/attempt-02/buttons.kicad_pcb -o artifacts/attempt-02/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/attempt-02/pcb-export.log 2>&1
print $? > logs/attempt-02/pcb-export.exit
