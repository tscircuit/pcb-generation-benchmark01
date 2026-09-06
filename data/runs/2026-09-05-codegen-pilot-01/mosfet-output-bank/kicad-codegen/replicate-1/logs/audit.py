import pcbnew as p,json,math
from pathlib import Path
root=Path(__file__).resolve().parent.parent
b=p.LoadBoard(str(root/'artifacts/attempt-03/board.kicad_pcb'))
f={x.GetReference():x for x in b.GetFootprints()}
def center(ref):
 pads=list(f[ref].Pads());return (sum(p.ToMM(z.GetPosition().x) for z in pads)/len(pads),sum(p.ToMM(z.GetPosition().y) for z in pads)/len(pads))
def pos(ref):v=f[ref].GetPosition();return p.ToMM(v.x),p.ToMM(v.y)
edge=[x for x in b.GetDrawings() if x.GetLayer()==p.Edge_Cuts];points=[q for e in edge for q in [e.GetStart(),e.GetEnd()]]
bounds=[min(p.ToMM(q.x) for q in points),min(p.ToMM(q.y) for q in points),max(p.ToMM(q.x) for q in points),max(p.ToMM(q.y) for q in points)]
required={}
for t in b.GetTracks():
 if type(t)==p.PCB_TRACK:required.setdefault(t.GetNetname(),[]).append(p.ToMM(t.GetWidth()))
d={'board_bounds_mm':bounds,'board_size_mm':[bounds[2]-bounds[0],bounds[3]-bounds[1]],'copper_layers':b.GetCopperLayerCount(),'min_track_width_by_net_mm':{n:min(w) for n,w in required.items()},'capacitor_distance_to_J1_center_mm':{r:math.dist(pos(r),center('J1')) for r in ['C1','C2']},'output_header_distance_to_right_edge_mm':{r:bounds[2]-center(r)[0] for r in ['J3','J4','J5','J6']},'output_header_adjacent_spacing_mm':[math.dist(center('J'+str(i)),center('J'+str(i+1))) for i in range(3,6)],'diode_distance_to_output_header_center_mm':{'D'+str(i):math.dist(pos('D'+str(i)),center('J'+str(i+2))) for i in range(1,5)},'pad_net_mapping':{r:{z.GetNumber():z.GetNetname() for z in fp.Pads()} for r,fp in f.items()},'footprint_count':len(f),'track_segment_count':sum(type(x)==p.PCB_TRACK for x in b.GetTracks()),'via_count':sum(type(x)==p.PCB_VIA for x in b.GetTracks())}
(root/'logs/geometry-connectivity-audit.json').write_text(json.dumps(d,indent=2));print(json.dumps(d,indent=2))
