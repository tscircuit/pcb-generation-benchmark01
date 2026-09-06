import json,collections
from pathlib import Path
p=Path('artifacts/attempt-02/dist/index/circuit.json');d=json.loads(p.read_text())
by=lambda t:[x for x in d if x['type']==t]
ports={x['source_port_id']:x['pcb_port_id'] for x in by('pcb_port')}
parent={x:x for x in ports.values()}
def root(x):
 while parent[x]!=x:
  parent[x]=parent[parent[x]];x=parent[x]
 return x
def join(a,b):parent[root(a)]=root(b)
for t in by('pcb_trace'):
 pp=t.get('connectsTo',[])
 for x in pp[1:]:join(pp[0],x)
for t in by('source_component_internal_connection'):
 pp=[ports[x] for x in t['source_port_ids']]
 for x in pp[1:]:join(pp[0],x)
nets=collections.defaultdict(set)
for t in by('source_trace'):
 for n in t.get('connected_source_net_ids',[]):nets[n].update(t['connected_source_port_ids'])
summary={}
for n in by('source_net'):
 pp=nets[n['source_net_id']]
 summary[n['name']]={'source_port_count':len(pp),'routed_connected_groups_including_internal_switch_pairs':len({root(ports[x]) for x in pp})}
widths=[q['width'] for t in by('pcb_trace') for q in t['route'] if q['route_type']=='wire']
result={'method':'Compiler route connectsTo graph plus source internal switch terminal pairs; not independent geometric continuity DRC','nets':summary,'all_nets_connected_in_route_graph':all(x['routed_connected_groups_including_internal_switch_pairs']==1 for x in summary.values()),'min_trace_width_mm':min(widths),'max_trace_width_mm':max(widths),'pcb_trace_count':len(by('pcb_trace')),'via_count':len(by('pcb_via')),'board':by('pcb_board'),'errors':[x for x in d if 'error' in x['type']],'minimum_physical_copper_clearance_mm':None}
print(json.dumps(result,indent=2))
