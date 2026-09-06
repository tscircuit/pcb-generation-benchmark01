import sys,json,itertools
sys.path.insert(0,'artifacts/validation-dependencies')
from shapely.geometry import Point,LineString,box
j=json.load(open('artifacts/attempt-03/dist/index/circuit.json')); copper=[];ports={}; parent={}
def root(x):
 parent.setdefault(x,x)
 if parent[x]!=x:parent[x]=root(parent[x])
 return parent[x]
for t in j:
 if t['type']=='pcb_trace':
  net=t['connection_name']
  for p in t['connectsTo']:ports[p]=net
  a,b=t['connectsTo'];parent[root(a)]=root(b)
  r=t['route']
  for a,b in zip(r,r[1:]):
   if a['route_type']==b['route_type']=='wire' and a['layer']==b['layer']:copper.append((net,a['layer'],LineString([(a['x'],a['y']),(b['x'],b['y'])]).buffer(a['width']/2,resolution=128),t['pcb_trace_id']))
  for p in r:
   if p['route_type']=='via':
    for l in ['top','bottom']:copper.append((net,l,Point(p['x'],p['y']).buffer(p['via_diameter']/2,resolution=128),t['pcb_trace_id']+' via'))
for t in j:
 if t['type'] in ['pcb_smtpad','pcb_plated_hole']:
  x,y=t['x'],t['y'];net=ports[t['pcb_port_id']]
  if t['shape'] in ['rect','circular_hole_with_rect_pad']:
   w=t.get('width',t.get('rect_pad_width'));h=t.get('height',t.get('rect_pad_height'));g=box(x-w/2,y-h/2,x+w/2,y+h/2)
  else:g=Point(x,y).buffer(t.get('radius',t.get('outer_diameter',0)/2),resolution=128)
  for l in t.get('layers',[t.get('layer')]):copper.append((net,l,g,t.get('pcb_smtpad_id',t.get('pcb_plated_hole_id'))))
minimum=min((a[2].distance(b[2]),a[3],b[3],a[1]) for a,b in itertools.combinations(copper,2) if a[0]!=b[0] and a[1]==b[1])
by_net={n:[p for p,v in ports.items() if v==n] for n in set(ports.values())}
out={'minimum_separate_net_copper_clearance_mm':minimum[0],'nearest_pair':minimum[1:],'clearance_0_25_pass':minimum[0]>=0.25-0.0001,'routed_net_connectivity':{n:len(set(root(p) for p in ps))==1 for n,ps in by_net.items()},'trace_min_width_mm':min(p['width'] for t in j if t['type']=='pcb_trace' for p in t['route'] if p['route_type']=='wire'),'method':'Shapely buffered wire segments, circular pads/vias approximated with 512-sided polygons, pad outlines. Connectivity from compiled route endpoints.'}
print(json.dumps(out,indent=2));json.dump(out,open('artifacts/geometry-validation.json','w'),indent=2)
