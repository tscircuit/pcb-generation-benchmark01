import pcbnew as p, pathlib, json, uuid, re, math, heapq, time
OUT=pathlib.Path(__file__).resolve().parent
LIB=pathlib.Path('/Users/ankan/Applications/KiCad/KiCad.app/Contents/SharedSupport')
def uid():return str(uuid.uuid4())
def parse(s):
 t=re.findall(r'"(?:\\.|[^"\\])*"|[^\s()]+|[()]',s);i=0
 def rec():
  nonlocal i
  if t[i]=='(':
   i+=1;r=[]
   while t[i]!=')':r.append(rec())
   i+=1;return r
  x=t[i];i+=1;return json.loads(x) if x.startswith('"') else x
 return rec()
def sex(s):
 if isinstance(s,list):return '('+' '.join(sex(x) for x in s)+')'
 return json.dumps(s) if not re.match(r'^[-+\d.]+$|^(yes|no|input|output|passive|bidirectional|power_in|power_out|line|hide|left|right|top|bottom|solid|default|none)$',s) else s
# preserve library text through balanced extraction
symbols={}
def getsym(lib,name):
 txt=(LIB/'symbols'/f'{lib}.kicad_sym').read_text();pos=txt.index('(symbol "'+name+'"');depth=0;quote=False;esc=False
 for end in range(pos,len(txt)):
  c=txt[end]
  if c=='"' and not esc:quote=not quote
  if not quote:
   if c=='(':depth+=1
   if c==')':
    depth-=1
    if not depth:break
  esc=(c=='\\' and not esc)
 raw=txt[pos:end+1];return raw,parse(raw)
parts=[('J1','Connector_Generic','Conn_01x04','INPUT','Connector_PinHeader_2.54mm:PinHeader_1x04_P2.54mm_Vertical',(54,58),['+5V','GND','CTRL1','CTRL2']),('C1','Device','C','100nF','Capacitor_SMD:C_0805_2012Metric',(58,61.75),['+5V','GND'])]
for ch,x in [(1,67),(2,82)]:
 parts += [(f'Q{ch}','Transistor_BJT','Q_NPN_BEC','MMBT3904','Package_TO_SOT_SMD:SOT-23',(x,68),[f'BASE{ch}','GND',f'COL{ch}']), (f'D{ch}','Device','LED','RED','LED_SMD:LED_0805_2012Metric',(x,55),[f'COL{ch}',f'ANODE{ch}']), (f'R{ch*3-2}','Device','R','1k','Resistor_SMD:R_0805_2012Metric',(x,59),['+5V',f'ANODE{ch}']), (f'R{ch*3-1}','Device','R','4.7k','Resistor_SMD:R_0805_2012Metric',(x-4,64),[f'CTRL{ch}',f'BASE{ch}']), (f'R{ch*3}','Device','R','100k','Resistor_SMD:R_0805_2012Metric',(x,73),[f'BASE{ch}','GND'])]
b=p.BOARD();b.SetCopperLayerCount(2)
nets={}
for name in dict.fromkeys(n for part in parts for n in part[-1]):
 n=p.NETINFO_ITEM(b,name);b.Add(n);nets[name]=n
fps={};pads={};uuids={}
for ref,lib,sym,val,fp,(x,y),ns in parts:
 f=p.FootprintLoad(str(LIB/'footprints'/(fp.split(':')[0]+'.pretty')),fp.split(':')[1]);f.SetReference(ref);f.SetValue(val);f.SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y)));b.Add(f);fps[ref]=f;uuids[ref]=uid()
 f.Reference().SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y-2.3)));f.Reference().SetTextSize(p.VECTOR2I(p.FromMM(.8),p.FromMM(.8)));f.Reference().SetTextThickness(p.FromMM(.13));f.Value().SetVisible(False)
 for pad in f.Pads():
  pn=int(pad.GetNumber());pad.SetNet(nets[ns[pn-1]]);pads[(ref,pn)]=pad
for a,c in [((50,50),(95,50)),((95,50),(95,80)),((95,80),(50,80)),((50,80),(50,50))]:
 s=p.PCB_SHAPE();s.SetShape(p.SHAPE_T_SEGMENT);s.SetStart(p.VECTOR2I(*[p.FromMM(z) for z in a]));s.SetEnd(p.VECTOR2I(*[p.FromMM(z) for z in c]));s.SetLayer(p.Edge_Cuts);s.SetWidth(p.FromMM(.05));b.Add(s)
