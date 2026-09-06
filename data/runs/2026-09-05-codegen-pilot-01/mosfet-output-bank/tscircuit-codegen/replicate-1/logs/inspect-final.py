import json,collections,math
from pathlib import Path
p=Path('dist/index/circuit.json');a=json.loads(p.read_text());bytype=lambda t:[e for e in a if e['type']==t]
sc={e['source_component_id']:e for e in bytype('source_component')};pc={sc[e['source_component_id']]['name']:e for e in bytype('pcb_component')}
def distance(a,b):return math.hypot(pc[a]['center']['x']-pc[b]['center']['x'],pc[a]['center']['y']-pc[b]['center']['y'])
# Compare source electrical membership with route endpoint connectivity. This is endpoint graph coverage, not full copper continuity DRC.
parent={}
def find(x):
 parent.setdefault(x,x)
 if parent[x]!=x:parent[x]=find(parent[x])
 return parent[x]
def union(xs):
 if xs:
  r=find(xs[0])
  for x in xs[1:]:parent[find(x)]=r
for e in bytype('source_trace'):union(e.get('connected_source_port_ids',[])+e.get('connected_source_net_ids',[]))
nets=collections.defaultdict(list)
for e in bytype('pcb_port'):nets[find(e['source_port_id'])].append(e['pcb_port_id'])
parent={}
for e in bytype('pcb_trace'):union(e.get('connectsTo',[]))
coverage=[{'port_count':len(v),'route_endpoint_groups':len(set(find(p) for p in v))} for v in nets.values()]
widths=[n['width'] for e in bytype('pcb_trace') for n in e['route'] if n['route_type']=='wire']
out={'board':bytype('pcb_board')[0],'components':len(sc),'trace_count':len(bytype('pcb_trace')),'via_count':len(bytype('pcb_via')),'trace_width_min_mm':min(widths),'trace_width_max_mm':max(widths),'capacitor_distance_from_J1_mm':{n:distance(n,'J1') for n in ['C1','C2']},'diode_distance_to_header_mm':{f'D{i}':distance(f'D{i}',f'J{i+2}') for i in range(1,5)},'header_right_edge_distance_mm':{f'J{i}':35-pc[f'J{i}']['center']['x'] for i in range(3,7)},'output_header_spacing_mm':[distance(f'J{i}',f'J{i+1}') for i in range(3,6)],'route_endpoint_coverage':coverage,'endpoint_coverage_pass':all(x['route_endpoint_groups']==1 for x in coverage),'copper_continuity_independent_check':None,'errors':[e for e in a if 'error' in e['type']]}
Path('inspection.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
