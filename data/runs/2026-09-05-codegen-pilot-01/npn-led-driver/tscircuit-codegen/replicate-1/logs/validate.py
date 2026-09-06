import subprocess,os,json,time
from pathlib import Path
root=Path.cwd(); attempt=root/'artifacts'/os.environ.get('ATTEMPT','attempt-01'); results=[]
for name,args in [('netlist',['check','netlist']),('schematic-placement',['check','schematic-placement']),('placement',['check','placement']),('build',['build','--svgs','--pcb-png','--disable-parts-engine','--autorouter-timeout','120s'])]:
 cmd=['tsci',*args,'index.circuit.tsx']; log=root/'logs'/f'{attempt.name}-{name}.log'
 with log.open('w') as f:
  f.write('COMMAND: '+repr(cmd)+'\n');f.flush()
  try:r=subprocess.run(cmd,cwd=attempt,stdout=f,stderr=subprocess.STDOUT,timeout=180);code=r.returncode
  except subprocess.TimeoutExpired:code=124
 results.append({'check':name,'exit_code':code,'log':str(log.relative_to(root))}); print(name,code,flush=True)
 (root/'logs'/f'{attempt.name}-validation.json').write_text(json.dumps(results,indent=2))
