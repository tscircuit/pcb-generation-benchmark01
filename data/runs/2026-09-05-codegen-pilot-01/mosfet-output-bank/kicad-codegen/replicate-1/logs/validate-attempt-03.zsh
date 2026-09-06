#!/bin/zsh
setopt PIPE_FAIL
kicad-cli sch export netlist artifacts/attempt-03/board.kicad_sch -o artifacts/attempt-03/board.net > logs/attempt-03-netlist.log 2>&1
print $? > logs/attempt-03-netlist.exit
kicad-cli sch erc artifacts/attempt-03/board.kicad_sch -o logs/attempt-03-erc.json --format json --exit-code-violations > logs/attempt-03-erc-command.log 2>&1
print $? > logs/attempt-03-erc.exit
kicad-cli pcb drc artifacts/attempt-03/board.kicad_pcb -o logs/attempt-03-drc.json --format json --schematic-parity --exit-code-violations > logs/attempt-03-drc-command.log 2>&1
print $? > logs/attempt-03-drc.exit
kicad-cli sch export svg artifacts/attempt-03/board.kicad_sch -o artifacts/attempt-03/schematic-svg/ > logs/attempt-03-sch-svg.log 2>&1
print $? > logs/attempt-03-sch-svg.exit
kicad-cli pcb export svg artifacts/attempt-03/board.kicad_pcb -o artifacts/attempt-03/board.svg --layers F.Cu,B.Cu,F.Silkscreen,Edge.Cuts --mode-single --fit-page-to-board --exclude-drawing-sheet > logs/attempt-03-pcb-svg.log 2>&1
print $? > logs/attempt-03-pcb-svg.exit
