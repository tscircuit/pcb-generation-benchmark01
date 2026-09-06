import pcbnew as p, json,uuid,math,os,re,time,heapq
from pathlib import Path
D=Path(__file__).resolve().parent
LIB=Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
u=lambda:str(uuid.uuid4())
board=p.BOARD(); board.SetCopperLayerCount(2)
netnames=['GND']+[f'{s}{i}' for i in range(1,7) for s in ['IN','DIV','OUT']]
nets={n:p.NETINFO_ITEM(board,n) for n in netnames}
for n in nets.values():board.Add(n)
components=[]
def component(ref,val,lib,fp,x,y,names,angle=0):
 f=p.FootprintLoad(str(LIB/'footprints'/ (fp.split(':')[0]+'.pretty')),fp.split(':')[1]);f.SetReference(ref);f.SetValue(val);f.SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y)));f.SetOrientationDegrees(angle);f.SetFPID(p.LIB_ID(*fp.split(':')));board.Add(f)
 f.Reference().SetVisible(False)
 for pad in f.Pads():
  if pad.GetNumber() and int(pad.GetNumber())<=len(names):pad.SetNet(nets[names[int(pad.GetNumber())-1]])
 components.append(dict(ref=ref,val=val,lib=lib,fp=fp,names=names,uuid=u()))
 return f
R='Resistor_SMD:R_0805_2012Metric'; C='Capacitor_SMD:C_0805_2012Metric'; H='Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical'
for i in range(1,7):
 x=10+(i-1)*12
 component(f'J{i}',f'IN{i}', 'Connector_Generic:Conn_01x02',H,x,4,[f'IN{i}','GND'])
 component(f'R{3*i-2}','10k','Device:R',R,x,15,[f'IN{i}',f'DIV{i}'])
 component(f'R{3*i-1}','20k','Device:R',R,x,22,[f'DIV{i}','GND'])
 component(f'R{3*i}','1k','Device:R',R,x,29,[f'DIV{i}',f'OUT{i}'])
 component(f'C{i}','100n','Device:C',C,32.5+(i-1)*3,39.5,[f'OUT{i}','GND'],90)
 component(f'TP{i}',f'OUT{i}','Connector:TestPoint','TestPoint:TestPoint_Pad_D1.5mm',32.5+(i-1)*3,35,[f'OUT{i}'])
component('J7','OUTPUTS','Connector_Generic:Conn_01x08','Connector_PinHeader_2.54mm:PinHeader_1x08_P2.54mm_Vertical',31.11,45,[f'OUT{i}' for i in range(1,7)]+['GND','GND'],90)
component('TP7','GND','Connector:TestPoint','TestPoint:TestPoint_Pad_D1.5mm',54,40,['GND'])
for i,(x,y) in enumerate([(4,4),(76,4),(4,46),(76,46)],1):
 f=p.FootprintLoad(str(LIB/'footprints'/'MountingHole.pretty'),'MountingHole_3.2mm_M3');f.SetReference(f'H{i}');f.SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y)));f.Reference().SetVisible(False);board.Add(f)
for a,b in [((0,0),(80,0)),((80,0),(80,50)),((80,50),(0,50)),((0,50),(0,0))]:
 s=p.PCB_SHAPE();s.SetShape(p.SHAPE_T_SEGMENT);s.SetStart(p.VECTOR2I(p.FromMM(a[0]),p.FromMM(a[1])));s.SetEnd(p.VECTOR2I(p.FromMM(b[0]),p.FromMM(b[1])));s.SetLayer(p.Edge_Cuts);s.SetWidth(p.FromMM(.05));board.Add(s)
def text(t,x,y,size=.8):
 z=p.PCB_TEXT(board);z.SetText(t);z.SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y)));z.SetTextSize(p.VECTOR2I(p.FromMM(size),p.FromMM(size)));z.SetTextThickness(p.FromMM(.12));z.SetLayer(p.F_SilkS);board.Add(z)
for i in range(1,7):
 x=10+(i-1)*12;text(f'J{i} 1:IN{i}',x,1.3,.7);text('2:GND',x,9,.7)
 text(f'OUT{i}',32.5+(i-1)*3,33,.65)
