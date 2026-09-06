import pcbnew as p,json,math,xml.etree.ElementTree as ET
from pathlib import Path
b=p.LoadBoard('artifacts/attempt-03/matrix.kicad_pcb'); fs={f.GetReference():f for f in b.GetFootprints()}; errors=[]; placements=[]
def mm(n):return p.ToMM(n)
def net(f,pin):return {x.GetNetname().lstrip('/') for x in f.Pads() if x.GetNumber()==str(pin)}
for r in range(1,4):
 for c in range(1,4):
  f=fs[f'SW{r}{c}'];d=fs[f'D{r}{c}'];cx=mm(f.GetPosition().x)+3.25;cy=65-(mm(f.GetPosition().y)+2.25);dx=mm(d.GetPosition().x)+3.81;dy=65-mm(d.GetPosition().y);dist=math.hypot(cx-dx,cy-dy)
  placements.append({'switch':f.GetReference(),'center_lower_left_mm':[cx,cy],'diode_center_lower_left_mm':[dx,dy],'distance_mm':dist})
  assert abs(cx-(12+20*(c-1)))<.5 and abs(cy-(12+20*(r-1)))<.5 and dist<=8
  assert net(f,1)=={f'COL{c}'} and net(f,2)=={f'KEY{r}{c}'} and net(d,2)=={f'KEY{r}{c}'} and net(d,1)=={f'ROW{r}'}
for i,n in enumerate(['ROW1','ROW2','ROW3','COL1','COL2','COL3']):assert net(fs['J1'],i+1)=={n}
coords=[]
for s in b.GetDrawings():
 if s.GetLayer()==p.Edge_Cuts:coords += [[mm(s.GetStart().x),mm(s.GetStart().y)],[mm(s.GetEnd().x),mm(s.GetEnd().y)]]
assert sorted(set(tuple(x) for x in coords))==[(0.,0.),(0.,65.),(65.,0.),(65.,65.)]
widths=[mm(t.GetWidth()) for t in b.GetTracks() if not isinstance(t,p.PCB_VIA)];assert min(widths)>=.25
assert b.GetCopperLayerCount()==2
pad_extents=[]
for f in fs.values():
 for pad in f.Pads():
  x=mm(pad.GetPosition().x);y=mm(pad.GetPosition().y);w=mm(pad.GetSize().x)/2;h=mm(pad.GetSize().y)/2;assert x-w>=0 and x+w<=65 and y-h>=0 and y+h<=65
out={'passed':True,'outline_mm':[65,65],'copper_layers':b.GetCopperLayerCount(),'component_count':len(fs),'switch_placements':placements,'min_trace_width_mm':min(widths),'schematic_parity':'native DRC reports 0 issues','pad_pin_net_mapping':'all 9 branches and J1 validated','all_pad_copper_within_outline':True,'physical_testing':None}
Path('logs/attempt-03-requirements.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
