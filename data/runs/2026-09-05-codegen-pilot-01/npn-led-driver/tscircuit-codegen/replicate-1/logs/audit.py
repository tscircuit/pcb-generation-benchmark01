import json,math,itertools
D=json.load(open('artifacts/attempt-03/dist/index/circuit.json'))
def rows(t):return [e for e in D if e['type']==t]
S={e['source_component_id']:e for e in rows('source_component')}; P={e['source_port_id']:e for e in rows('source_port')}; B={S[e['source_component_id']]['name']:e for e in rows('pcb_component')}
ports={e['pcb_port_id']:P[e['source_port_id']]['subcircuit_connectivity_map_key'] for e in rows('pcb_port')}
T={e['source_trace_id']:e['subcircuit_connectivity_map_key'] for e in rows('source_trace')}
parent={p:p for p in ports}
def find(p):
 while parent[p]!=p:p=parent[p]
 return p
for t in rows('pcb_trace'):
 ps=[p for p in t.get('connectsTo',[]) if p in parent]
 for p in ps[1:]:parent[find(p)]=find(ps[0])
nets={}
for p,n in ports.items():nets.setdefault(n,[]).append(p)
unrouted={n:ps for n,ps in nets.items() if len({find(p) for p in ps})!=1}
board=rows('pcb_board')[0]; led1=B['D1']['center'];led2=B['D2']['center']
widths=[p['width'] for t in rows('pcb_trace') for p in t['route'] if p['route_type']=='wire']
result={'board_mm':[board['width'],board['height']],'layers':board['num_layers'],'led_centres_mm':[led1,led2],'led_spacing_mm':math.dist(list(led1.values()),list(led2.values())),'led_same_row':abs(led1['y']-led2['y'])<1e-6,'capacitor_header_distance_mm':math.dist(list(B['C1']['center'].values()),list(B['J1']['center'].values())),'min_routed_wire_width_mm':min(widths),'route_metadata_disconnected_nets':unrouted,'route_count':len(rows('pcb_trace')),'error_records':[e for e in D if 'error' in e['type']],'transistor_pins':{S[p['source_component_id']]['name']+'.'+str(p['pin_number']):p['name'] for p in P.values() if S[p['source_component_id']]['name'].startswith('Q')},'limitation':'Connectivity test uses compiled connectsTo metadata, not an independent copper continuity proof. Full geometric 0.25 mm clearance validation not performed.'}
print(json.dumps(result,indent=2))
