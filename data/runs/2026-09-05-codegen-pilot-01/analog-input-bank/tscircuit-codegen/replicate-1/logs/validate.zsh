#!/bin/zsh
attempt=$1
cd "${0:A:h}/../artifacts/$attempt" || exit 2
for check in netlist schematic-placement placement; do
  print -r -- "tsci check $check index.circuit.tsx" >> ../../logs/commands.txt
  tsci check "$check" index.circuit.tsx > "../../logs/$attempt-$check.txt" 2>&1
  print "$?" > "../../logs/$attempt-$check.exit"
done
print 'tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine --autorouter-timeout 180s' >> ../../logs/commands.txt
tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine --autorouter-timeout 180s > "../../logs/$attempt-build.txt" 2>&1
print "$?" > "../../logs/$attempt-build.exit"
