#!/bin/zsh
set +e
attempt=$1
cd "artifacts/$attempt" || exit 1
for check in netlist schematic-placement placement; do
  print -r -- "tsci check $check index.circuit.tsx" >> ../../logs/commands.txt
  tsci check "$check" index.circuit.tsx > "../../logs/$attempt-$check.txt" 2>&1
  print -r -- "$?" > "../../logs/$attempt-$check.exit"
done
print -r -- 'tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine --autorouter-timeout 120s' >> ../../logs/commands.txt
tsci build index.circuit.tsx --svgs --pcb-png --disable-parts-engine --autorouter-timeout 120s > "../../logs/$attempt-build.txt" 2>&1
print -r -- "$?" > "../../logs/$attempt-build.exit"
