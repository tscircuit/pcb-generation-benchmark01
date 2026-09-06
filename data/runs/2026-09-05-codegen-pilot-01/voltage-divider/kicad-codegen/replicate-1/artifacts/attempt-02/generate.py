import pcbnew as pcb
import uuid, json, re
from pathlib import Path
P=Path(__file__).resolve().parent
LIB=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
u=lambda:str(uuid.uuid4())
rootid=u()
def expr(text,start):
 depth=0; quoted=False; esc=False
 for j in range(start,len(text)):
  c=text[j]
  if esc:esc=False;continue
  if c=='\\' and quoted:esc=True;continue
  if c=='"':quoted=not quoted
  if not quoted:
   if c=='(':depth+=1
   if c==')':
    depth-=1
    if depth==0:return text[start:j+1]
 raise ValueError('Unbalanced symbol')
def get_symbol(lib,name):
 text=(LIB/'symbols'/f'{lib}.kicad_sym').read_text();start=text.index(f'(symbol "{name}"')
 return expr(text,start).replace(f'(symbol "{name}"',f'(symbol "{lib}:{name}"',1)
resfp='Resistor_SMD:R_0805_2012Metric'
headfp='Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical'
tpfp='TestPoint:TestPoint_Pad_D1.5mm'
# Standard symbol pin positions at zero rotation; local labels are given /NET board names.
components=[
 ('J1','Connector_Generic:Conn_01x02','INPUT',headfp,(50.8,50.8),{'1':'VIN','2':'GND'},{'1':(-5.08,0),'2':(-5.08,-2.54)},(4,8)),
 ('J2','Connector_Generic:Conn_01x02','OUTPUT',headfp,(111.76,50.8),{'1':'VOUT','2':'GND'},{'1':(-5.08,0),'2':(-5.08,-2.54)},(26,8)),
 ('R1','Device:R','10k',resfp,(71.12,50.8),{'1':'VIN','2':'VOUT'},{'1':(0,3.81),'2':(0,-3.81)},(11,8)),
 ('R2','Device:R','10k',resfp,(91.44,50.8),{'1':'VOUT','2':'GND'},{'1':(0,3.81),'2':(0,-3.81)},(18,12)),
 ('TP1','Connector:TestPoint','VOUT',tpfp,(71.12,73.66),{'1':'VOUT'},{'1':(0,0)},(22,5)),
 ('TP2','Connector:TestPoint','GND',tpfp,(91.44,73.66),{'1':'GND'},{'1':(0,0)},(10,16))]
ids={c[0]:u() for c in components}
fx='(effects (font (size 1.27 1.27)))'
sch=[f'(kicad_sch (version 20250114) (generator "pcb-benchmark-script") (uuid "{rootid}") (paper "A4")',
 '(lib_symbols '+ ' '.join(get_symbol(lib,name) for lib,name in [('Device','R'),('Connector_Generic','Conn_01x02'),('Connector','TestPoint')])+')']
for ref,lib,value,fp,(x,y),nets,pins,position in components:
 sch.append(f'''(symbol (lib_id "{lib}") (at {x} {y} 0) (unit 1) (in_bom {"no" if ref.startswith("TP") else "yes"}) (on_board yes) (dnp no) (uuid "{ids[ref]}")
 (property "Reference" "{ref}" (at {x+3.81} {y-2.54} 0) {fx})
 (property "Value" "{value}" (at {x+3.81} {y+1.27} 0) {fx})
 (property "Footprint" "{fp}" (at {x} {y} 0) (effects (font (size 1.27 1.27)) (hide yes)))
 {' '.join(f'(pin "{n}" (uuid "{u()}"))' for n in nets)}
 (instances (project "divider" (path "/{rootid}" (reference "{ref}") (unit 1)))))''')
 for number,net in nets.items():
  dx,dy=pins[number]; px,py=x+dx,y-dy;lx=px-5.08
  sch.append(f'(wire (pts (xy {px} {py}) (xy {lx} {py})) (stroke (width 0) (type default)) (uuid "{u()}"))')
  sch.append(f'(label "{net}" (at {lx} {py} 0) (effects (font (size 1.27 1.27)) (justify left bottom)) (uuid "{u()}"))')
sch.append(')');(P/'divider.kicad_sch').write_text('\n'.join(sch)+'\n')
# Native PCB using installed, unmodified library footprints.
b=pcb.BOARD();b.SetCopperLayerCount(2)
nets={}
for name in ['VIN','VOUT','GND']:
 n=pcb.NETINFO_ITEM(b,'/'+name);b.Add(n);nets[name]=n
