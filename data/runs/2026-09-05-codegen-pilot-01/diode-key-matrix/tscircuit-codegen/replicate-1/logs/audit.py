import json,sys,collections,math
p=sys.argv[1];j=json.load(open(p));by=lambda t:[x for x in j if x['type']==t]
sc={x['source_component_id']:x['name'] for x in by('source_component')}; ports={x['source_port_id']:x for x in by('source_port')}
netnames={x['source_net_id']:x['name'] for x in by('source_net')};members=collections.defaultdict(set)
for t in by('source_trace'):
 for n in t['connected_source_net_ids']:members[netnames[n]].update(t['connected_source_port_ids'])
parent={p:p for p in ports}
def find(x):
 if parent[x]!=x:parent[x]=find(parent[x])
 return parent[x]
def union(xs):
 for x in xs[1:]:parent[find(x)]=find(xs[0])
pp={x['pcb_port_id']:x['source_port_id'] for x in by('pcb_port')}
for t in by('pcb_trace'):union([pp[x] for x in t.get('connectsTo',[]) if x in pp])
for x in by('source_component_internal_connection'):union(x['source_port_ids'])
continuity={n:len({find(x) for x in ps})==1 for n,ps in members.items()}
positions={sc[x['source_component_id']]:{'x':x['center']['x']+32.5,'y':x['center']['y']+32.5} for x in by('pcb_component')}
errors=[x for x in j if 'error' in x['type'] or 'warning' in x['type']]
board=by('pcb_board')[0]
result={'board_dimensions_mm':[board['width'],board['height']],'copper_layers':board['num_layers'],'positions_from_lower_left_mm':positions,'switch_positions_pass':all(abs(positions[f'SW{r}{c}']['x']-(12+20*(c-1)))<0.5 and abs(positions[f'SW{r}{c}']['y']-(12+20*(r-1)))<0.5 for r in [1,2,3] for c in [1,2,3]),'diodes_within_8mm':all(math.dist(list(positions[f'SW{r}{c}'].values()),list(positions[f'D{r}{c}'].values()))<=8 for r in [1,2,3] for c in [1,2,3]),'net_count':len(netnames),'net_route_metadata_continuity':continuity,'all_net_route_metadata_continuity_pass':all(continuity.values()),'minimum_route_wire_width_mm':min(pt['width'] for t in by('pcb_trace') for pt in t['route'] if pt['route_type']=='wire'),'pcb_trace_count':len(by('pcb_trace')),'pcb_via_count':len(by('pcb_via')),'diagnostics':errors,'limitations':['Connectivity audit uses route connectsTo metadata plus declared switch internal connections; independent geometric opens verification is not performed.','Clearance diagnostics are retained; exit code alone is not a clean DRC result.']}
print(json.dumps(result,indent=2))
