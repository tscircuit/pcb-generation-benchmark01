from pathlib import Path
import pcbnew as p
out=Path(__file__).resolve().parent
b=p.LoadBoard(str(out/'rc-filter.kicad_pcb'))
for n in b.GetNetInfo().NetsByNetcode().values():
 if n.GetNetname() in ['SIGNAL_IN','SIGNAL_OUT','GND']:
  print('Rename',n.GetNetname(),'to','/'+n.GetNetname());n.SetNetname('/'+n.GetNetname())
p.SaveBoard(str(out/'rc-filter.kicad_pcb'),b)
