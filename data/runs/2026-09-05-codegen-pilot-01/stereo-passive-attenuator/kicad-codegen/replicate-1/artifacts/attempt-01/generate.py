import pcbnew as p,uuid,json,pathlib
D=pathlib.Path(__file__).parent; LIB=pathlib.Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport'); U=lambda:str(uuid.uuid4())
root=U(); comps=[]
def c(ref,val,sym,fp,nets,sch,pcb): comps.append(dict(ref=ref,val=val,sym=sym,fp=fp,nets=nets,sch=sch,pcb=pcb,uuid=U()))
h='Connector_PinHeader_2.54mm:PinHeader_1x03_P2.54mm_Vertical';r='Resistor_SMD:R_0805_2012Metric';ca='Capacitor_SMD:C_0805_2012Metric';tp='TestPoint:TestPoint_Pad_D1.5mm'
c('J1','INPUT','Connector_Generic:Conn_01x03',h,['LEFT_IN','GND','RIGHT_IN'],(40.64,60.96),(103,112.46))
c('J2','OUTPUT','Connector_Generic:Conn_01x03',h,['LEFT_OUT','GND','RIGHT_OUT'],(165.1,60.96),(147,112.46))
for i,ch,y,py,sy in [(1,'LEFT',45.72,107,110),(2,'RIGHT',96.52,123,120)]:
 c('C'+str(i),'1uF ceramic nonpolar','Device:C',ca,[ch+'_IN',ch+'_AC'],(71.12,y),(114,py))
 c('R'+str(i*2-1),'10k','Device:R',r,[ch+'_AC',ch+'_OUT'],(104.14,y),(124,py))
 c('R'+str(i*2),'10k','Device:R',r,[ch+'_OUT','GND'],(137.16,y),(133,sy))
 c('TP'+str(i),ch+'_OUT','Connector:TestPoint',tp,[ch+'_OUT'],(175.26,y),(138,104 if i==1 else 126))
c('TP3','GND','Connector:TestPoint',tp,['GND'],(175.26,119.38),(125,115))
def get_symbol(id):
 lib,name=id.split(':');s=(LIB/'symbols'/(lib+'.kicad_sym')).read_text();a=s.index('(symbol "'+name+'"');dep=0;quoted=False;escape=False
 for j in range(a,len(s)):
  ch=s[j]
  if ch=='"' and not escape:quoted=not quoted
  if not quoted:dep+=(ch=='(')-(ch==')')
  escape=(ch=='\\' and not escape)
  if dep==0:break
 return s[a:j+1].replace('(symbol "'+name+'"','(symbol "'+id+'"',1)
items=[f'(kicad_sch (version 20250114) (generator "pcb-benchmark-codegen") (uuid {root}) (paper "A4") (lib_symbols '+ '\n'.join(get_symbol(s) for s in sorted(set(c['sym'] for c in comps)))+')']
def effects(size=1.27):return f'(effects (font (size {size} {size})))'
for c in comps:
 x,y=c['sch'];ref=c['ref'];s=f'(symbol (lib_id "{c["sym"]}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid {c["uuid"]})'
 for name,val,dy in [('Reference',ref,-7.62),('Value',c['val'],7.62),('Footprint',c['fp'],10.16)]:
  eff=effects(1 if name=='Value' else 1.27)
  if name=='Footprint':eff=eff[:-1]+' (hide yes))'
  s+=f'(property "{name}" "{val}" (at {x} {y+dy} 0) {eff})'
 s+=f'(instances (project "attenuator" (path "/{root}" (reference "{ref}") (unit 1)))))';items.append(s)
 offsets=[(-5.08,-2.54),(-5.08,0),(-5.08,2.54)] if ref.startswith('J') else [(0,0)] if ref.startswith('TP') else [(0,-3.81),(0,3.81)]
 for (dx,dy),net in zip(offsets,c['nets']):
  a,b=round(x+dx,4),round(y+dy,4);ex=round(a-7.62,4)
  items.append(f'(wire (pts (xy {a} {b}) (xy {ex} {b})) (stroke (width 0) (type default)) (uuid {U()}))')
  items.append(f'(label "{net}" (at {ex} {b} 0) (effects (font (size 1 1)) (justify left bottom)) (uuid {U()}))')
items.append(')');(D/'attenuator.kicad_sch').write_text('\n'.join(items))
b=p.BOARD();b.SetCopperLayerCount(2);nets={}
for i,n in enumerate(sorted(set(n for c in comps for n in c['nets'])),1):
 obj=p.NETINFO_ITEM(b,n,i);b.Add(obj);nets[n]=obj
