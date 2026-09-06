import subprocess,json,time,pathlib,sys
root=pathlib.Path(__file__).resolve().parent.parent
attempt=sys.argv[1]
commands=[['tsci','check','netlist','index.circuit.tsx'],['tsci','check','schematic-placement','index.circuit.tsx'],['tsci','check','placement','index.circuit.tsx'],['tsci','build','index.circuit.tsx','--svgs','--pcb-png','--disable-parts-engine','--autorouter-timeout','120s']]
for cmd in commands:
 name=cmd[2] if cmd[1]=='check' else 'build'
 p=root/'logs'/f'{attempt}-{name}.log'
 with open(p,'w') as f:
  f.write('$ '+' '.join(cmd)+'\n'); f.flush()
  try:
   s=subprocess.run(cmd,cwd=root/'artifacts'/attempt,stdout=f,stderr=subprocess.STDOUT,timeout=180)
   code=s.returncode
  except subprocess.TimeoutExpired: code=124
 with open(root/'logs'/f'{attempt}-commands.jsonl','a') as f:f.write(json.dumps({'command':cmd,'exit_code':code,'log':str(p.relative_to(root))})+'\n')
 print(name,code,flush=True)
