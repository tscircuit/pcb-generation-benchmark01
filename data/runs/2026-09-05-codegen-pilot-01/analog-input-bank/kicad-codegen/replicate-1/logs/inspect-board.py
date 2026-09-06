import pcbnew as p,json,math
b=p.LoadBoard('artifacts/attempt-03/analog_input.kicad_pcb')
def mm(v):return [p.ToMM(v.x),p.ToMM(v.y)]
f={x.GetReference():x for x in b.GetFootprints()};jp=[mm(x.GetPosition()) for x in f['J7'].Pads()];jc=[sum(x[i] for x in jp)/len(jp) for i in [0,1]]
a={'copper_layers':b.GetCopperLayerCount(),'J7_pad_centroid_mm':jc,'capacitor_distances_to_J7_mm':{f'C{i}':math.dist(mm(f[f'C{i}'].GetPosition()),jc) for i in range(1,7)},'minimum_track_width_mm':min(p.ToMM(t.GetWidth()) for t in b.GetTracks() if type(t)==p.PCB_TRACK),'inputs_pad_centroid_mm':{},'mounting_holes_mm':{},'outline_segments_mm':[]}
for i in range(1,7):
 ps=[mm(x.GetPosition()) for x in f[f'J{i}'].Pads()];a['inputs_pad_centroid_mm'][f'J{i}']=[sum(x[z] for x in ps)/len(ps) for z in [0,1]]
for i in range(1,5):a['mounting_holes_mm'][f'H{i}']=mm(f[f'H{i}'].GetPosition())
for s in b.GetDrawings():
 if s.GetLayer()==p.Edge_Cuts:a['outline_segments_mm'].append([mm(s.GetStart()),mm(s.GetEnd())])
print(json.dumps(a,indent=2))
