#!/bin/zsh
kicad-cli sch erc artifacts/attempt-03/attenuator.kicad_sch --output logs/attempt-03-erc.rpt > logs/attempt-03-erc.log 2>&1
kicad-cli sch export netlist artifacts/attempt-03/attenuator.kicad_sch --output artifacts/attempt-03/attenuator.net > logs/attempt-03-netlist.log 2>&1
kicad-cli sch export svg artifacts/attempt-03/attenuator.kicad_sch --output artifacts/attempt-03/schematic-svg > logs/attempt-03-sch-svg.log 2>&1
kicad-cli pcb drc artifacts/attempt-03/attenuator.kicad_pcb --output logs/attempt-03-drc.rpt --schematic-parity > logs/attempt-03-drc.log 2>&1
kicad-cli pcb export svg artifacts/attempt-03/attenuator.kicad_pcb --output artifacts/attempt-03/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/attempt-03-pcb-svg.log 2>&1