text('TP7 GND',55,42,.65);text('J7  1  2  3  4  5  6  G  G',40,48,.7)
text('OUT1 OUT2 OUT3 OUT4 OUT5 OUT6 GND GND',40,42.5,.52)
# Native modern schematic, embedded standard symbols; each pin connects to a named net label.
def extract_symbol(libname):
 library,name=libname.split(':');s=(LIB/'symbols'/(library+'.kicad_sym')).read_text();start=s.index('(symbol "'+name+'"');depth=0;quoted=False;esc=False
 for end in range(start,len(s)):
  c=s[end]
  if c=='"' and not esc:quoted=not quoted
  if not quoted:
   if c=='(':depth+=1
   if c==')':
    depth-=1
    if depth==0:break
  esc=(c=='\\' and not esc)
 return s[start:end+1].replace('(symbol "'+name+'"','(symbol "'+libname+'"',1)
root=u();sch=['(kicad_sch (version 20250114) (generator "pcb_benchmark_codegen")',f'(uuid {root})','(paper "A3")','(lib_symbols']
for name in sorted({c['lib'] for c in components}):sch.append(extract_symbol(name))
sch.append(')')
for k,c in enumerate(components):
 x=25+(k%7)*52;y=30+(k//7)*43
 lib=c['lib'];ref=c['ref'];val=c['val'];sid=c['uuid']
 sch.append(f'(symbol (lib_id "{lib}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid {sid}) (property "Reference" "{ref}" (at {x+4} {y-3} 0) (effects (font (size 1.27 1.27)))) (property "Value" "{val}" (at {x+4} {y} 0) (effects (font (size 1.27 1.27)))) (property "Footprint" "{c["fp"]}" (at {x} {y} 0) (effects (font (size 1.27 1.27)) (hide yes))) (instances (project "analog_input" (path "/{root}" (reference "{ref}") (unit 1)))) )')
 if lib in ['Device:R','Device:C']:pins=[(0,-3.81),(0,3.81)]
 elif lib.endswith('01x02'):pins=[(-5.08,0),(-5.08,2.54)]
 elif lib.endswith('01x08'):pins=[(-5.08,-7.62+j*2.54) for j in range(8)]
 else:pins=[(0,0)]
 for (dx,dy),net in zip(pins,c['names']):
  px=x+dx;py=y+dy
  sch.append(f'(label "{net}" (at {px:.4f} {py:.4f} 0) (effects (font (size 1 1)) (justify left bottom)) (uuid {u()}))')
sch.append(')');(D/'analog_input.kicad_sch').write_text('\n'.join(sch))
# Constraints in project settings.
(D/'analog_input.kicad_pro').write_text(json.dumps({'board':{'design_settings':{'rules':{'min_clearance':0.25,'min_track_width':0.25,'min_via_diameter':0.6,'min_through_hole_diameter':0.3},'defaults':{}}},'net_settings':{'classes':[{'name':'Default','clearance':0.25,'track_width':0.25,'via_diameter':0.6,'via_drill':0.3}] }},indent=2))
p.SaveBoard(str(D/'analog_input.kicad_pcb'),board)
# Deterministic two-layer Manhattan maze router. Grid stores conservative pad and trace clearance envelopes.
G=.25; NX=321;NY=201; SZ=NX*NY
occupied=[{} for _ in range(2)]
def node(x,y):return int(round(x/G))+NX*int(round(y/G))
def xy(n):return (n%NX)*G,(n//NX)*G
def disk(layer,x,y,r,net):
 for ix in range(max(0,int((x-r)/G)),min(NX,int((x+r)/G)+2)):
  for iy in range(max(0,int((y-r)/G)),min(NY,int((y+r)/G)+2)):
   if math.hypot(ix*G-x,iy*G-y)<r-1e-6:occupied[layer][ix+iy*NX]=net
pads={n:[] for n in netnames}
for f in board.GetFootprints():
 for pad in f.Pads():
  pos=pad.GetPosition();x=p.ToMM(pos.x);y=p.ToMM(pos.y);size=pad.GetSize();sx=p.ToMM(size.x);sy=p.ToMM(size.y)
  if abs(f.GetOrientationDegrees()%180-90)<1:sx,sy=sy,sx
  net=pad.GetNetname() or '__hole__';layers=[0,1] if pad.GetAttribute() in [p.PAD_ATTRIB_PTH,p.PAD_ATTRIB_NPTH] else [0]
  margin=.4 if net!='__hole__' else 1.15
  for l in layers:
   for ix in range(max(0,int((x-sx/2-margin)/G)),min(NX,int((x+sx/2+margin)/G)+2)):
    for iy in range(max(0,int((y-sy/2-margin)/G)),min(NY,int((y+sy/2+margin)/G)+2)):
     dx=max(abs(ix*G-x)-sx/2,0);dy=max(abs(iy*G-y)-sy/2,0)
     if math.hypot(dx,dy)<margin:occupied[l][ix+iy*NX]=net
  if net in pads:pads[net].append((node(x,y),layers,x,y))
for l in range(2):
 for n in range(SZ):
  x,y=xy(n)
  if x<.75 or x>79.25 or y<.75 or y>49.25:occupied[l][n]='__edge__'
trackcount=0;viacount=0;fails=[]
def seg(a,b,l,net):
 global trackcount
 if a==b:return
 t=p.PCB_TRACK(board);t.SetStart(p.VECTOR2I(p.FromMM(a[0]),p.FromMM(a[1])));t.SetEnd(p.VECTOR2I(p.FromMM(b[0]),p.FromMM(b[1])));t.SetWidth(p.FromMM(.25));t.SetLayer(p.F_Cu if l==0 else p.B_Cu);t.SetNet(nets[net]);board.Add(t);trackcount+=1
 steps=max(1,int(math.dist(a,b)/(.1)))
 for j in range(steps+1):disk(l,a[0]+(b[0]-a[0])*j/steps,a[1]+(b[1]-a[1])*j/steps,.51,net)
def free(n,l,net):return 0<=n<SZ and occupied[l].get(n,net)==net
def viaok(n,net):
 x,y=xy(n)
 for l in range(2):
  for dx,dy in [(a,b) for a in range(-2,3) for b in range(-2,3) if a*a+b*b<=5]:
   if not free(n+dx+dy*NX,l,net):return False
 return True
for net in sorted(netnames,key=lambda n:(n=='GND',not n.startswith('OUT'),n)):
 ps=pads[net];tree={(ps[0][0],l) for l in ps[0][1]}
 for target in ps[1:]:
  tn,tl,tx,ty=target;start=[(tn,l) for l in tl];goals=list(tree)
  # A* to any existing tree cell, lower bound to bounding box.
  xs=[a%NX for a,l in goals];ys=[a//NX for a,l in goals];xmin,xmax,ymin,ymax=min(xs),max(xs),min(ys),max(ys)
  def h(n):
   x=n%NX;y=n//NX;return max(xmin-x,0,x-xmax)+max(ymin-y,0,y-ymax)
  q=[];dist={};prev={}
  for s in start:dist[s]=0;heapq.heappush(q,(h(s[0]),0,s))
  found=None
  while q:
   _,cost,s=heapq.heappop(q)
   if cost!=dist.get(s):continue
   if s in tree:found=s;break
   n,l=s
   opts=[(n-1,l,1),(n+1,l,1),(n-NX,l,1),(n+NX,l,1)]
   if viaok(n,net):opts.append((n,1-l,18))
   for nn,ll,step in opts:
    if not free(nn,ll,net) or abs(nn%NX-n%NX)>1:continue
    ns=(nn,ll);nc=cost+step
    if nc<dist.get(ns,1e20):dist[ns]=nc;prev[ns]=s;heapq.heappush(q,(nc+h(nn),nc,ns))
  if found is None:fails.append(net);print('FAILED',net,flush=True);continue
  path=[found]
  while path[-1] in prev:path.append(prev[path[-1]])
  tree.update(path)
  for (a,l),(b,m) in zip(path,path[1:]):
   if l!=m:
    x,y=xy(a);v=p.PCB_VIA(board);v.SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y)));v.SetWidth(p.FromMM(.6));v.SetDrill(p.FromMM(.3));v.SetViaType(p.VIATYPE_THROUGH);v.SetLayerPair(p.F_Cu,p.B_Cu);v.SetNet(nets[net]);board.Add(v);viacount+=1
    for z in range(2):disk(z,x,y,.7,net)
   else:seg(xy(a),xy(b),l,net)
  seg((tx,ty),xy(tn),tl[0],net)
 # Pad to grid segments for all terminals, including root.
 for n,ls,x,y in ps:seg((x,y),xy(n),ls[0],net)
 print(net,'routed',flush=True)
p.SaveBoard(str(D/'analog_input.kicad_pcb'),board)
(D/'routing-summary.json').write_text(json.dumps({'failed_connections':fails,'track_segments':trackcount,'vias':viacount},indent=2))
print('Saved',trackcount,'tracks',viacount,'vias',fails)
