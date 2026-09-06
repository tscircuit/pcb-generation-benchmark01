import pathlib,re,uuid,json
import pcbnew as p
OUT=pathlib.Path(__file__).parent
LIB=pathlib.Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
uid=lambda:str(uuid.uuid4())
root=uid()

def extract(lib,name):
 s=(LIB/'symbols'/f'{lib}.kicad_sym').read_text(); start=s.index('(symbol "'+name+'"'); depth=0; quoted=False; esc=False
 for i in range(start,len(s)):
  c=s[i]
  if c=='"' and not esc:quoted=not quoted
  if not quoted:
   if c=='(':depth+=1
   if c==')':
    depth-=1
    if depth==0:return s[start:i+1]
  if c=='\\' and not esc:esc=True
  else:esc=False
symbols={n:extract(*n.split(':')) for n in ['Device:R','Device:C','Switch:SW_Push','Connector_Generic:Conn_01x06']}
parts=[]
fpr='Resistor_SMD:R_0805_2012Metric';fpc='Capacitor_SMD:C_0805_2012Metric';fps='Button_Switch_THT:SW_PUSH_6mm';fpj='Connector_PinHeader_2.54mm:PinHeader_1x06_P2.54mm_Vertical'
parts.append(('J1','Connector_Generic:Conn_01x06','INPUTS',fpj,45.72,55.88,{'1':'+3V3','2':'GND',**{str(i+2):f'BTN{i}' for i in range(1,5)}}))
for i in range(1,5):
 x=81.28+(i-1)*35.56
 parts += [(f'R{i}','Device:R','10k',fpr,x,45.72,{'1':'+3V3','2':f'BTN{i}'}),(f'C{i}','Device:C','100nF',fpc,x,71.12,{'1':f'BTN{i}','2':'GND'}),(f'SW{i}','Switch:SW_Push',f'BTN{i}',fps,x,93.98,{'1':f'BTN{i}','2':'GND'})]
chunks=[f'(kicad_sch (version 20250114) (generator "pcb-benchmark") (uuid {root}) (paper "A4") (lib_symbols']
for k,s in symbols.items():chunks.append(s.replace('(symbol "'+k.split(':')[1]+'"','(symbol "'+k+'"',1))
chunks.append(')')
ids={}
for ref,lib,val,fp,x,y,nets in parts:
 ident=uid();ids[ref]=ident
 chunks.append(f'(symbol (lib_id "{lib}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid {ident}) (property "Reference" "{ref}" (at {x+3} {y-2} 0) (effects (font (size 1.27 1.27)))) (property "Value" "{val}" (at {x+4} {y+2} 0) (effects (font (size 1.27 1.27)))) (property "Footprint" "{fp}" (at {x} {y} 0) (effects (font (size 1.27 1.27)) hide)) (instances (project "buttons" (path "/{root}" (reference "{ref}") (unit 1)))))')
 # standard symbol pins: parse balanced pin expressions
 s=symbols[lib]
 for m in re.finditer(r'\(pin (?:passive|input|output|power_in|power_out)\s+\w+\s+\(at ([\d.-]+) ([\d.-]+) ([\d.-]+)\)',s):
  sub=s[m.start():]; num=re.search(r'\(number "([^"]+)"',sub).group(1); px=x+float(m[1]);py=y-float(m[2]); a=float(m[3]);dx,dy={0:(-2.54,0),180:(2.54,0),90:(0,2.54),270:(0,-2.54)}[a];ex=px+dx;ey=py+dy
  chunks.append(f'(wire (pts (xy {px} {py}) (xy {ex} {ey})) (stroke (width 0) (type default)) (uuid {uid()}))')
  chunks.append(f'(global_label "{nets[num]}" (shape bidirectional) (at {ex} {ey} 0) (effects (font (size 1.0 1.0)) (justify left)) (uuid {uid()}) (property "Intersheetrefs" "${{INTERSHEET_REFS}}" (at {ex} {ey} 0) (effects (font (size 1 1)) hide)))')
chunks.append('(embedded_fonts no))');(OUT/'buttons.kicad_sch').write_text('\n'.join(chunks))
b=p.BOARD(); b.SetCopperLayerCount(2)
nets={}
for n in ['+3V3','GND','BTN1','BTN2','BTN3','BTN4']:
 net=p.NETINFO_ITEM(b,n);b.Add(net);nets[n]=net
