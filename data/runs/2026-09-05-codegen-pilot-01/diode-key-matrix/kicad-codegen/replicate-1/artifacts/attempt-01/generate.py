from pathlib import Path
import uuid,json,pcbnew as p
OUT=Path(__file__).resolve().parent
LIB=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
def uid():return str(uuid.uuid4())
def extract(f,n):
 s=(LIB/'symbols'/f'{f}.kicad_sym').read_text(); a=s.index('(symbol "'+n+'"'); dep=0; q=False; esc=False
 for i in range(a,len(s)):
  c=s[i]
  if c=='"' and not esc:q=not q
  if not q:
   if c=='(':dep+=1
   elif c==')':
    dep-=1
    if not dep:return s[a:i+1].replace('(symbol "'+n+'"','(symbol "'+f+':'+n+'"',1)
  esc=c=='\\' and not esc
root=uid(); parts=[]; ids={}
fpSW='Button_Switch_THT:SW_PUSH_6mm'; fpD='Diode_THT:D_DO-35_SOD27_P7.62mm_Horizontal'; fpJ='Connector_PinHeader_2.54mm:PinHeader_1x06_P2.54mm_Vertical'
def sym(lib,ref,val,fp,x,y,pins):
 u=uid();ids[ref]=u
 t=f'(symbol (lib_id "{lib}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid "{u}")'
 for k,v,dy in [('Reference',ref,-5),('Value',val,5),('Footprint',fp,0)]:
  t+=f'(property "{k}" "{v}" (at {x} {y+dy} 0) (effects (font (size 1.27 1.27))'+(' (hide yes)' if k=='Footprint' else '')+') )'
 for pin in pins:t+=f'(pin "{pin}" (uuid "{uid()}"))'
 t+=f'(instances (project "matrix" (path "/{root}" (reference "{ref}") (unit 1)))))';parts.append(t)
def wire(x1,y1,x2,y2):parts.append(f'(wire (pts (xy {x1} {y1})(xy {x2} {y2})) (stroke (width 0)(type default))(uuid "{uid()}"))')
def label(n,x,y):parts.append(f'(label "{n}" (at {x} {y} 0) (effects (font(size 1.27 1.27))(justify left bottom))(uuid "{uid()}"))')
for r in range(1,4):
 for c in range(1,4):
  x=40+(c-1)*70;y=40+(r-1)*40
  sym('Switch:SW_Push',f'SW{r}{c}','SW_Push',fpSW,x,y,['1','2'])
  sym('Device:D',f'D{r}{c}','1N4148',fpD,x+25.4,y,['1','2'])
  wire(x-5.08,y,x-12.7,y);label(f'COL{c}',x-12.7,y)
  # diode cathode left connects ROW; junction connects switch right and diode anode via lower wire
  wire(x+5.08,y,x+7.62,y);wire(x+7.62,y,x+7.62,y+10.16);wire(x+7.62,y+10.16,x+33.02,y+10.16);wire(x+33.02,y+10.16,x+33.02,y);wire(x+33.02,y,x+29.21,y);label(f'KEY{r}{c}',x+7.62,y+10.16)
  wire(x+21.59,y,x+17.78,y);label(f'ROW{r}',x+17.78,y)
sym('Connector_Generic:Conn_01x06','J1','MATRIX',fpJ,50,165,[str(n) for n in range(1,7)])
for n,name in enumerate(['ROW1','ROW2','ROW3','COL1','COL2','COL3']):
 y=159.92+n*2.54;wire(44.92,y,30,y);label(name,30,y)
sch='(kicad_sch (version 20250114) (generator "pcb-matrix-codegen") (uuid "'+root+'") (paper "A4") (lib_symbols '+''.join(extract(f,n) for f,n in [('Switch','SW_Push'),('Device','D'),('Connector_Generic','Conn_01x06')])+')'+''.join(parts)+'(sheet_instances(path "/"(page "1"))))'
(OUT/'matrix.kicad_sch').write_text(sch)
b=p.BOARD();b.SetCopperLayerCount(2);nets={}
for name in ['ROW1','ROW2','ROW3','COL1','COL2','COL3']+[f'KEY{r}{c}' for r in range(1,4) for c in range(1,4)]:
 n=p.NETINFO_ITEM(b,name);b.Add(n);nets[name]=n
