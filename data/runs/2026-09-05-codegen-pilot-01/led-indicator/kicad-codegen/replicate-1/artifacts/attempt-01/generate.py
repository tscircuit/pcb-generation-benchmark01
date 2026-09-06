from pathlib import Path
import uuid,json
import pcbnew as pcb
OUT=Path(__file__).resolve().parent
LIB=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
u=lambda:str(uuid.uuid4())
root=u(); ids={r:u() for r in ['J1','R1','D1']}
parts=[('J1','Connector_Generic:Conn_01x02','5V INPUT','Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical',50.8,50.8),('R1','Device:R','1k','Resistor_SMD:R_0805_2012Metric',81.28,50.8),('D1','Device:LED','RED','LED_SMD:LED_0805_2012Metric',111.76,50.8)]
def extract(lib,name):
 t=(LIB/'symbols'/(lib+'.kicad_sym')).read_text(); start=t.index('(symbol "'+name+'"');dep=0;quoted=False;escape=False
 for i in range(start,len(t)):
  c=t[i]
  if c=='"' and not escape:quoted=not quoted
  if not quoted:
   if c=='(':dep+=1
   elif c==')':dep-=1
  if dep==0:break
  escape=c=='\\' and not escape
 return t[start:i+1].replace('(symbol "'+name+'"','(symbol "'+lib+':'+name+'"',1)
s=[f'(kicad_sch (version 20250114) (generator "pcb_benchmark_codegen") (uuid "{root}") (paper "A4") (lib_symbols']
for _,libid,*_ in parts:s.append(extract(*libid.split(':')))
s.append(')')
for ref,libid,val,fp,x,y in parts:
 s.append(f'(symbol (lib_id "{libid}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid "{ids[ref]}")')
 for key,value,px,py,hide in [('Reference',ref,x+5.08,y-3.81,False),('Value',val,x+5.08,y,False),('Footprint',fp,x,y,True)]:
  s.append(f'(property "{key}" "{value}" (at {px} {py} 0) (effects (font (size 1.27 1.27))'+(' (hide yes)' if hide else '')+'))')
 for num in ['1','2']:s.append(f'(pin "{num}" (uuid "{u()}"))')
 s.append(f'(instances (project "indicator" (path "/{root}" (reference "{ref}") (unit 1)))) )')
# Real wires and labels at every connected terminal.
connections=[('J1',1,'+5V',(45.72,50.8),(38.1,50.8)),('J1',2,'GND',(45.72,53.34),(38.1,53.34)),('R1',1,'+5V',(81.28,46.99),(81.28,40.64)),('R1',2,'LED_A',(81.28,54.61),(81.28,60.96)),('D1',1,'GND',(107.95,50.8),(100.33,50.8)),('D1',2,'LED_A',(115.57,50.8),(123.19,50.8))]
for _,_,net,(x1,y1),(x2,y2) in connections:
 s.append(f'(wire (pts (xy {x1} {y1}) (xy {x2} {y2})) (stroke (width 0) (type default)) (uuid "{u()}"))')
 s.append(f'(label "{net}" (at {x2} {y2} 0) (effects (font (size 1.27 1.27)) (justify left bottom)) (uuid "{u()}"))')
s.append('(embedded_fonts no))');(OUT/'indicator.kicad_sch').write_text('\n'.join(s))
b=pcb.BOARD();b.SetCopperLayerCount(2)
nets={}
for name in ['+5V','GND','LED_A']:
 n=pcb.NETINFO_ITEM(b,name);b.Add(n);nets[name]=n
