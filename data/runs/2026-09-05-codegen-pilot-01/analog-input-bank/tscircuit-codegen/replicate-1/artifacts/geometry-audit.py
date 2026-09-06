import json,math,sys
c=json.load(open(sys.argv[1]));items=lambda t:[v for v in c if v['type']==t]
names={x['source_component_id']:x['name'] for x in items('source_component')}
pc={names[x['source_component_id']]:x for x in items('pcb_component')}
b=items('pcb_board')[0];holes=items('pcb_hole');traces=items('pcb_trace')
def segmentdistance(p,a,z):
 dx=z['x']-a['x'];dy=z['y']-a['y'];den=dx*dx+dy*dy
 t=max(0,min(1,((p['x']-a['x'])*dx+(p['y']-a['y'])*dy)/den)) if den else 0
 return math.hypot(p['x']-a['x']-t*dx,p['y']-a['y']-t*dy)
def rectdistance(h,x,y,w,ht): return math.hypot(max(abs(h['x']-x)-w/2,0),max(abs(h['y']-y)-ht/2,0))-h['hole_diameter']/2
body=min(rectdistance(h,v['center']['x'],v['center']['y'],v['width'],v['height']) for h in holes for v in pc.values())
copper=[]
for h in holes:
 for t in traces:
  r=t['route']
  for a,z in zip(r,r[1:]):
   if a['route_type']=='wire' and z['route_type']=='wire' and a['layer']==z['layer']: copper.append(segmentdistance(h,a,z)-max(a['width'],z['width'])/2-h['hole_diameter']/2)
 for v in items('pcb_smtpad')+items('pcb_plated_hole')+items('pcb_via'):
  w=v.get('width',v.get('rect_pad_width',v.get('outer_diameter',v.get('radius',0)*2)));ht=v.get('height',v.get('rect_pad_height',w))
  copper.append(rectdistance(h,v['x'],v['y'],w,ht))
j=pc['J7']['center'];caps={n:math.dist((v['center']['x'],v['center']['y']),(j['x'],j['y'])) for n,v in pc.items() if n.startswith('C')}
result={'board_mm':[b['width'],b['height']],'copper_layers':b['num_layers'],'capacitor_distance_to_J7_mm':caps,'input_header_centers':{n:v['center'] for n,v in pc.items() if n.startswith('J') and n!='J7'},'output_header_center':j,'nonplated_holes':holes,'minimum_component_bounds_to_hole_edge_mm':body,'minimum_copper_to_hole_edge_mm':min(copper),'min_routed_width_mm':min(w['width'] for t in traces for w in t['route'] if w['route_type']=='wire'),'pcb_trace_count':len(traces),'pcb_via_count':len(items('pcb_via')),'generation_errors':[x for x in c if 'error' in x['type']],'compiled_clearance_settings':{k:v for k,v in b.items() if 'clearance' in k},'all_net_physical_continuity':None,'minimum_between_net_copper_clearance_mm':None}
print(json.dumps(result,indent=2))
