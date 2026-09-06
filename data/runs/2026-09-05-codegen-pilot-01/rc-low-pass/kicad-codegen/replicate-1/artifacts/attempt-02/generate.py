from pathlib import Path
import uuid,json,pcbnew as p
OUT=Path(__file__).resolve().parent
BASE=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
uid=lambda:str(uuid.uuid4())
root=uid(); ids={r:uid() for r in ['J1','J2','R1','C1']}
fpids={'J1':'Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical','J2':'Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical','R1':'Resistor_SMD:R_0805_2012Metric','C1':'Capacitor_SMD:C_0805_2012Metric'}
values={'J1':'SIGNAL_IN','J2':'SIGNAL_OUT','R1':'1k','C1':'100nF'}
def libsym(lib,n):
 s=(BASE/'symbols'/f'{lib}.kicad_sym').read_text();i=s.index('\n\t(symbol "'+n+'"')+1;depth=0;quoted=False;esc=False
 for k in range(i,len(s)):
  c=s[k]
  if c=='"' and not esc:quoted=not quoted
  if not quoted:
   if c=='(':depth+=1
   elif c==')':
    depth-=1
    if depth==0:break
  esc=(c=='\\' and not esc)
 return s[i:k+1].replace(f'(symbol "{n}"',f'(symbol "{lib}:{n}"',1)
parts=[f'(kicad_sch (version 20250114) (generator "pcb-benchmark-codegen") (uuid {root}) (paper "A4") (lib_symbols',libsym('Device','R'),libsym('Device','C'),libsym('Connector_Generic','Conn_01x02'),')']
for ref,lib,x,y in [('J1','Connector_Generic:Conn_01x02',50.8,50.8),('J2','Connector_Generic:Conn_01x02',127,50.8),('R1','Device:R',76.2,50.8),('C1','Device:C',100.33,60.96)]:
 parts.append(f'(symbol (lib_id "{lib}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid {ids[ref]})')
 for name,val,dx,dy,hide in [('Reference',ref,3,-2,False),('Value',values[ref],3,2,False),('Footprint',fpids[ref],0,0,True)]:
  parts.append(f'(property "{name}" "{val}" (at {x+dx} {y+dy} 0) (effects (font (size 1.27 1.27))'+(' (hide yes)' if hide else '')+'))')
 for n in ['1','2']:parts.append(f'(pin "{n}" (uuid {uid()}))')
 parts.append(f'(instances (project "rc-filter" (path "/{root}" (reference "{ref}") (unit 1)))))')
def wire(a,b):parts.append(f'(wire (pts (xy {a[0]} {a[1]}) (xy {b[0]} {b[1]})) (stroke (width 0) (type default)) (uuid {uid()}))')
def label(net,x,y):parts.append(f'(label "{net}" (at {x} {y} 0) (effects (font (size 1.27 1.27)) (justify left bottom)) (uuid {uid()}))')
for a,b,n in [((45.72,50.8),(35.56,50.8),'SIGNAL_IN'),((45.72,53.34),(35.56,53.34),'GND'),((121.92,50.8),(111.76,50.8),'SIGNAL_OUT'),((121.92,53.34),(111.76,53.34),'GND'),((76.2,46.99),(76.2,43.18),'SIGNAL_IN'),((76.2,54.61),(76.2,57.15),'SIGNAL_OUT'),((100.33,64.77),(100.33,68.58),'GND')]:wire(a,b);label(n,*b)
wire((76.2,57.15),(100.33,57.15))
parts.append('(embedded_fonts no))');(OUT/'rc-filter.kicad_sch').write_text('\n'.join(parts))
b=p.BOARD();b.SetCopperLayerCount(2)
ds=b.GetDesignSettings();ds.m_MinClearance=p.FromMM(.25);ds.m_TrackMinWidth=p.FromMM(.25);ds.m_CopperEdgeClearance=p.FromMM(.25)
nets={}
for name in ['SIGNAL_IN','SIGNAL_OUT','GND']:
 net=p.NETINFO_ITEM(b,"/"+name);b.Add(net);nets[name]=net
