import json,collections,pathlib
p=pathlib.Path('artifacts/attempt-03/dist/index/circuit.json');data=json.loads(p.read_text());by=lambda t:[e for e in data if e['type']==t]
ports={e['source_port_id']:e['pcb_port_id'] for e in by('pcb_port')}
nets=collections.defaultdict(set)
for t in by('source_trace'):
 for n in t['connected_source_net_ids']:nets[n].update(ports[i] for i in t['connected_source_port_ids'])
parent={v:v for v in ports.values()}
def find(v):
 while parent[v]!=v:v=parent[v]
 return v
for t in by('pcb_trace'):
 pp=t.get('connectsTo',[])
 for v in pp[1:]:parent[find(v)]=find(pp[0])
results={n:{'terminal_count':len(pp),'connected_by_pcb_trace_graph':len({find(v) for v in pp})==1} for n,pp in nets.items()}
board=by('pcb_board')[0];widths=sorted({p['width'] for t in by('pcb_trace') for p in t['route'] if p['route_type']=='wire'})
print(json.dumps({'board':board,'net_routing':results,'trace_widths_mm':widths,'routing_error_objects':[e for e in data if 'error' in e['type']],'test_pads':[p for p in by('pcb_smtpad') if p.get('shape')=='circle'],'full_copper_clearance_mm':None,'clearance_note':'Source requests 0.35 mm autorouter traceClearance and 0.25 mm routingTolerances, but compiled board retains 0.1 mm trace-to-pad and pad-to-pad rule defaults. Full 0.25 mm clearance is not independently verified.'},indent=2))
assert all(r['connected_by_pcb_trace_graph'] for r in results.values())
assert board['width']==50 and board['height']==30 and board['num_layers']==2
assert min(widths)>=0.25
