import pcbnew as p,json,pathlib,re
D=pathlib.Path('artifacts/attempt-03');b=p.LoadBoard(str(D/'attenuator.kicad_pcb'));fps={f.GetReference():f for f in b.GetFootprints()}
P=lambda v:[round(p.ToMM(v.x),6),round(p.ToMM(v.y),6)]
outline=[s for s in b.GetDrawings() if s.GetLayer()==p.Edge_Cuts];pts=[P(pt) for s in outline for pt in [s.GetStart(),s.GetEnd()]]
width=max(v[0] for v in pts)-min(v[0] for v in pts);height=max(v[1] for v in pts)-min(v[1] for v in pts)
expected={'J1':['LEFT_IN','GND','RIGHT_IN'],'J2':['LEFT_OUT','GND','RIGHT_OUT'],'C1':['LEFT_IN','LEFT_AC'],'R1':['LEFT_AC','LEFT_OUT'],'R2':['LEFT_OUT','GND'],'C2':['RIGHT_IN','RIGHT_AC'],'R3':['RIGHT_AC','RIGHT_OUT'],'R4':['RIGHT_OUT','GND'],'TP1':['LEFT_OUT'],'TP2':['RIGHT_OUT'],'TP3':['GND']}
actual={r:{pad.GetNumber():pad.GetNetname().lstrip('/') for pad in f.Pads()} for r,f in fps.items()}
# Parse exported native schematic netlist independently of generator metadata.
tokens=re.findall(r'"(?:\\.|[^"\\])*"|[()]|[^\s()]+',(D/'attenuator.net').read_text());it=iter(tokens)
def parse():
 out=[]
 for t in it:
  if t==')':return out
  out.append(parse() if t=='(' else json.loads(t) if t.startswith('"') else t)
 return out
root=parse()[0];netsect=next(x for x in root if isinstance(x,list) and x and x[0]=='nets');sch={}
for n in netsect[1:]:
 name=next(x[1] for x in n if isinstance(x,list) and x[0]=='name').lstrip('/')
 for node in [x for x in n if isinstance(x,list) and x[0]=='node']:
  fields={x[0]:x[1] for x in node[1:] if isinstance(x,list)};sch.setdefault(fields['ref'],{})[fields['pin']]=name
exp={r:{str(i):n for i,n in enumerate(ns,1)} for r,ns in expected.items()}
res={'outline_mm':[width,height],'copper_layers':b.GetCopperLayerCount(),'schematic_connectivity_matches_spec':sch==exp,'pcb_connectivity_matches_spec':actual==exp,'left_component_centres_top_half':all(P(fps[r].GetPosition())[1]<115 for r in ['C1','R1','R2']),'right_component_centres_bottom_half':all(P(fps[r].GetPosition())[1]>115 for r in ['C2','R3','R4']),'connector_edge_offsets_mm':{'J1':P(fps['J1'].GetPosition())[0]-100,'J2':150-P(fps['J2'].GetPosition())[0]},'minimum_track_width_mm':min(p.ToMM(t.GetWidth()) for t in b.GetTracks() if type(t)==p.PCB_TRACK),'test_pad_diameters_mm':{r:P(next(iter(fps[r].Pads())).GetSize()) for r in ['TP1','TP2','TP3']},'footprint_centres_mm':{r:P(f.GetPosition()) for r,f in fps.items()},'physical_testing':None}
print(json.dumps(res,indent=2));assert sch==exp and actual==exp and width==50 and height==30
