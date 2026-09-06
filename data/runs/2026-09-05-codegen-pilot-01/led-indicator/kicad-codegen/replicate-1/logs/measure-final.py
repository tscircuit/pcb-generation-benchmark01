import pcbnew as p,json
b=p.LoadBoard('artifacts/attempt-03/indicator.kicad_pcb')
edges=[x for x in b.GetDrawings() if x.GetLayer()==p.Edge_Cuts]
xs=[p.ToMM(pt.x) for e in edges for pt in [e.GetStart(),e.GetEnd()]];ys=[p.ToMM(pt.y) for e in edges for pt in [e.GetStart(),e.GetEnd()]]
result={'outline_mm':{'width':max(xs)-min(xs),'height':max(ys)-min(ys),'left':min(xs),'right':max(xs)},'copper_layers':b.GetCopperLayerCount(),'track_widths_mm':sorted(set(p.ToMM(t.GetWidth()) for t in b.GetTracks())),'footprints':{}}
for f in b.GetFootprints():
 pos=f.GetPosition();bb=f.GetBoundingBox(False,False)
 result['footprints'][f.GetReference()]={'origin_mm':[p.ToMM(pos.x),p.ToMM(pos.y)],'footprint':str(f.GetFPID().GetLibItemName()),'bounding_box_mm':[p.ToMM(bb.GetLeft()),p.ToMM(bb.GetTop()),p.ToMM(bb.GetRight()),p.ToMM(bb.GetBottom())],'pad_nets':{q.GetNumber():str(q.GetNetname()) for q in f.Pads()}}
print(json.dumps(result,indent=2))
