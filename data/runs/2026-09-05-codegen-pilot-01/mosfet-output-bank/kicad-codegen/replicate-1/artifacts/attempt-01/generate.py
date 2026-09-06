import pcbnew as p, os,re,json,uuid,heapq,math,time
from pathlib import Path
HERE=Path(__file__).resolve().parent
LIB=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
def uid():return str(uuid.uuid4())
def mm(x):return p.FromMM(x)
def pt(x,y):return p.VECTOR2I(mm(x),mm(y))
components=[]
def add(ref,val,lib,fp,nets,x,y):components.append(dict(ref=ref,val=val,lib=lib,fp=fp,nets=nets,x=x,y=y))
add('J1','12V INPUT','Connector_Generic:Conn_01x02','Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical',['+12V','GND'],15,15)
add('J2','CONTROL','Connector_Generic:Conn_01x05','Connector_PinHeader_2.54mm:PinHeader_1x05_P2.54mm_Vertical',['GND','CTRL1','CTRL2','CTRL3','CTRL4'],15,31)
add('C1','10uF 25V X7R','Device:C','Capacitor_SMD:C_0805_2012Metric',['+12V','GND'],20,15)
add('C2','100nF 50V X7R','Device:C','Capacitor_SMD:C_0805_2012Metric',['+12V','GND'],20,19)
for i,y in enumerate([17,28,39,50],1):
 add('J'+str(i+2),'LOAD'+str(i),'Connector_Generic:Conn_01x02','Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical',['+12V','OUT'+str(i)],75,y)
 add('Q'+str(i),'AO3400A','Device:Q_NMOS_GSD','Package_TO_SOT_SMD:SOT-23',['GATE'+str(i),'GND','OUT'+str(i)],59,y+2)
 add('R'+str(2*i-1),'100','Device:R','Resistor_SMD:R_0805_2012Metric',['CTRL'+str(i),'GATE'+str(i)],42,y+1)
 add('R'+str(2*i),'100k','Device:R','Resistor_SMD:R_0805_2012Metric',['GATE'+str(i),'GND'],51,y+5)
 add('D'+str(i),'SS14 40V 1A','Device:D_Schottky','Diode_SMD:D_SMA',['+12V','OUT'+str(i)],69,y)
# Extract standard symbol definitions without editing library files.
def sex(text):
 tok=re.findall(r'"(?:\\.|[^"\\])*"|[^\s()]+|[()]',text); stack=[]; root=[];cur=root
 for t in tok:
  if t=='(': n=[];cur.append(n);stack.append(cur);cur=n
  elif t==')':cur=stack.pop()
  else:cur.append(t)
 return root[0]
def out(x):return '('+' '.join(out(v) if isinstance(v,list) else v for v in x)+')'
def tag(x,k):return next((v for v in x if isinstance(v,list) and v and v[0]==k),None)
libs={};pins={}
for c in components:
 if c['lib'] in libs:continue
 ln,sn=c['lib'].split(':');tree=sex((LIB/'symbols'/f'{ln}.kicad_sym').read_text());sym=next(x for x in tree if isinstance(x,list) and x[:2]==['symbol','"'+sn+'"']);sym[1]='"'+c['lib']+'"';libs[c['lib']]=out(sym)
 pp=[]
 for child in sym:
  if isinstance(child,list) and child[0]=='symbol':
   for el in child:
    if isinstance(el,list) and el[0]=='pin':pp.append((tag(el,'number')[1].strip('"'),tag(el,'at')[1:]))
 pins[c['lib']]=pp
