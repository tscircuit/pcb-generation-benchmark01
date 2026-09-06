#!/bin/zsh
# Historical generation command record; do not rerun against preserved attempts.
# Run cwd: this run's root directory.
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 artifacts/attempt-01/generate.py > logs/attempt-01-generation.log 2>&1
zsh logs/validate-attempt-01.zsh
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 artifacts/attempt-02/generate.py > logs/attempt-02-generation.log 2>&1
zsh logs/validate-attempt-02.zsh
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 artifacts/attempt-03/generate.py > logs/attempt-03-generation.log 2>&1
zsh logs/validate-attempt-03.zsh
/Users/ankan/Applications/KiCad/KiCad.app/Contents/Frameworks/Python.framework/Versions/3.9/bin/python3 logs/check-requirements.py > logs/attempt-03-requirements.json 2> logs/attempt-03-requirements.stderr
