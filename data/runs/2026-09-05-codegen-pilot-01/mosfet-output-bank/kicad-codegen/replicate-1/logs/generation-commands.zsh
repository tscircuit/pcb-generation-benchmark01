# Commands used during generation, recorded for reproducibility. Run from this run directory.
# Each candidate's output was preserved separately.
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 artifacts/attempt-01/generate.py > logs/attempt-01-generation.log 2>&1
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 artifacts/attempt-02/generate.py > logs/attempt-02-generation.log 2>&1
kicad-cli sch export netlist artifacts/attempt-02/board.kicad_sch -o artifacts/attempt-02/board.net > logs/attempt-02-netlist.log 2>&1
kicad-cli sch erc artifacts/attempt-02/board.kicad_sch -o logs/attempt-02-erc.json --format json > logs/attempt-02-erc-command.log 2>&1
kicad-cli pcb drc artifacts/attempt-02/board.kicad_pcb -o logs/attempt-02-drc.json --format json --schematic-parity > logs/attempt-02-drc-command.log 2>&1
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 artifacts/attempt-03/generate.py > logs/attempt-03-generation.log 2>&1
zsh logs/validate-attempt-03.zsh
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 logs/audit.py > logs/geometry-connectivity-audit-command.log 2>&1
