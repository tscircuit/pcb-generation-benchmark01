#!/bin/zsh
kicad-cli sch erc artifacts/attempt-01/attenuator.kicad_sch --output logs/attempt-01-erc.rpt > logs/attempt-01-erc.log 2>&1
kicad-cli sch export netlist artifacts/attempt-01/attenuator.kicad_sch --output artifacts/attempt-01/attenuator.net > logs/attempt-01-netlist.log 2>&1
kicad-cli sch export svg artifacts/attempt-01/attenuator.kicad_sch --output artifacts/attempt-01/schematic-svg > logs/attempt-01-sch-svg.log 2>&1
kicad-cli pcb drc artifacts/attempt-01/attenuator.kicad_pcb --output logs/attempt-01-drc.rpt --schematic-parity > logs/attempt-01-drc.log 2>&1
kicad-cli pcb export svg artifacts/attempt-01/attenuator.kicad_pcb --output artifacts/attempt-01/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/attempt-01-pcb-svg.log 2>&1
