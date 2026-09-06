#!/bin/zsh
set -x
kicad-cli sch erc --severity-all --exit-code-violations -o logs/attempt-03-erc.rpt artifacts/attempt-03/indicator.kicad_sch
print "ERC_EXIT=$?"
kicad-cli sch export netlist -o artifacts/attempt-03/indicator.net artifacts/attempt-03/indicator.kicad_sch
print "NETLIST_EXIT=$?"
kicad-cli sch export svg -o artifacts/attempt-03/schematic-svg/ artifacts/attempt-03/indicator.kicad_sch
print "SCH_SVG_EXIT=$?"
kicad-cli pcb drc --severity-all --schematic-parity --exit-code-violations -o logs/attempt-03-drc.rpt artifacts/attempt-03/indicator.kicad_pcb
print "DRC_EXIT=$?"
kicad-cli pcb export svg -l F.Cu,B.Cu,F.Silkscreen,Edge.Cuts -o artifacts/attempt-03/pcb.svg artifacts/attempt-03/indicator.kicad_pcb
print "PCB_SVG_EXIT=$?"