for text,x,y,size in [('TWO CHANNEL LED DRIVER',73,77.5,1),('1 +5V',57.5,55.5,.75),('GND',51.6,60.54,.7),('CTRL1',57.5,63.08,.7),('CTRL2',57.5,66.5,.7)]:
 t=p.PCB_TEXT(b);t.SetText(text);t.SetPosition(p.VECTOR2I(p.FromMM(x),p.FromMM(y)));t.SetTextSize(p.VECTOR2I(p.FromMM(size),p.FromMM(size)));t.SetTextThickness(p.FromMM(.12));t.SetLayer(p.F_SilkS);b.Add(t)
# conservative grid router, pad obstacles expanded for .25 clearance and .25 tracks
step=.125;W=361;H=241;blocked=[{},{}];netpoints={};padrect=[]
def grid(x,y):return round((x-50)/step),round((y-50)/step)
def xy(g):return 50+g[0]*step,50+g[1]*step
def fillrect(layer,x0,y0,x1,y1,net):
 for ix in range(max(3,math.floor((x0-50)/step)),min(W-3,math.ceil((x1-50)/step)+1)):
  for iy in range(max(3,math.floor((y0-50)/step)),min(H-3,math.ceil((y1-50)/step)+1)):blocked[layer][(ix,iy)]=net
for pad in pads.values():
 pos=pad.GetPosition();x,y=p.ToMM(pos.x),p.ToMM(pos.y);sz=pad.GetSize();sx,sy=p.ToMM(sz.x),p.ToMM(sz.y);n=pad.GetNetname();layers=[0,1] if pad.GetAttribute()==p.PAD_ATTRIB_PTH else [0]
 for l in layers:fillrect(l,x-sx/2-.4,y-sy/2-.4,x+sx/2+.4,y+sy/2+.4,n)
 netpoints.setdefault(n,[]).append((grid(x,y),layers,(x,y)))
def free(x,y,l,n,via=False):
 if x<5 or y<5 or x>=W-5 or y>=H-5:return False
 if blocked[l].get((x,y),n)!=n:return False
 if via:
  for dx in range(-3,4):
   for dy in range(-3,4):
    if blocked[l].get((x+dx,y+dy),n)!=n:return False
 return True

def seg(a,c,l,n):
 if a==c:return
 t=p.PCB_TRACK(b);t.SetStart(p.VECTOR2I(*[p.FromMM(z) for z in a]));t.SetEnd(p.VECTOR2I(*[p.FromMM(z) for z in c]));t.SetLayer(p.F_Cu if l==0 else p.B_Cu);t.SetWidth(p.FromMM(.25));t.SetNet(nets[n]);b.Add(t)
def reserve(x,y,l,n,r=4):
 for dx in range(-r,r+1):
  for dy in range(-r,r+1):
   if dx*dx+dy*dy<=r*r:blocked[l][(x+dx,y+dy)]=n
