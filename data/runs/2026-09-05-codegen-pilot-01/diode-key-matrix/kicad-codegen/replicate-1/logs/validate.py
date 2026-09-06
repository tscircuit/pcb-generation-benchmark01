import subprocess,json,sys
from pathlib import Path
n=sys.argv[1];base=Path('artifacts')/n;out=[]
commands=[['kicad-cli','sch','export','netlist',str(base/'matrix.kicad_sch'),'-o',str(base/'matrix.net')],['kicad-cli','sch','export','svg',str(base/'matrix.kicad_sch'),'-o',str(base/'schematic-svg')],['kicad-cli','sch','erc',str(base/'matrix.kicad_sch'),'-o',f'logs/{n}-erc.rpt'],['kicad-cli','pcb','drc',str(base/'matrix.kicad_pcb'),'-o',f'logs/{n}-drc.rpt'],['kicad-cli','pcb','export','svg',str(base/'matrix.kicad_pcb'),'-o',str(base/'pcb-svg'),'-l','F.Cu,B.Cu,F.Silkscreen,Edge.Cuts']]
for i,cmd in enumerate(commands):
 r=subprocess.run(cmd,capture_output=True,text=True);log=f'logs/{n}-validation-{i+1}.log';Path(log).write_text('$ '+' '.join(cmd)+'\n'+r.stdout+r.stderr);out.append({'command':cmd,'exit_code':r.returncode,'log':log});print(log,r.returncode,r.stdout,r.stderr)
Path(f'logs/{n}-validation.json').write_text(json.dumps(out,indent=2))
