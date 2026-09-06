#!/bin/zsh
runroot=${0:A:h:h}
label=$1
shift
print -r -- "$(date -u +%FT%TZ) ${(q)@}" >> "$runroot/logs/commands.txt"
"$@" > "$runroot/logs/$label.txt" 2>&1
rc=$?
print -r -- "$rc" > "$runroot/logs/$label.exit-code"
cat "$runroot/logs/$label.txt"
exit $rc
