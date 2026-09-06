import pcbnew as p,json,math,xml.etree.ElementTree as ET
from pathlib import Path
base=Path('artifacts/attempt-02');b=p.LoadBoard(str(base/'hub.kicad_pcb'))
mm=lambda x:x/1e6
fps={f.GetReference():f for f in b.GetFootprints()}
def center(f):
 ps=list(f.Pads());return (sum(mm(q.GetPosition().x) for q in ps)/len(ps),sum(mm(q.GetPosition().y) for q in ps)/len(ps))
centers={k:center(v) for k,v in fps.items()}
edges=[q for q in b.GetDrawings() if q.GetLayer()==p.Edge_Cuts];xs=[mm(q.GetStart().x) for q in edges];ys=[mm(q.GetStart().y) for q in edges]
capdist={str(i):math.dist(centers['J'+str(i)],centers['C'+str(i)]) for i in [1,2,3]}
gaps={}
for key in ['JP1','JP2']:
 pads=sorted(fps[key].Pads(),key=lambda q:q.GetNumber());gaps[key]=mm(pads[1].GetPosition().x-pads[0].GetPosition().x-(pads[0].GetSize().x+pads[1].GetSize().x)/2)
tracks=[t for t in b.GetTracks() if not isinstance(t,p.PCB_VIA)]
netlist=ET.parse(base/'hub.net.xml');conn={n.attrib['name']:sorted((x.attrib['ref'],x.attrib['pin']) for x in n.findall('node')) for n in netlist.findall('.//nets/net')}
d={'outline_mm':[max(xs)-min(xs),max(ys)-min(ys)],'copper_layers':b.GetCopperLayerCount(),'connector_geometric_centers_mm':{k:v for k,v in centers.items() if k.startswith('J') and not k.startswith('JP')},'connector_distance_from_required_edge_mm':{'J1':centers['J1'][0],'J2':45-centers['J2'][0],'J3':centers['J3'][1]},'capacitor_distance_from_corresponding_connector_center_mm':capdist,'solder_jumper_copper_gap_mm':gaps,'minimum_trace_width_mm':min(mm(t.GetWidth()) for t in tracks),'trace_segments':len(tracks),'vias':sum(isinstance(t,p.PCB_VIA) for t in b.GetTracks()),'schematic_nets':conn,'physical_testing':None}
print(json.dumps(d,indent=2))
