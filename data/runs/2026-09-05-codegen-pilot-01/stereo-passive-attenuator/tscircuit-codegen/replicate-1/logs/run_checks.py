import subprocess,json,pathlib,sys,time
root=pathlib.Path.cwd();attempt=sys.argv[1];wd=root/'artifacts'/attempt
cmds=[['tsci','check','netlist','index.circuit.tsx'],['tsci','check','schematic-placement','index.circuit.tsx'],['tsci','check','placement','index.circuit.tsx'],['tsci','build','index.circuit.tsx','--svgs','--pcb-png','--disable-parts-engine','--autorouter-timeout','120s'],['tsci','check','shorts','dist/index/circuit.json']]
results=[]
for cmd in cmds:
 name=cmd[2] if cmd[1]=='check' else 'build';log=root/'logs'/f'{attempt}-{name}.log'
 with log.open('w') as f:
  f.write('$ '+' '.join(cmd)+'\n');f.flush()
  try:r=subprocess.run(cmd,cwd=wd,stdout=f,stderr=subprocess.STDOUT,timeout=170);code=r.returncode
  except subprocess.TimeoutExpired:code=124
 results.append({'check':name,'command':cmd,'exit_code':code,'log':str(log.relative_to(root))})
 print(name,code,flush=True)
 (root/'logs'/f'{attempt}-checks.json').write_text(json.dumps(results,indent=2))