positions={'J1':(103,108.73,0),'R1':(115,108.73,0),'D1':(127,108.73,180)}
padnets={'J1':{'1':'+5V','2':'GND'},'R1':{'1':'+5V','2':'LED_A'},'D1':{'1':'GND','2':'LED_A'}}
fps={}
for ref,libid,val,fp,*_ in parts:
 lib,name=fp.split(':');f=pcb.FootprintLoad(str(LIB/'footprints'/(lib+'.pretty')),name)
 f.SetReference(ref);f.SetValue(val);f.SetFPID(pcb.LIB_ID(lib,name));x,y,rot=positions[ref];f.SetPosition(pcb.VECTOR2I(pcb.FromMM(x),pcb.FromMM(y)));f.SetOrientationDegrees(rot)
 f.SetPath(pcb.KIID_PATH('/'+root+'/'+ids[ref]))
 f.Reference().SetPosition(pcb.VECTOR2I(pcb.FromMM(x),pcb.FromMM(y-2.8)));f.Reference().SetTextAngle(pcb.EDA_ANGLE(0,pcb.DEGREES))
 f.Value().SetVisible(False)
 for p in f.Pads():p.SetNet(nets[padnets[ref][p.GetNumber()]])
 b.Add(f);fps[ref]=f

def vec(x,y):return pcb.VECTOR2I(pcb.FromMM(x),pcb.FromMM(y))
for a,c in [((100,100),(130,100)),((130,100),(130,120)),((130,120),(100,120)),((100,120),(100,100))]:
 sh=pcb.PCB_SHAPE();sh.SetShape(pcb.SHAPE_T_SEGMENT);sh.SetStart(vec(*a));sh.SetEnd(vec(*c));sh.SetLayer(pcb.Edge_Cuts);sh.SetWidth(pcb.FromMM(.05));b.Add(sh)
def pad(ref,num):
 p=next(p for p in fps[ref].Pads() if p.GetNumber()==num).GetPosition();return (pcb.ToMM(p.x),pcb.ToMM(p.y))
def route(net,pts):
 for a,c in zip(pts,pts[1:]):
  t=pcb.PCB_TRACK(b);t.SetStart(vec(*a));t.SetEnd(vec(*c));t.SetWidth(pcb.FromMM(.3));t.SetLayer(pcb.F_Cu);t.SetNet(nets[net]);b.Add(t)
route('+5V',[pad('J1','1'),pad('R1','1')])
route('LED_A',[pad('R1','2'),pad('D1','2')])
route('GND',[pad('D1','1'),(128.5,109.255),(128.5,114),(127.5,115),(107,115),(103.27,111.27),pad('J1','2')])
for label,x,y,size in [('1 +5V',106,105,.85),('2 GND',105,114,.85),('K',128.5,111.5,.85),('RED',126,104,.85),('LED POWER 5V',115,118,1)]:
 t=pcb.PCB_TEXT(b);t.SetText(label);t.SetPosition(vec(x,y));t.SetTextSize(vec(size,size));t.SetTextThickness(pcb.FromMM(.15));t.SetLayer(pcb.F_SilkS);b.Add(t)
settings=b.GetDesignSettings();settings.m_MinClearance=pcb.FromMM(.25);settings.m_TrackMinWidth=pcb.FromMM(.25)
pcb.SaveBoard(str(OUT/'indicator.kicad_pcb'),b)
project={'meta':{'filename':'indicator.kicad_pro','version':1},'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25},'rule_severities':{}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.3,'via_diameter':.6,'via_drill':.3,'microvia_diameter':.3,'microvia_drill':.1,'diff_pair_width':.3,'diff_pair_gap':.25,'diff_pair_via_gap':.25}],'meta':{'version':3}}}
(OUT/'indicator.kicad_pro').write_text(json.dumps(project,indent=2))
(OUT/'indicator.kicad_dru').write_text('(version 1)\n(rule "Minimum copper clearance" (constraint clearance (min 0.25mm)))\n(rule "Minimum track width" (constraint track_width (min 0.25mm)))\n')
(OUT/'ids.json').write_text(json.dumps({'root':root,'symbols':ids},indent=2))
print(json.dumps({'pad_positions':{r:{p.GetNumber():[pcb.ToMM(p.GetPosition().x),pcb.ToMM(p.GetPosition().y)] for p in f.Pads()} for r,f in fps.items()}},indent=2))