rootid=uid();s=['(kicad_sch (version 20250114) (generator "pcb-benchmark-codegen") (uuid '+rootid+') (paper "A3") (lib_symbols '+' '.join(libs.values())+')']
for idx,c in enumerate(components):
 # Power/controls top row, each channel separate row.
 if idx<4:x=35+idx*65;y=30
 else:x=35+((idx-4)%5)*65;y=75+((idx-4)//5)*50
 u=uid();c['uuid']=u
 s.append(f'(symbol (lib_id "{c["lib"]}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid {u}) (property "Reference" "{c["ref"]}" (at {x+6} {y-5} 0) (effects (font (size 1.27 1.27)))) (property "Value" "{c["val"]}" (at {x+6} {y+5} 0) (effects (font (size 1.27 1.27)))) (property "Footprint" "{c["fp"]}" (at {x} {y} 0) (effects (font (size 1 1)) hide)) (instances (project "board" (path "/{rootid}" (reference "{c["ref"]}") (unit 1)))))')
 for n,a in pins[c['lib']]:
  px=x+float(a[0]);py=y-float(a[1]);net=c['nets'][int(n)-1]
  s.append(f'(label "{net}" (at {px} {py} 0) (effects (font (size 1 1)) (justify left bottom)) (uuid {uid()}))')
s.append(')');(HERE/'board.kicad_sch').write_text('\n'.join(s))
board=p.BOARD();nets={}
for name in sorted({n for c in components for n in c['nets']}):
 net=p.NETINFO_ITEM(board,name);board.Add(net);nets[name]=net
pads=[]
for c in components:
 lib,name=c['fp'].split(':');fp=p.FootprintLoad(str(LIB/'footprints'/f'{lib}.pretty'),name);fp.SetReference(c['ref']);fp.SetValue(c['val']);fp.SetPosition(pt(c['x'],c['y']));fp.SetPath(p.KIID_PATH('/'+rootid+'/'+c['uuid']));board.Add(fp)
 fp.Reference().SetTextSize(pt(.8,.8));fp.Reference().SetPosition(pt(c['x'],c['y']-2.7));fp.Value().SetVisible(False)
 for pad in fp.Pads():
  n=pad.GetNumber()
  if not n:continue
  net=c['nets'][int(n)-1];pad.SetNet(nets[net]);pos=pad.GetPosition();size=pad.GetSize();pads.append(dict(net=net,x=p.ToMM(pos.x),y=p.ToMM(pos.y),sx=p.ToMM(size.x),sy=p.ToMM(size.y),th=pad.GetAttribute()==p.PAD_ATTRIB_PTH))
 for k,n in enumerate(c['nets']):
  if c['ref'].startswith('J'):
   t=p.PCB_TEXT(board);t.SetText(str(k+1)+':'+n);t.SetPosition(pt(c['x']-5,c['y']+k*2.54));t.SetTextSize(pt(.7,.7));t.SetTextThickness(mm(.12));t.SetLayer(p.F_SilkS);board.Add(t)
for a,b in [((10,10),(80,10)),((80,10),(80,60)),((80,60),(10,60)),((10,60),(10,10))]:
 edge=p.PCB_SHAPE();edge.SetShape(p.SHAPE_T_SEGMENT);edge.SetStart(pt(*a));edge.SetEnd(pt(*b));edge.SetLayer(p.Edge_Cuts);edge.SetWidth(mm(.05));board.Add(edge)
# Two-layer grid router, foreign copper clearance 0.27mm. Coordinates relative to absolute mm.
step=.25;N=321;M=241
objects=[(z['net'],z['x'],z['y'],z['sx']/2,z['sy']/2,0) for z in pads]+[(z['net'],z['x'],z['y'],z['sx']/2,z['sy']/2,1) for z in pads if z['th']]
def raster(cx,cy,rx,ry):
 return [(ix,iy) for ix in range(math.ceil((cx-rx)/step),math.floor((cx+rx)/step)+1) for iy in range(math.ceil((cy-ry)/step),math.floor((cy+ry)/step)+1)]
def blocked(net,r):
 b=[set(),set()]
 for name,x,y,rx,ry,l in objects:
  if name!=net:b[l].update(raster(x,y,rx+r+.27,ry+r+.27))
 return b
def line(a,b,net,w,layer):
 if a==b:return
 tr=p.PCB_TRACK(board);tr.SetStart(pt(*a));tr.SetEnd(pt(*b));tr.SetWidth(mm(w));tr.SetLayer(p.F_Cu if layer==0 else p.B_Cu);tr.SetNet(nets[net]);board.Add(tr)
 dist=math.dist(a,b);n=max(1,math.ceil(dist/.12))
 for i in range(n+1):
  x=a[0]+(b[0]-a[0])*i/n;y=a[1]+(b[1]-a[1])*i/n;objects.append((net,x,y,w/2,w/2,layer))
def route(net):
 ps=[z for z in pads if z['net']==net];w=.5 if net in ['GND','+12V'] or net.startswith('OUT') else .25
 conn={(round(ps[0]['x']/step),round(ps[0]['y']/step),0)}
 if ps[0]['th']:conn.add((*next(iter(conn))[:2],1))
 remain=ps[1:]
 while remain:
  z=min(remain,key=lambda z:min(abs(round(z['x']/step)-a)+abs(round(z['y']/step)-b) for a,b,l in conn));remain.remove(z)
  start=(round(z['x']/step),round(z['y']/step),0);b=blocked(net,w/2);vb=blocked(net,.3)
  targetxy=[(a,c) for a,c,l in conn]
  def h(v):return min(abs(v[0]-a)+abs(v[1]-c) for a,c in targetxy)
  heap=[(h(start),0,start)];cost={start:0};prev={};end=None
  while heap:
   _,g,v=heapq.heappop(heap)
   if g!=cost[v]:continue
   if v in conn:end=v;break
   x,y,l=v
   for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
    t=(x+dx,y+dy,l)
    if not (42<=t[0]<=318 and 42<=t[1]<=238) or t[:2] in b[l]:continue
    ng=g+1
    if ng<cost.get(t,1e12):cost[t]=ng;prev[t]=v;heapq.heappush(heap,(ng+h(t),ng,t))
   if (x,y) not in vb[0] and (x,y) not in vb[1]:
    t=(x,y,1-l);ng=g+16
    if ng<cost.get(t,1e12):cost[t]=ng;prev[t]=v;heapq.heappush(heap,(ng+h(t),ng,t))
  if end is None:print('UNROUTED',net,z,flush=True);continue
  path=[end]
  while path[-1]!=start:path.append(prev[path[-1]])
  path.reverse();line((z['x'],z['y']),(start[0]*step,start[1]*step),net,w,0)
  for a,c in zip(path,path[1:]):
   if a[2]==c[2]:line((a[0]*step,a[1]*step),(c[0]*step,c[1]*step),net,w,a[2])
   else:
    via=p.PCB_VIA(board);via.SetPosition(pt(a[0]*step,a[1]*step));via.SetWidth(mm(.6));via.SetDrill(mm(.3));via.SetViaType(p.VIATYPE_THROUGH);via.SetLayerPair(p.F_Cu,p.B_Cu);via.SetNet(nets[net]);board.Add(via)
    for l in [0,1]:objects.append((net,a[0]*step,a[1]*step,.3,.3,l))
  conn.update(path)
  print('ROUTED',net,len(path),flush=True)
 # Connect initial exact pad centre to snapped grid
 a=ps[0];line((a['x'],a['y']),(round(a['x']/step)*step,round(a['y']/step)*step),net,w,0)
for net in sorted(nets,key=lambda n:(0 if n.startswith('GATE') else 1 if n.startswith('OUT') else 2 if n.startswith('CTRL') else 3)):
 route(net)
p.SaveBoard(str(HERE/'board.kicad_pcb'),board)
(HERE/'components.json').write_text(json.dumps(components,indent=2))
(HERE/'board.kicad_pro').write_text(json.dumps({'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25},'defaults':{'board_outline_line_width':.05}}}},indent=2))
print('SAVED',flush=True)
