#!/bin/zsh
set -x
mkdir -p artifacts/attempt-02
cp artifacts/attempt-01/rc-filter.kicad_sch artifacts/attempt-01/rc-filter.kicad_pcb artifacts/attempt-01/rc-filter.kicad_pro artifacts/attempt-01/rc-filter.kicad_dru artifacts/attempt-01/sym-lib-table artifacts/attempt-01/fp-lib-table artifacts/attempt-01/generate.py artifacts/attempt-02/
python3 - <<'PY'
from pathlib import Path
p=Path('artifacts/attempt-02/generate.py')
s=p.read_text().replace('p.NETINFO_ITEM(b,name)','p.NETINFO_ITEM(b,"/"+name)')
p.write_text(s)
PY
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3.9 artifacts/attempt-02/repair.py
