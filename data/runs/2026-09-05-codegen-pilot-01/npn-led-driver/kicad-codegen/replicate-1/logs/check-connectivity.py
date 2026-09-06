import json,re,pathlib,math,pcbnew as p
base=pathlib.Path('artifacts/attempt-03')
def parse(s):
 t=re.findall(r'"(?:\\.|[^"\\])*"|[^\s()]+|[()]',s);i=0
 def rec():
  nonlocal i
  if t[i]=='(':
   i+=1;r=[]
   while t[i]!=')':r.append(rec())
   i+=1;return r
  x=t[i];i+=1;return json.loads(x) if x.startswith('"') else x
 return rec()
def child(n,k):return next(v for v in n if isinstance(v,list) and v[0]==k)
tree=parse(pathlib.Path('logs/attempt-03.net').read_text());sn={}
for net in child(tree,'nets')[1:]:
 name=child(net,'name')[1].lstrip('/')
 sn[name]=sorted((child(node,'ref')[1],child(node,'pin')[1]) for node in net if isinstance(node,list) and node[0]=='node')
b=p.LoadBoard(str(base/'driver.kicad_pcb'));bn={}
for f in b.GetFootprints():
 for pad in f.Pads():bn.setdefault(pad.GetNetname(),[]).append((f.GetReference(),pad.GetNumber()))
bn={k:sorted(v) for k,v in bn.items()}
expected=json.loads((base/'pin-map.json').read_text());en={}
for r,ps in expected.items():
 for pn,n in ps.items():en.setdefault(n,[]).append((r,pn))
en={k:sorted(v) for k,v in en.items()}
fps={f.GetReference():f for f in b.GetFootprints()}
def pos(f):v=f.GetPosition();return p.ToMM(v.x),p.ToMM(v.y)
def distance(a,c):return math.hypot(a[0]-c[0],a[1]-c[1])
rect=b.GetBoardEdgesBoundingBox();d={'normalized_schematic_matches_pcb':sn==bn,'normalized_schematic_matches_prompt_pin_map':sn==en,'normalization':'Remove leading / from schematic local net names; native parity reports naming mismatch.','pin_count':sum(map(len,bn.values())),'net_count':len(bn),'board_dimensions_mm':[p.ToMM(rect.GetWidth()),p.ToMM(rect.GetHeight())],'copper_layers':b.GetCopperLayerCount(),'led_centre_spacing_mm':distance(pos(fps['D1']),pos(fps['D2'])),'c1_distance_from_header_pad_centroid_mm':distance(pos(fps['C1']),(54,61.81)),'minimum_track_width_mm':min(p.ToMM(t.GetWidth()) for t in b.GetTracks() if not isinstance(t,p.PCB_VIA)),'schematic_pin_groups':sn,'pcb_pin_groups':bn}
print(json.dumps(d,indent=2));assert sn==bn==en