def pt(x,y):return p.VECTOR2I(p.FromMM(x),p.FromMM(y))
def footprint(lib,ref,val,x,y,netmap,angle=0):
 l,n=lib.split(':');f=p.FootprintLoad(str(LIB/'footprints'/(l+'.pretty')),n);f.SetReference(ref);f.SetValue(val);f.SetFPID(p.LIB_ID(l,n));f.SetPosition(pt(x,y));f.SetOrientationDegrees(angle);f.SetPath(p.KIID_PATH('/'+root+'/'+ids[ref]));b.Add(f)
 for pad in f.Pads():pad.SetNet(nets[netmap[pad.GetNumber()]])
 f.Reference().SetVisible(False)
 return f
def track(net,layer,points):
 for a,z in zip(points,points[1:]):
  if a==z:continue
  t=p.PCB_TRACK(b);t.SetStart(pt(*a));t.SetEnd(pt(*z));t.SetWidth(p.FromMM(.3));t.SetLayer(layer);t.SetNet(nets[net]);b.Add(t)
def via(net,x,y):
 v=p.PCB_VIA(b);v.SetPosition(pt(x,y));v.SetWidth(p.FromMM(.65));v.SetDrill(p.FromMM(.3));v.SetViaType(p.VIATYPE_THROUGH);v.SetLayerPair(p.F_Cu,p.B_Cu);v.SetNet(nets[net]);b.Add(v)
def text(s,x,y,size=1):
 t=p.PCB_TEXT(b);t.SetText(s);t.SetPosition(pt(x,y));t.SetTextSize(pt(size,size));t.SetTextThickness(p.FromMM(.15));t.SetLayer(p.F_SilkS);b.Add(t)
for r in range(1,4):
 cy=65-(12+20*(r-1)); row=f'ROW{r}'
 for c in range(1,4):
  cx=12+20*(c-1);col=f'COL{c}';key=f'KEY{r}{c}'
  footprint(fpSW,f'SW{r}{c}','SW_Push',cx-3.25,cy-2.25,{'1':col,'2':key})
  footprint(fpD,f'D{r}{c}','1N4148',cx-3.81,cy+6.5,{'1':row,'2':key})
  text(f'R{r}C{c}',cx,cy-5.2);text(f'D{r}{c}',cx+1.5,cy+9)
  track(col,p.F_Cu,[(cx-6,cy-2.25),(cx-3.25,cy-2.25),(cx+3.25,cy-2.25)])
  track(key,p.F_Cu,[(cx-3.25,cy+2.25),(cx+3.25,cy+2.25),(cx+3.81,cy+2.81),(cx+3.81,cy+6.5)])
  track(row,p.B_Cu,[(cx-3.81,cy+6.5),(cx-3.81,cy+9)])
 track(row,p.B_Cu,[(r+1,cy+9),(48.19,cy+9)])
 track(row,p.B_Cu,[(r+1,5+r),(r+1,cy+9)])
 via(row,r+1,5+r)
 track(row,p.F_Cu,[(20+2.54*(r-1),4),(20+2.54*(r-1),5+r),(r+1,5+r)])
for c in range(1,4):
 x=6+20*(c-1);net=f'COL{c}';y=8+c;via(net,x,y)
 track(net,p.F_Cu,[(x,y),(x,50.75)])
 track(net,p.B_Cu,[(20+2.54*(c+2),4),(20+2.54*(c+2),y),(x,y)])
footprint(fpJ,'J1','MATRIX',20,4,{str(i+1):n for i,n in enumerate(['ROW1','ROW2','ROW3','COL1','COL2','COL3'])},90)
for i,n in enumerate(['1:R1','2:R2','3:R3','4:C1','5:C2','6:C3']):text(n,20+i*2.54,1.7,.65)
text('J1 ROW1 ROW2 ROW3 COL1 COL2 COL3',40,7,.65)
for a,z in [((0,0),(65,0)),((65,0),(65,65)),((65,65),(0,65)),((0,65),(0,0))]:
 s=p.PCB_SHAPE();s.SetShape(p.SHAPE_T_SEGMENT);s.SetStart(pt(*a));s.SetEnd(pt(*z));s.SetLayer(p.Edge_Cuts);s.SetWidth(p.FromMM(.05));b.Add(s)
p.SaveBoard(str(OUT/'matrix.kicad_pcb'),b)
pro={'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.3,'via_diameter':.65,'via_drill':.3,'microvia_diameter':.3,'microvia_drill':.1,'diff_pair_width':.3,'diff_pair_gap':.25,'diff_pair_via_gap':.25}]}}
(OUT/'matrix.kicad_pro').write_text(json.dumps(pro,indent=2))
(OUT/'matrix.kicad_dru').write_text('(version 1)\n(rule "Minimum copper clearance" (constraint clearance (min 0.25mm)))\n(rule "Minimum track width" (constraint track_width (min 0.25mm)))\n')
print('Generated native schematic and PCB with 19 components and 15 nets.')
