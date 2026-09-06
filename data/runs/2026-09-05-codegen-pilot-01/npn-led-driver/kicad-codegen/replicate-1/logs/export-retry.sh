#!/bin/zsh
for attempt in attempt-01 attempt-02 attempt-03; do
kicad-cli pcb export svg artifacts/$attempt/driver.kicad_pcb --mode-single --fit-page-to-board --exclude-drawing-sheet -o artifacts/$attempt/pcb.svg -l F.Cu,B.Cu,F.Silkscreen,Edge.Cuts > logs/$attempt-pcb-export-retry.log 2>&1
print $? > logs/$attempt-pcb-export-retry.exit
done