V=lambda x,y:p.VECTOR2I(p.FromMM(x),p.FromMM(y));fps={};pads={}
for c in comps:
 lib,name=c['fp'].split(':');f=p.FootprintLoad(str(LIB/'footprints'/(lib+'.pretty')),name);f.SetReference(c['ref']);f.SetValue(c['val']);f.SetPosition(V(*c['pcb']));f.SetPath(p.KIID_PATH('/'+root+'/'+c['uuid']));b.Add(f);fps[c['ref']]=f
 for pad in f.Pads():pad.SetNet(nets[c['nets'][int(pad.GetNumber())-1]]);pads[(c['ref'],int(pad.GetNumber()))]=(p.ToMM(pad.GetPosition().x),p.ToMM(pad.GetPosition().y))
 f.Reference().SetTextSize(V(0.8,0.8));f.Reference().SetTextThickness(p.FromMM(.12))
for a,z in [((100,100),(150,100)),((150,100),(150,130)),((150,130),(100,130)),((100,130),(100,100))]:
 e=p.PCB_SHAPE();e.SetShape(p.SHAPE_T_SEGMENT);e.SetStart(V(*a));e.SetEnd(V(*z));e.SetLayer(p.Edge_Cuts);e.SetWidth(p.FromMM(.05));b.Add(e)
def route(net,points,layer=p.F_Cu):
 for a,z in zip(points,points[1:]):
  t=p.PCB_TRACK(b);t.SetStart(V(*a));t.SetEnd(V(*z));t.SetWidth(p.FromMM(.3));t.SetLayer(layer);t.SetNet(nets[net]);b.Add(t)
def via(net,pt):
 v=p.PCB_VIA(b);v.SetPosition(V(*pt));v.SetWidth(p.FromMM(.7));v.SetDrill(p.FromMM(.3));v.SetViaType(p.VIATYPE_THROUGH);v.SetLayerPair(p.F_Cu,p.B_Cu);v.SetNet(nets[net]);b.Add(v)
for i,ch,y,sy in [(1,'LEFT',107,110),(2,'RIGHT',123,120)]:
 cap='C'+str(i);ser='R'+str(i*2-1);sh='R'+str(i*2);pin=1 if i==1 else 3
 route(ch+'_IN',[pads['J1',pin],(107,pads['J1',pin][1]),(110,y),pads[cap,1]])
 route(ch+'_AC',[pads[cap,2],pads[ser,1]])
 route(ch+'_OUT',[pads[ser,2],(140,y),(144,pads['J2',pin][1]),pads['J2',pin]])
 route(ch+'_OUT',[(132.0875,y),pads[sh,1]])
 route(ch+'_OUT',[(138,y),pads['TP'+str(i),1]])
 route('GND',[pads[sh,2],(136,sy)]);via('GND',(136,sy))
route('GND',[(136,110),(136,115),(136,120)],p.B_Cu)
route('GND',[pads['J1',2],pads['J2',2]],p.B_Cu)
route('GND',[pads['TP3',1],(127,115)]);via('GND',(127,115))
def text(txt,x,y,size=.8):
 t=p.PCB_TEXT(b);t.SetText(txt);t.SetPosition(V(x,y));t.SetTextSize(V(size,size));t.SetTextThickness(p.FromMM(.12));t.SetLayer(p.F_SilkS);b.Add(t)
for x,suffix in [(109,'IN'),(140.5,'OUT')]:
 for y,txt in [(112.46,'1 LEFT_'+suffix),(115,'2 GND'),(117.54,'3 RIGHT_'+suffix)]:text(txt,x,y,.65)
text('STEREO AC ATTENUATOR',125,102,1);text('LEFT_OUT',138,102,.7);text('RIGHT_OUT',138,128,.7);text('GND',125,117,.7)
p.SaveBoard(str(D/'attenuator.kicad_pcb'),b)
pro={'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25,'min_via_diameter':.6,'min_through_hole_diameter':.3},'defaults':{'board_outline_line_width':.05}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.3,'via_diameter':.7,'via_drill':.3}],'meta':{'version':3}},'meta':{'filename':'attenuator.kicad_pro','version':1}}
(D/'attenuator.kicad_pro').write_text(json.dumps(pro,indent=2));(D/'connectivity.json').write_text(json.dumps(comps,indent=2))
(D/'attenuator.kicad_dru').write_text('(version 1)\n(rule "minimum clearance" (constraint clearance (min 0.25)))\n(rule "minimum track width" (constraint track_width (min 0.25)))\n')
