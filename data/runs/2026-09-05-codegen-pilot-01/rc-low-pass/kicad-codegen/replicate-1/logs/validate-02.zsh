#!/bin/zsh
set -x
kicad-cli sch erc artifacts/attempt-02/rc-filter.kicad_sch --format json --output logs/erc-02.json --exit-code-violations
print "ERC_EXIT=$?"
kicad-cli sch export netlist artifacts/attempt-02/rc-filter.kicad_sch --format kicadxml --output artifacts/attempt-02/rc-filter.net
print "NETLIST_EXIT=$?"
kicad-cli sch export svg artifacts/attempt-02/rc-filter.kicad_sch --output artifacts/attempt-02/schematic-svg
print "SCH_EXPORT_EXIT=$?"
kicad-cli pcb drc artifacts/attempt-02/rc-filter.kicad_pcb --format json --output logs/drc-02.json --exit-code-violations --schematic-parity
print "DRC_EXIT=$?"
kicad-cli pcb export svg artifacts/attempt-02/rc-filter.kicad_pcb --output artifacts/attempt-02/pcb-svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts
print "PCB_EXPORT_EXIT=$?"
