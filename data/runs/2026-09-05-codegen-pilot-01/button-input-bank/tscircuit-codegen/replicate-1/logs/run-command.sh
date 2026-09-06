#!/bin/zsh
set +e
run_dir=/Users/ankan/Documents/Codex/2026-09-05/cr/outputs/pcb-generation-benchmark/data/runs/2026-09-05-codegen-pilot-01/button-input-bank/tscircuit-codegen/replicate-1
label=$1
shift
print -r -- "$(date -u +%FT%TZ) $*" >> "$run_dir/logs/commands.log"
"$@" > "$run_dir/logs/$label.log" 2>&1
rc=$?
print -r -- "$rc" > "$run_dir/logs/$label.exit"
tail -30 "$run_dir/logs/$label.log"
exit $rc
