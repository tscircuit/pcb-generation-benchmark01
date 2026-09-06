import pcbnew as p,json,re,pathlib
base=pathlib.Path('artifacts/attempt-03');b=p.LoadBoard(str(base/'buttons.kicad_pcb'))
expected={'J1':{'1':'+3V3','2':'GND',**{str(i+2):f'BTN{i}' for i in range(1,5)}}}
for i in range(1,5):
 expected[f'R{i}']={'1':'+3V3','2':f'BTN{i}'};expected[f'C{i}']={'1':f'BTN{i}','2':'GND'};expected[f'SW{i}']={'1':f'BTN{i}','2':'GND'}
actual={f.GetReference():{pad.GetNumber():pad.GetNetname() for pad in f.Pads()} for f in b.GetFootprints()}
assert actual==expected,(actual,expected)
# Parse native exported netlist with a small S-expression parser.
tokens=re.findall(r'"(?:\\.|[^"\\])*"|[^\s()]+|[()]',(base/'buttons.net').read_text());idx=0
def parse():
 global idx
 t=tokens[idx];idx+=1
 if t=='(':
  a=[]
  while tokens[idx]!=')':a.append(parse())
  idx+=1;return a
 return t[1:-1] if t.startswith('"') else t
root=parse();nets=next(x for x in root if isinstance(x,list) and x[0]=='nets');sch={r:{} for r in expected}
for n in nets[1:]:
 name=next(x[1] for x in n if isinstance(x,list) and x[0]=='name')
 for node in [x for x in n if isinstance(x,list) and x[0]=='node']:
  d={x[0]:x[1] for x in node[1:]};sch[d['ref']][d['pin']]=name
assert sch==expected,(sch,expected)
box=b.GetBoardEdgesBoundingBox();dims=[p.ToMM(box.GetWidth()),p.ToMM(box.GetHeight())]
assert abs(dims[0]-50)<.1 and abs(dims[1]-35)<.1
assert b.GetCopperLayerCount()==2
tracks=[t for t in b.GetTracks() if not isinstance(t,p.PCB_VIA)];assert min(p.ToMM(t.GetWidth()) for t in tracks)>=.25
sw=sorted([(f.GetReference(),p.ToMM(f.GetPosition().x),p.ToMM(f.GetPosition().y)) for f in b.GetFootprints() if f.GetReference().startswith('SW')]);assert all(abs(sw[i+1][1]-sw[i][1]-11)<.001 for i in range(3))
report={'schematic_and_board_net_mapping_matches_specification':True,'copper_layers':b.GetCopperLayerCount(),'outline_bounding_box_including_line_width_mm':dims,'switch_x_spacing_mm':11,'minimum_track_width_mm':min(p.ToMM(t.GetWidth()) for t in tracks),'components':len(actual),'switch_duplicated_pad_numbers':{f.GetReference():[pad.GetNumber() for pad in f.Pads()] for f in b.GetFootprints() if f.GetReference().startswith('SW')}}
print(json.dumps(report,indent=2))