footprints={};pads={}
V=lambda x,y:pcb.VECTOR2I(pcb.FromMM(x),pcb.FromMM(y))
for ref,lib,value,fp,_,pin_nets,_,(x,y) in components:
 nick,entry=fp.split(':');f=pcb.FootprintLoad(str(LIB/'footprints'/f'{nick}.pretty'),entry)
 if f is None:raise RuntimeError(fp)
 f.SetReference(ref);f.SetValue(value);f.SetPosition(V(x,y));f.SetFPID(pcb.LIB_ID(nick,entry))
 path=pcb.KIID_PATH();path.push_back(pcb.KIID(rootid));path.push_back(pcb.KIID(ids[ref]));f.SetPath(path)
 f.Reference().SetPosition(V(x,y-2.8));f.Reference().SetTextSize(V(1,1));f.Reference().SetTextThickness(pcb.FromMM(.15));f.Value().SetVisible(False)
 for pad in f.Pads():
  pad.SetNet(nets[pin_nets[pad.GetNumber()]]);pads[(ref,pad.GetNumber())]=pad
 b.Add(f);footprints[ref]=f
for a,z in [((0,0),(30,0)),((30,0),(30,20)),((30,20),(0,20)),((0,20),(0,0))]:
 edge=pcb.PCB_SHAPE();edge.SetShape(pcb.SHAPE_T_SEGMENT);edge.SetStart(V(*a));edge.SetEnd(V(*z));edge.SetLayer(pcb.Edge_Cuts);edge.SetWidth(pcb.FromMM(.05));b.Add(edge)
def xy(ref,n):
 v=pads[(ref,n)].GetPosition();return (pcb.ToMM(v.x),pcb.ToMM(v.y))
def route(net,points):
 for a,z in zip(points,points[1:]):
  t=pcb.PCB_TRACK(b);t.SetStart(V(*a));t.SetEnd(V(*z));t.SetLayer(pcb.F_Cu);t.SetWidth(pcb.FromMM(.3));t.SetNet(nets[net]);b.Add(t)
route('VIN',[xy('J1','1'),xy('R1','1')])
route('VOUT',[xy('R1','2'),(17.0875,8),(22,8),xy('J2','1')])
route('VOUT',[(17.0875,8),xy('R2','1')])
route('VOUT',[(22,8),xy('TP1','1')])
route('GND',[xy('R2','2'),(18.9125,16),xy('TP2','1'),(4,16),xy('J1','2')])
route('GND',[(18.9125,16),(26,16),xy('J2','2')])
for text,(x,y) in [('1 VIN',(4,3)),('2 GND',(4,13.5)),('1 VOUT',(26,3)),('2 GND',(26,13.5)),('1:2 DIVIDER',(15,2))]:
 t=pcb.PCB_TEXT(b);t.SetText(text);t.SetPosition(V(x,y));t.SetLayer(pcb.F_SilkS);t.SetTextSize(V(.8,.8));t.SetTextThickness(pcb.FromMM(.12));b.Add(t)
pcb.SaveBoard(str(P/'divider.kicad_pcb'),b)
project={'meta':{'filename':'divider.kicad_pro','version':1},'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.3,'via_diameter':.6,'via_drill':.3}],'meta':{'version':3}}}
(P/'divider.kicad_pro').write_text(json.dumps(project,indent=2)+'\n')
(P/'divider.kicad_dru').write_text('(version 1)\n(rule "Minimum clearance" (constraint clearance (min 0.25mm)))\n(rule "Minimum width" (constraint track_width (min 0.25mm)))\n')
(P/'sym-lib-table').write_text('(sym_lib_table\n'+''.join(f'(lib (name "{l}")(type "KiCad")(uri "{LIB}/symbols/{l}.kicad_sym")(options "")(descr ""))\n' for l in ['Device','Connector_Generic','Connector'])+')\n')
(P/'fp-lib-table').write_text('(fp_lib_table\n'+''.join(f'(lib (name "{l}")(type "KiCad")(uri "{LIB}/footprints/{l}.pretty")(options "")(descr ""))\n' for l in ['Resistor_SMD','Connector_PinHeader_2.54mm','TestPoint'])+')\n')
(P/'generation-metadata.json').write_text(json.dumps({'root_uuid':rootid,'symbol_uuids':ids,'components':components,'tracks':len(list(b.GetTracks()))},indent=2)+'\n')
print('Wrote editable schematic and PCB:', len(components),'components',len(list(b.GetTracks())),'tracks')