V=lambda x,y:p.VECTOR2I(p.FromMM(x),p.FromMM(y))
footprints={}
for ref,lib,val,fp,sx,sy,pins in parts:
 libname,fpname=fp.split(':'); f=p.FootprintLoad(str(LIB/'footprints'/(libname+'.pretty')),fpname);f.SetReference(ref);f.SetValue(val);f.SetFPID(p.LIB_ID(libname,fpname));f.SetPath(p.KIID_PATH('/'+root+'/'+ids[ref]));b.Add(f)
 if ref=='J1':x,y,angle=10,4,90
 else:
  i=int(ref[-1]);x0=5+11*(i-1)
  if ref.startswith('SW'):x,y,angle=x0,23,0
  elif ref.startswith('R'):x,y,angle=x0+.9125,15,0
  else:x,y,angle=x0+2.7375,18,0
 f.SetPosition(V(x,y));f.SetOrientationDegrees(angle)
 for pad in f.Pads():pad.SetNet(nets[pins[pad.GetNumber()]])
 f.Reference().SetVisible(False);f.Value().SetVisible(False);footprints[ref]=f

def trace(net,coords,layer=p.F_Cu):
 for a,c in zip(coords,coords[1:]):
  t=p.PCB_TRACK(b);t.SetStart(V(*a));t.SetEnd(V(*c));t.SetWidth(p.FromMM(.3));t.SetLayer(layer);t.SetNet(nets[net]);b.Add(t)
def via(net,x,y):
 v=p.PCB_VIA(b);v.SetPosition(V(x,y));v.SetWidth(p.FromMM(.7));v.SetDrill(p.FromMM(.3));v.SetViaType(p.VIATYPE_THROUGH);v.SetLayerPair(p.F_Cu,p.B_Cu);v.SetNet(nets[net]);b.Add(v)
def txt(s,x,y,size=.9):
 t=p.PCB_TEXT(b);t.SetText(s);t.SetPosition(V(x,y));t.SetTextSize(V(size,size));t.SetTextThickness(p.FromMM(.15));t.SetLayer(p.F_SilkS);b.Add(t)
trace('+3V3',[(10,4),(3,4),(3,12),(38,12)])
trace('GND',[(12.54,4),(12.54,2),(47,2),(47,31),(5,31)])
for i in range(1,5):
 x=5+(i-1)*11;n=f'BTN{i}';s=x+1.825;g=x+3.65
 trace('+3V3',[(x,12),(x,15)])
 trace(n,[(s,15),(s,18),(s,21),(x,23),(x+6.5,23)])
 via(n,s,16.5)
 hx=10+(i+1)*2.54;hy=11-i
 trace(n,[(hx,4),(hx,hy),(s,hy),(s,16.5)],p.B_Cu)
 trace('GND',[(g,18),(g,19)]);via('GND',g,19);trace('GND',[(g,19),(g,31)],p.B_Cu);via('GND',g,31)
 trace('GND',[(x,27.5),(x+6.5,27.5),(x+6.5,31)])
 txt(n,x+3.25,21);txt(f'R{i} 10k',x+3,13.5,.75);txt(f'C{i} 100n',x+4,16.8,.65)
for j,n in enumerate(['1:+3V3','GND','BTN1','BTN2','BTN3','BTN4']):
 # individual signal labels below header, rotated for readability
 t=p.PCB_TEXT(b);t.SetText(n);t.SetPosition(V(10+2.54*j,8));t.SetTextAngle(p.EDA_ANGLE(90,p.DEGREES_T));t.SetTextSize(V(.7,.7));t.SetTextThickness(p.FromMM(.12));t.SetLayer(p.F_SilkS);b.Add(t)
txt('FOUR BUTTON INPUT 3V3',29,33,.9)
for a,c in [((0,0),(50,0)),((50,0),(50,35)),((50,35),(0,35)),((0,35),(0,0))]:
 e=p.PCB_SHAPE();e.SetShape(p.SHAPE_T_SEGMENT);e.SetStart(V(*a));e.SetEnd(V(*c));e.SetLayer(p.Edge_Cuts);e.SetWidth(p.FromMM(.05));b.Add(e)
p.SaveBoard(str(OUT/'buttons.kicad_pcb'),b)
project={'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25,'min_via_diameter':.6,'min_through_hole_diameter':.3,'min_copper_edge_clearance':.25}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.3,'via_diameter':.7,'via_drill':.3}]}}
(OUT/'buttons.kicad_pro').write_text(json.dumps(project,indent=2))
(OUT/'fp-lib-table').write_text('(fp_lib_table\n'+''.join(f'(lib (name "{name}")(type "KiCad")(uri "{LIB}/footprints/{name}.pretty")(options "")(descr ""))\n' for name in ['Resistor_SMD','Capacitor_SMD','Button_Switch_THT','Connector_PinHeader_2.54mm'])+')')
print('Generated schematic and PCB with',len(parts),'components')