v=lambda xy:p.VECTOR2I(p.FromMM(xy[0]),p.FromMM(xy[1]))
padmap={'J1':{'1':'SIGNAL_IN','2':'GND'},'J2':{'1':'SIGNAL_OUT','2':'GND'},'R1':{'1':'SIGNAL_IN','2':'SIGNAL_OUT'},'C1':{'1':'SIGNAL_OUT','2':'GND'}}
fps={};pads={}
for ref,xy in [('J1',(53,60)),('J2',(82,60)),('R1',(67,60)),('C1',(78,61.27))]:
 lib,name=fpids[ref].split(':');f=p.FootprintLoad(str(BASE/'footprints'/(lib+'.pretty')),name);f.SetReference(ref);f.SetValue(values[ref]);f.SetFPID(p.LIB_ID(lib,name));f.SetPosition(v(xy));f.SetPath(p.KIID_PATH('/'+root+'/'+ids[ref]));b.Add(f)
 f.Reference().SetPosition(v((xy[0],xy[1]-3)));f.Value().SetVisible(False)
 for pad in f.Pads():
  pad.SetNet(nets[padmap[ref][pad.GetNumber()]]);pads[(ref,pad.GetNumber())]=(p.ToMM(pad.GetPosition().x),p.ToMM(pad.GetPosition().y))
 fps[ref]=f
for a,c in [((50,50),(85,50)),((85,50),(85,75)),((85,75),(50,75)),((50,75),(50,50))]:
 s=p.PCB_SHAPE();s.SetShape(p.SHAPE_T_SEGMENT);s.SetStart(v(a));s.SetEnd(v(c));s.SetLayer(p.Edge_Cuts);s.SetWidth(p.FromMM(.05));b.Add(s)
def route(net,pts):
 for a,c in zip(pts,pts[1:]):
  t=p.PCB_TRACK(b);t.SetStart(v(a));t.SetEnd(v(c));t.SetWidth(p.FromMM(.25));t.SetLayer(p.F_Cu);t.SetNet(nets[net]);b.Add(t)
route('SIGNAL_IN',[pads['J1','1'],pads['R1','1']])
route('SIGNAL_OUT',[pads['R1','2'],(75.8175,60),pads['C1','1']])
route('SIGNAL_OUT',[pads['C1','1'],(77.0875,58),(80,58),pads['J2','1']])
route('GND',[pads['C1','2'],(78.9125,65),(82,65),pads['J2','2']])
route('GND',[(78.9125,65),(53,65),pads['J1','2']])
def txt(s,xy,size=1):
 t=p.PCB_TEXT(b);t.SetText(s);t.SetPosition(v(xy));t.SetTextSize(v((size,size)));t.SetTextThickness(p.FromMM(.15));t.SetLayer(p.F_SilkS);b.Add(t)
txt('1 SIGNAL_IN',(58,54),.8);txt('2 GND',(57,68),.8);txt('1 SIGNAL_OUT',(77,54),.8);txt('2 GND',(80,68),.8);txt('RC LOW PASS  1k / 100nF',(67.5,72),1)
p.SaveBoard(str(OUT/'rc-filter.kicad_pcb'),b)
project={'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25,'min_copper_edge_clearance':.25}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.25,'via_diameter':.6,'via_drill':.3,'diff_pair_width':.25,'diff_pair_gap':.25,'diff_pair_via_gap':.25}],'meta':{'version':4}},'meta':{'filename':'rc-filter.kicad_pro','version':1}}
(OUT/'rc-filter.kicad_pro').write_text(json.dumps(project,indent=2))
(OUT/'rc-filter.kicad_dru').write_text('(version 1)\n(rule "Minimum copper clearance" (constraint clearance (min 0.25mm)))\n(rule "Minimum track width" (constraint track_width (min 0.25mm)))\n')
for kind,libs in [('sym',['Device','Connector_Generic']),('fp',['Resistor_SMD','Capacitor_SMD','Connector_PinHeader_2.54mm'])]:
 items=[]
 for lib in libs:
  loc=BASE/('symbols' if kind=='sym' else 'footprints')/(lib+('.kicad_sym' if kind=='sym' else '.pretty'))
  items.append(f'(lib (name "{lib}") (type "KiCad") (uri "{loc}") (options "") (descr "Installed KiCad library"))')
 (OUT/(kind+'-lib-table')).write_text('('+kind+'_lib_table\n'+'\n'.join(items)+'\n)')
print(json.dumps({'pads_mm':{r+':'+n:xy for (r,n),xy in pads.items()},'schematic_uuid':root},indent=2))
