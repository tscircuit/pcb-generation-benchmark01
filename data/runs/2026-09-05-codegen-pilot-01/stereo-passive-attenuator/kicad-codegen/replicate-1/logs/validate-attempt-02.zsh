#!/bin/zsh
kicad-cli sch erc artifacts/attempt-02/attenuator.kicad_sch --output logs/attempt-02-erc.rpt > logs/attempt-02-erc.log 2>&1
kicad-cli sch export netlist artifacts/attempt-02/attenuator.kicad_sch --output artifacts/attempt-02/attenuator.net > logs/attempt-02-netlist.log 2>&1
kicad-cli sch export svg artifacts/attempt-02/attenuator.kicad_sch --output artifacts/attempt-02/schematic-svg > logs/attempt-02-sch-svg.log 2>&1
kicad-cli pcb drc artifacts/attempt-02/attenuator.kicad_pcb --output logs/attempt-02-drc.rpt --schematic-parity > logs/attempt-02-drc.log 2>&1
kicad-cli pcb export svg artifacts/attempt-02/attenuator.kicad_pcb --output artifacts/attempt-02/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/attempt-02-pcb-svg.log 2>&1
