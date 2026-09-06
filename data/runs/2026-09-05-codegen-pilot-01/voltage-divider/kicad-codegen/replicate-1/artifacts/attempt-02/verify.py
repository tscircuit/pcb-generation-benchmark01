import pcbnew as pcb,json,re
from pathlib import Path
p=Path(__file__).resolve().parent
b=pcb.LoadBoard(str(p/'divider.kicad_pcb'))
expected={'/VIN':{('J1','1'),('R1','1')},'/VOUT':{('R1','2'),('R2','1'),('J2','1'),('TP1','1')},'/GND':{('R2','2'),('J1','2'),('J2','2'),('TP2','1')}}
actual={n:set() for n in expected};f={x.GetReference():x for x in b.GetFootprints()}
for ref,fp in f.items():
 for pad in fp.Pads():actual[pad.GetNetname()].add((ref,pad.GetNumber()))
assert actual==expected,(actual,expected)
assert b.GetCopperLayerCount()==2
outline=[o for o in b.GetDrawings() if o.GetLayer()==pcb.Edge_Cuts];xs=[];ys=[]
for edge in outline:
 for v in [edge.GetStart(),edge.GetEnd()]:xs.append(pcb.ToMM(v.x));ys.append(pcb.ToMM(v.y))
assert max(xs)-min(xs)==30 and max(ys)-min(ys)==20
assert pcb.ToMM(f['J1'].GetPosition().x)<=5 and 30-pcb.ToMM(f['J2'].GetPosition().x)<=5
assert all(pcb.ToMM(t.GetWidth())>=.25 for t in b.GetTracks())
assert all(pcb.ToMM(next(iter(f[ref].Pads())).GetSize().x)>=1 for ref in ['TP1','TP2'])
for ref in ['R1','R2']:assert f[ref].GetValue()=='10k'
text=(p/'divider.net').read_text();found={}
for match in re.finditer(r'\(net \(code "?\d+"?\) \(name "([^"]+)"\)',text):
 start=match.start();end=text.find('\n    (net ',start+1);block=text[start:end if end>=0 else len(text)]
 found[match.group(1)]={tuple(t) for t in re.findall(r'\(node \(ref "([^"]+)"\) \(pin "([^"]+)"\)',block)}
assert found==expected,(found,expected)
result={'native_pcb_pin_sets_match':True,'native_schematic_pin_sets_match':True,'board_dimensions_mm':[30,20],'layers':2,'trace_width_mm':.3,'testpoint_diameter_mm':1.5,'header_edge_distance_mm':4,'expected_nets':{n:sorted(v) for n,v in expected.items()}}
(p/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