for n,points in sorted(netpoints.items(),key=lambda it:len(it[1])):
 connected=[points[0]]
 for target in points[1:]:
  source=min(connected,key=lambda s:abs(s[0][0]-target[0][0])+abs(s[0][1]-target[0][1]));(sx,sy),sl,sp=source;(tx,ty),tl,tp=target
  start=(sx,sy,sl[0]);q=[(0,0,start)];dist={start:0};prev={};found=None
  while q:
   _,cost,u=heapq.heappop(q)
   if cost!=dist[u]:continue
   x,y,l=u
   if x==tx and y==ty and l in tl:found=u;break
   opts=[(x+1,y,l,1),(x-1,y,l,1),(x,y+1,l,1),(x,y-1,l,1)]
   if free(x,y,l,n,True) and free(x,y,1-l,n,True):opts.append((x,y,1-l,30))
   for nx,ny,nl,dc in opts:
    v=(nx,ny,nl);nc=cost+dc
    if free(nx,ny,nl,n) and nc<dist.get(v,1e20):
     dist[v]=nc;prev[v]=u;heapq.heappush(q,(nc+abs(nx-tx)+abs(ny-ty),nc,v))
  if found is None:print('UNROUTED',n,sp,tp,flush=True);continue
  path=[found]
  while path[-1]!=start:path.append(prev[path[-1]])
  path.reverse();seg(sp,xy(path[0]),path[0][2],n);seg(xy(path[-1]),tp,path[-1][2],n)
  run=path[0];direction=None
  for i,u in enumerate(path):
   reserve(*u,n)
   if i==0:continue
   last=path[i-1];d=(u[0]-last[0],u[1]-last[1],u[2]-last[2])
   if d[2]:
    seg(xy(run),xy(last),last[2],n);v=p.PCB_VIA(b);v.SetPosition(p.VECTOR2I(*[p.FromMM(z) for z in xy(u)]));v.SetWidth(p.FromMM(.6));v.SetDrill(p.FromMM(.3));v.SetViaType(p.VIATYPE_THROUGH);v.SetLayerPair(p.F_Cu,p.B_Cu);v.SetNet(nets[n]);b.Add(v);reserve(u[0],u[1],0,n,6);reserve(u[0],u[1],1,n,6);run=u;direction=None
   elif direction and direction!=d:seg(xy(run),xy(last),last[2],n);run=last
   if not d[2]:direction=d
  seg(xy(run),xy(path[-1]),path[-1][2],n);connected.append(target);print('ROUTED',n,sp,tp,len(path),flush=True)
b.GetDesignSettings().m_MinClearance=p.FromMM(.25)
p.SaveBoard(str(OUT/'driver.kicad_pcb'),b)
# Schematic: standard library symbols, explicit named wire connections.
root=uid();body=[];libtexts={}
for idx,(ref,lib,sym,val,fp,_,ns) in enumerate(parts):
 raw,tree=getsym(lib,sym);lid=lib+':'+sym;libtexts[lid]=raw.replace('(symbol "'+sym+'"','(symbol "'+lid+'"',1)
 x=40+(idx%4)*50;y=40+(idx//4)*40
 def prop(k,v,px,py,hide=False):return f'(property "{k}" "{v}" (at {px} {py} 0) (effects (font (size 1.27 1.27))'+(' (hide yes)' if hide else '')+'))'
 props=prop('Reference',ref,x+5,y-4)+prop('Value',val,x+6,y-1)+prop('Footprint',fp,x,y,True)
 body.append(f'(symbol (lib_id "{lid}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes) (dnp no) (uuid {uuids[ref]}) {props} (instances (project "driver" (path "/{root}" (reference "{ref}") (unit 1)))))')
 for sub in tree:
  if isinstance(sub,list) and sub[0]=='symbol':
   for pin in sub:
    if isinstance(pin,list) and pin[0]=='pin':
     at=next(v for v in pin if isinstance(v,list) and v[0]=='at');num=int(next(v for v in pin if isinstance(v,list) and v[0]=='number')[1]);px=x+float(at[1]);py=y-float(at[2]);ang=float(at[3]);ex=px-2.54*math.cos(math.radians(ang));ey=py+2.54*math.sin(math.radians(ang));n=ns[num-1]
     body.append(f'(wire (pts (xy {px} {py}) (xy {ex} {ey})) (stroke (width 0) (type default)) (uuid {uid()}))')
     body.append(f'(label "{n}" (at {ex} {ey} 0) (effects (font (size 1 1)) (justify left bottom)) (uuid {uid()}))')
(OUT/'driver.kicad_sch').write_text(f'(kicad_sch (version 20250114) (generator "pcb-benchmark-codegen") (uuid {root}) (paper "A4") (lib_symbols '+''.join(libtexts.values())+')'+''.join(body)+')')
(OUT/'driver.kicad_pro').write_text(json.dumps({'board':{'design_settings':{'rules':{'min_clearance':.25,'min_track_width':.25}}},'net_settings':{'classes':[{'name':'Default','clearance':.25,'track_width':.25,'via_diameter':.6,'via_drill':.3}]}},indent=2))
(OUT/'pin-map.json').write_text(json.dumps({r:{str(i+1):n for i,n in enumerate(ns)} for r,_,_,_,_,_,ns in parts},indent=2))
