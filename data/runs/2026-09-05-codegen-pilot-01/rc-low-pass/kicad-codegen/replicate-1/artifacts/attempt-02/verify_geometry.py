from pathlib import Path
import pcbnew as p,xml.etree.ElementTree as E,json,math
out=Path(__file__).resolve().parent;b=p.LoadBoard(str(out/'rc-filter.kicad_pcb'))
fps={f.GetReference():f for f in b.GetFootprints()};xy=lambda f:[p.ToMM(f.GetPosition().x),p.ToMM(f.GetPosition().y)]
points=[]
for s in b.GetDrawings():
 if s.GetLayer()==p.Edge_Cuts:
  points += [[p.ToMM(q.x),p.ToMM(q.y)] for q in [s.GetStart(),s.GetEnd()]]
lo=[min(t[i] for t in points) for i in [0,1]];hi=[max(t[i] for t in points) for i in [0,1]]
nets={n.attrib['name']:sorted((a.attrib['ref'],a.attrib['pin']) for a in n.findall('node')) for n in E.parse(out/'rc-filter.net').findall('./nets/net')}
expected={'/SIGNAL_IN':[('J1','1'),('R1','1')],'/SIGNAL_OUT':[('C1','1'),('J2','1'),('R1','2')],'/GND':[('C1','2'),('J1','2'),('J2','2')]}
centres={r:xy(f) for r,f in fps.items()}
inside={r: all(50<=p.ToMM(pad.GetPosition().x)-p.ToMM(pad.GetSize().x)/2 and p.ToMM(pad.GetPosition().x)+p.ToMM(pad.GetSize().x)/2<=85 and 50<=p.ToMM(pad.GetPosition().y)-p.ToMM(pad.GetSize().y)/2 and p.ToMM(pad.GetPosition().y)+p.ToMM(pad.GetSize().y)/2<=75 for pad in f.Pads()) for r,f in fps.items()}
d={'outline_dimensions_mm':[hi[i]-lo[i] for i in [0,1]],'copper_layers':b.GetCopperLayerCount(),'footprint_origins_mm':centres,'j1_left_edge_mm':centres['J1'][0]-lo[0],'j2_right_edge_mm':hi[0]-centres['J2'][0],'c1_to_j2_origin_distance_mm':math.dist(centres['C1'],centres['J2']),'c1_to_j2_pad_midpoint_mm':math.dist(centres['C1'],[82,61.27]),'minimum_track_width_mm':min(p.ToMM(t.GetWidth()) for t in b.GetTracks()),'all_pads_inside_outline':inside,'schematic_nets':nets,'net_topology_matches':nets==expected}
assert d['outline_dimensions_mm']==[35,25] and d['copper_layers']==2 and d['minimum_track_width_mm']>=.25 and d['c1_to_j2_origin_distance_mm']<=5 and nets==expected and all(inside.values())
print(json.dumps(d,indent=2))
