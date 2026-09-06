import json,math,itertools,pathlib
p=pathlib.Path('dist/index/circuit.json'); j=json.loads(p.read_text())
def elems(t):return [x for x in j if x['type']==t]
src={x['source_component_id']:x['name'] for x in elems('source_component')}
ports={x['source_port_id']:src[x['source_component_id']]+'.'+str(x['pin_number']) for x in elems('source_port')}
pp={x['pcb_port_id']:x for x in elems('pcb_port')}
nets={'J1.1':'SIGNAL_IN','R1.1':'SIGNAL_IN','R1.2':'SIGNAL_OUT','C1.1':'SIGNAL_OUT','J2.1':'SIGNAL_OUT','J1.2':'GND','J2.2':'GND','C1.2':'GND'}
pnet={k:nets[ports[v['source_port_id']]] for k,v in pp.items()}
parent={k:k for k in pp}
def root(x):
 while parent[x]!=x:x=parent[x]
 return x
shapes=[]
for t in elems('pcb_trace'):
 a,b=t['connectsTo']; assert pnet[a]==pnet[b]; parent[root(a)]=root(b)
 r=t['route']; assert math.dist((r[0]['x'],r[0]['y']),(pp[a]['x'],pp[a]['y']))<1e-3 or math.dist((r[0]['x'],r[0]['y']),(pp[b]['x'],pp[b]['y']))<1e-3
 for u,v in zip(r,r[1:]):
  if u['route_type']==v['route_type']=='wire' and u['layer']==v['layer']:shapes.append((pnet[a],u['layer'],[(u['x'],u['y']),(v['x'],v['y'])],max(u['width'],v['width'])/2,t['pcb_trace_id']))
for t in elems('pcb_smtpad')+elems('pcb_plated_hole'):
 x,y=t['x'],t['y']; net=pnet[t['pcb_port_id']]
 if t['shape']=='circle':pts=[(x,y)]; rad=t['outer_diameter']/2
 else:
  w=t.get('width',t.get('rect_pad_width'))/2; h=t.get('height',t.get('rect_pad_height'))/2
  pts=[(x-w,y-h),(x+w,y-h),(x+w,y+h),(x-w,y+h)];rad=0
 for layer in t.get('layers',[t.get('layer')]):shapes.append((net,layer,pts,rad,t.get('pcb_smtpad_id',t.get('pcb_plated_hole_id'))))
for t in elems('pcb_via'):
 tr=next(z for z in elems('pcb_trace') if z['pcb_trace_id']==t['pcb_trace_id'])
 for l in t['layers']:shapes.append((pnet[tr['connectsTo'][0]],l,[(t['x'],t['y'])],t['outer_diameter']/2,t['pcb_via_id']))
def pointseg(p,a,b):
 dx,dy=b[0]-a[0],b[1]-a[1]; s=dx*dx+dy*dy
 u=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/s)) if s else 0
 return math.dist(p,(a[0]+u*dx,a[1]+u*dy))
def edges(p):return list(zip(p,p[1:]+p[:1])) if len(p)>2 else [(p[0],p[-1])]
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def segdist(a,b,c,d):
 if cross(a,b,c)*cross(a,b,d)<0 and cross(c,d,a)*cross(c,d,b)<0:return 0
 return min(pointseg(a,c,d),pointseg(b,c,d),pointseg(c,a,b),pointseg(d,a,b))
def inside(p,q):return len(q)>2 and min(x[0] for x in q)<=p[0]<=max(x[0] for x in q) and min(x[1] for x in q)<=p[1]<=max(x[1] for x in q)
def dist(a,b):
 if any(inside(p,b[2]) for p in a[2]) or any(inside(p,a[2]) for p in b[2]):return -a[3]-b[3]
 return min(segdist(u,v,w,z) for u,v in edges(a[2]) for w,z in edges(b[2]))-a[3]-b[3]
pairs=[(dist(a,b),a[4],b[4]) for a,b in itertools.combinations(shapes,2) if a[0]!=b[0] and a[1]==b[1]]
b=elems('pcb_board')[0];comps={src[x['source_component_id']]:x for x in elems('pcb_component')}
widths=[z['width'] for x in elems('pcb_trace') for z in x['route'] if z['route_type']=='wire']
report={'board_mm':[b['width'],b['height']],'copper_layers':b['num_layers'],'j1_left_edge_center_mm':comps['J1']['center']['x']+b['width']/2,'j2_right_edge_center_mm':b['width']/2-comps['J2']['center']['x'],'c1_j2_centers_mm':math.dist(tuple(comps['C1']['center'].values()),tuple(comps['J2']['center'].values())),'min_route_width_mm':min(widths),'min_distinct_net_copper_clearance_mm':min(pairs)[0],'closest_copper_pair':min(pairs)[1:],'pcb_trace_count':len(elems('pcb_trace')),'via_count':len(elems('pcb_via')),'nets_connected':{n:len({root(k) for k in pp if pnet[k]==n})==1 for n in set(pnet.values())},'circuit_error_records':[x for x in j if 'error' in x['type']]}
print(json.dumps(report,indent=2));pathlib.Path('geometry-audit.json').write_text(json.dumps(report,indent=2))
assert min(widths)>=.25 and min(pairs)[0]>=.25-1e-6 and all(report['nets_connected'].values())
